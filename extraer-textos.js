/* Saca el texto de cada PDF para que el visor pueda leer el cuento en voz alta.

   Deja un textos/<slug>.txt por libro, con una sección por página del PDF:

       == 2
       Había una vez una semillita llamada Semillita...

   El archivo se puede corregir a mano (es lo que se lee, y de donde salen los
   audios). Por eso NO pisa los que ya existen: para rehacer uno, borrarlo antes.
   Usa el mismo pdf.js que el visor.
   Correr:  node extraer-textos.js              (todos los que falten)
            node extraer-textos.js caperucita   (solo esos slugs)
*/
const fs = require('fs');
const path = require('path');
const pdfjs = require('./pdfjs-dist/build/pdf.min.js');
pdfjs.GlobalWorkerOptions.workerSrc = path.join(__dirname, 'pdfjs-dist/build/pdf.worker.min.js');

// Adornos de los PDF que no se leen
const ADORNOS = /[☀-➿⸀-⹿⁂⁕※]|[\u{1F300}-\u{1FAFF}]/gu;
// Números de página sueltos ("- 5 -", "5")
const NUMERO_PAGINA = /^[-–\s\d]+$/;
// Avisos de la editorial, direcciones web y créditos: no son parte del cuento
const EDITORIAL = /alfabetito|material autorizado|visita la p[aá]gina|derechos de autor|©|isbn|www\.|https?:/i;

// Pedazos de texto con su posición. Muchos PDF dibujan cada texto dos veces, apenas
// corrido (relleno y borde): se queda con uno solo.
function fragmentos(items){
  const vistos = new Map(), salida = [];
  for (const it of items){
    if (!it.str.trim()) continue;
    const [a, b, , d, x, y] = it.transform, tam = Math.hypot(a, b) || Math.abs(d) || 10;
    const previos = vistos.get(it.str) || [];
    if (previos.some(p => Math.abs(p.x - x) < tam * .3 && Math.abs(p.y - y) < tam * .3)) continue;
    previos.push({ x, y }); vistos.set(it.str, previos);
    salida.push({ t: it.str, x, y, fin: x + (it.width || 0), tam });
  }
  return salida;
}

// Página a dos columnas: casi ningún pedazo cruza el medio y hay texto de los dos lados
function columnas(frags, ancho){
  const medio = ancho / 2, margen = ancho * .02;
  const cruzan = frags.filter(f => f.x < medio - margen && f.fin > medio + margen).length;
  const izq = frags.filter(f => f.fin <= medio + margen), der = frags.filter(f => f.x >= medio - margen);
  const filas = fs => new Set(fs.map(f => Math.round(f.y / 4))).size;
  if (cruzan <= frags.length * .05 && filas(izq) >= 3 && filas(der) >= 3) return [izq, der.filter(f => !izq.includes(f))];
  return [frags];
}

// Renglones de arriba hacia abajo y, dentro de cada uno, de izquierda a derecha
function renglones(frags){
  const filas = [];
  for (const f of [...frags].sort((p, q) => q.y - p.y || p.x - q.x)){
    const fila = filas[filas.length - 1];
    if (fila && Math.abs(fila.y - f.y) < f.tam * .4) fila.partes.push(f);
    else filas.push({ y: f.y, tam: f.tam, partes: [f] });
  }
  return filas.map(fila => {
    let linea = '';
    for (const p of fila.partes.sort((a, b) => a.x - b.x)){
      // La letra capital va pegada a lo que sigue ("H" grande + "abía")
      // ("A" + " la mañana" conserva el espacio porque el pedazo ya lo trae)
      const capital = /^\p{Lu}$/u.test(linea) && /^\p{Ll}/u.test(p.t);
      if (linea && !linea.endsWith(' ') && !p.t.startsWith(' ') && !capital) linea += ' ';
      linea += p.t;
    }
    return { y: fila.y, tam: fila.tam, linea };
  });
}

// Une los renglones en párrafos: corta en los saltos grandes, junta las palabras
// partidas con guion y saca adornos y números de página
function parrafos(lineas, titulo){
  lineas = lineas.map(l => ({ ...l, linea: l.linea.normalize('NFC').replace(ADORNOS, '').replace(/\s+/g, ' ').trim() }))
                 .filter(l => l.linea && !NUMERO_PAGINA.test(l.linea));
  const salida = [];
  let actual = '', ant = null;
  for (const l of lineas){
    if (actual && ant && (ant.y - l.y) > Math.max(ant.tam, l.tam) * 1.9){ salida.push(actual); actual = ''; }
    if (/\p{L} ?-$/u.test(actual) && /^\p{Ll}/u.test(l.linea)) actual = actual.replace(/ ?-$/, '') + l.linea;
    else actual = (actual + ' ' + l.linea).trim();
    ant = l;
  }
  if (actual) salida.push(actual);
  // Encabezado que repite el título en cada página ("PINOCHO 3", "FÁBULAS DE ESOPO")
  const t = titulo.normalize('NFC').toUpperCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const encabezado = new RegExp('^' + t + '\\s*\\d*\\s*');
  return salida.map(p => p
    .replace(encabezado, '')
    // "Estoy aquí , susurró ." -> "Estoy aquí, susurró."
    .replace(/ +([,.;:!?…»)])/g, '$1').replace(/([¿¡«(—]) +/g, '$1')
    // letras espaciadas para lucirse ("t i c", "S P L A S H") -> "tic", "SPLASH"
    .replace(/(?<!\p{L})\p{L}(?: \p{L}){2,}(?!\p{L})/gu, m => m.replace(/ /g, ''))
    .trim()
  ).filter(p => p && !EDITORIAL.test(p) && !EDITORIAL.test(p.replace(/ /g, ''))).join('\n');
}

async function extraer(libro){
  const data = new Uint8Array(fs.readFileSync(`pdf/${libro.slug}.pdf`));
  const doc = await pdfjs.getDocument({ data, isEvalSupported: false }).promise;
  const partes = [];
  for (let i = 1; i <= doc.numPages; i++){
    let texto;
    // En la tapa el título suele ser un dibujo con letras sueltas: se lee el de libros.json
    if (i === 1) texto = libro.titulo + '.' + (libro.subtitulo ? ' ' + libro.subtitulo + '.' : '');
    else {
      const pag = await doc.getPage(i), ancho = pag.getViewport({ scale: 1 }).width;
      const frags = fragmentos((await pag.getTextContent()).items);
      texto = columnas(frags, ancho).map(c => parrafos(renglones(c), libro.titulo)).filter(Boolean).join('\n');
    }
    if (texto) partes.push(`== ${i}\n${texto}`);
  }
  await doc.destroy();
  return partes;
}

(async () => {
  process.chdir(__dirname);
  const libros = JSON.parse(fs.readFileSync('libros.json', 'utf8'));
  const pedidos = new Set(process.argv.slice(2));
  fs.mkdirSync('textos', { recursive: true });
  for (const l of libros){
    if (pedidos.size && !pedidos.has(l.slug)) continue;
    const destino = `textos/${l.slug}.txt`, nombre = l.slug.padEnd(44);
    if (fs.existsSync(destino)){ console.log(nombre, 'ya existe (borrarlo para rehacerlo)'); continue; }
    if (!fs.existsSync(`pdf/${l.slug}.pdf`)){ console.log(nombre, 'FALTA EL PDF'); continue; }
    const partes = await extraer(l);
    const cabeza = `# ${l.titulo}\n# Una sección por página del PDF (== número). Se puede corregir a mano:\n` +
                   `# esto es lo que se lee en voz alta. Una página sin sección no se lee.\n`;
    fs.writeFileSync(destino, cabeza + '\n' + partes.join('\n\n') + '\n');
    console.log(nombre, partes.length, 'páginas con texto');
  }
})().catch(e => { console.error(e); process.exit(1); });
