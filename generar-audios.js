/* Graba el audio de cada página con una voz de Azure, para que el visor lea
   los cuentos con voz natural en vez de la del navegador.

   Lee textos/<slug>.txt y deja audio/<slug>/p03.mp3 (uno por página) más
   audio/<slug>/indice.json, que le dice al visor qué páginas tienen audio.
   Solo graba lo que falta o cambió: si se corrige un texto, se vuelve a correr
   y rehace solo esa página.

   Necesita una clave del servicio de voz (Speech) de Azure:
     AZURE_SPEECH_KEY=xxxx AZURE_SPEECH_REGION=eastus node generar-audios.js
   Opciones:
     node generar-audios.js caperucita hadas    solo esos cuentos
     --voz=es-UY-ValentinaNeural                otra voz (por defecto es-AR-ElenaNeural)
     --velocidad=-10%                           más lento o más rápido (por defecto -25%)
     --tono=-3%                                 más grave o más agudo (por defecto -4%)
   Voces rioplatenses: es-AR-ElenaNeural, es-AR-TomasNeural, es-UY-ValentinaNeural, es-UY-MateoNeural
   Por defecto lee pausado, con pausas largas, para escuchar antes de dormir.
*/
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const opciones = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => a.slice(2).split('=')));
const pedidos = new Set(process.argv.slice(2).filter(a => !a.startsWith('--')));
const VOZ = opciones.voz || 'es-AR-ElenaNeural';
const VELOCIDAD = opciones.velocidad || '-25%';
const TONO = opciones.tono || '-4%';
// Silencio después de cada frase y entre párrafos: tranquilo, para antes de dormir.
// Ojo: el de frase REEMPLAZA la pausa natural de la voz (unos 700 ms); menos que eso acelera.
const PAUSA_FRASE = '900ms', PAUSA_PARRAFO = '1300ms';
const CLAVE = process.env.AZURE_SPEECH_KEY, REGION = process.env.AZURE_SPEECH_REGION;

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

const xml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Pausado: silencio tras cada frase y una pausa más larga entre párrafos
function ssml(texto){
  const lang = VOZ.slice(0, 5);
  const cuerpo = texto.split('\n').map(xml).join(`<break time="${PAUSA_PARRAFO}"/>`);
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${lang}">` +
         `<voice name="${VOZ}"><mstts:silence type="Sentenceboundary" value="${PAUSA_FRASE}"/>` +
         `<prosody rate="${VELOCIDAD}" pitch="${TONO}">${cuerpo}</prosody></voice></speak>`;
}
const AJUSTES = [VOZ, VELOCIDAD, TONO, PAUSA_FRASE, PAUSA_PARRAFO].join('|');

const esperar = ms => new Promise(r => setTimeout(r, ms));
// El plan gratis acepta unos 20 pedidos por minuto: si se pasa, espera y reintenta
async function grabar(texto){
  for (let intento = 1; ; intento++){
    const r = await fetch(`https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': CLAVE,
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

(async () => {
  process.chdir(__dirname);
  if (!CLAVE || !REGION){
    console.error('Faltan AZURE_SPEECH_KEY y AZURE_SPEECH_REGION (ver el comentario al principio del archivo).');
    process.exit(1);
  }
  const libros = JSON.parse(fs.readFileSync('libros.json', 'utf8'));
  let grabadas = 0, letras = 0;
  for (const l of libros){
    if (pedidos.size && !pedidos.has(l.slug)) continue;
    const origen = `textos/${l.slug}.txt`;
    if (!fs.existsSync(origen)){ console.log(l.slug.padEnd(44), 'sin texto (correr extraer-textos.js)'); continue; }
    const paginas = leerTextos(fs.readFileSync(origen, 'utf8'));
    const dir = path.join('audio', l.slug), rutaIndice = path.join(dir, 'indice.json');
    fs.mkdirSync(dir, { recursive: true });
    const anterior = fs.existsSync(rutaIndice) ? JSON.parse(fs.readFileSync(rutaIndice, 'utf8')).paginas || {} : {};
    const indice = { voz: VOZ, velocidad: VELOCIDAD, tono: TONO, paginas: {} };
    let nuevas = 0;
    for (const [n, texto] of Object.entries(paginas)){
      const archivo = path.join(dir, `p${n.padStart(2, '0')}.mp3`);
      // la huella cambia si cambia el texto o cualquier ajuste de la voz
      const huella = crypto.createHash('sha1').update(AJUSTES + '|' + texto).digest('hex').slice(0, 12);
      if (anterior[n] === huella && fs.existsSync(archivo)){ indice.paginas[n] = huella; continue; }
      fs.writeFileSync(archivo, await grabar(texto));
      indice.paginas[n] = huella;
      nuevas++; grabadas++; letras += texto.length;
      // se guarda en cada página: si se corta a la mitad, lo ya grabado no se pierde
      fs.writeFileSync(rutaIndice, JSON.stringify(indice, null, 1) + '\n');
      await esperar(3200);
    }
    // páginas que ya no tienen texto: su audio sobra
    for (const f of fs.readdirSync(dir)){
      const m = f.match(/^p(\d+)\.mp3$/);
      if (m && !indice.paginas[String(Number(m[1]))]) fs.unlinkSync(path.join(dir, f));
    }
    fs.writeFileSync(rutaIndice, JSON.stringify(indice, null, 1) + '\n');
    console.log(l.slug.padEnd(44), nuevas ? `${nuevas} páginas grabadas` : 'al día');
  }
  console.log(`Listo: ${grabadas} páginas, ${letras} letras (el plan gratis de Azure da 500.000 por mes).`);
})().catch(e => { console.error(e.message); process.exit(1); });
