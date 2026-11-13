/* Service worker de la versión nacional (alcance: /nacional/).
   Igual que el de delegaciones: archivos con internet primero, mapa guardado, avisos (../notif.js). */
self.NOTIF_CACHE = "nac-meta";
self.NOTIF_ICON = "../icons/icon-192.png";
importScripts("../notif.js");

var SHELL = "nac-shell-v1";
var TILES = "conv-tiles-v2"; // el mapa se comparte con el portal de delegaciones
var FILES = ["./", "index.html", "nacional.css", "app.js", "data.js", "manifest.webmanifest",
  "../styles.css", "../fonts.css", "../notif.js", "../vendor/leaflet/leaflet.js", "../vendor/leaflet/leaflet.css",
  "../icons/icon-192.png", "../fonts/oswald-300_600.woff2", "../fonts/poppins-400.woff2", "../fonts/poppins-500.woff2", "../fonts/poppins-600.woff2", "../fonts/poppins-700.woff2",
  "img/iglesias/maldonado.jpg", "img/iglesias/melo.jpg", "img/iglesias/acegua.jpg", "img/iglesias/treinta-y-tres.jpg", "img/iglesias/tacuarembo.jpg",
  "img/iglesias/artigas.jpg", "img/iglesias/salto.jpg", "img/iglesias/curva.jpg", "img/iglesias/el-cerro.jpg", "img/iglesias/la-paz.jpg",
  "../img/logo.png", "../img/artigas.jpg", "../img/culto4.jpg", "../img/culto2.jpg", "../img/salon.jpg", "../img/teatro.jpg", "../img/familia.jpg", "../img/aplauso.jpg"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(SHELL).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return /^nac-shell/.test(k) && k !== SHELL; }).map(function (k) { return caches.delete(k); }));
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
        return fetch(req).then(function (res) { if (res.ok) c.put(req.url, res.clone()); return res; });
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
self.addEventListener("periodicsync", function (e) { if (e.tag === "conv-avisos") e.waitUntil(notifyDue()); });
self.addEventListener("push", function (e) {
  var d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Convención Nacional Uruguay 2026", { body: d.body || "", icon: "../icons/icon-192.png", data: { tab: d.tab || "inicio" } }));
});
self.addEventListener("message", function (e) { if (e.data === "avisos") e.waitUntil(notifyDue()); });
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var tab = (e.notification.data || {}).tab || "inicio";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      if ("focus" in list[i] && list[i].url.indexOf("/nacional/") >= 0) { list[i].postMessage({ ir: tab }); return list[i].focus(); }
    }
    return self.clients.openWindow("./#ir=" + tab);
  }));
});
