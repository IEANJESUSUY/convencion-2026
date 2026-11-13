/* Avisos del portal (notificaciones en el celular).
   Lo usan la página (app.js) y el service worker (sw.js), así los dos calculan lo mismo.
   No hay servidor: cada celular calcula sus avisos a partir del programa de data.js.
   - Faltan N días para la convención (30, 14, 7, 3, 2 y 1 día antes, a las 9:00)
   - Cada día con actividades, a las 7:30: lo que hacemos hoy
   - 20 minutos antes de cada culto y de cada salida de las vans
   - Al terminar cada culto: «Esperamos que el culto haya sido de gran bendición…» y lo que sigue
   - Al terminar la convención: gracias, y la invitación a mandar fotos y testimonios */
(function (g) {
  "use strict";
  var M = 6e4, H = 36e5;
  function timed(h) { return /^\d{1,2}:\d{2}$/.test(h || ""); }
  function dobj(f, h) { var hm = timed(h) ? h : "00:00"; if (hm.length === 4) hm = "0" + hm; return new Date(f + "T" + hm + ":00"); }
  function byId(l, id) { for (var i = 0; i < (l || []).length; i++) if (l[i].id === id) return l[i]; return null; }
  var TITLES = /^(pr\.|pra\.|hno\.|hna\.|ir\.|obispo|bispo|misionero|misionera|dra\.|dr\.)\s+/i;
  function first(n) { var s = String(n || "").trim(); while (TITLES.test(s)) s = s.replace(TITLES, ""); return s.split(/\s+/)[0]; }
  function hm(d) { return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); }

  function plan(D, pid, lang) {
    var p = byId(D.personas, pid) || byId(D.iglesias, pid); if (!p) return [];
    var pt = lang === "pt", out = [], name = p.saludo || first(p.nombre), los = !!p.saludo;
    function L(es, x) { return pt ? x : es; }
    function placeName(id) { var x = byId(D.lugares, id) || byId(D.alojamientos, id); return x ? x.nombre : ""; }
    function add(k, at, win, title, body, tab) { out.push({ k: k, at: at.getTime(), win: win, title: title, body: body, tab: tab || "inicio" }); }

    var items = (D.programa || []).filter(function (it) { return timed(it.hora); }).slice();
    if (p.llegada && p.llegada.fecha && timed(p.llegada.hora)) items.push({ fecha: p.llegada.fecha, hora: p.llegada.hora, tipo: "llegada", titulo: L("Tu llegada", "Sua chegada") + (p.llegada.numero ? " · " + p.llegada.numero : "") });
    items.sort(function (a, b) { return dobj(a.fecha, a.hora) - dobj(b.fecha, b.hora); });
    function start(it) { return dobj(it.fecha, it.hora); }
    function end(it) {
      if (it.fin) return dobj(it.fecha, it.fin);
      var s = start(it), e = new Date(s.getTime() + (it.tipo === "culto" ? 2 * H : it.tipo === "traslado" ? 30 * M : H));
      items.forEach(function (x) { var xs = start(x); if (xs > s && xs < e) e = xs; });
      return e;
    }
    function what(it) { var pl = it.destino ? placeName(it.destino) : it.lugar ? placeName(it.lugar) : ""; return it.hora + " " + it.titulo + (pl && it.tipo !== "culto" ? " (" + pl + ")" : ""); }

    // Cuenta regresiva
    var cultos = items.filter(function (x) { return x.tipo === "culto"; });
    var first0 = cultos[0] || items[0];
    if (first0) {
      var st = start(first0);
      [30, 14, 7, 3, 2, 1].forEach(function (n) {
        var d = new Date(st); d.setDate(d.getDate() - n); d.setHours(9, 0, 0, 0);
        if (n === 1) add("cd1", d, 14 * H, L("¡Mañana empieza la convención!", "Amanhã começa a convenção!"),
          L("Mañana a las " + first0.hora + " nos encontramos en el Teatro Cervantes. Tocá para ver el programa.", "Amanhã às " + first0.hora + " nos encontramos no Teatro Cervantes. Toque para ver a programação."), "programa");
        else add("cd" + n, d, 14 * H, L("Faltan " + n + " días para la convención", "Faltam " + n + " dias para a convenção"),
          L(name + (los ? ", los" : ", te") + " estamos esperando con mucha alegría. «" + D.evento.lema + "»", name + ", estamos esperando você com muita alegria. «" + D.evento.lema + "»"), "inicio");
      });
    }

    // Un día antes: pedir fotos de los preparativos (versión nacional)
    if (D.evento.fotosAntes && first0) {
      var fa = new Date(start(first0)); fa.setDate(fa.getDate() - 1); fa.setHours(18, 0, 0, 0);
      add("fotos", fa, 6 * H, "Mandanos tus fotos", "¿Cómo van los preparativos? Mandanos una foto de tu iglesia preparándose para la convención. Tocá acá.", "inicio");
    }

    // Lo que hacemos hoy
    var days = {};
    items.forEach(function (it) { (days[it.fecha] = days[it.fecha] || []).push(it); });
    Object.keys(days).forEach(function (f) {
      var list = days[f], at = dobj(f, "07:30");
      var body = list.slice(0, 3).map(what).join(" · ") + (list.length > 3 ? " · …" : "");
      add("day" + f, at, 5 * H, L("Hoy en la convención", "Hoje na convenção"), body, "programa");
    });

    // Antes y después de cada actividad
    var lastCulto = cultos[cultos.length - 1];
    items.forEach(function (it, i) {
      var s = start(it), k = it.fecha + it.hora;
      if (it.tipo === "culto") {
        add("pre" + k, new Date(s.getTime() - 20 * M), 25 * M, L("En 20 minutos empieza el culto", "Em 20 minutos começa o culto"),
          it.titulo + (it.equipo ? " · " + it.equipo : "") + " · Teatro Cervantes", "programa");
        if (it === lastCulto) return;
        var e = end(it), nx = items.filter(function (x) { return start(x) >= e && start(x) - e < 5 * H && x.fecha === it.fecha; });
        // si lo siguiente empieza justo al terminar (p. ej. salen las vans), avisar 10 minutos antes
        var cut = nx.length && start(nx[0]).getTime() === e.getTime();
        var body = L("Esperamos que el culto haya sido de gran bendición. ", "Esperamos que o culto tenha sido de grande bênção. ") +
          (nx.length ? L("Te recordamos lo que sigue: ", "Lembramos o que vem a seguir: ") + nx.slice(0, 2).map(what).join(" · ") + L(". Tocá para ver el programa.", ". Toque para ver a programação.")
            : L("Por hoy no hay más actividades. Que descanses y Dios te bendiga.", "Por hoje não há mais atividades. Descanse e Deus te abençoe."));
        add("post" + k, new Date(e.getTime() + (cut ? -10 : 5) * M), 2 * H, L("¡Qué bendición!", "Que bênção!"), body, "programa");
      } else if (it.tipo === "traslado") {
        add("pre" + k, new Date(s.getTime() - 20 * M), 25 * M, L("Las vans salen a las " + it.hora, "As vans saem às " + it.hora),
          it.titulo + (it.lugar === "hotel" ? L(". Punto de encuentro: puerta del hotel, calle Soriano 868.", ". Ponto de encontro: porta do hotel, rua Soriano 868.") : "."), "programa");
      }
    });

    // Al terminar la convención
    if (lastCulto) {
      add("fin", new Date(end(lastCulto).getTime() + 30 * M), 72 * H, L("¡Gracias por acompañarnos!", "Obrigado por estar conosco!"),
        L("Esperamos que la convención haya sido de gran bendición. ¿Nos compartís tus fotos y testimonios? Tocá acá.", "Esperamos que a convenção tenha sido de grande bênção. Você compartilha suas fotos e testemunhos? Toque aqui."), "inicio");
    }
    return out;
  }

  /* Lo que el celular recuerda para los avisos (persona, idioma y avisos ya mostrados).
     Se guarda en el almacenamiento del portal para que el service worker también lo lea. */
  var META = g.NOTIF_CACHE || "conv-meta", KEY = "avisos.json";
  function getMeta() {
    if (typeof caches === "undefined") return Promise.resolve({});
    return caches.open(META).then(function (c) { return c.match(KEY); }).then(function (r) { return r ? r.json() : {}; }).catch(function () { return {}; });
  }
  function setMeta(m) {
    if (typeof caches === "undefined") return Promise.resolve();
    return caches.open(META).then(function (c) { return c.put(KEY, new Response(JSON.stringify(m), { headers: { "Content-Type": "application/json" } })); }).catch(function () {});
  }
  // Devuelve el aviso que toca mostrar ahora (el más reciente) y marca como vistos los que ya pasaron.
  function check(D, now) {
    return getMeta().then(function (m) {
      if (!m.person) return null;
      var sent = m.sent || [];
      var due = plan(D, m.person, m.lang).filter(function (n) { return n.at <= now && now - n.at < n.win && sent.indexOf(n.k) < 0; });
      if (!due.length) return null;
      m.sent = sent.concat(due.map(function (n) { return n.k; })).slice(-300);
      var pick = due.reduce(function (a, b) { return b.at > a.at ? b : a; });
      return setMeta(m).then(function () { return pick; });
    });
  }
  function options(n) { return { body: n.body, icon: g.NOTIF_ICON || "icons/icon-192.png", tag: n.k, data: { tab: n.tab || "inicio" } }; }

  g.CONV_NOTIF = { plan: plan, check: check, getMeta: getMeta, setMeta: setMeta, options: options };
})(typeof self !== "undefined" ? self : window);
