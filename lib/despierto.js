/* Mantiene la pantalla prendida mientras la página está abierta (para que no se
   apague en medio de un cuento). Usa la Screen Wake Lock API: Chrome, Brave,
   Edge, Android y iPhone/iPad desde iOS 16.4. Si el navegador no la tiene, no
   pasa nada.

   Se pide al cargar y otra vez con el primer toque (algunos navegadores solo la
   dan después de que la persona toca algo), y se vuelve a pedir al volver a la
   pestaña: el navegador la suelta sola cuando la página queda oculta. */
(function () {
  "use strict";
  if (!("wakeLock" in navigator)) return;
  var traba = null, pidiendo = false;
  function pedir() {
    if (traba || pidiendo || document.visibilityState !== "visible") return;
    pidiendo = true;
    navigator.wakeLock.request("screen").then(function (t) {
      traba = t;
      t.addEventListener("release", function () { traba = null; });
    }).catch(function () { /* sin permiso todavía: se reintenta con el próximo toque */ })
      .then(function () { pidiendo = false; });
  }
  ["pointerdown", "touchend", "keydown"].forEach(function (ev) {
    document.addEventListener(ev, pedir, { passive: true, capture: true });
  });
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") pedir(); });
  pedir();
})();
