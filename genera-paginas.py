# -*- coding: utf-8 -*-
"""Genera una pagina por libro a partir de libros.json.

Cada pagina es una cascara minima: carga el visor compartido y le pasa su PDF.
Correr despues de tocar libros.json:  python genera-paginas.py
"""
import json, html, io, os

PLANTILLA = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>{titulo_t}</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="{desc}">
<meta name="theme-color" content="#3a2415">
<link rel="shortcut icon" type="image/png" href="./favicon.ico">

<meta property="og:type" content="book">
<meta property="og:title" content="{titulo_t}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="portadas/{slug}.jpg">

<link rel="stylesheet" href="./lib/stPageFlip.css">
<link rel="stylesheet" href="./lib/visor.css">
</head>
<body>

<!-- Generado por genera-paginas.py a partir de libros.json. No editar a mano.
     pdf.js (Mozilla, Apache-2.0) rasteriza el PDF;
     StPageFlip / page-flip 2.0.7 (Nodlik, MIT) hace el pasaje de paginas. -->
<script src="./pdfjs-dist/build/pdf.min.js"></script>
<script src="./lib/page-flip.browser.js"></script>
<script src="./lib/visor.js"></script>
<script>
Visor.iniciar({{
  pdf: "pdf/{slug}.pdf",
  titulo: {titulo_js},
  subtitulo: {subtitulo_js},
  inicio: "./index.html"
}});
</script>
</body>
</html>
"""

def refresca_pesos(libros):
    """Deja el tamano de cada PDF al dia, asi la estanteria no miente."""
    for l in libros:
        ruta = "pdf/%s.pdf" % l["slug"]
        l["peso"] = os.path.getsize(ruta) if os.path.exists(ruta) else 0
    with io.open("libros.json", "w", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(libros, ensure_ascii=False, indent=2) + "\n")


def main():
    libros = json.load(io.open("libros.json", encoding="utf-8"))
    refresca_pesos(libros)
    for l in libros:
        titulo = l["titulo"] + ((" · " + l["subtitulo"]) if l["subtitulo"] else "")
        desc = u"%s — libro ilustrado para leer pasando las páginas." % l["titulo"]
        pagina = PLANTILLA.format(
            slug=l["slug"],
            titulo_t=html.escape(titulo),
            desc=html.escape(desc),
            titulo_js=json.dumps(l["titulo"], ensure_ascii=False),
            subtitulo_js=json.dumps(l["subtitulo"], ensure_ascii=False),
        )
        with io.open(l["pagina"], "w", encoding="utf-8", newline="\n") as f:
            f.write(pagina)
        falta = "" if os.path.exists("pdf/%s.pdf" % l["slug"]) else "  <-- FALTA EL PDF"
        print(u"%-46s %s%s" % (l["pagina"], l["titulo"], falta))
    print("%d paginas generadas" % len(libros))

if __name__ == "__main__":
    main()
