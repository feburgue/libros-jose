# -*- coding: utf-8 -*-
"""Rehace los libros en formato apaisado: la ilustración ocupa toda la página
(es lo que mira la nena) y el texto de textos/<slug>.txt va chico, en una
franja abajo (es para el adulto). Si una página tiene mucho texto, va en una
columna al costado para no tapar medio dibujo.

Toma el PDF original de pdf/originales/<slug>.pdf (la primera vez lo mueve ahí
desde pdf/) y deja el nuevo en pdf/<slug>.pdf. Cada página nueva corresponde a
la misma página del original, así que el audio de audio/<slug>/ sigue sincronizado.

Hay dos tipos de libro:
- Los armados como pliego apaisado con fondo de papel e ilustración aparte (la
  mayoría): se rehacen las páginas con texto; la tapa y el resto quedan igual.
- Los de ESPECIALES (otras editoriales): se rehace todo en apaisado, la tapa
  pasa a ser el dibujo con el título, y se sacan las páginas que no son del
  cuento (avisos, publicidad). Al sacarlas, la primera vez se renumeran
  textos/<slug>.txt y los audios; pdf/originales/<slug>.json guarda qué se sacó.

Necesita Chrome para imprimir el PDF.
Correr:  python rehacer-libros.py la-semillita-dormida caperucita
"""
import html, io, json, os, re, shutil, subprocess, sys, tempfile
import pypdf
from PIL import Image, ImageEnhance, ImageFilter

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
# Fondos de papel que ocupan toda la página: no son la ilustración
FONDOS = {(2142, 3000), (1428, 2000)}
# Libros de otras editoriales: páginas del PDF original que no son parte del cuento
ESPECIALES = {
    # En Caperucita el dibujo de cada escena está en la página siguiente a su texto: va con
    # el texto y se saca la página que era solo dibujo (y la nota del editor, la 12)
    "caperucita": {"quitar": [3, 5, 7, 12],
                   "imagen": {2: 3, 4: 5, 6: 7, 9: 7, 10: 3, 11: 1}},
    "gato-con-botas": {"quitar": []},
    "hadas": {"quitar": []},
    "pinocho": {"quitar": [2, 14, 15]},          # aviso legal, recortable y publicidad
    # En las Fábulas cada escena se arma con varias imágenes debajo del texto: se usan
    # recortes ya hechos de la página dibujada (pdf/originales/fabulas-de-esopo/), y la
    # tapa original entera, que ya trae su título
    "fabulas-de-esopo": {"quitar": [2, 8],       # aviso legal y publicidad
                         "archivo": {n: "pdf/originales/fabulas-de-esopo/escena-%d.jpg" % n for n in (1, 3, 4, 5, 6, 7)},
                         "sin_titulo": True},
    "ponte-en-mi-lugar": {"quitar": [2, 3, 20, 21]},  # guardas, créditos y contratapa
}
APAISADO = (876.0, 612.96)
# Con más letras que esto, el texto va en columna al costado
LARGO = 480

ESTILO = """
@page { size: %(w)spt %(h)spt; margin: 0 }
html, body { margin: 0 }
section { width: %(w)spt; height: %(h)spt; position: relative; overflow: hidden; page-break-after: always; background: #f6eedd }
/* la ilustración entera; si no tiene la forma de la página, el hueco se llena con ella misma difuminada */
.fondo { position: absolute; inset: 0; width: 100%%; height: 100%%; object-fit: cover }
.ilus { position: absolute; inset: 0; width: 100%%; height: 100%%; object-fit: contain }
.ilus.llena { object-fit: cover }
.texto { position: absolute; left: 18pt; right: 18pt; bottom: 14pt; padding: 7pt 14pt;
  background: rgba(255, 250, 240, .86); border-radius: 12pt; box-shadow: 0 2pt 10pt rgba(0,0,0,.15);
  font: 13pt/1.32 Georgia, 'Times New Roman', serif; color: #3a2a1a }
.texto p { display: inline; margin: 0 }
.texto p + p::before { content: " " }
/* mucho texto: el dibujo a la izquierda y el texto en columna a la derecha */
section.lado .ilus { width: 64%% }
section.lado .texto { left: auto; top: 14pt; bottom: 14pt; width: 31%%; display: flex; flex-direction: column; justify-content: center;
  font-size: %(chica)spt; padding: 10pt 14pt }
section.lado .texto p { display: block; margin: 0 0 4pt }
section.lado .texto p + p::before { content: none }
/* tapa: el título grande sobre el dibujo */
.titulo { position: absolute; left: 50%%; transform: translateX(-50%%); bottom: 18pt; padding: 8pt 26pt; white-space: nowrap;
  background: rgba(255, 250, 240, .9); border-radius: 14pt; box-shadow: 0 2pt 10pt rgba(0,0,0,.2);
  font: bold 30pt/1.2 Georgia, 'Times New Roman', serif; color: #5a2e14 }
"""


def textos(slug):
    paginas, actual = {}, None
    for l in io.open(os.path.join("textos", slug + ".txt"), encoding="utf-8"):
        l = l.rstrip("\n")
        m = re.match(r"^==\s*(\d+)\s*$", l)
        if m:
            actual = int(m.group(1)); paginas[actual] = []; continue
        if actual is None or l.startswith("#") or not l.strip():
            continue
        paginas[actual].append(l.strip())
    return {k: v for k, v in paginas.items() if v}


def ilustracion(pagina):
    """La ilustración de la página: la imagen más grande que no sea el fondo de
    papel ni un adorno (chica o muy finita). Si el dibujo viene partido en dos
    mitades de la misma altura (pliegos de doble página), las une."""
    ims = []
    for im in pagina.images:
        ancho, alto = im.image.size
        if (ancho, alto) in FONDOS or ancho * alto < 120000 or not 0.25 < ancho / alto < 4:
            continue
        ims.append(im.image)
    if not ims:
        return None
    ims.sort(key=lambda im: -im.size[0] * im.size[1])
    a = ims[0]
    if len(ims) > 1:
        b = ims[1]
        if abs(a.size[1] - b.size[1]) <= 2 and 1.6 < (a.size[0] + b.size[0]) / a.size[1] < 2.4:
            # en el orden en que aparecen en la página: izquierda primero
            orden = [im.image.size for im in pagina.images]
            izq, der = (a, b) if orden.index(a.size) <= orden.index(b.size) else (b, a)
            junto = Image.new("RGB", (izq.size[0] + der.size[0], izq.size[1]))
            junto.paste(izq.convert("RGB"), (0, 0)); junto.paste(der.convert("RGB"), (izq.size[0], 0))
            return junto
    return a


def guardar_imagen(img, ruta):
    # dibujos con fondo transparente: sobre blanco (convertirlos directo deja el fondo negro)
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
        rgba = img.convert("RGBA")
        blanco = Image.new("RGB", rgba.size, "white")
        blanco.paste(rgba, mask=rgba.getchannel("A"))
        img = blanco
    img = img.convert("RGB")
    img.save(ruta, quality=86)
    # el relleno difuminado se hace acá, chico: un filtro CSS lo imprimiría como una imagen enorme
    chico = img.copy(); chico.thumbnail((360, 360))
    fondo = ImageEnhance.Brightness(chico.filter(ImageFilter.GaussianBlur(9))).enhance(.9)
    ruta_fondo = ruta.replace(".jpg", "_fondo.jpg")
    fondo.save(ruta_fondo, quality=70)
    return img, ruta_fondo


def seccion(img, ruta, ruta_fondo, w, h, parrafos=None, titulo=None):
    llena = abs(img.size[0] / img.size[1] - w / h) < 0.08
    largo = parrafos and sum(len(t) for t in parrafos) > LARGO
    capa = ""
    if titulo:
        capa = '<div class="titulo">%s</div>' % html.escape(titulo)
    elif parrafos:
        capa = '<div class="texto">%s</div>' % "".join("<p>%s</p>" % html.escape(t) for t in parrafos)
    return '<section class="%s"><img class="fondo" src="%s"><img class="ilus%s" src="%s">%s</section>' % (
        "lado" if largo else "", os.path.basename(ruta_fondo), " llena" if llena and not largo else "",
        os.path.basename(ruta), capa)


def renumerar(slug, quitar, total):
    """Saca las páginas quitadas de la numeración de textos/ y audio/ (una sola vez)."""
    marca = os.path.join("pdf", "originales", slug + ".json")
    if os.path.exists(marca):
        return
    quedan = [i for i in range(1, total + 1) if i not in quitar]
    nuevo = {viejo: k for k, viejo in enumerate(quedan, 1)}
    ruta_txt = os.path.join("textos", slug + ".txt")
    t = io.open(ruta_txt, encoding="utf-8").read()
    t = re.sub(r"^==\s*(\d+)\s*$", lambda m: "== %d" % nuevo[int(m.group(1))] if int(m.group(1)) in nuevo else "== quitada",
               t, flags=re.M)
    # la sección quitada se va entera, también si es la última del archivo
    t = re.sub(r"\n== quitada(?:\n[\s\S]*?)?(?=\n== |\Z)", "\n", t)
    io.open(ruta_txt, "w", encoding="utf-8", newline="\n").write(t)
    carpeta = os.path.join("audio", slug)
    indice_ruta = os.path.join(carpeta, "indice.json")
    if os.path.exists(indice_ruta):
        indice = json.load(io.open(indice_ruta, encoding="utf-8"))
        viejas = indice.get("paginas", {})
        nuevas = {}
        # renombrar en dos pasos para no pisar archivos
        for v in viejas:
            os.rename(os.path.join(carpeta, "p%02d.mp3" % int(v)), os.path.join(carpeta, "tmp%02d.mp3" % int(v)))
        for v, huella in viejas.items():
            v = int(v)
            if v in nuevo:
                os.rename(os.path.join(carpeta, "tmp%02d.mp3" % v), os.path.join(carpeta, "p%02d.mp3" % nuevo[v]))
                nuevas[str(nuevo[v])] = huella
            else:
                os.remove(os.path.join(carpeta, "tmp%02d.mp3" % v))
        indice["paginas"] = nuevas
        io.open(indice_ruta, "w", encoding="utf-8", newline="\n").write(json.dumps(indice, indent=1) + "\n")
    json.dump({"quitadas": quitar}, io.open(marca, "w", encoding="utf-8"))


def imprimir(secciones, w, h, tmp, slug, chica=12):
    doc = "<!doctype html><html><head><meta charset='utf-8'><style>%s</style></head><body>%s</body></html>" % (
        ESTILO % {"w": w, "h": h, "chica": chica}, "".join(secciones))
    ruta_html = os.path.join(tmp, slug + ".html")
    io.open(ruta_html, "w", encoding="utf-8").write(doc)
    ruta_pdf = os.path.join(tmp, slug + ".pdf")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--allow-file-access-from-files",
                    "--print-to-pdf=" + ruta_pdf, "file:///" + ruta_html.replace("\\", "/")], check=True, capture_output=True)
    nuevo = pypdf.PdfReader(ruta_pdf)
    if len(nuevo.pages) != len(secciones):
        raise SystemExit("%s: Chrome devolvió %d páginas y esperaba %d" % (slug, len(nuevo.pages), len(secciones)))
    return nuevo


def rehacer(slug, tmp):
    original = os.path.join("pdf", "originales", slug + ".pdf")
    if not os.path.exists(original):
        os.makedirs(os.path.dirname(original), exist_ok=True)
        shutil.move(os.path.join("pdf", slug + ".pdf"), original)
    r = pypdf.PdfReader(original)
    especial = ESPECIALES.get(slug)
    if especial:
        return rehacer_especial(slug, r, especial, tmp)
    w, h = float(r.pages[0].mediabox.width), float(r.pages[0].mediabox.height)
    txt = textos(slug)
    secciones, nuevas, anterior = [], [], None
    for i, p in enumerate(r.pages, 1):
        if i == 1 or i not in txt:
            continue
        # una página con texto pero sin dibujo (un cierre, por ejemplo) usa el dibujo de la anterior
        img = ilustracion(p) or anterior
        if img is None:
            continue
        anterior = img
        ruta = os.path.join(tmp, "%s_%02d.jpg" % (slug, i))
        img, ruta_fondo = guardar_imagen(img, ruta)
        secciones.append(seccion(img, ruta, ruta_fondo, w, h, txt[i]))
        nuevas.append(i)
    if not nuevas:
        print("%-44s sin páginas para rehacer (¿no es del formato con ilustración aparte?)" % slug)
        return
    nuevo = imprimir(secciones, w, h, tmp, slug)
    salida, k = pypdf.PdfWriter(), 0
    for i, p in enumerate(r.pages, 1):
        if i in nuevas:
            salida.add_page(nuevo.pages[k]); k += 1
        else:
            salida.add_page(p)
    with open(os.path.join("pdf", slug + ".pdf"), "wb") as f:
        salida.write(f)
    print("%-44s %d de %d páginas rehechas" % (slug, len(nuevas), len(r.pages)))


def rehacer_especial(slug, r, especial, tmp):
    quitar = especial["quitar"]
    renumerar(slug, quitar, len(r.pages))
    quedan = [i for i in range(1, len(r.pages) + 1) if i not in quitar]
    # textos/ ya está con la numeración nueva: se lleva a la del PDF original
    txt = {quedan[k - 1]: v for k, v in textos(slug).items() if k <= len(quedan)}
    titulo = next(l["titulo"] for l in json.load(io.open("libros.json", encoding="utf-8")) if l["slug"] == slug)
    w, h = APAISADO
    secciones, anterior = [], None
    otra, archivos = especial.get("imagen", {}), especial.get("archivo", {})
    for i in quedan:
        if i in archivos:
            img = Image.open(archivos[i])
        else:
            img = ilustracion(r.pages[otra.get(i, i) - 1]) or anterior
        if img is None:
            raise SystemExit("%s: la página %d no tiene dibujo y no hay uno anterior" % (slug, i))
        anterior = img
        ruta = os.path.join(tmp, "%s_%02d.jpg" % (slug, i))
        img, ruta_fondo = guardar_imagen(img, ruta)
        if i == 1:
            secciones.append(seccion(img, ruta, ruta_fondo, w, h, titulo=None if especial.get("sin_titulo") else titulo))
        else:
            secciones.append(seccion(img, ruta, ruta_fondo, w, h, txt.get(i)))
    nuevo = imprimir(secciones, w, h, tmp, slug, chica=11.5 if slug == "fabulas-de-esopo" else 12)
    salida = pypdf.PdfWriter()
    for p in nuevo.pages:
        salida.add_page(p)
    with open(os.path.join("pdf", slug + ".pdf"), "wb") as f:
        salida.write(f)
    print("%-44s %d páginas (de %d del original)" % (slug, len(quedan), len(r.pages)))


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    with tempfile.TemporaryDirectory() as tmp:
        for slug in sys.argv[1:]:
            rehacer(slug, tmp)


if __name__ == "__main__":
    main()
