/* Service worker: hace que la web funcione sin internet y muestra los avisos.
   - Archivos de la app: primero intenta internet (para recibir cambios), si no hay usa la copia guardada.
   - Mapa: usa la copia guardada si existe; si no, la descarga y la guarda.
   - Avisos: ver notif.js. */
importScripts("preparacion.js", "notif.js");

var SHELL = "conv-shell-v7";
var TILES = "conv-tiles-v2"; // v2: se descarta lo guardado antes (incluía imágenes de "Access blocked")
var META = "conv-meta";      // persona, idioma y avisos ya mostrados
var FILES = ["./", "index.html", "styles.css", "fonts.css", "app.js", "data.js", "musica.js", "preparacion.js", "notif.js", "manifest.webmanifest", "vendor/leaflet/leaflet.js", "vendor/leaflet/leaflet.css",
    "icons/icon-192.png", "icons/icon-512.png", "fonts/oswald-300_600.woff2", "fonts/poppins-400.woff2", "fonts/poppins-500.woff2", "fonts/poppins-600.woff2", "fonts/poppins-700.woff2",
    "img/aeropuerto.jpg", "img/aplauso.jpg", "img/artigas.jpg", "img/buquebus.jpg", "img/cerro.jpg", "img/culto1.jpg", "img/culto2.jpg", "img/culto4.jpg", "img/curva-grupo.jpg", "img/curva.jpg", "img/familia.jpg", "img/hotel.jpg", "img/jovenes.jpg", "img/logo.png", "img/montevideo.jpg", "img/musica.jpg", "img/ofrenda.jpg", "img/oracion2.jpg", "img/predica.jpg", "img/salon.jpg", "img/teatro.jpg", "img/lugares/18julio.jpg", "img/lugares/atlantida.jpg", "img/lugares/casapueblo.jpg", "img/lugares/centenario.jpg", "img/lugares/cerro.jpg", "img/lugares/ciudadvieja.jpg", "img/lugares/colonia.jpg", "img/lugares/legislativo.jpg", "img/lugares/matriz.jpg", "img/lugares/mercado.jpg", "img/lugares/mirador.jpg", "img/lugares/piriapolis.jpg", "img/lugares/pocitos.jpg", "img/lugares/punta.jpg", "img/lugares/rambla.jpg", "img/lugares/rodo.jpg", "img/lugares/solis.jpg", "img/lugares/mam.jpg", "img/lugares/s_puntacarretas.jpg", "img/lugares/trescruces.jpg"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(SHELL).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    // solo borra versiones viejas de este portal (no toca las de /nacional/)
    return Promise.all(keys.filter(function (k) { return /^conv-(shell|tiles)/.test(k) && k !== SHELL && k !== TILES; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);

  if (url.hostname === "server.arcgisonline.com" || url.hostname === "tile.openstreetmap.org") {
    e.respondWith(caches.open(TILES).then(function (c) {
      return c.match(req.url).then(function (hit) {
        if (hit) return hit;
        return fetch(req).then(function (res) {
          // guardar solo respuestas buenas, nunca páginas de error o bloqueo
          if (res.ok) c.put(req.url, res.clone());
          return res;
        });
      });
    }));
    return;
  }

  if (url.origin === location.origin) {
    e.respondWith(fetch(req).then(function (res) {
      if (res.ok) { var copy = res.clone(); caches.open(SHELL).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) {
        return hit || (req.mode === "navigate" ? caches.match("index.html") : undefined);
      });
    }));
  }
});

/* ---------------- Avisos ---------------- */
// Lee los datos más nuevos (internet o copia guardada) sin depender de la página abierta
function loadData() {
  return fetch("data.js", { cache: "no-store" }).then(function (r) { if (!r.ok) throw 0; return r; })
    .catch(function () { return caches.match("data.js", { ignoreSearch: true }); })
    .then(function (r) { return r.text(); })
    .then(function (txt) { var w = {}; (new Function("window", txt))(w); return w.DATA; });
}
function notifyDue() {
  return loadData().then(function (D) { return self.CONV_NOTIF.check(D, Date.now()); }).then(function (n) {
    if (n) return self.registration.showNotification(n.title, self.CONV_NOTIF.options(n));
  }).catch(function () {});
}
// Android con el portal instalado: el teléfono despierta al portal de vez en cuando
self.addEventListener("periodicsync", function (e) { if (e.tag === "conv-avisos") e.waitUntil(notifyDue()); });
// Preparado para avisos enviados desde un servidor (si más adelante se agrega uno)
self.addEventListener("push", function (e) {
  var d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Convención Nacional Uruguay 2026", { body: d.body || "", icon: "icons/icon-192.png", data: { tab: d.tab || "inicio" } }));
});
self.addEventListener("message", function (e) { if (e.data === "avisos") e.waitUntil(notifyDue()); });
// Tocar el aviso abre el portal en la sección que corresponde
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var tab = (e.notification.data || {}).tab || "inicio";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      if ("focus" in list[i]) { list[i].postMessage({ ir: tab }); return list[i].focus(); }
    }
    return self.clients.openWindow("./#ir=" + tab);
  }));
});
