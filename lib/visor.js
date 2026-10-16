/* Visor de libros en PDF.
 *
 *   Visor.iniciar({ pdf: "pdf/pinocho.pdf", titulo: "Pinocho" });
 *
 * pdf.js rasteriza cada página y StPageFlip hace el pasaje de hojas. El PDF es
 * la única entrada: no hay index ni configuración generada por ninguna herramienta.
 *
 * Requiere, en este orden: pdfjs-dist/build/pdf.min.js, lib/page-flip.browser.js.
 */
(function (global) {
  "use strict";

  var PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
  var PRIMERAS = 4;            // páginas que se dibujan antes de mostrar el libro

  var ICONOS = {
    sonido: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
    girar: '<rect x="7" y="10" width="10" height="10" rx="2"/><path d="M1.8 15A10.2 10.2 0 0 1 12 4.8"/><path d="m9.2 3.9 3.1.9-.9 3.1"/>',
    pantalla: '<path d="M8 3H3v5"/><path d="M16 3h5v5"/><path d="M16 21h5v-5"/><path d="M8 21H3v-5"/>',
    casa: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
    izq: '<path d="M15 5 8 12l7 7"/>',
    der: '<path d="m9 5 7 7-7 7"/>',
    leer: '<path d="M7 4.5v15l12-7.5z"/>',
    pausa: '<path d="M8 5v14"/><path d="M16 5v14"/>'
  };

  function svg(d) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + d + "</svg>";
  }

  function armarUI(cfg) {
    var head = document.createElement("header");
    head.className = "v-header";
    var h1 = document.createElement("h1");
    h1.textContent = cfg.titulo;                       // textContent: el título puede venir de la URL
    if (cfg.subtitulo) {
      var s = document.createElement("small");
      s.textContent = " · " + cfg.subtitulo;
      h1.appendChild(s);
    }
    head.appendChild(h1);
    head.insertAdjacentHTML("beforeend",
      '<div class="v-spacer"></div><div class="v-tools">' +
      (cfg.inicio ? '<a class="v-tool" id="v-home" href="' + cfg.inicio + '" aria-label="Volver a los libros" title="Todos los libros">' + svg(ICONOS.casa) + "</a>" : "") +
      // aparece solo si el cuento tiene su texto en textos/
      '<button class="v-tool v-leer" id="v-leer" aria-pressed="false" aria-label="Leer el cuento solo" title="Leer solo" hidden>' + svg(ICONOS.leer) + "</button>" +
      '<button class="v-tool" id="v-sound" aria-pressed="true" aria-label="Sonido al pasar la página" title="Sonido">' + svg(ICONOS.sonido) + "</button>" +
      // girar y pantalla completa juntos: los dos cambian como se ve el libro
      '<button class="v-tool" id="v-girar" aria-pressed="false" aria-label="Girar el libro 90 grados" title="Girar 90°">' + svg(ICONOS.girar) + "</button>" +
      '<button class="v-tool" id="v-full" aria-label="Pantalla completa" title="Pantalla completa">' + svg(ICONOS.pantalla) + "</button>" +
      "</div>");

    var main = document.createElement("main");
    main.className = "v-stage";
    main.innerHTML =
      '<button class="v-nav prev" id="v-prev" aria-label="Página anterior">' + svg(ICONOS.izq) + "</button>" +
      '<div id="v-shift"><div id="v-book"></div></div>' +
      '<button class="v-nav next" id="v-next" aria-label="Página siguiente">' + svg(ICONOS.der) + "</button>";

    var foot = document.createElement("footer");
    foot.className = "v-footer";
    foot.innerHTML =
      '<input type="range" id="v-range" min="0" max="0" value="0" step="1" aria-label="Ir a una página">' +
      '<span id="v-counter">— / —</span>';

    var loader = document.createElement("div");
    loader.id = "v-loader";
    loader.innerHTML =
      '<div class="box"><p id="v-status">Preparando el cuento…</p>' +
      '<div class="v-track"><div class="v-fill" id="v-fill"></div></div>' +
      '<p id="v-error"></p></div>';

    // Todo el visor vive dentro de un marco propio para poder girarlo 90° sin
    // tocar la orientacion del dispositivo. El cartel de carga queda afuera.
    var marco = document.createElement("div");
    marco.id = "v-marco";
    marco.appendChild(head);
    marco.appendChild(main);
    marco.appendChild(foot);
    document.body.appendChild(marco);
    document.body.appendChild(loader);
  }

  // --- sonido de hoja, sintetizado: no depende de ningún archivo de audio ---
  function Sonido() {
    var activo = true, ctx = null;
    this.alternar = function () { activo = !activo; return activo; };
    this.sonar = function () {
      if (!activo) return;
      try {
        var Ctx = global.AudioContext || global.webkitAudioContext;
        if (!Ctx) return;
        if (!ctx) ctx = new Ctx();
        if (ctx.state === "suspended") ctx.resume();

        var n = Math.floor(ctx.sampleRate * 0.32);
        var buf = ctx.createBuffer(1, n, ctx.sampleRate);
        var data = buf.getChannelData(0);
        for (var i = 0; i < n; i++) {
          var t = i / n;                    // ruido con ataque suave y cola larga
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.5) * Math.min(1, t * 24);
        }
        var src = ctx.createBufferSource(); src.buffer = buf;
        var flt = ctx.createBiquadFilter(); flt.type = "bandpass";
        flt.frequency.value = 1800; flt.Q.value = 0.6;
        var vol = ctx.createGain(); vol.gain.value = 0.16;
        src.connect(flt); flt.connect(vol); vol.connect(ctx.destination);
        src.start();
      } catch (e) { /* sin audio el libro igual funciona */ }
    };
  }

  // --- lectura en voz alta ---
  // El texto de cada página sale de textos/<libro>.txt ("== 3" abre la página 3).
  // Si hay audio grabado (audio/<libro>/indice.json + p03.mp3) suena ese; si no,
  // la voz del navegador.
  function leerTextos(txt) {
    var paginas = {}, actual = null;
    txt.split(/\r?\n/).forEach(function (l) {
      var m = l.match(/^==\s*(\d+)\s*$/);
      if (m) { actual = Number(m[1]); paginas[actual] = ""; return; }
      if (actual === null || /^#/.test(l)) return;
      paginas[actual] += (paginas[actual] ? "\n" : "") + l;
    });
    Object.keys(paginas).forEach(function (k) { paginas[k] = paginas[k].trim(); if (!paginas[k]) delete paginas[k]; });
    return paginas;
  }

  function Lector(base) {
    var textos = {}, audios = {}, audio = null, token = 0, self = this;
    var synth = global.speechSynthesis;

    this.listo = fetch(base.textos).then(function (r) { if (!r.ok) throw r.status; return r.text(); })
      .then(function (t) { textos = leerTextos(t); return Object.keys(textos).length > 0; })
      .catch(function () { return false; });
    // indice.json: { "paginas": { "3": "..." } } dice qué páginas tienen audio grabado
    fetch(base.audio + "indice.json").then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (j) { audios = (j && j.paginas) || {}; }).catch(function () {});

    this.tieneTexto = function (n) { return !!textos[n]; };

    // Voz del navegador para cuando no hay audio: una de mujer en español
    function vozNavegador() {
      var es = synth ? synth.getVoices().filter(function (v) { return /^es/i.test(v.lang); }) : [];
      var mujer = /paulina|sabina|dalia|elena|helena|monica|mónica|laura|luc[ií]a|valentina|elvira|ximena|paloma|google español/i;
      return es.filter(function (v) { return mujer.test(v.name); })[0] || es[0] || null;
    }
    function hablar(texto, t) {
      return new Promise(function (listo) {
        if (!synth) return listo();
        // de a una frase: Chrome corta los textos largos
        var frases = (texto.match(/[^.!?…]+[.!?…]*\s*/g) || []).filter(function (f) { return f.trim(); });
        var v = vozNavegador(), quedan = frases.length;
        if (!quedan) return listo();
        frases.forEach(function (f) {
          var u = new SpeechSynthesisUtterance(f);
          if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "es-419";
          u.rate = 0.9;
          u.onend = u.onerror = function () { if (--quedan <= 0 || t !== token) listo(); };
          synth.speak(u);
        });
      });
    }
    function sonar(n, t) {
      return new Promise(function (listo) {
        audio.onended = audio.onerror = function () { listo(); };
        audio.src = base.audio + "p" + (n < 10 ? "0" : "") + n + ".mp3";
        var p = audio.play();
        if (p && p.catch) p.catch(function () { listo(); });
      });
    }

    // Lee las páginas en orden; devuelve una promesa que termina al acabar (o al pararlo)
    this.leer = function (paginas) {
      self.callar();
      var t = token;
      var cadena = Promise.resolve();
      paginas.forEach(function (n) {
        if (!textos[n]) return;
        cadena = cadena.then(function () {
          if (t !== token) return;
          return audios[n] ? sonar(n, t) : hablar(textos[n], t);
        }).then(function () {
          if (t !== token) return;
          return new Promise(function (r) { setTimeout(r, 1500); });   // respiro tranquilo entre páginas
        });
      });
      return cadena.then(function () { return t === token; });
    };
    this.callar = function () {
      token++;
      if (audio) { audio.onended = audio.onerror = null; audio.pause(); }
      if (synth) synth.cancel();
    };
    // El primer audio tiene que crearse dentro del toque del botón (iPad, Chrome)
    this.preparar = function () { if (!audio) audio = new Audio(); };
  }

  function iniciar(cfg) {
    if (!cfg || !cfg.pdf) throw new Error("Visor.iniciar necesita { pdf }");
    cfg.titulo = cfg.titulo || "Libro";
    armarUI(cfg);

    var $ = function (id) { return document.getElementById(id); };
    var statusEl = $("v-status"), fillEl = $("v-fill"), errorEl = $("v-error"), loader = $("v-loader");
    var counter = $("v-counter"), range = $("v-range"), prevBtn = $("v-prev"), nextBtn = $("v-next");
    var el = $("v-book"), shift = $("v-shift"), stage = document.querySelector(".v-stage");
    var sonido = new Sonido();

    $("v-sound").addEventListener("click", function () {
      this.setAttribute("aria-pressed", String(sonido.alternar()));
    });
    $("v-full").addEventListener("click", function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
    });

    function fallar(msg) {
      loader.classList.remove("oculto");
      loader.style.display = "";
      statusEl.textContent = "No se pudo abrir el libro";
      errorEl.style.display = "block";
      errorEl.textContent = msg;
    }

    // El worker hay que apuntarlo a mano o pdf.js cae al "fake worker" y traba la UI.
    pdfjsLib.GlobalWorkerOptions.workerSrc = (cfg.pdfjs || "./pdfjs-dist/build/") + "pdf.worker.min.js";

    var imagenes = [], ratio = 0.707, doble = true;
    var flip = null, pageW = 0, ultima = 0, montado = false;

    // ---------- 1. dibujar el PDF ----------
    function dibujar(pdf, num) {
      return pdf.getPage(num).then(function (page) {
        var base = page.getViewport({ scale: 1 });
        var dpr = Math.min(global.devicePixelRatio || 1, 2);
        var objetivo = Math.min(1500, Math.max(760, Math.round(global.innerWidth * dpr)));
        var vp = page.getViewport({ scale: objetivo / base.width });

        var c = document.createElement("canvas");
        c.width = Math.round(vp.width); c.height = Math.round(vp.height);
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);

        return page.render({ canvasContext: ctx, viewport: vp }).promise.then(function () {
          imagenes[num - 1] = c.toDataURL("image/jpeg", 0.86);
          c.width = c.height = 0;                       // liberar memoria en celulares
          if (montado) {
            var div = el.querySelector('.v-page[data-idx="' + (num - 1) + '"]');
            if (div) {
              div.classList.remove("v-pendiente");
              div.querySelector("img").src = imagenes[num - 1];
            }
          }
          return base;
        });
      });
    }

    // ---------- 2. medidas ----------
    function medidas() {
      var vw = stage.clientWidth, vh = stage.clientHeight;
      // páginas apaisadas: el PDF ya trae el pliego entero, se muestra de a una
      var hojas = (doble && vw >= 760) ? 2 : 1;
      var h = vh * 0.95, w = h * ratio;
      var maxW = (vw - (hojas === 1 ? 24 : 110)) / hojas;
      if (w > maxW) { w = maxW; h = w / ratio; }
      return { w: Math.floor(w), h: Math.floor(h), hojas: hojas };
    }

    // La tapa y la contratapa se ven solas y ocupan media hoja del pliego. En vez
    // de deducir de qué lado cayeron, medimos lo visible y lo centramos.
    function recentrar(reintento) {
      requestAnimationFrame(function () {
        shift.style.transition = "none";
        shift.style.transform = "translateX(0px)";
        requestAnimationFrame(function () {
          var l = Infinity, r = -Infinity, visibles = [];
          Array.prototype.forEach.call(el.querySelectorAll(".stf__item"), function (n) {
            if (getComputedStyle(n).display === "none") return;
            // Coordenadas de maquetado y no de pantalla: con el visor girado 90°
            // getBoundingClientRect devuelve la caja ya rotada, y el centrado
            // saldria cruzado. offsetLeft va contra #v-book, que es el que hay
            // que centrar de todos modos.
            if (n.offsetWidth < 1) return;
            l = Math.min(l, n.offsetLeft); r = Math.max(r, n.offsetLeft + n.offsetWidth);
            // StPageFlip pone sus clases sobre el mismo div, no lo envuelve
            var p = n.classList.contains("v-page") ? n : n.querySelector(".v-page");
            if (p && p.dataset.idx !== undefined) visibles.push(Number(p.dataset.idx) + 1);
          });

          if (visibles.length) {
            visibles.sort(function (a, b) { return a - b; });
            counter.textContent =
              (visibles.length > 1 ? visibles[0] + "-" + visibles[visibles.length - 1] : visibles[0]) +
              " / " + imagenes.length;
          }

          if (l === Infinity) {                      // todavía no hay nada que medir
            shift.style.transition = "";
            if (reintento !== false) setTimeout(function () { recentrar(false); }, 80);
            return;
          }
          var dx = Math.round(el.clientWidth / 2 - (l + r) / 2);
          shift.style.transition = "";
          shift.style.transform = "translateX(" + dx + "px)";
        });
      });
    }

    function sincronizar(i) {
      range.max = ultima; range.value = i;
      counter.textContent = (i + 1) + " / " + imagenes.length;
      prevBtn.disabled = i <= 0;
      nextBtn.disabled = i >= ultima;
      recentrar();
    }

    // ---------- 3. montar ----------
    function construir(desde) {
      // flip.destroy() saca del documento el propio contenedor (hace block.remove()),
      // asi que al rearmar hay que reponerlo: si no, las hojas se crean sobre un nodo
      // suelto y el libro desaparece de la pantalla. De paso arranca sin las clases ni
      // los estilos que StPageFlip dejo puestos.
      var previo = document.getElementById("v-book");
      if (previo && previo.parentNode) previo.parentNode.removeChild(previo);
      el = document.createElement("div");
      el.id = "v-book";
      shift.appendChild(el);

      var d = medidas();
      pageW = d.w;
      // StPageFlip decide horizontal/vertical por el ancho del contenedor, y dentro
      // de un grid centrado ese ancho es cero: hay que fijarlo a mano.
      var ancho = d.w * d.hojas + 2;
      shift.style.width = ancho + "px";
      el.style.width = ancho + "px";

      // Recorrido por indice y no forEach: las paginas que todavia no se
      // dibujaron son huecos del array, y forEach los saltea — el libro
      // quedaria con solo las hojas ya listas.
      for (var idx = 0; idx < imagenes.length; idx++) {
        var src = imagenes[idx];
        var pg = document.createElement("div");
        pg.className = "v-page" + (src ? "" : " v-pendiente");
        pg.dataset.idx = idx;
        if (idx === 0 || idx === ultima) pg.setAttribute("data-density", "hard");
        var im = document.createElement("img");
        im.src = src || PLACEHOLDER;
        im.alt = "Página " + (idx + 1);
        pg.appendChild(im);
        el.appendChild(pg);
      }

      flip = new St.PageFlip(el, {
        width: d.w, height: d.h,
        size: "fixed",
        showCover: true,
        usePortrait: true,
        // Sin arrastre ni click sobre la hoja: la pagina se pasa solo con las
        // flechas o el teclado. useMouseEvents en false hace que StPageFlip no
        // registre sus handlers de mouse y tacto; flipNext() y flipPrev() siguen
        // andando igual, con la misma animacion de hoja.
        useMouseEvents: false,
        showPageCorners: false,
        maxShadowOpacity: 0.45,
        flippingTime: 700,
        drawShadow: true
      });
      flip.loadFromHTML(el.querySelectorAll(".v-page"));
      flip.on("flip", function (e) { sincronizar(e.data); alPasarHoja(); });
      flip.on("changeState", function (e) {
        // al arrancar el giro ya se ocupa el pliego entero: sacamos el corrimiento
        if (e.data === "flipping") { sonido.sonar(); shift.style.transform = "translateX(0px)"; }
      });
      if (desde) flip.turnToPage(desde);
      montado = true;
      sincronizar(flip.getCurrentPageIndex());
    }

    // Rehace el libro con las medidas nuevas, conservando la hoja actual.
    function rehacer() {
      if (!flip) return;
      var at = flip.getCurrentPageIndex();
      flip.destroy();
      construir(at);
    }

    $("v-girar").addEventListener("click", function () {
      var girado = document.body.classList.toggle("v-girado");
      this.setAttribute("aria-pressed", String(girado));
      // Girar no dispara resize porque la ventana no cambia de tamaño: hay que
      // rehacer a mano, y despues del repintado para medir el marco ya girado.
      requestAnimationFrame(function () { requestAnimationFrame(rehacer); });
    });

    // ---------- lectura en voz alta ----------
    // pdf/caperucita.pdf -> textos/caperucita.txt y audio/caperucita/
    var slug = cfg.pdf.replace(/^.*\//, "").replace(/\.pdf$/i, "");
    var lector = new Lector({ textos: cfg.textos || "textos/" + slug + ".txt", audio: cfg.audio || "audio/" + slug + "/" });
    var leerBtn = $("v-leer"), leyendo = false, esperaHoja = null;
    lector.listo.then(function (hay) { leerBtn.hidden = !hay; });

    // Páginas del PDF (desde 1) que se ven ahora: una sola o el pliego de dos
    function paginasVisibles() {
      var v = [];
      Array.prototype.forEach.call(el.querySelectorAll(".stf__item"), function (n) {
        if (getComputedStyle(n).display === "none" || n.offsetWidth < 1) return;
        var p = n.classList.contains("v-page") ? n : n.querySelector(".v-page");
        if (p && p.dataset.idx !== undefined) v.push(Number(p.dataset.idx) + 1);
      });
      return v.sort(function (a, b) { return a - b; });
    }
    function ponerLeyendo(si) {
      leyendo = si;
      leerBtn.setAttribute("aria-pressed", String(si));
      leerBtn.setAttribute("aria-label", si ? "Pausar la lectura" : "Leer el cuento solo");
      leerBtn.title = si ? "Pausar" : "Leer solo";
      leerBtn.innerHTML = svg(si ? ICONOS.pausa : ICONOS.leer);
      if (!si) { clearTimeout(esperaHoja); lector.callar(); }
    }
    // Lee lo que está a la vista y, al terminar, pasa la hoja (alPasarHoja sigue)
    function seguirLeyendo() {
      if (!leyendo || !flip) return;
      var pags = paginasVisibles();
      lector.leer(pags).then(function (completo) {
        if (!completo || !leyendo) return;
        if (!pags.length || pags[pags.length - 1] >= imagenes.length) { ponerLeyendo(false); return; }
        flip.flipNext();
      });
    }
    // Cualquier cambio de hoja (sola o a mano) lee la página nueva, cuando termina de girar
    function alPasarHoja() {
      if (!leyendo) return;
      lector.callar();
      clearTimeout(esperaHoja);
      esperaHoja = setTimeout(seguirLeyendo, 500);
    }
    leerBtn.addEventListener("click", function () {
      lector.preparar();
      ponerLeyendo(!leyendo);
      if (leyendo) seguirLeyendo();
    });

    prevBtn.addEventListener("click", function () { if (flip) flip.flipPrev(); });
    nextBtn.addEventListener("click", function () { if (flip) flip.flipNext(); });
    range.addEventListener("input", function () {
      if (!flip) return;
      flip.turnToPage(Number(this.value));
      sincronizar(Number(this.value));
    });
    document.addEventListener("keydown", function (e) {
      if (!flip) return;
      if (e.key === "ArrowLeft") flip.flipPrev();
      if (e.key === "ArrowRight") flip.flipNext();
    });

    var tid = null;
    global.addEventListener("resize", function () {
      clearTimeout(tid);
      tid = setTimeout(rehacer, 200);
    });

    // ---------- arranque ----------
    // StPageFlip necesita que todas las hojas midan igual, pero hay libros que
    // mezclan tapa suelta con pliegos ya armados. Nos quedamos con la proporción
    // que más se repite; las páginas distintas entran con bandas blancas (contain)
    // en vez de deformarse.
    function proporcionDominante(pdf) {
      var cuenta = {}, cadena = Promise.resolve();
      for (var i = 1; i <= pdf.numPages; i++) {
        cadena = cadena.then(pdf.getPage.bind(pdf, i)).then(function (page) {
          var v = page.getViewport({ scale: 1 });
          var k = (v.width / v.height).toFixed(3);
          cuenta[k] = (cuenta[k] || 0) + 1;
        });
      }
      return cadena.then(function () {
        var mejor = null;
        Object.keys(cuenta).forEach(function (k) {
          if (!mejor || cuenta[k] > cuenta[mejor]) mejor = k;
        });
        return Number(mejor);
      });
    }

    pdfjsLib.getDocument(cfg.pdf).promise.then(function (pdf) {
      imagenes = new Array(pdf.numPages);
      ultima = pdf.numPages - 1;

      // Se dibujan unas pocas páginas, se muestra el libro y el resto se completa
      // de fondo: así un cuento de 21 páginas no hace esperar de entrada.
      var primeras = Math.min(PRIMERAS, pdf.numPages);

      return proporcionDominante(pdf).then(function (r) {
        ratio = r;
        doble = ratio < 1;                   // apaisado = el pliego ya viene armado

        var cadena = Promise.resolve();
        for (var i = 1; i <= primeras; i++) {
          cadena = cadena.then(dibujar.bind(null, pdf, i)).then(function () {
            fillEl.style.width = Math.round((this.n / primeras) * 100) + "%";
            statusEl.textContent = "Cargando página " + this.n + " de " + pdf.numPages + "…";
          }.bind({ n: i }));
        }
        return cadena;
      }).then(function () {
        construir(0);
        loader.classList.add("oculto");
        setTimeout(function () { loader.style.display = "none"; }, 600);

        var resto = Promise.resolve();
        for (var j = primeras + 1; j <= pdf.numPages; j++) resto = resto.then(dibujar.bind(null, pdf, j));
        return resto;
      });
    }).catch(function (e) { fallar(String((e && e.message) || e)); });
  }

  global.Visor = { iniciar: iniciar };
})(window);
