# -*- coding: utf-8 -*-
"""Rehace los libros en formato apaisado: la ilustración ocupa toda la página
(es lo que mira la nena) y el texto de textos/<slug>.txt va chico, en una
franja abajo (es para el adulto).

Toma el PDF original de pdf/originales/<slug>.pdf (la primera vez lo mueve ahí
desde pdf/) y deja el nuevo en pdf/<slug>.pdf. Cada página nueva corresponde a
la misma página del original, así que el audio de audio/<slug>/ sigue sincronizado.
La tapa y las páginas sin texto quedan como en el original.

Sirve para los libros armados como pliego apaisado con un fondo de papel y una
ilustración aparte (la mayoría). Necesita Chrome para imprimir el PDF.
Correr:  python rehacer-libros.py la-semillita-dormida alba-y-el-tarro-de-las-cosas-bonitas
"""
import html, io, os, re, shutil, subprocess, sys, tempfile
import pypdf
from PIL import ImageEnhance, ImageFilter

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
# Fondos de papel que ocupan toda la página: no son la ilustración
FONDOS = {(2142, 3000), (1428, 2000)}

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
    """La imagen más grande de la página que no sea el fondo de papel."""
    ims = [im for im in pagina.images if im.image.size not in FONDOS]
    if not ims:
        return None
    return max(ims, key=lambda im: im.image.size[0] * im.image.size[1]).image


def rehacer(slug, tmp):
    original = os.path.join("pdf", "originales", slug + ".pdf")
    if not os.path.exists(original):
        os.makedirs(os.path.dirname(original), exist_ok=True)
        shutil.move(os.path.join("pdf", slug + ".pdf"), original)
    r = pypdf.PdfReader(original)
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
        img = img.convert("RGB")
        img.save(ruta, quality=86)
        # el relleno difuminado se hace acá, chico: un filtro CSS lo imprimiría como una imagen enorme
        chico = img.copy(); chico.thumbnail((360, 360))
        fondo = ImageEnhance.Brightness(chico.filter(ImageFilter.GaussianBlur(9))).enhance(.9)
        ruta_fondo = ruta.replace(".jpg", "_fondo.jpg")
        fondo.save(ruta_fondo, quality=70)
        # casi la misma forma que la página: a sangre; si no, entera sobre su versión difuminada
        llena = abs(img.size[0] / img.size[1] - w / h) < 0.08
        parr = "".join("<p>%s</p>" % html.escape(t) for t in txt[i])
        nombre = os.path.basename(ruta)
        secciones.append('<section><img class="fondo" src="%s"><img class="ilus%s" src="%s"><div class="texto">%s</div></section>'
                         % (os.path.basename(ruta_fondo), " llena" if llena else "", nombre, parr))
        nuevas.append(i)
    if not nuevas:
        print("%-44s sin páginas para rehacer (¿no es del formato con ilustración aparte?)" % slug)
        return
    doc = "<!doctype html><html><head><meta charset='utf-8'><style>%s</style></head><body>%s</body></html>" % (
        ESTILO % {"w": w, "h": h}, "".join(secciones))
    ruta_html = os.path.join(tmp, slug + ".html")
    io.open(ruta_html, "w", encoding="utf-8").write(doc)
    ruta_pdf = os.path.join(tmp, slug + ".pdf")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--allow-file-access-from-files",
                    "--print-to-pdf=" + ruta_pdf, "file:///" + ruta_html.replace("\\", "/")], check=True, capture_output=True)
    nuevo = pypdf.PdfReader(ruta_pdf)
    if len(nuevo.pages) != len(nuevas):
        raise SystemExit("%s: Chrome devolvió %d páginas y esperaba %d" % (slug, len(nuevo.pages), len(nuevas)))
    salida, k = pypdf.PdfWriter(), 0
    for i, p in enumerate(r.pages, 1):
        if i in nuevas:
            salida.add_page(nuevo.pages[k]); k += 1
        else:
            salida.add_page(p)
    with open(os.path.join("pdf", slug + ".pdf"), "wb") as f:
        salida.write(f)
    print("%-44s %d de %d páginas rehechas" % (slug, len(nuevas), len(r.pages)))


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    with tempfile.TemporaryDirectory() as tmp:
        for slug in sys.argv[1:]:
            rehacer(slug, tmp)


if __name__ == "__main__":
    main()
