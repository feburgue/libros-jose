/* Graba el audio de cada página, para que el visor lea los cuentos con una voz
   natural en vez de la del navegador.

   Lee textos/<slug>.txt y deja audio/<slug>/p03.mp3 (uno por página) más
   audio/<slug>/indice.json, que le dice al visor qué páginas tienen audio.
   Solo graba lo que falta o cambió: si se corrige un texto, se vuelve a correr
   y rehace solo esa página. Si se corta a la mitad (por ejemplo, se terminó el
   cupo del día), se vuelve a correr y sigue donde quedó.

   Motor por defecto: Gemini (la voz que eligió el usuario). Necesita una clave de
   Google AI Studio:
     GEMINI_API_KEY=xxxx node generar-audios.js
   Con Azure (la voz anterior):
     AZURE_SPEECH_KEY=xxxx AZURE_SPEECH_REGION=eastus node generar-audios.js --motor=azure
   Opciones:
     node generar-audios.js caperucita hadas    solo esos cuentos
     --voz=...                                  otra voz (Gemini: Sulafat; Azure: es-AR-ElenaNeural)
   Para pasar el audio de Gemini a mp3 usa @breezystack/lamejs (npm install).
*/
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const opciones = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => a.slice(2).split('=')));
const pedidos = new Set(process.argv.slice(2).filter(a => !a.startsWith('--')));
const MOTOR = opciones.motor || 'gemini';
const esperar = ms => new Promise(r => setTimeout(r, ms));

/* ---------- Gemini ---------- */
const GEMINI = {
  modelo: 'gemini-2.5-flash-preview-tts',
  voz: opciones.voz || 'Sulafat',
  // la forma de leer se pide en palabras, antes del texto
  estilo: 'Leé este cuento en voz alta, despacito, con voz dulce y tranquila, como un cuento antes de dormir, ' +
          'con acento rioplatense. Hacé una pausa tranquila entre cada párrafo:'
};
class SinCupo extends Error {}
// A veces Gemini "se traba" y devuelve minutos de audio (repite o deja silencios largos)
// para un texto de un minuto. Normal: unos 0,1 segundos por letra. Si se va muy lejos,
// se pide de nuevo; tras 3 intentos queda el más razonable.
async function grabarGemini(texto){
  let mejor = null;
  for (let intento = 1; intento <= 3; intento++){
    const audio = await pedirGemini(texto);
    const ritmo = audio.segundos / Math.max(texto.length, 1);
    if (ritmo >= 0.04 && ritmo <= 0.2 || audio.segundos < 6) return audio.mp3;
    console.log(`  audio raro (${Math.round(audio.segundos)} s para ${texto.length} letras), intento ${intento} de 3`);
    if (!mejor || Math.abs(ritmo - 0.1) < Math.abs(mejor.ritmo - 0.1)) mejor = { ...audio, ritmo };
  }
  return mejor.mp3;
}
async function pedirGemini(texto){
  for (let intento = 1; ; intento++){
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI.modelo}:generateContent`, {
      method: 'POST',
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: GEMINI.estilo + '\n\n' + texto }] }],
        generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: GEMINI.voz } } } }
      })
    });
    const j = await r.json().catch(() => ({}));
    if (r.ok){
      const parte = (j.candidates?.[0]?.content?.parts || []).find(p => p.inlineData);
      if (parte) return aMp3(Buffer.from(parte.inlineData.data, 'base64'), parte.inlineData.mimeType);
      if (intento < 4){ await esperar(5000); continue; }   // a veces contesta sin audio: se reintenta
      throw new Error('Gemini no devolvió audio');
    }
    const msg = JSON.stringify(j.error || j);
    if (r.status === 429){
      // cupo del día terminado: no tiene sentido seguir; mañana se retoma donde quedó
      if (/PerDay/i.test(msg)) throw new SinCupo('Se terminó el cupo de hoy de Gemini (el modelo de voz permite una cantidad de audios por día): volver a correr mañana y sigue donde quedó.');
      const espera = Number((msg.match(/"retryDelay":"(\d+)/) || [])[1] || 30);
      if (intento < 8){ await esperar((espera + 2) * 1000); continue; }
    }
    if (r.status >= 500 && intento < 6){ await esperar(intento * 10000); continue; }
    throw new Error(`Gemini respondió ${r.status}: ${msg.slice(0, 300)}`);
  }
}
// Gemini devuelve PCM de 16 bits (24 kHz) o un WAV: se pasa a mp3 mono de 48 kbps
async function aMp3(buf, tipo){
  const { Mp3Encoder } = await import('@breezystack/lamejs');
  let rate = Number(((tipo || '').match(/rate=(\d+)/) || [])[1] || 24000), datos = buf;
  if (/wav/i.test(tipo) || buf.slice(0, 4).toString() === 'RIFF'){
    rate = buf.readUInt32LE(24);
    let i = 12;
    while (i < buf.length - 8 && buf.slice(i, i + 4).toString() !== 'data') i += 8 + buf.readUInt32LE(i + 4);
    datos = buf.slice(i + 8, i + 8 + buf.readUInt32LE(i + 4));
  }
  const muestras = new Int16Array(datos.buffer, datos.byteOffset, Math.floor(datos.length / 2));
  const enc = new Mp3Encoder(1, rate, 48), partes = [];
  for (let i = 0; i < muestras.length; i += 1152) partes.push(Buffer.from(enc.encodeBuffer(muestras.subarray(i, i + 1152))));
  partes.push(Buffer.from(enc.flush()));
  return { mp3: Buffer.concat(partes), segundos: muestras.length / rate };
}

/* ---------- Azure ---------- */
const AZURE = { voz: opciones.voz || 'es-AR-ElenaNeural', velocidad: '-25%', tono: '-4%', pausaFrase: '900ms', pausaParrafo: '1300ms' };
const xml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Ojo: el silencio de frase REEMPLAZA la pausa natural de la voz (unos 700 ms); menos que eso acelera
function ssml(texto){
  const cuerpo = texto.split('\n').map(xml).join(`<break time="${AZURE.pausaParrafo}"/>`);
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${AZURE.voz.slice(0, 5)}">` +
         `<voice name="${AZURE.voz}"><mstts:silence type="Sentenceboundary" value="${AZURE.pausaFrase}"/>` +
         `<prosody rate="${AZURE.velocidad}" pitch="${AZURE.tono}">${cuerpo}</prosody></voice></speak>`;
}
async function grabarAzure(texto){
  for (let intento = 1; ; intento++){
    const r = await fetch(`https://${process.env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'libros-jose'
      },
      body: ssml(texto)
    });
    if (r.ok) return Buffer.from(await r.arrayBuffer());
    if ((r.status === 429 || r.status >= 500) && intento < 6){ await esperar(intento * 10000); continue; }
    throw new Error(`Azure respondió ${r.status} ${r.statusText}` + (r.status === 401 ? ' (revisar la clave y la región)' : ''));
  }
}

const grabar = MOTOR === 'azure' ? grabarAzure : grabarGemini;
// La huella cambia si cambia el texto o cualquier ajuste de la voz: entonces se regraba
const AJUSTES = MOTOR === 'azure' ? Object.values(AZURE).join('|') : [GEMINI.modelo, GEMINI.voz, GEMINI.estilo].join('|');
const DESCRIPCION = MOTOR === 'azure' ? { motor: 'azure', ...AZURE } : { motor: 'gemini', modelo: GEMINI.modelo, voz: GEMINI.voz };

// Mismo formato que lee el visor: "== 3" abre la página 3; las líneas con # se ignoran
function leerTextos(txt){
  const paginas = {};
  let actual = null;
  for (const l of txt.split(/\r?\n/)){
    const m = l.match(/^==\s*(\d+)\s*$/);
    if (m){ actual = m[1]; paginas[actual] = ''; continue; }
    if (actual === null || l.startsWith('#')) continue;
    paginas[actual] += (paginas[actual] ? '\n' : '') + l;
  }
  for (const k of Object.keys(paginas)) if (!(paginas[k] = paginas[k].trim())) delete paginas[k];
  return paginas;
}

(async () => {
  process.chdir(__dirname);
  if (MOTOR === 'azure' ? !(process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION) : !process.env.GEMINI_API_KEY){
    console.error('Falta la clave (ver el comentario al principio del archivo).');
    process.exit(1);
  }
  const libros = JSON.parse(fs.readFileSync('libros.json', 'utf8'));
  // también los textos que no son libros de la estantería (por ejemplo, el sendero de los tres chanchitos)
  for (const f of fs.readdirSync('textos')){
    const slug = f.replace(/\.txt$/, '');
    if (f.endsWith('.txt') && !libros.some(l => l.slug === slug)) libros.push({ slug });
  }
  let grabadas = 0, letras = 0;
  try {
    for (const l of libros){
      if (pedidos.size && !pedidos.has(l.slug)) continue;
      const origen = `textos/${l.slug}.txt`;
      if (!fs.existsSync(origen)){ console.log(l.slug.padEnd(44), 'sin texto (correr extraer-textos.js)'); continue; }
      const paginas = leerTextos(fs.readFileSync(origen, 'utf8'));
      const dir = path.join('audio', l.slug), rutaIndice = path.join(dir, 'indice.json');
      fs.mkdirSync(dir, { recursive: true });
      const anterior = fs.existsSync(rutaIndice) ? JSON.parse(fs.readFileSync(rutaIndice, 'utf8')).paginas || {} : {};
      const archivo = n => path.join(dir, `p${String(n).padStart(2, '0')}.mp3`);
      // arranca con lo que ya había (si se corta, esas páginas siguen sonando con su audio viejo)
      const indice = { ...DESCRIPCION, paginas: {} };
      for (const n of Object.keys(paginas)) if (anterior[n] && fs.existsSync(archivo(n))) indice.paginas[n] = anterior[n];
      let nuevas = 0;
      for (const [n, texto] of Object.entries(paginas)){
        const huella = crypto.createHash('sha1').update(AJUSTES + '|' + texto).digest('hex').slice(0, 12);
        if (anterior[n] === huella && fs.existsSync(archivo(n))) continue;
        fs.writeFileSync(archivo(n), await grabar(texto));
        indice.paginas[n] = huella;
        nuevas++; grabadas++; letras += texto.length;
        // se guarda en cada página: si se corta a la mitad, lo ya grabado no se pierde
        fs.writeFileSync(rutaIndice, JSON.stringify(indice, null, 1) + '\n');
        if (MOTOR === 'azure') await esperar(3200);
      }
      // páginas que ya no tienen texto: su audio sobra
      for (const f of fs.readdirSync(dir)){
        const m = f.match(/^p(\d+)\.mp3$/);
        if (m && !paginas[String(Number(m[1]))]) fs.unlinkSync(path.join(dir, f));
      }
      fs.writeFileSync(rutaIndice, JSON.stringify(indice, null, 1) + '\n');
      console.log(l.slug.padEnd(44), nuevas ? `${nuevas} páginas grabadas` : 'al día');
    }
  } catch (e){
    if (!(e instanceof SinCupo)) throw e;
    console.log(e.message);
  }
  console.log(`Listo: ${grabadas} páginas, ${letras} letras.`);
})().catch(e => { console.error(e.message); process.exit(1); });
