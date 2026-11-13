/* =====================================================================
   PLANILLA EN LÍNEA (Google Sheets) → portal
   ---------------------------------------------------------------------
   Si en data.js hay   hoja: { id: "ID-DE-LA-PLANILLA" }   el portal lee las
   pestañas de esa planilla y reemplaza los datos de ejemplo. Cada vez que se
   abre con internet, toma lo último; sin internet usa lo último que bajó.
   La planilla tiene que estar compartida como «Cualquier persona con el enlace: Lector».
   Lo usan las dos versiones (delegaciones y nacional). Lo que no está en la planilla
   (fotos, mapa, lugares) sigue saliendo de data.js.
   ===================================================================== */
(function () {
  "use strict";
  var D = window.DATA; if (!D) return;
  var H = D.hoja || {};
  var KEY = (D.nacional ? "nac_" : "conv_") + "hoja";
  var TABS = D.nacional ? ["Evento", "Avisos", "Programa", "Iglesias", "Letras"]
    : ["Evento", "Avisos", "Programa", "Contactos", "Personas", "Alojamientos", "Letras"];
  var BASE = JSON.parse(JSON.stringify(D)); // datos de data.js, sin tocar
  var MUS0 = window.MUSICA ? JSON.parse(JSON.stringify(window.MUSICA)) : null;

  /* ---------- lectura de CSV ---------- */
  function parseCSV(t) {
    var out = [], row = [], cell = "", q = false;
    for (var i = 0; i < t.length; i++) {
      var ch = t[i];
      if (q) { if (ch === '"') { if (t[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
      else if (ch === '"') q = true;
      else if (ch === ",") { row.push(cell); cell = ""; }
      else if (ch === "\n" || ch === "\r") { if (ch === "\r" && t[i + 1] === "\n") i++; row.push(cell); out.push(row); row = []; cell = ""; }
      else cell += ch;
    }
    if (cell || row.length) { row.push(cell); out.push(row); }
    return out;
  }
  function key(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""); }
  function rows(t) {
    var a = parseCSV(t); if (!a.length) return [];
    var h = a[0].map(key);
    return a.slice(1).filter(function (r) { return r.some(function (c) { return String(c).trim(); }); }).map(function (r) {
      var o = {}; h.forEach(function (k, i) { if (k) o[k] = String(r[i] == null ? "" : r[i]).trim(); }); return o;
    });
  }

  /* ---------- normalizar valores ---------- */
  function fecha(s) {
    s = String(s || "").trim(); var m;
    if ((m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s))) return m[1] + "-" + ("0" + m[2]).slice(-2) + "-" + ("0" + m[3]).slice(-2);
    if ((m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(s))) return m[3] + "-" + ("0" + m[2]).slice(-2) + "-" + ("0" + m[1]).slice(-2); // día/mes/año
    return s;
  }
  function hora(s) { s = String(s || "").trim(); var m = /^(\d{1,2}):(\d{2})/.exec(s); return m ? ("0" + m[1]).slice(-2) + ":" + m[2] : s; }
  function num(s) { var n = parseFloat(String(s || "").replace(",", ".")); return isNaN(n) ? null : n; }
  function si(s) { return /^(si|sí|s|x|1|true|yes)$/i.test(String(s || "").trim()); }
  function lista(s) { return String(s || "").split(/[;,\n]+/).map(function (x) { return x.trim(); }).filter(Boolean); }
  function hoyISO() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function byId(l, id) { for (var i = 0; i < (l || []).length; i++) if (l[i].id === id) return l[i]; return null; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------- pasar la planilla a los datos del portal ---------- */
  function apply(sets) {
    // cada vez se parte de data.js, así aplicar dos veces da lo mismo
    ["evento", "avisos", "programa", "contactos", "personas", "alojamientos", "iglesias", "nacionalContacto", "demo"].forEach(function (k) { if (k in BASE) D[k] = clone(BASE[k]); });
    if (MUS0) window.MUSICA = clone(MUS0);

    var ev = sets.Evento;
    if (ev && ev.length) {
      var e = {}; ev.forEach(function (r) { if (r.campo) e[key(r.campo)] = r.valor; });
      var E = D.evento;
      if (e.nombre) E.nombre = e.nombre;
      if (e.lema) E.lema = e.lema;
      if (e.versiculo) E.versiculo = e.versiculo;
      if (e.inicio) E.inicio = fecha(e.inicio);
      if (e.fin) E.fin = fecha(e.fin);
      if (D.nacional) { if (e.bienvenida_nacional) E.bienvenida = e.bienvenida_nacional; }
      else if (e.bienvenida && typeof E.bienvenida === "object") E.bienvenida.es = e.bienvenida;
      if (e.bienvenida_pt && typeof E.bienvenida === "object") E.bienvenida.pt = e.bienvenida_pt;
      if (e.firma_nombre && E.firma) E.firma.nombre = e.firma_nombre;
      if (e.firma_cargo && E.firma) E.firma.cargo = e.firma_cargo;
      if (e.comunicaciones_whatsapp && E.comunicaciones) E.comunicaciones.whatsapp = e.comunicaciones_whatsapp;
      if (e.consejeria_whatsapp && E.consejeria) E.consejeria.whatsapp = e.consejeria_whatsapp;
      if (D.nacionalContacto) {
        if (e.nacional_nombre) D.nacionalContacto.nombre = e.nacional_nombre;
        if (e.nacional_whatsapp) D.nacionalContacto.whatsapp = e.nacional_whatsapp;
      }
      if (e.modo_prueba !== undefined && e.modo_prueba !== "") D.demo = si(e.modo_prueba);
    }

    if (sets.Avisos) {
      var hoy = hoyISO();
      D.avisos = sets.Avisos.filter(function (r) {
        var app = (r.app || "ambas").toLowerCase();
        if (app.indexOf("amb") < 0 && app.indexOf(D.nacional ? "nac" : "del") < 0) return false;
        return r.texto && (!r.desde || fecha(r.desde) <= hoy) && (!r.hasta || fecha(r.hasta) >= hoy);
      }).map(function (r) { return { texto: r.texto }; });
    }

    if (sets.Programa && sets.Programa.length) {
      var pr = sets.Programa.filter(function (r) {
        var app = (r.app || "ambas").toLowerCase();
        return r.titulo && (app.indexOf("amb") >= 0 || app.indexOf(D.nacional ? "nac" : "del") >= 0);
      }).map(function (r) {
        var it = { fecha: fecha(r.fecha), hora: hora(r.hora), tipo: (r.tipo || "general").toLowerCase(), titulo: r.titulo, lugar: r.lugar || (r.tipo === "culto" ? "teatro" : "") };
        if (r.fin) it.fin = hora(r.fin);
        if (r.equipo) it.equipo = r.equipo;
        if (r.nota) it.nota = r.nota;
        if (r.destino) it.destino = r.destino;
        if (si(r.destacado)) it.destacado = true;
        return it;
      });
      if (pr.length) D.programa = pr;
    }

    if (!D.nacional && sets.Contactos && sets.Contactos.length) {
      D.contactos = sets.Contactos.filter(function (r) { return r.id && r.nombre; }).map(function (r) {
        var c = { id: r.id, area: r.area || "", nombre: r.nombre, whatsapp: r.whatsapp || "", horario: r.horario || "", paises: lista(r.paises) };
        if (r.detalle) c.detalle = r.detalle;
        return c;
      });
    }

    if (!D.nacional && sets.Alojamientos && sets.Alojamientos.length) {
      D.alojamientos = sets.Alojamientos.filter(function (r) { return r.id && r.nombre; }).map(function (r) {
        var a = clone(byId(BASE.alojamientos, r.id) || {});
        a.id = r.id; a.nombre = r.nombre;
        ["tipo", "direccion", "checkin", "checkout", "desayuno", "nota"].forEach(function (k) { if (r[k]) a[k] = r[k]; });
        if (num(r.lat) !== null) a.lat = num(r.lat);
        if (num(r.lng) !== null) a.lng = num(r.lng);
        return a;
      }).filter(function (a) { return a.lat != null && a.lng != null; });
    }

    if (!D.nacional && sets.Personas && sets.Personas.length) {
      var ps = sets.Personas.filter(function (r) { return r.id && r.nombre && r.pais; }).map(function (r) {
        var p = { id: r.id, pais: r.pais.toLowerCase(), nombre: r.nombre, rango: r.rango || "", whatsapp: r.whatsapp || "", alojamiento: r.alojamiento || "hotel",
          habitacion: r.habitacion || "—", comparte: r.comparte || "", transporte: r.transporte || "", chofer: r.chofer || "", obs: r.obs || r.observaciones || "", pin: String(r.pin || "").replace(/\D/g, "") };
        if (r.llegada_fecha) p.llegada = { medio: (r.llegada_medio || "avion").toLowerCase(), fecha: fecha(r.llegada_fecha), hora: hora(r.llegada_hora), numero: r.llegada_numero || "", punto: r.llegada_punto || "" };
        return p;
      });
      if (ps.length) D.personas = ps;
    }

    if (D.nacional && sets.Iglesias && sets.Iglesias.length) {
      var ig = sets.Iglesias.filter(function (r) { return r.id && r.nombre; }).map(function (r) {
        var c = clone(byId(BASE.iglesias, r.id) || {});
        c.id = r.id; c.nombre = r.nombre; c.saludo = c.saludo || ("Hermanos de " + r.nombre);
        if (r.departamento || r.depto) c.depto = r.departamento || r.depto;
        if (r.pastor) c.pastor = r.pastor;
        if (r.pastor_whatsapp) c.pastorTel = r.pastor_whatsapp;
        if (r.encargado) c.encargado = r.encargado;
        if (r.encargado_whatsapp) c.encargadoTel = r.encargado_whatsapp;
        if (r.direccion) c.direccion = r.direccion;
        if (num(r.lat) !== null) c.lat = num(r.lat);
        if (num(r.lng) !== null) c.lng = num(r.lng);
        if (r.exacta) c.exacta = si(r.exacta);
        if (r.horarios) c.horarios = lista(r.horarios.replace(/,/g, "⁣")).map(function (x) { return x.replace(/⁣/g, ","); });
        if (r.facebook) c.facebook = r.facebook;
        if (r.web) c.web = r.web;
        if (!c.foto) c.foto = "../img/logo.png";
        return c;
      }).filter(function (c) { return c.lat != null && c.lng != null; });
      if (ig.length) D.iglesias = ig;
    }

    // Letras: se pegan en la canción con el mismo título
    if (sets.Letras && window.MUSICA) {
      var all = [];
      window.MUSICA.cultos.forEach(function (c) { all = all.concat(c.coros); });
      window.MUSICA.avivamiento.forEach(function (g) { all = all.concat(g.coros); });
      all = all.concat(window.MUSICA.adoracion);
      sets.Letras.forEach(function (r) {
        if (!r.titulo || !r.letra) return;
        var k = key(r.titulo), hit = all.filter(function (s) { return key(s.titulo) === k; });
        if (hit.length) hit.forEach(function (s) { s.letra = r.letra; });
        else { var g = window.MUSICA.avivamiento[window.MUSICA.avivamiento.length - 1]; g.coros.push({ titulo: r.titulo, letra: r.letra }); all.push(g.coros[g.coros.length - 1]); }
      });
    }
  }

  /* ---------- guardado en el celular ---------- */
  function load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }

  var cached = H.id ? load() : null;
  if (cached && cached.id === H.id && cached.sets) { try { apply(cached.sets); } catch (e) {} }

  function fetchTab(name) {
    var url = "https://docs.google.com/spreadsheets/d/" + encodeURIComponent(H.id) + "/gviz/tq?tqx=out:csv&headers=1&sheet=" + encodeURIComponent(name);
    var ctrl = window.AbortController ? new AbortController() : null, t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 9000);
    return fetch(url, { cache: "no-store", signal: ctrl ? ctrl.signal : undefined }).then(function (r) { clearTimeout(t); return r.ok ? r.text() : null; })
      .then(function (txt) { if (!txt || /^\s*</.test(txt)) return null; return rows(txt); }).catch(function () { clearTimeout(t); return null; });
  }
  var last = 0;
  // Baja la planilla; si cambió algo, aplica y avisa a la app para redibujar
  window.HOJA_REFRESH = function (onChange) {
    if (!H.id || !navigator.onLine || Date.now() - last < 60000) return;
    last = Date.now();
    Promise.all(TABS.map(fetchTab)).then(function (res) {
      var sets = {}, any = false;
      TABS.forEach(function (t, i) { if (res[i]) { sets[t] = res[i]; any = true; } });
      if (!any) return;
      var prev = load(), s = JSON.stringify(sets);
      save({ id: H.id, sets: sets, at: Date.now() });
      if (prev && prev.id === H.id && JSON.stringify(prev.sets) === s) return;
      apply(sets);
      if (onChange) onChange();
    });
  };
  window.HOJA_INFO = function () { var c = load(); return { activa: !!H.id, actualizado: c && c.at ? new Date(c.at) : null }; };
})();
