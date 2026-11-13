(function () {
  "use strict";
  var D = window.DATA;
  var $app = document.getElementById("app");
  var $toast = document.getElementById("toast");

  /* ---------------- Almacenamiento local (seguro) ---------------- */
  function mk(s) {
    return {
      get: function (k) { try { return JSON.parse(s.getItem("conv_" + k)); } catch (e) { return null; } },
      set: function (k, v) { try { s.setItem("conv_" + k, JSON.stringify(v)); } catch (e) {} },
      del: function (k) { try { s.removeItem("conv_" + k); } catch (e) {} }
    };
  }
  var store, session;
  try { store = mk(window.localStorage); session = mk(window.sessionStorage); } catch (e) { store = session = mk({ getItem: function () { return null; }, setItem: function () {}, removeItem: function () {} }); }

  /* ---------------- Estado ---------------- */
  var S = {
    view: "splash", country: null, personId: null, pin: "", pinError: false,
    tab: "inicio", lang: "es", mapCat: "todo", sheetOpen: false, place: null, day: null,
    online: navigator.onLine, offlineReady: !!store.get("offlineReady"), dl: null
  };
  var map = null, markers = {}, meMarker = null, installEvt = null;

  /* ---------------- Textos ES / PT ---------------- */
  var TXT = {
    es: {
      start: "Empecemos", whereFrom: "¿De dónde venís?", people1: "persona", people: "personas",
      tapName: "Tocá tu nombre para entrar.", back: "Volver",
      enterPin: "Ingresá tu PIN de 4 números", wrongPin: "Ese PIN no es, probá de nuevo", demoPin: "Versión de ejemplo: el PIN es 1234",
      del: "Borrar", bless: "Dios te bendiga,", cont: "Continuar", skip: "Saltar", next: "Siguiente", go: "Entrar",
      online: "En línea", offline: "Sin internet",
      tInicio: "Inicio", tMapa: "Mapa", tPrograma: "Programa", tContactos: "Contactos", tPerfil: "Perfil",
      hello: "Hola", days: "días", hours: "h", mins: "min", missing: "Faltan para la convención",
      today: "La convención es hoy", thanks: "¡Gracias por acompañarnos!",
      myStay: "Tu estadía", room: "habitación", shares: "Compartís con", checkin: "Check-in", checkout: "Check-out", breakfast: "Desayuno",
      sameHotel: "<b>La convención es en tu mismo hotel:</b> el Teatro Cervantes, con entrada por calle Soriano.",
      seeMap: "Ver en mapa", directions: "Cómo llegar",
      arrival: "Tu llegada", receives: "Te recibe", driver: "Tu chofer", upNext: "Lo próximo", useful: "Útil",
      ourConv: "Nuestra convención", toVisit: "Para conocer", toVisitSub: "Cerca de tu alojamiento, ordenado por distancia.",
      trips: "Excursiones", tripsSub: "Para un día libre, a una o dos horas de Montevideo.", highlights: "Destacados", credits: "Créditos de fotos",
      creditsSub: "Fotos de la convención: IEANJESÚS Uruguay. Fotos de lugares: Wikimedia Commons, con licencia libre.", mapBy: "Mapa: Esri · © OpenStreetMap",
      cultoPhotoNote: "Foto de la convención anterior",
      wifi: "WiFi", wifiSub: "Redes y claves", sos: "Emergencias 911", sosSub: "Policía, bomberos, ambulancia",
      offBtn: "Guardar para usar sin internet", offSub: "El portal y las fotos; el mapa guarda lo que ya miraste", offDoing: "Guardando…", offDone: "Listo para usar sin internet", offRedo: "Actualizar lo guardado",
      install: "Instalar como app", installSub: "Abrila desde tu pantalla de inicio",
      iosTitle: "Agregar a inicio", iosSteps: "En Safari, tocá Compartir (el cuadrado con la flecha) y elegí «Agregar a pantalla de inicio».",
      places: "lugares", all: "Todo", mapSub: "Desde tu alojamiento", inHotel: "En tu hotel",
      distance: "Distancia", time: "Tiempo", walk: "a pie", car: "en auto", locErr: "No pudimos ver tu ubicación. Revisá el permiso.",
      now: "Ahora", yourArrival: "Tu llegada", mine: "Para vos", noItems: "No hay actividades este día.",
      emergency: "Emergencias", emergDesc: "Policía, bomberos y ambulancia en todo Uruguay.",
      yourTeam: "Tu equipo", yourDeleg: "Tu delegación", callsNote: "Sin internet, las llamadas funcionan igual con señal de teléfono.",
      profile: "Mi perfil", myData: "Mis datos", lodging: "Alojamiento", phone: "WhatsApp", notes: "Observaciones",
      settings: "Ajustes", language: "Idioma", seeWelcome: "Ver la bienvenida", seeTut: "Ver el recorrido", switchUser: "Cambiar de persona",
      demoNote: "Versión de ejemplo: nombres y teléfonos de prueba.",
      demoWa: "Número de ejemplo: en la versión final abre WhatsApp", demoCall: "Número de ejemplo: en la versión final llama",
      waMsg: "Hola {c}, soy {n} de la delegación de {p}. ",
      wifiTitle: "Redes WiFi", network: "Red", password: "Clave", close: "Cerrar",
      tipo_culto: "Culto", tipo_comida: "Comida", tipo_traslado: "Traslado", tipo_general: "Actividad", tipo_libre: "Tiempo libre", tipo_llegada: "Tu llegada",
      in: "en",
      tut: [
        ["img/hotel.jpg", "Tu estadía", "En Inicio ves dónde dormís, tu habitación, con quién compartís y quién te busca cuando llegás."],
        ["img/teatro.jpg", "El programa", "Los cinco cultos del sábado y el domingo en el Teatro Cervantes, con las comidas y los traslados."],
        ["img/montevideo.jpg", "El mapa", "El hotel, lugares para conocer, shoppings y hospitales, con el tiempo para llegar. «Cómo llegar» abre Google Maps."],
        ["img/familia.jpg", "Siempre acompañado", "Escribí por WhatsApp o llamá a tus responsables de traslado, hospedaje o alimentación con un toque."],
        ["img/culto1.jpg", "Sin internet también", "Tocá «Guardar para usar sin internet» y agregá el portal a tu pantalla de inicio. Las zonas del mapa que ya miraste también quedan guardadas."]
      ]
    },
    pt: {
      start: "Vamos começar", whereFrom: "De onde você vem?", people1: "pessoa", people: "pessoas",
      tapName: "Toque no seu nome para entrar.", back: "Voltar",
      enterPin: "Digite seu PIN de 4 números", wrongPin: "PIN incorreto, tente de novo", demoPin: "Versão de exemplo: o PIN é 1234",
      del: "Apagar", bless: "Deus te abençoe,", cont: "Continuar", skip: "Pular", next: "Próximo", go: "Entrar",
      online: "Online", offline: "Sem internet",
      tInicio: "Início", tMapa: "Mapa", tPrograma: "Programa", tContactos: "Contatos", tPerfil: "Perfil",
      hello: "Olá", days: "dias", hours: "h", mins: "min", missing: "Faltam para a convenção",
      today: "A convenção é hoje", thanks: "Obrigado por estar conosco!",
      myStay: "Sua estadia", room: "quarto", shares: "Divide com", checkin: "Check-in", checkout: "Check-out", breakfast: "Café da manhã",
      sameHotel: "<b>A convenção é no seu próprio hotel:</b> o Teatro Cervantes, com entrada pela rua Soriano.",
      seeMap: "Ver no mapa", directions: "Como chegar",
      arrival: "Sua chegada", receives: "Quem te recebe", driver: "Seu motorista", upNext: "O próximo", useful: "Útil",
      ourConv: "Nossa convenção", toVisit: "Para conhecer", toVisitSub: "Perto da sua hospedagem, por distância.",
      trips: "Passeios", tripsSub: "Para um dia livre, a uma ou duas horas de Montevidéu.", highlights: "Destaques", credits: "Créditos das fotos",
      creditsSub: "Fotos da convenção: IEANJESÚS Uruguai. Fotos dos lugares: Wikimedia Commons, com licença livre.", mapBy: "Mapa: Esri · © OpenStreetMap",
      cultoPhotoNote: "Foto da convenção anterior",
      wifi: "WiFi", wifiSub: "Redes e senhas", sos: "Emergências 911", sosSub: "Polícia, bombeiros, ambulância",
      offBtn: "Salvar para usar sem internet", offSub: "O portal e as fotos; o mapa guarda o que você já viu", offDoing: "Salvando…", offDone: "Pronto para usar sem internet", offRedo: "Atualizar o que foi salvo",
      install: "Instalar como app", installSub: "Abra pela tela inicial",
      iosTitle: "Adicionar à tela inicial", iosSteps: "No Safari, toque em Compartilhar (o quadrado com a seta) e escolha «Adicionar à Tela de Início».",
      places: "lugares", all: "Tudo", mapSub: "Desde sua hospedagem", inHotel: "No seu hotel",
      distance: "Distância", time: "Tempo", walk: "a pé", car: "de carro", locErr: "Não conseguimos ver sua localização. Verifique a permissão.",
      now: "Agora", yourArrival: "Sua chegada", mine: "Para você", noItems: "Não há atividades neste dia.",
      emergency: "Emergências", emergDesc: "Polícia, bombeiros e ambulância em todo o Uruguai.",
      yourTeam: "Sua equipe", yourDeleg: "Sua delegação", callsNote: "Sem internet, as ligações funcionam normalmente com sinal de celular.",
      profile: "Meu perfil", myData: "Meus dados", lodging: "Hospedagem", phone: "WhatsApp", notes: "Observações",
      settings: "Ajustes", language: "Idioma", seeWelcome: "Ver as boas-vindas", seeTut: "Ver o tour", switchUser: "Trocar de pessoa",
      demoNote: "Versão de exemplo: nomes e telefones de teste.",
      demoWa: "Número de exemplo: na versão final abre o WhatsApp", demoCall: "Número de exemplo: na versão final liga",
      waMsg: "Olá {c}, sou {n} da delegação do {p}. ",
      wifiTitle: "Redes WiFi", network: "Rede", password: "Senha", close: "Fechar",
      tipo_culto: "Culto", tipo_comida: "Refeição", tipo_traslado: "Traslado", tipo_general: "Atividade", tipo_libre: "Tempo livre", tipo_llegada: "Sua chegada",
      in: "em",
      tut: [
        ["img/hotel.jpg", "Sua estadia", "No Início você vê onde vai dormir, seu quarto, com quem divide e quem te busca na chegada."],
        ["img/teatro.jpg", "A programação", "Os cinco cultos de sábado e domingo no Teatro Cervantes, com as refeições e os traslados."],
        ["img/montevideo.jpg", "O mapa", "O hotel, lugares para conhecer, shoppings e hospitais, com o tempo para chegar. «Como chegar» abre o Google Maps."],
        ["img/familia.jpg", "Sempre acompanhado", "Escreva pelo WhatsApp ou ligue para os responsáveis de traslado, hospedagem ou alimentação com um toque."],
        ["img/culto1.jpg", "Sem internet também", "Toque em «Salvar para usar sem internet» e adicione o portal à tela inicial. As áreas do mapa que você já viu também ficam salvas."]
      ]
    }
  };
  function T(k) { return (TXT[S.lang] && TXT[S.lang][k] != null) ? TXT[S.lang][k] : TXT.es[k]; }

  /* ---------------- Íconos (un solo juego, trazo) ---------------- */
  function ic(d, sw) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.8) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>"; }
  var I = {
    home: ic('<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'),
    map: ic('<path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5z"/><path d="M9 4v13M15 6.5v13"/>'),
    cal: ic('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
    chat: ic('<path d="M20.5 11.5a8 8 0 0 1-11.7 7.1L3.5 20l1.4-4.9A8 8 0 1 1 20.5 11.5z"/>'),
    user: ic('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
    // logo oficial de WhatsApp (Simple Icons, CC0)
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
    phone: ic('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>', 2),
    star: ic('<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill="currentColor" stroke-width="1"/>', 1),
    pin: ic('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    nav: ic('<path d="M3 11 21 3l-8 18-2-8z"/>'),
    x: ic('<path d="M6 6l12 12M18 6 6 18"/>', 2.2),
    back: ic('<path d="M15 5l-7 7 7 7"/>', 2),
    arrow: ic('<path d="M5 12h14M13 6l6 6-6 6"/>', 2),
    chev: ic('<path d="M9 5l7 7-7 7"/>', 2),
    locate: ic('<circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="8"/>'),
    bed: ic('<path d="M3 19V6M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="11.5" r="1.8"/>'),
    wifi: ic('<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.8 16a4.8 4.8 0 0 1 6.4 0"/><circle cx="12" cy="19.3" r=".9" fill="currentColor"/>'),
    alert: ic('<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>'),
    save: ic('<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v3h16v-3"/>'),
    device: ic('<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
    globe: ic('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
    heart: ic('<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.5 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20z"/>'),
    book: ic('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>'),
    out: ic('<path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"/>'),
    // mapa
    church: ic('<path d="M12 2v5M10 4h4M5 21V12l7-5 7 5v9M10 21v-4a2 2 0 0 1 4 0v4"/>', 2),
    plane: ic('<path d="M10.5 13.5 4 16l-1-1.5 6-4.5V5a1.5 1.5 0 0 1 3 0v5l6 4.5-1 1.5-6.5-2.5V18l2 1.5V21l-3.5-1-3.5 1v-1.5l2-1.5z" fill="currentColor" stroke-width="1"/>', 1),
    camera: ic('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>', 2),
    sun: ic('<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>', 2),
    bag: ic('<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>', 2),
    fork: ic('<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 2-2.5 5-2.5 8H17v10"/>', 2),
    health: ic('<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" fill="currentColor" stroke-width="1"/>', 1),
    bell: ic('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>'),
    shield: ic('<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>'),
    share: ic('<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M6 11H5v10h14V11h-1"/>'),
    plusSq: ic('<rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M12 8.5v7M8.5 12h7"/>'),
    dots: ic('<circle cx="6" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="18" cy="12" r="1.2" fill="currentColor"/>')
  };

  var CATS = {
    convencion: { c: "#8E2A1F", i: "star", es: "Convención", pt: "Convenção" },
    iglesia: { c: "#7A2E4A", i: "church", es: "Iglesias y comidas", pt: "Igrejas e refeições" },
    hospedaje: { c: "#1F0F0C", i: "bed", es: "Alojamiento", pt: "Hospedagem" },
    llegada: { c: "#3D5A80", i: "plane", es: "Llegadas", pt: "Chegadas" },
    turismo: { c: "#2F6B55", i: "camera", es: "Para conocer", pt: "Para conhecer" },
    excursion: { c: "#2B7A8C", i: "sun", es: "Excursiones", pt: "Passeios" },
    shopping: { c: "#A0661F", i: "bag", es: "Shoppings", pt: "Shoppings" },
    comida: { c: "#D9782F", i: "fork", es: "Comida", pt: "Comida" },
    salud: { c: "#C62828", i: "health", es: "Salud", pt: "Saúde" }
  };
  var MEDIO = { avion: { lugar: "aeropuerto" }, barco: { lugar: "puerto" }, bus: { lugar: "trescruces" } };

  /* ---------------- Banderas ---------------- */
  function starPts(cx, cy, R, r) {
    var p = [];
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r : R; p.push((cx + d * Math.cos(a)).toFixed(2) + "," + (cy + d * Math.sin(a)).toFixed(2)); }
    return p.join(" ");
  }
  function flag(id) {
    var s = '<svg viewBox="0 0 30 20" preserveAspectRatio="none" aria-hidden="true">';
    if (id === "br") s += '<rect width="30" height="20" fill="#009C3B"/><polygon points="15,2.2 27.6,10 15,17.8 2.4,10" fill="#FFDF00"/><circle cx="15" cy="10" r="4.4" fill="#002776"/><path d="M10.8 9.1Q15 7.7 19.2 10.8" stroke="#fff" stroke-width=".9" fill="none"/>';
    else if (id === "ar") s += '<rect width="30" height="20" fill="#74ACDF"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><circle cx="15" cy="10" r="1.9" fill="#F6B40E" stroke="#85340A" stroke-width=".25"/>';
    else if (id === "cl") s += '<rect width="30" height="20" fill="#fff"/><rect y="10" width="30" height="10" fill="#D52B1E"/><rect width="10" height="10" fill="#0039A6"/><polygon points="' + starPts(5, 5, 2.7, 1.05) + '" fill="#fff"/>';
    else if (id === "ec") s += '<rect width="30" height="20" fill="#FFD100"/><rect y="10" width="30" height="5" fill="#034EA2"/><rect y="15" width="30" height="5" fill="#EF3340"/><ellipse cx="15" cy="10" rx="2.3" ry="2.9" fill="#6CACE4" stroke="#7A5A1E" stroke-width=".5"/>';
    else if (id === "co") s += '<rect width="30" height="20" fill="#FCD116"/><rect y="10" width="30" height="5" fill="#003893"/><rect y="15" width="30" height="5" fill="#CE1126"/>';
    else if (id === "us") {
      s += '<rect width="30" height="20" fill="#fff"/>';
      for (var k = 0; k < 7; k++) s += '<rect y="' + (k * 20 / 6.5).toFixed(2) + '" width="30" height="' + (20 / 13).toFixed(2) + '" fill="#B22234"/>';
      s += '<rect width="12" height="10.77" fill="#3C3B6E"/>';
      for (var r = 0; r < 4; r++) for (var c = 0; c < 5; c++) s += '<circle cx="' + (1.4 + c * 2.3).toFixed(1) + '" cy="' + (1.5 + r * 2.6).toFixed(1) + '" r=".45" fill="#fff"/>';
    }
    else s += '<rect width="30" height="20" fill="#ccc"/>';
    return s + "</svg>";
  }

  /* ---------------- Utilidades ---------------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function country(id) { return byId(D.paises, id); }
  function person() { return byId(D.personas, S.personId); }
  function contact(id) { return byId(D.contactos, id); }
  function aloj(id) { return byId(D.alojamientos, id); }
  function place(id) {
    var p = byId(D.lugares, id);
    if (p) return p;
    var a = aloj(id);
    if (a) return { id: a.id, cat: "hospedaje", nombre: a.nombre, desc: a.nota || a.direccion, lat: a.lat, lng: a.lng, foto: a.foto };
    return null;
  }
  var TITLES = /^(pr\.|pra\.|hno\.|hna\.|ir\.|obispo|bispo|misionero|misionera|dra\.|dr\.)\s+/i;
  function cleanName(n) { var s = String(n).trim(); while (TITLES.test(s)) s = s.replace(TITLES, ""); return s; }
  function firstName(n) { return cleanName(n).split(/\s+/)[0]; }
  function initials(n) { var w = cleanName(n).split(/\s+/); return ((w[0] || "")[0] + ((w[1] || "")[0] || "")).toUpperCase(); }
  var AV = ["#8E2A1F", "#B4511A", "#2F6B55", "#3D5A80", "#6B4423", "#7A2E4A", "#2B7A8C", "#A0661F"];
  function avColor(id) { var h = 0; for (var i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return AV[h % AV.length]; }
  function avatar(id, name) { return '<div class="avatar" style="background:' + avColor(id) + '">' + esc(initials(name)) + "</div>"; }
  function locale() { return S.lang === "pt" ? "pt-BR" : "es-UY"; }
  function timed(h) { return /^\d{1,2}:\d{2}$/.test(h || ""); }
  function dateObj(f, h) { var hm = timed(h) ? h : "00:00"; if (hm.length === 4) hm = "0" + hm; return new Date(f + "T" + hm + ":00"); }
  function fmt(f, o) { return dateObj(f).toLocaleDateString(locale(), o).replace(/\./g, ""); }
  // Reloj de la app. En la versión de ejemplo se puede simular una hora para probar la convención.
  function NOW() { return S.fakeNow ? new Date(S.fakeNow) : new Date(); }
  function isoDay(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function hhmm(d) { return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); }
  function digits(p) { return String(p).replace(/[^\d]/g, ""); }
  function haversine(a, b) {
    var R = 6371, t = Math.PI / 180, dLat = (b.lat - a.lat) * t, dLng = (b.lng - a.lng) * t;
    var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * t) * Math.cos(b.lat * t) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(x)));
  }
  function myBase() { var p = person(); return p ? aloj(p.alojamiento) : D.alojamientos[0]; }
  function inMyBase(pl) { var b = myBase(); return pl.id === b.id || (pl.enHotel && b.id === "hotel"); }
  function distText(km) { return km < 1 ? Math.round(km * 100) * 10 + " m" : km.toFixed(km < 10 ? 1 : 0).replace(".", ",") + " km"; }
  function timeText(pl) {
    var base = myBase();
    if (inMyBase(pl)) return T("inHotel");
    var tr = function (s) { return S.lang === "pt" ? s.replace("a pie", "a pé").replace("en auto", "de carro") : s; };
    if (pl.t && base.id === "hotel") return tr(pl.t);
    var km = haversine(base, pl) * 1.3;
    if (km <= 1.8) return Math.max(1, Math.round(km / 4.8 * 60)) + " min " + T("walk");
    var m = Math.round((Math.min(km, 10) / 28 + Math.max(0, km - 10) / 85) * 60) + 3;
    return (m >= 60 ? Math.floor(m / 60) + " h" + (m % 60 ? " " + (m % 60) + " min" : "") : m + " min") + " " + T("car");
  }
  function dirUrl(pl) { return "https://www.google.com/maps/dir/?api=1&destination=" + pl.lat + "," + pl.lng; }
  function toast(msg) {
    $toast.textContent = msg; $toast.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { $toast.classList.remove("show"); }, 2800);
  }
  function rise(i) { return ' class="rise" style="--i:' + i + '"'; }

  /* ================= Pantallas de entrada ================= */
  function vSplash() {
    var e = D.evento;
    return '<div class="screen dark splash">' +
      '<div class="photo-bg slides">' +
      '<img src="img/artigas.jpg" alt="Monumento a Artigas en la Plaza Independencia, Montevideo">' +
      '<img src="img/montevideo.jpg" alt="Plaza Independencia y Palacio Salvo, Montevideo">' +
      '<img src="img/culto4.jpg" alt="Culto de la convención anterior">' +
      '<img src="img/culto2.jpg" alt="Alabanza en la convención anterior">' +
      "</div>" +
      '<div class="splash-top fade"><img class="logo" src="' + esc(e.logo) + '" alt="' + esc(e.iglesia) + '"></div>' +
      '<div class="splash-body">' +
      "<h1" + rise(1) + ">Bienvenidos<br>al Uruguay</h1>" +
      '<p class="pt rise" style="--i:2">Bem-vindos ao Uruguai</p>' +
      '<p class="lead rise" style="--i:3">' + esc(e.portada.es) + "</p>" +
      '<div class="splash-meta rise" style="--i:4"><div><b>5 y 6 dic</b><span>2026</span></div><div><b>Teatro Cervantes</b><span>Montevideo</span></div></div>' +
      '<div class="btn-row rise" style="--i:5"><button class="btn btn-primary press" data-a="splashGo">' + T("start") + I.arrow + "</button></div>" +
      "</div></div>";
  }

  function vFlags() {
    var h = '<div class="screen dark"><div class="intro">' +
      '<div class="flags-head"><img class="kenburns" src="img/culto4.jpg" alt=""><div><h1 class="h-xl rise" style="--i:0">¿De dónde venís?<span class="soft">De onde você vem?</span></h1></div></div>' +
      '<div class="flags">';
    D.paises.forEach(function (c, i) {
      var n = D.personas.filter(function (p) { return p.pais === c.id; }).length;
      var word = c.lang === "pt" ? (n === 1 ? "pessoa" : "pessoas") : (n === 1 ? "persona" : "personas");
      h += '<button class="flag-btn pop" style="--i:' + (i + 2) + '" data-a="flag" data-v="' + c.id + '"><div class="flag">' + flag(c.id) + "</div><b>" + esc(c.nombre) + "</b><small>" + n + " " + word + "</small></button>";
    });
    return h + "</div></div></div>";
  }

  function vNames() {
    var c = country(S.country), list = D.personas.filter(function (p) { return p.pais === S.country; });
    var h = '<div class="screen dark"><div class="intro">' +
      '<button class="back press" data-a="go" data-v="flags">' + I.back + T("back") + "</button>" +
      '<div class="who rise" style="--i:0"><div class="flag">' + flag(c.id) + "</div><h1>" + esc(c.nombre) + "</h1></div>" +
      '<p class="sub rise" style="--i:1">' + T("tapName") + '</p><div class="profiles">';
    list.forEach(function (p, i) {
      h += '<button class="profile-btn pop" style="--i:' + (i + 2) + '" data-a="person" data-v="' + p.id + '">' + avatar(p.id, p.nombre) + "<b>" + esc(p.nombre) + "</b><small>" + esc(p.rango) + "</small></button>";
    });
    return h + "</div></div></div>";
  }

  function vPin() {
    var p = person(), dots = "", keys = "";
    for (var i = 0; i < 4; i++) dots += '<i class="' + (i < S.pin.length ? "on" : "") + '"></i>';
    "123456789".split("").forEach(function (k) { keys += '<button class="key" data-a="key" data-v="' + k + '">' + k + "</button>"; });
    keys += '<span></span><button class="key" data-a="key" data-v="0">0</button><button class="key word" data-a="keydel">' + T("del") + "</button>";
    return '<div class="screen dark"><div class="intro">' +
      '<button class="back press" data-a="go" data-v="names">' + I.back + T("back") + "</button>" +
      '<div class="pin">' + avatar(p.id, p.nombre) + '<div class="pin-name">' + esc(p.nombre) + '</div><div class="pin-hint">' + T("enterPin") + "</div>" +
      '<div class="dots' + (S.pinError ? " shake" : "") + '">' + dots + '</div><div class="pin-error" role="alert">' + (S.pinError ? T("wrongPin") : "") + "</div>" +
      '<div class="keypad">' + keys + "</div>" + (D.demo ? '<div class="demo">' + T("demoPin") + "</div>" : "") + "</div></div></div>";
  }

  function vWelcome() {
    var p = person(), e = D.evento;
    return '<div class="screen dark">' +
      '<div class="welcome-photo"><img class="kenburns" src="img/culto2.jpg" alt="Hermanos adorando en una convención anterior"></div>' +
      '<div class="welcome-body">' +
      '<div class="bless rise" style="--i:1">' + T("bless") + "</div>" +
      "<h1" + rise(2) + ">" + esc(firstName(p.nombre)) + "</h1>" +
      '<p class="msg rise" style="--i:3">' + esc(e.bienvenida[S.lang] || e.bienvenida.es) + "</p>" +
      '<div class="lema rise" style="--i:4"><b>«' + esc(e.lema) + "»</b><span>" + esc(e.versiculo) + "</span></div>" +
      '<div class="sign rise" style="--i:5"><b>' + esc(e.firma.nombre) + "</b>" + esc(e.firma.cargo) + "</div>" +
      '<div class="btn-row rise" style="--i:6"><button class="btn btn-primary press" data-a="welcomeNext">' + T("cont") + I.arrow + "</button></div>" +
      "</div></div>";
  }

  /* Invitación a instalar el portal (y a activar los avisos) */
  function vInstall() {
    var sa = isStandalone(), name = firstName(person().nombre), h;
    var perks = [
      [I.bell, LT("Avisos para que no te pierdas nada", "Avisos para você não perder nada"), LT("Lo que hacemos hoy, cuántos días faltan y lo que sigue después de cada culto: las vans, la comida y el lugar.", "O que fazemos hoje, quantos dias faltam e o que vem depois de cada culto: as vans, a refeição e o lugar.")],
      [I.save, LT("Funciona sin internet", "Funciona sem internet"), LT("Tu habitación, el programa y los contactos, siempre a mano.", "Seu quarto, a programação e os contatos, sempre à mão.")],
      [I.device, LT("Se abre como una app", "Abre como um app"), LT("Con un toque desde tu pantalla de inicio, sin buscar el enlace.", "Com um toque na tela inicial, sem procurar o link.")]
    ];
    if (sa) perks = perks.slice(0, 1);
    h = '<div class="screen dark"><div class="welcome-photo inst-photo"><img class="kenburns" src="img/familia.jpg" alt=""></div><div class="welcome-body inst">' +
      '<div class="bless rise" style="--i:1">' + esc(name) + "</div>" +
      "<h1" + rise(2) + ">" + (sa ? LT("¡Ya lo tenés instalado!", "Já está instalado!") : LT("Este portal fue diseñado para vos", "Este portal foi feito para você")) + "</h1>" +
      '<p class="msg rise" style="--i:3">' + (sa ? LT("Activá los avisos y te vamos a ir contando lo que sigue en cada momento de la convención.", "Ative os avisos e vamos contando o que vem a seguir em cada momento da convenção.")
        : LT("Instalarlo en tu celular nos ayuda muchísimo a acompañarte durante toda la convención.", "Instalar no seu celular nos ajuda muito a acompanhar você durante toda a convenção.")) + "</p>" +
      '<ul class="perks">' + perks.map(function (x, i) { return '<li class="rise" style="--i:' + (4 + i) + '">' + x[0] + "<div><b>" + x[1] + "</b><span>" + x[2] + "</span></div></li>"; }).join("") + "</ul>" +
      '<div class="safe rise" style="--i:7">' + I.shield + "<p>" + LT("<b>Es totalmente seguro.</b> No te pide datos, no ve tus fotos ni tus contactos y casi no ocupa lugar. Cuando termine la convención lo podés desinstalar como cualquier app.", "<b>É totalmente seguro.</b> Não pede dados, não vê suas fotos nem seus contatos e quase não ocupa espaço. Quando a convenção terminar, você pode desinstalar como qualquer app.") + "</p></div>" +
      '<div class="btn-row rise" style="--i:8"><button class="btn btn-primary press" data-a="instGo">' + (sa ? I.bell + LT("Activar avisos", "Ativar avisos") : I.save + LT("Instalar en mi celular", "Instalar no meu celular")) + "</button>" +
      '<button class="btn btn-ghost press" data-a="instSkip">' + LT("Ahora no", "Agora não") + "</button></div>" +
      "</div></div>";
    return h;
  }
  function iosGuide() {
    var steps = [
      [I.share, LT("Tocá <b>Compartir</b>", "Toque em <b>Compartilhar</b>"), LT("El cuadrado con la flecha, abajo en Safari. Si no lo ves, tocá primero los tres puntos.", "O quadrado com a seta, embaixo no Safari. Se não aparecer, toque antes nos três pontos.")],
      [I.dots, LT("Tocá <b>Ver más</b>", "Toque em <b>Ver Mais</b>"), LT("Deslizá hacia abajo en la lista que se abre.", "Deslize para baixo na lista que abre.")],
      [I.plusSq, LT("Elegí <b>Agregar a inicio</b>", "Escolha <b>Adicionar à Tela de Início</b>"), LT("Después tocá <b>Agregar</b>, arriba a la derecha.", "Depois toque em <b>Adicionar</b>, em cima à direita.")],
      [I.bell, LT("Abrilo desde el ícono", "Abra pelo ícone"), LT("Entrá de nuevo con tu nombre y tu PIN, y activá los avisos.", "Entre de novo com seu nome e PIN e ative os avisos.")]
    ];
    return "<h3>" + LT("Instalar en iPhone", "Instalar no iPhone") + '</h3><ol class="guide">' + steps.map(function (s, i) {
      return '<li class="rise" style="--i:' + i + '"><span class="gnum">' + (i + 1) + '</span><span class="gico">' + s[0] + "</span><div><b>" + s[1] + "</b><small>" + s[2] + "</small></div></li>";
    }).join("") + "</ol>";
  }
  function otherGuide() {
    return "<h3>" + LT("Instalar el portal", "Instalar o portal") + "</h3><p>" + LT("Abrí el menú del navegador (los tres puntos <b>⋮</b>) y elegí <b>«Instalar app»</b> o <b>«Agregar a pantalla de inicio»</b>.", "Abra o menu do navegador (os três pontos <b>⋮</b>) e escolha <b>«Instalar app»</b> ou <b>«Adicionar à tela inicial»</b>.") + "</p>";
  }

  function vTutorial() {
    var s = "", dots = "";
    T("tut").forEach(function (sl, i) {
      s += '<section class="tut-slide' + (i === 0 ? " seen" : "") + '"><div class="tut-photo"><img class="tut-bg" src="' + sl[0] + '" alt=""><img class="tut-img" src="' + sl[0] + '" alt=""></div><div class="tut-text"><h2>' + esc(sl[1]) + "</h2><p>" + esc(sl[2]) + "</p></div></section>";
      dots += '<i class="' + (i === 0 ? "on" : "") + '"></i>';
    });
    return '<div class="screen dark"><button class="tut-skip press" data-a="tutEnd">' + T("skip") + "</button>" +
      '<div class="tut-track" id="tutTrack">' + s + '</div><div class="tut-foot"><div class="tut-dots" id="tutDots">' + dots + "</div>" +
      '<button class="btn btn-primary press" id="tutBtn" data-a="tutNext">' + T("next") + I.arrow + "</button></div></div>";
  }
  function bindTutorial() {
    var tr = document.getElementById("tutTrack");
    if (!tr) return;
    tr.addEventListener("scroll", function () {
      var i = Math.round(tr.scrollLeft / tr.clientWidth), n = tr.children.length;
      var ds = document.getElementById("tutDots").children;
      for (var k = 0; k < ds.length; k++) ds[k].className = k === i ? "on" : "";
      if (tr.children[i]) tr.children[i].classList.add("seen");
      document.getElementById("tutBtn").innerHTML = (i >= n - 1 ? T("go") : T("next")) + I.arrow;
    }, { passive: true });
  }

  /* ================= App ================= */
  var TAB_ORDER = ["inicio", "mapa", "programa", "contactos", "perfil"];
  function vApp() {
    var p = person();
    var title = { inicio: T("hello") + ", " + firstName(p.nombre), mapa: T("tMapa"), programa: T("tPrograma"), contactos: T("tContactos"), perfil: T("profile") }[S.tab];
    var body = { inicio: tInicio, mapa: tMapa, programa: tPrograma, contactos: tContactos, perfil: tPerfil }[S.tab]();
    var idx = TAB_ORDER.indexOf(S.tab), prev = TAB_ORDER.indexOf(S.prevTab);
    var dir = prev < 0 || prev === idx ? "tab-in" : (idx > prev ? "tab-in-r" : "tab-in-l");
    var tabs = [["inicio", I.home, T("tInicio")], ["mapa", I.map, T("tMapa")], ["programa", I.cal, T("tPrograma")], ["contactos", I.chat, T("tContactos")], ["perfil", I.user, T("tPerfil")]];
    return '<div class="screen">' +
      '<header class="topbar"><div class="flag">' + flag(p.pais) + "</div><h1>" + esc(title) + "</h1>" +
      (S.fakeNow ? '<button class="sim-pill" data-a="sim">' + esc(simLabel()) + "</button>" : '<span class="net ' + (S.online ? "" : "off") + '" id="net"><i></i>' + (S.online ? T("online") : T("offline")) + "</span>") + "</header>" +
      '<main class="content ' + (S.tab === "mapa" ? "map-mode" : dir) + '" id="content">' + body + "</main>" +
      '<button class="chat-fab' + (S.tab === "mapa" ? " on-map" : "") + '" data-a="chat" aria-label="' + LT("Asistente: preguntá lo que quieras", "Assistente: pergunte o que quiser") + '">' + I.chat + '<span class="chat-fab-label">' + LT("¿Dudas?", "Dúvidas?") + "</span></button>" +
      '<nav class="nav" aria-label="Secciones"><span class="nav-ind" style="--x:' + idx + ";--from:" + (prev < 0 ? idx : prev) + '"></span>' + tabs.map(function (t) {
        return '<button class="' + (S.tab === t[0] ? "on" : "") + '" data-a="tab" data-v="' + t[0] + '"' + (S.tab === t[0] ? ' aria-current="page"' : "") + ">" + t[1] + t[2] + "</button>";
      }).join("") + "</nav></div>";
  }

  /* ----- Inicio ----- */
  function countdownHTML() {
    var now = NOW(), start = dateObj(D.evento.inicio, "16:00"), end = dateObj(D.evento.fin, "18:00");
    var when = '<div class="when">' + (S.lang === "pt" ? "5 e 6 de dezembro" : "5 y 6 de diciembre") + " · <em>Teatro Cervantes</em></div>";
    if (now < start) {
      var ms = start - now, d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
      return "<p>" + T("missing") + '</p><div class="count"><div><b data-k="d">' + d + "</b><span>" + T("days") + '</span></div><div><b data-k="h">' + h + "</b><span>" + T("hours") + '</span></div><div><b data-k="m">' + m + "</b><span>" + T("mins") + "</span></div></div>" + when;
    }
    if (now <= end) return '<p>' + esc(D.evento.nombre) + '</p><div class="count"><div><b style="font-size:44px">' + T("today") + "</b></div></div>" + when;
    return "<p>" + esc(D.evento.nombre) + '</p><div class="count"><div><b style="font-size:40px">' + T("thanks") + "</b></div></div>";
  }
  function personRow(c, label) {
    if (!c) return "";
    return '<div class="person">' + avatar(c.id, c.nombre) + '<div class="person-info"><small>' + esc(label) + "</small><b>" + esc(c.nombre) + "</b>" + (c.detalle ? "<span>" + esc(c.detalle) + "</span>" : "") + "</div>" +
      '<button class="ibtn wa" aria-label="WhatsApp ' + esc(c.nombre) + '" data-a="wa" data-v="' + c.id + '">' + I.wa + "</button>" +
      '<button class="ibtn call" aria-label="Llamar a ' + esc(c.nombre) + '" data-a="call" data-v="' + c.id + '">' + I.phone + "</button></div>";
  }
  function myAgenda() {
    var p = person(), items = D.programa.slice();
    if (p.llegada && p.llegada.fecha) items.push({ fecha: p.llegada.fecha, hora: p.llegada.hora, tipo: "llegada", titulo: T("yourArrival") + " · " + p.llegada.numero, lugar: (MEDIO[p.llegada.medio] || {}).lugar, mine: true });
    return items.sort(function (a, b) { return dateObj(a.fecha, a.hora) - dateObj(b.fecha, b.hora); });
  }
  function nextItem() {
    var now = NOW(), items = myAgenda().filter(function (it) { return timed(it.hora); });
    for (var i = 0; i < items.length; i++) {
      var it = items[i], endT = it.fin ? dateObj(it.fecha, it.fin) : new Date(dateObj(it.fecha, it.hora).getTime() + 2 * 36e5);
      if (endT >= now) return it;
    }
    return null;
  }
  function placeCards(list) {
    return '<div class="hscroll">' + list.map(function (pl) {
      return '<button class="pcard press" data-a="seeMap" data-v="' + pl.id + '"><span class="pimg"><img src="' + pl.foto + '" alt="' + esc(pl.nombre) + '" loading="lazy"></span>' +
        "<b>" + esc(pl.nombre) + "</b><span>" + esc(timeText(pl)) + "</span></button>";
    }).join("") + "</div>";
  }
  function tInicio() {
    var p = person(), a = aloj(p.alojamiento), h = "", k = 0;
    function blk(html) { return '<div class="rise" style="--i:' + (k++) + '">' + html + "</div>"; }
    h += '<section class="cover"><img class="kenburns" src="img/salon.jpg" alt="El salón del Teatro Cervantes preparado para la convención">' +
      '<img class="cover-logo fade" src="' + esc(D.evento.logo) + '" alt="' + esc(D.evento.iglesia) + '"><div class="cover-in" id="countdown">' + countdownHTML() + "</div></section>";
    (D.avisos || []).forEach(function (av) { h += '<div class="notice">' + esc(av.texto) + "</div>"; });
    h += '<div class="pad">';
    if (eventOver()) h += blk(thanksHTML());
    var ahora = ahoraHTML();
    if (ahora) h += blk(ahora);

    h += blk('<h2 class="h">' + T("myStay") + "</h2>" +
      '<div class="panel"><div class="stay">' + (a.foto ? '<img src="' + a.foto + '" alt="' + esc(a.nombre) + '">' : '<div class="stay-noimg">' + I.bed + "</div>") +
      "<div><h3>" + esc(a.nombre) + "</h3><p>" + esc(a.direccion) + '</p><div class="room"><b>' + esc(p.habitacion) + "</b><span>" + T("room") + "</span></div></div></div>" +
      (a.id === "hotel" ? '<div class="finding">' + T("sameHotel") + "</div>" : "") +
      '<div class="kv"><div><span>' + T("shares") + "</span><b>" + esc(p.comparte || "—") + "</b></div><div><span>" + T("checkin") + " / " + T("checkout") + "</span><b>" + esc(a.checkin) + " · " + esc(a.checkout) + "</b></div><div><span>" + T("breakfast") + "</span><b>" + esc(a.desayuno) + "</b></div></div>" +
      '<div class="actions"><button class="act press" data-a="seeMap" data-v="' + a.id + '">' + I.pin + T("seeMap") + '</button><button class="act dark press" data-a="dir" data-v="' + a.id + '">' + I.nav + T("directions") + "</button></div></div>");

    if (p.llegada) {
      var ll = (D.llegadas || {})[p.llegada.medio];
      h += blk('<h2 class="h">' + T("arrival") + "</h2>" +
        '<div class="panel">' + (ll ? '<figure class="arrive-photo"><img src="' + ll.foto + '" alt="' + esc(ll.texto) + '"><figcaption>' + esc(ll.texto) + "</figcaption></figure>" : "") +
        '<div class="arrive"><div class="big">' + esc(fmt(p.llegada.fecha, { weekday: "short", day: "numeric", month: "short" })) + " · <em>" + esc(p.llegada.hora) + "</em></div><p>" + esc(p.llegada.numero) + " · " + esc(p.llegada.punto) + "</p></div>" +
        personRow(contact(p.transporte), T("receives")) + personRow(contact(p.chofer), T("driver")) + "</div>");
    }

    var nx = ahora ? null : nextItem();
    if (nx) {
      var pl = nx.lugar ? place(nx.lugar) : null;
      h += blk('<h2 class="h">' + T("upNext") + "</h2>" +
        '<button class="panel next press" style="width:100%;text-align:left" data-a="goDay" data-v="' + nx.fecha + '"><div class="t">' + esc(nx.hora) + "<small>" + esc(fmt(nx.fecha, { weekday: "short", day: "numeric" })) + "</small></div><div><h3>" + esc(nx.titulo) + "</h3><p>" + esc(nx.equipo || (pl ? pl.nombre : "")) + "</p></div></button>");
    }
    h += "</div>";

    // Para conocer cerca del alojamiento
    var base = myBase();
    var near = D.lugares.filter(function (l) { return l.foto && l.cat === "turismo"; }).sort(function (x, y) { return haversine(base, x) - haversine(base, y); }).slice(0, 8);
    h += blk('<div class="pad"><h2 class="h">' + T("toVisit") + '</h2><p class="lede">' + T("toVisitSub") + "</p></div>" + placeCards(near));
    var far = D.lugares.filter(function (l) { return l.foto && l.cat === "excursion"; });
    h += blk('<div class="pad"><h2 class="h">' + T("trips") + '</h2><p class="lede">' + T("tripsSub") + "</p></div>" + placeCards(far));

    // Galería de la convención anterior (fotos completas, sin recortar)
    h += blk('<div class="pad"><h2 class="h">' + T("ourConv") + '</h2><p class="lede">' + esc(D.evento.anterior) + "</p></div>" +
      '<div class="hscroll gallery">' + (D.galeria || []).map(function (g) {
        return '<figure class="gimg press" data-a="photo" data-v="' + esc(g.foto) + '"><img src="' + g.foto + '" alt="' + esc(g.texto) + '" loading="lazy"><figcaption>' + esc(g.texto) + "</figcaption></figure>";
      }).join("") + "</div>");

    h += '<div class="pad">' + blk('<h2 class="h">' + T("useful") + '</h2><div class="rows">' +
      '<button class="row sos" data-a="sos">' + I.alert + '<span class="txt">' + T("sos") + "<small>" + T("sosSub") + "</small></span>" + I.chev.replace("<svg", '<svg class="chev"') + "</button>" +
      offlineRow() + installRow() + notifRow() + "</div>");
    if (D.demo) h += '<p class="foot">' + T("demoNote") + "</p>";
    return h + "</div>";
  }
  function offlineRow() {
    var dl = S.dl, sub;
    if (dl) sub = T("offDoing") + " " + Math.round(dl.done / dl.total * 100) + '%<span class="bar" style="display:block"><i style="width:' + (dl.done / dl.total * 100) + '%"></i></span>';
    else sub = S.offlineReady ? T("offDone") : T("offSub");
    return '<button class="row" id="offRow" data-a="offline">' + I.save + '<span class="txt">' + (S.offlineReady && !dl ? T("offRedo") : T("offBtn")) + "<small>" + sub + "</small></span>" + (S.offlineReady && !dl ? '<span class="end" style="color:var(--green)">✓</span>' : "") + "</button>";
  }
  function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent); }
  function isStandalone() { return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true; }
  function installRow() {
    if (isStandalone() || (!installEvt && !isIOS())) return "";
    return '<button class="row" data-a="install">' + I.device + '<span class="txt">' + T("install") + "<small>" + T("installSub") + "</small></span>" + I.chev.replace("<svg", '<svg class="chev"') + "</button>";
  }
  // Avisos: en iPhone solo funcionan con el portal instalado
  function canNotify() { return "Notification" in window && "serviceWorker" in navigator; }
  function notifRow() {
    if (!canNotify()) return "";
    var st = Notification.permission, sub;
    if (st === "granted") sub = LT("Activados · tocá para probar uno", "Ativados · toque para testar um");
    else if (st === "denied") sub = LT("Bloqueados: permitilos en los ajustes del navegador", "Bloqueados: permita nos ajustes do navegador");
    else sub = LT("Lo de hoy, los días que faltan y lo que sigue", "O de hoje, os dias que faltam e o que vem depois");
    return '<button class="row" data-a="notif">' + I.bell + '<span class="txt">' + (st === "granted" ? LT("Avisos", "Avisos") : LT("Activar avisos", "Ativar avisos")) + "<small>" + sub + "</small></span>" +
      (st === "granted" ? '<span class="end" style="color:var(--green)">✓</span>' : I.chev.replace("<svg", '<svg class="chev"')) + "</button>";
  }
  function eventOver() { return NOW() > dateObj(D.evento.fin, "18:00"); }
  function thanksHTML() {
    var com = D.evento.comunicaciones;
    return '<section class="thanks-card"><figure><img src="img/aplauso.jpg" alt="Hermanos en la convención"></figure><div class="thanks-in">' +
      "<h2>" + LT("¡Gracias por acompañarnos!", "Obrigado por estar conosco!") + "</h2>" +
      "<p>" + LT("Fue una alegría tenerte en nuestra convención. Esperamos que haya sido de gran bendición para tu vida.", "Foi uma alegria ter você na nossa convenção. Esperamos que tenha sido de grande bênção para sua vida.") + "</p>" +
      "<p>" + LT("Nos encantaría que nos compartas <b>las fotos, videos y testimonios</b> de lo que viviste: con ellos vamos a armar un recuerdo de todas las delegaciones.", "Adoraríamos que você compartilhasse <b>as fotos, vídeos e testemunhos</b> do que viveu: com eles vamos montar uma lembrança de todas as delegações.") + "</p>" +
      (com ? '<button class="btn wa-btn press" data-a="waCom">' + I.wa + LT("Enviar a Comunicaciones", "Enviar para Comunicações") + "</button><small>" + esc(com.nombre) + "</small>" : "") +
      '<p class="thanks-note">' + LT("Cuando quieras, podés desinstalar el portal como cualquier app. Dios te bendiga y buen viaje de regreso.", "Quando quiser, pode desinstalar o portal como qualquer app. Deus te abençoe e boa viagem de volta.") + "</p></div></section>";
  }

  /* ----- Mapa ----- */
  function mapPlaces() {
    var p = person(), list = D.lugares.slice(), mine = place(p.alojamiento), hotel = place("hotel");
    if (hotel.id !== mine.id) list.unshift(hotel);
    list.unshift(mine);
    return list;
  }
  function filtered() {
    var base = myBase();
    return mapPlaces().filter(function (pl) { return S.mapCat === "todo" || pl.cat === S.mapCat; })
      .map(function (pl) { return { pl: pl, km: inMyBase(pl) ? 0 : haversine(base, pl) }; })
      .sort(function (a, b) { return a.km - b.km; });
  }
  function tMapa() {
    var chips = ["todo"].concat(Object.keys(CATS)).map(function (k) {
      return '<button class="chip ' + (S.mapCat === k ? "on" : "") + '" data-a="cat" data-v="' + k + '">' + (k === "todo" ? T("all") : '<i style="background:' + CATS[k].c + '"></i>' + CATS[k][S.lang]) + "</button>";
    }).join("");
    return '<div id="map" aria-label="Mapa"></div><div class="chips">' + chips + "</div>" +
      '<div class="fabs" id="fabs"><button class="fab" aria-label="Mi ubicación" data-a="locate">' + I.locate + '</button><button class="fab" aria-label="' + T("lodging") + '" data-a="home">' + I.bed + "</button></div>" +
      '<div class="sheet" id="sheet"></div>';
  }
  function sheetHTML() {
    if (S.place) {
      var pl = place(S.place), cat = CATS[pl.cat], base = myBase(), here = inMyBase(pl);
      var fotos = pl.fotos || (pl.foto ? [pl.foto] : []);
      var pics = fotos.length > 1
        ? '<div class="detail-strip">' + fotos.map(function (f) { return '<img src="' + f + '" alt="' + esc(pl.nombre) + '">'; }).join("") + "</div>"
        : fotos.length ? '<div class="detail-img"><img src="' + fotos[0] + '" alt="' + esc(pl.nombre) + '"></div>' : "";
      return '<div class="grab" aria-hidden="true"></div><div class="sheet-body detail-in">' + pics + (pl.cred ? '<div class="cred">Foto: ' + esc(pl.cred) + " · Wikimedia Commons</div>" : "") +
        '<div class="detail-head"><div><small><i style="background:' + cat.c + '"></i>' + cat[S.lang] + "</small><h3>" + esc(pl.nombre) + "</h3></div>" +
        '<button class="close" aria-label="' + T("close") + '" data-a="closePlace">' + I.x + "</button></div>" +
        '<p class="detail-desc">' + esc(pl.desc || "") + "</p>" +
        (here ? '<div class="stats"><div><small>' + T("distance") + "</small><b>" + T("inHotel") + "</b></div></div>" :
          '<div class="stats"><div><small>' + T("distance") + "</small><b>" + distText(haversine(base, pl)) + "</b></div><div><small>" + T("time") + "</small><b>" + esc(timeText(pl)) + "</b></div></div>") +
        '<button class="btn btn-dark press" data-a="dir" data-v="' + pl.id + '">' + T("directions") + I.arrow + "</button></div>";
    }
    var rows = filtered();
    var h = '<button class="handle" id="handle" data-a="sheet" aria-expanded="' + S.sheetOpen + '"><b>' + rows.length + " " + T("places") + "</b><span>" + T("mapSub") + " · " + T("mapBy") + '</span></button><div class="sheet-body">';
    var hi = rows.filter(function (r) { return r.pl.foto && !inMyBase(r.pl); }).slice(0, 10);
    if (hi.length) {
      h += '<div class="hscroll mini">' + hi.map(function (r) {
        return '<button class="pcard small press" data-a="place" data-v="' + r.pl.id + '"><span class="pimg"><img src="' + r.pl.foto + '" alt="" loading="lazy"></span><b>' + esc(r.pl.nombre) + "</b><span>" + esc(timeText(r.pl)) + "</span></button>";
      }).join("") + "</div>";
    }
    rows.forEach(function (r) {
      var here = inMyBase(r.pl);
      h += '<button class="place" data-a="place" data-v="' + r.pl.id + '"><span class="dot" style="background:' + CATS[r.pl.cat].c + '"></span><span class="txt"><b>' + esc(r.pl.nombre) + "</b><span>" +
        esc(timeText(r.pl)) + "</span></span><em>" + (here ? "" : distText(r.km)) + "</em></button>";
    });
    return h + "</div>";
  }
  function renderSheet() {
    var sh = document.getElementById("sheet");
    if (!sh) return;
    sh.innerHTML = sheetHTML();
    sh.className = "sheet" + (S.place ? " detail" : S.sheetOpen ? " open" : "");
    Object.keys(markers).forEach(function (id) { var el = markers[id].getElement(); if (el && el.firstChild) el.firstChild.classList.toggle("sel", id === S.place); });
    requestAnimationFrame(positionFabs);
  }
  function positionFabs() {
    var sh = document.getElementById("sheet"), f = document.getElementById("fabs");
    if (!sh || !f) return;
    var visible = (S.place || S.sheetOpen) ? sh.offsetHeight : 84;
    var nav = document.querySelector(".nav");
    f.style.bottom = (visible + (nav ? nav.offsetHeight : 66) - (document.querySelector(".screen").offsetHeight - document.getElementById("content").offsetTop - document.getElementById("content").offsetHeight) + 14) + "px";
  }
  function markerIcon(pl, big, i) {
    var c = CATS[pl.cat];
    return L.divIcon({ className: "", html: '<div class="mk drop' + (big ? " big" : "") + '" style="background:' + c.c + ";--i:" + (i || 0) + '">' + I[c.i] + "</div>", iconSize: big ? [44, 44] : [32, 32], iconAnchor: big ? [22, 22] : [16, 16] });
  }
  // Mapa base: Esri (no pide clave ni bloquea según desde dónde se abra). Si falla, se usa OpenStreetMap.
  var TILES = [
    { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", attr: "Mapa © Esri, HERE, Garmin, © OpenStreetMap", max: 19 },
    { url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", attr: "© OpenStreetMap", max: 19 }
  ];
  var tileIdx = 0;
  function addTiles() {
    var t = TILES[tileIdx], errors = 0;
    var layer = L.tileLayer(t.url, { maxZoom: t.max, attribution: t.attr, crossOrigin: "anonymous" }).addTo(map);
    layer.on("tileerror", function () {
      if (++errors >= 4 && tileIdx < TILES.length - 1) { tileIdx++; map.removeLayer(layer); addTiles(); }
    });
  }
  function initMap() {
    if (typeof L === "undefined") return;
    if (map) { map.remove(); map = null; }
    var base = myBase();
    map = L.map("map", { zoomControl: false, attributionControl: false }).setView([base.lat, base.lng], 15);
    addTiles();
    markers = {};
    var list = filtered(), bounds = [], n = 0;
    list.forEach(function (r) {
      if (r.pl.enHotel && list.some(function (x) { return x.pl.id === "hotel"; })) return; // mismo punto que el hotel
      var big = r.pl.id === base.id || r.pl.id === "hotel";
      var m = L.marker([r.pl.lat, r.pl.lng], { icon: markerIcon(r.pl, big, Math.min(n++, 14)), zIndexOffset: big ? 500 : 0, title: r.pl.nombre }).addTo(map);
      m.on("click", function () { openPlace(r.pl.id); });
      markers[r.pl.id] = m;
      if (r.km < 30) bounds.push([r.pl.lat, r.pl.lng]);
    });
    if (meMarker) meMarker = L.marker(meMarker.getLatLng(), { icon: L.divIcon({ className: "", html: '<div class="me-dot"></div>', iconSize: [18, 18] }) }).addTo(map);
    renderSheet();
    var sh = document.getElementById("sheet"), cover = (S.place || S.sheetOpen) && sh ? sh.offsetHeight : 84;
    if (S.place) { var pl = place(S.place); map.setView(above([pl.lat, pl.lng], 16, cover), 16); }
    else if (S.mapCat !== "todo" && bounds.length > 1) map.fitBounds(bounds, { paddingTopLeft: [40, 70], paddingBottomRight: [40, cover + 20], maxZoom: 16 });
    else if (S.mapCat !== "todo" && list.length) { var z0 = list[0].km > 30 ? 9 : 14; map.setView(above([list[0].pl.lat, list[0].pl.lng], z0, cover), z0); }
    else map.setView(above([base.lat, base.lng], 15, cover), 15);
    setTimeout(function () { if (map) map.invalidateSize(); }, 80);
    bindSheetDrag();
  }

  /* Arrastrar la hoja de lugares con el dedo */
  function bindSheetDrag() {
    var sh = document.getElementById("sheet");
    if (!sh || sh._drag) return;
    sh._drag = true;
    // El gesto lo maneja el portal (preventDefault): así bajar la hoja nunca recarga la página
    var y0 = null, base = 0, moved = false, fromBody = false;
    sh.addEventListener("touchstart", function (e) {
      var onGrab = e.target.closest(".handle, .grab");
      var body = sh.querySelector(".sheet-body");
      fromBody = false;
      if (S.place) {
        // ficha de un lugar: se baja desde la rayita o desde arriba del todo del contenido
        if (!onGrab && !(body && body.scrollTop <= 0)) return;
        fromBody = !onGrab; base = 0;
      } else {
        if (!onGrab) return;
        base = S.sheetOpen ? 0 : sh.offsetHeight - 84;
      }
      y0 = e.touches[0].clientY; moved = false;
      sh.style.transition = "none";
    }, { passive: true });
    sh.addEventListener("touchmove", function (e) {
      if (y0 === null) return;
      var dy = e.touches[0].clientY - y0;
      if (fromBody && !moved && dy < 0) { y0 = null; sh.style.transition = ""; return; } // hacia arriba: dejar que el contenido se desplace
      if (Math.abs(dy) > 6) moved = true;
      if (e.cancelable) e.preventDefault();
      var y = S.place ? Math.max(0, dy) : Math.max(0, Math.min(sh.offsetHeight - 84, base + dy));
      sh.style.transform = "translateY(" + y + "px)";
    }, { passive: false });
    function endDrag(e) {
      if (y0 === null) return;
      var dy = (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : y0) - y0;
      sh.style.transition = ""; sh.style.transform = "";
      y0 = null;
      if (!moved) return;
      sh._swallow = true; setTimeout(function () { sh._swallow = false; }, 350);
      if (S.place) { if (dy > 70) { S.place = null; renderSheet(); } return; }
      S.sheetOpen = dy < 0 ? true : dy > 0 ? false : S.sheetOpen;
      renderSheet();
    }
    sh.addEventListener("touchend", endDrag);
    sh.addEventListener("touchcancel", endDrag);
  }
  // centro del mapa corrido para que el punto quede visible por encima de la hoja de abajo
  function above(ll, z, cover) {
    if (!map) return ll;
    var p = map.project(ll, z).add([0, (cover || 0) / 2]);
    return map.unproject(p, z);
  }
  function openPlace(id) {
    S.place = id; renderSheet();
    var pl = place(id), sh = document.getElementById("sheet");
    if (map && pl) { var z = Math.max(map.getZoom(), haversine(myBase(), pl) > 30 ? 11 : 16); map.flyTo(above([pl.lat, pl.lng], z, sh ? sh.offsetHeight : 0), z, { duration: .7 }); }
  }

  /* ----- Programa ----- */
  function tPrograma() {
    var items = myAgenda(), days = [];
    items.forEach(function (it) { if (days.indexOf(it.fecha) < 0) days.push(it.fecha); });
    if (!S.day || days.indexOf(S.day) < 0) {
      var today = isoDay(NOW());
      S.day = days.indexOf(today) >= 0 ? today : (today < D.evento.inicio ? D.evento.inicio : days[0]);
    }
    var h = '<div class="days" role="tablist">' + days.map(function (d) {
      var conv = d >= D.evento.inicio && d <= D.evento.fin;
      return '<button role="tab" aria-selected="' + (d === S.day) + '" class="day' + (d === S.day ? " on" : "") + (conv ? " conv" : "") + '" data-a="day" data-v="' + d + '"><small>' + esc(fmt(d, { weekday: "short" })) + "</small><b>" + dateObj(d).getDate() + "</b></button>";
    }).join("") + "</div>";
    var now = NOW(), list = items.filter(function (it) { return it.fecha === S.day; });
    h += '<div class="pad"><h2 class="h" style="margin-top:18px">' + esc(fmt(S.day, { weekday: "long", day: "numeric", month: "long" })) + '</h2><div class="items">';
    if (!list.length) h += '<div class="panel panel-pad">' + T("noItems") + "</div>";
    var CULTO_FOTOS = ["img/predica.jpg", "img/musica.jpg", "img/culto1.jpg", "img/jovenes.jpg", "img/aplauso.jpg"];
    var cultoN = D.programa.filter(function (x) { return x.tipo === "culto" && x.fecha < S.day; }).length;
    list.forEach(function (it, i) {
      var pl = it.lugar ? place(it.lugar) : null, t = timed(it.hora);
      if (it.tipo === "culto") {
        var foto = CULTO_FOTOS[cultoN++ % CULTO_FOTOS.length];
        h += '<figure class="culto-photo rise" style="--i:' + i + '"><img src="' + foto + '" alt="' + T("cultoPhotoNote") + '"></figure>';
      }
      var isNow = t && now >= dateObj(it.fecha, it.hora) && now <= (it.fin ? dateObj(it.fecha, it.fin) : new Date(dateObj(it.fecha, it.hora).getTime() + 2 * 36e5));
      var cls = "item" + (it.tipo === "culto" ? " culto with-photo" : "") + (it.destacado ? " star" : "") + (it.mine ? " mine" : "") + (pl && pl.cat === "iglesia" ? " at-church" : "");
      h += '<div class="' + cls + ' rise" style="--i:' + i + '"><div class="t">' + (t ? esc(it.hora) : "—") + (it.fin ? "<small>" + esc(it.fin) + "</small>" : "") + "</div><div>" +
        '<div class="k">' + (it.mine ? T("mine") : T("tipo_" + it.tipo)) + (isNow ? '<span class="now">' + T("now") + "</span>" : "") + "</div>" +
        "<h3>" + esc(it.titulo) + (t ? "" : " · " + esc(it.hora)) + "</h3>" +
        (it.equipo ? '<div class="team">' + esc(it.equipo) + "</div>" : "") + (it.nota ? '<div class="note">' + esc(it.nota) + "</div>" : "") +
        (pl ? '<button class="where" data-a="seeMap" data-v="' + pl.id + '">' + I.pin + esc(pl.nombre) + "</button>" : "") +
        (pl && pl.cat === "iglesia" && pl.foto ? '<button class="church-thumb press" data-a="seeMap" data-v="' + pl.id + '"><img src="' + pl.foto + '" alt="' + esc(pl.nombre) + '"></button>' : "") + "</div></div>";
    });
    return h + "</div></div>";
  }

  /* ----- Contactos ----- */
  function tContactos() {
    var p = person();
    var h = '<div class="pad"><div class="sos-block"><div class="n">' + esc(D.evento.emergencias) + "</div><div><b>" + T("emergency") + "</b><p>" + T("emergDesc") + '</p></div><button class="ibtn" aria-label="Llamar al 911" data-a="sos">' + I.phone + "</button></div>";
    h += '<h2 class="h">' + T("yourTeam") + '</h2><div class="panel team-list">';
    D.contactos.filter(function (c) { return !c.paises.length || c.paises.indexOf(p.pais) >= 0; }).forEach(function (c) {
      h += personRow(c, c.area + " · " + c.horario);
    });
    h += '</div><p class="foot" style="margin-top:12px">' + T("callsNote") + "</p>";
    h += '<h2 class="h">' + T("yourDeleg") + '</h2><div class="panel team-list">';
    D.personas.filter(function (x) { return x.pais === p.pais; }).forEach(function (x) {
      h += '<div class="person">' + avatar(x.id, x.nombre) + '<div class="person-info"><b>' + esc(x.nombre) + "</b><span>" + esc(x.rango) + "</span></div></div>";
    });
    return h + "</div></div>";
  }

  /* ----- Perfil ----- */
  function tPerfil() {
    var p = person(), a = aloj(p.alojamiento), c = country(p.pais);
    function row(icon, k, v) { return '<div class="row">' + icon + '<span class="txt"><small style="margin:0 0 1px">' + esc(k) + "</small>" + esc(v) + "</span></div>"; }
    var h = '<div class="me-top">' + avatar(p.id, p.nombre) + "<div><h2>" + esc(p.nombre) + '</h2><p><span class="flag">' + flag(p.pais) + "</span>" + esc(c.nombre) + " · " + esc(p.rango) + "</p></div></div>";
    h += '<div class="pad"><h2 class="h">' + T("myData") + '</h2><div class="rows">' +
      row(I.bed, T("lodging"), a.nombre + " · " + p.habitacion) + row(I.user, T("shares"), p.comparte || "—") + row(I.phone, T("phone"), p.whatsapp) +
      (p.obs ? row(I.book, T("notes"), p.obs) : "") + "</div>";
    h += '<h2 class="h">' + T("settings") + '</h2><div class="rows">' +
      '<div class="row">' + I.globe + '<span class="txt">' + T("language") + '</span><div class="seg"><button class="' + (S.lang === "es" ? "on" : "") + '" data-a="lang" data-v="es">ES</button><button class="' + (S.lang === "pt" ? "on" : "") + '" data-a="lang" data-v="pt">PT</button></div></div>' +
      '<button class="row" data-a="showWelcome">' + I.heart + '<span class="txt">' + T("seeWelcome") + "</span></button>" +
      '<button class="row" data-a="showTut">' + I.book + '<span class="txt">' + T("seeTut") + "</span></button>" +
      '<button class="row" data-a="tour">' + I.map + '<span class="txt">' + LT("Ver el paseo guiado", "Ver o tour guiado") + "<small>" + LT("El portal se recorre solo, en medio minuto", "O portal se apresenta sozinho, em meio minuto") + "</small></span></button>" +
      offlineRow() + installRow() + notifRow() +
      (D.demo ? '<button class="row" data-a="sim">' + I.cal + '<span class="txt">' + LT("Probar: simular la hora", "Testar: simular a hora") + "<small>" + LT("Para ver Inicio como durante la convención", "Para ver o Início como durante a convenção") + '</small></span><span class="end">' + esc(simLabel()) + "</span></button>" : "") +
      "</div>";
    var cred = D.lugares.filter(function (l) { return l.cred; });
    h += '<details class="credits"><summary>' + T("credits") + "</summary><p>" + T("creditsSub") + "</p><ul>" +
      cred.map(function (l) { return "<li><b>" + esc(l.nombre) + "</b> · " + esc(l.cred) + "</li>"; }).join("") + "</ul><p>" + T("mapBy") + "</p></details>";
    h += '<div class="rows" style="margin-top:22px"><button class="row sos" data-a="logout">' + I.out + '<span class="txt">' + LT("Cerrar sesión", "Sair") + "<small>" + LT("El portal vuelve a empezar desde el principio", "O portal recomeça desde o início") + "</small></span></button></div>";
    h += '<div class="brand-foot"><img src="' + esc(D.evento.logo) + '" alt="' + esc(D.evento.iglesia) + '"><p>' + esc(D.evento.nombre) + " · «" + esc(D.evento.lema) + "»" + (D.demo ? "<br>" + T("demoNote") : "") + "</p></div>";
    return h + "</div>";
  }

  /* ================= «Ahora»: lo que sigue durante la convención ================= */
  function LT(es, pt) { return S.lang === "pt" && pt ? pt : es; }
  function timedAgenda() { return myAgenda().filter(function (it) { return timed(it.hora); }); }
  // Fin de una actividad: el que tenga, o hasta que empiece la siguiente (culto ~2 h, traslado ~30 min, resto ~1 h)
  function itemEnd(it, list) {
    if (it.fin) return dateObj(it.fecha, it.fin);
    var st = dateObj(it.fecha, it.hora), dur = it.tipo === "culto" ? 2 * 36e5 : it.tipo === "traslado" ? 30 * 6e4 : 36e5;
    var end = new Date(st.getTime() + dur);
    list.forEach(function (x) { var s = dateObj(x.fecha, x.hora); if (s > st && s < end) end = s; });
    return end;
  }
  function agendaState() {
    var now = NOW(), list = timedAgenda(), cur = null, prevCulto = null, next = [];
    list.forEach(function (it) {
      var s = dateObj(it.fecha, it.hora), e = itemEnd(it, list);
      if (s <= now && now < e) cur = it;
      else if (e <= now && it.tipo === "culto" && now - e < 90 * 6e4) prevCulto = it;
      else if (s > now) next.push(it);
    });
    return { now: now, cur: cur, prevCulto: prevCulto, next: next, list: list };
  }
  function inEventWindow(now) {
    var list = timedAgenda(); if (!list.length) return false;
    var last = D.programa.reduce(function (m, x) { return x.fecha > m ? x.fecha : m; }, list[0].fecha);
    return now >= dateObj(list[0].fecha, "00:00") && now <= dateObj(last, "23:59");
  }
  function stepHTML(it) {
    var pl = it.lugar ? place(it.lugar) : null, dest = it.destino ? place(it.destino) : null, ch = contact(person().chofer);
    var h = '<div class="step"><div class="step-t">' + esc(it.hora) + '</div><div class="step-b"><small>' + (it.mine ? T("mine") : T("tipo_" + it.tipo)) + "</small><b>" + esc(it.titulo) + "</b>";
    if (it.equipo) h += "<span>" + esc(it.equipo) + "</span>";
    if (it.tipo === "traslado" && pl && pl.id === "hotel") h += "<span>" + LT("Punto de encuentro: puerta del hotel, calle Soriano 868.", "Ponto de encontro: porta do hotel, rua Soriano 868.") + "</span>";
    else if (pl) h += "<span>" + esc(pl.nombre) + " · " + esc(timeText(pl)) + "</span>";
    var target = dest || pl, acts = "";
    if (target && !inMyBase(target)) acts += '<button class="act press" data-a="seeMap" data-v="' + target.id + '">' + I.pin + T("seeMap") + "</button>";
    if (it.tipo === "traslado" && ch) acts += '<button class="act wa press" data-a="wa" data-v="' + ch.id + '">' + I.wa + T("driver") + "</button>";
    return h + (acts ? '<div class="step-act">' + acts + "</div>" : "") + "</div></div>";
  }
  function ahoraInner() {
    var st = agendaState();
    if (!inEventWindow(st.now) || eventOver()) return "";
    var title, msg, steps = [], cur = st.cur, nx = st.next;
    var follow = nx.slice(0, nx[0] && nx[0].tipo === "traslado" ? 2 : 1);
    var bless = LT("Esperamos que el culto haya sido de gran bendición. Te recordamos lo que sigue en el cronograma:", "Esperamos que o culto tenha sido de grande bênção. Lembramos o que vem a seguir na programação:");
    if (cur && cur.tipo === "culto") {
      title = LT("Ahora en el culto", "Agora no culto");
      msg = LT("Que Dios te hable en este " + cur.titulo.toLowerCase() + ". Termina cerca de las ", "Que Deus fale com você neste culto. Termina por volta das ") + hhmm(itemEnd(cur, st.list)) + LT(". Después:", ". Depois:");
      steps = [cur].concat(follow);
    } else if (cur && cur.tipo === "comida") {
      title = LT("¡Buen provecho!", "Bom apetite!");
      msg = LT("Disfrutá la comida. Después sigue:", "Aproveite a refeição. Depois vem:");
      steps = [cur].concat(follow);
    } else if (st.prevCulto) {
      title = LT("¡Qué bendición!", "Que bênção!");
      steps = (cur ? [cur] : []).concat(cur && cur.tipo === "traslado" ? nx.slice(0, 1) : cur ? [] : follow);
      msg = steps.length ? bless : LT("Esperamos que el culto haya sido de gran bendición. Por hoy no hay más actividades: que descanses y Dios te bendiga.", "Esperamos que o culto tenha sido de grande bênção. Por hoje não há mais atividades: descanse e Deus te abençoe.");
      if (!steps.length && !nx.length) msg = LT("Esperamos que la convención haya sido de gran bendición. ¡Gracias por acompañarnos! Que tengas un muy buen viaje de regreso.", "Esperamos que a convenção tenha sido de grande bênção. Obrigado por estar conosco! Faça uma ótima viagem de volta.");
    } else if (cur && cur.tipo === "traslado") {
      title = LT("Es hora de subir a las vans", "Hora de subir nas vans");
      msg = LT("Te esperamos en el punto de encuentro. Si te demorás, avisale a tu chofer.", "Esperamos você no ponto de encontro. Se for atrasar, avise seu motorista.");
      steps = [cur].concat(nx.slice(0, 1));
    } else if (cur) {
      title = LT("Ahora", "Agora"); msg = ""; steps = [cur].concat(follow);
    } else if (follow.length) {
      title = LT("Lo que sigue hoy", "O que vem hoje");
      if (isoDay(dateObj(follow[0].fecha)) !== isoDay(st.now)) title = LT("Lo que sigue", "O que vem a seguir");
      msg = LT("Así no te perdés nada:", "Para você não perder nada:");
      steps = follow;
    } else {
      title = LT("¡Gracias por acompañarnos!", "Obrigado por estar conosco!");
      msg = LT("Por hoy no hay más actividades. Que descanses y Dios te bendiga.", "Por hoje não há mais atividades. Descanse e Deus te abençoe.");
    }
    return '<div class="now-head"><span class="pulse"></span>' + esc(fmt(isoDay(st.now), { weekday: "long", day: "numeric" })) + " · " + hhmm(st.now) + (S.fakeNow ? " · " + LT("simulado", "simulado") : "") + "</div>" +
      "<h2>" + esc(title) + "</h2>" + (msg ? "<p>" + msg + "</p>" : "") + steps.map(stepHTML).join("");
  }
  function ahoraHTML() { var inner = ahoraInner(); return inner ? '<section class="now-card" id="nowCard">' + inner + "</section>" : ""; }

  /* ================= Asistente de chat (funciona sin internet) ================= */
  var chatLog = [];
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[¿?¡!.,;:]/g, " "); }
  function btn(a, v, label, cls) { return '<button class="act ' + (cls || "") + ' press" data-a="' + a + '" data-v="' + esc(v || "") + '">' + label + "</button>"; }
  function encargado() { var c = country(person().pais); return contact(c.encargado) || contact(person().transporte); }
  function encargadoBtns() {
    var e = encargado(); if (!e) return "";
    return '<div class="bot-acts">' + btn("wa", e.id, I.wa + LT("Escribir a ", "Escrever para ") + esc(firstName(e.nombre)), "wa") + btn("call", e.id, I.phone + LT("Llamar", "Ligar")) + "</div>";
  }
  function line(it) { var pl = it.lugar ? place(it.lugar) : null; return "<li><b>" + esc(it.hora) + "</b> " + esc(it.titulo) + (it.equipo ? " · " + esc(it.equipo) : "") + (pl ? " <span>(" + esc(pl.nombre) + ")</span>" : "") + "</li>"; }
  function dayName(f) { return fmt(f, { weekday: "long", day: "numeric" }); }
  function answer(q) {
    var n = norm(q), p = person(), a = aloj(p.alojamiento), st = agendaState();
    function has(re) { return re.test(n); }
    // 1. Emergencias
    if (has(/emergenc|urgenc|\b911\b|ambulanc|medic|hospital|doctor|enferm|dolor|me siento mal|socorro|ajuda|doente|policia|robo|perdi /)) {
      var hos = place("maciel");
      return LT("Si es una emergencia, llamá al <b>911</b> (policía, bomberos y ambulancia en todo Uruguay). El hospital público más cercano es el <b>" + hos.nombre + "</b>, a " + timeText(hos) + ".", "Se for uma emergência, ligue para o <b>911</b> (polícia, bombeiros e ambulância em todo o Uruguai). O hospital público mais próximo é o <b>" + hos.nombre + "</b>, a " + timeText(hos) + ".") +
        '<div class="bot-acts">' + btn("sos", "", I.phone + LT("Llamar al 911", "Ligar 911"), "danger") + btn("seeMap", "maciel", I.pin + T("seeMap")) + "</div>" +
        LT("También avisale a tu encargado:", "Avise também o seu responsável:") + encargadoBtns();
    }
    // 2. Hablar con alguien
    if (has(/encargad|responsab|contact|hablar con|whatsapp|llamar|telefono|numero|ligar|falar|alguien|pessoa|persona/)) {
      var e = encargado();
      return LT("Tu encargado es <b>" + esc(e.nombre) + "</b>. Está para ayudarte en todo lo que necesites.", "Seu responsável é <b>" + esc(e.nombre) + "</b>. Está aqui para ajudar no que precisar.") + encargadoBtns() +
        '<div class="bot-acts">' + btn("tab", "contactos", I.chat + LT("Ver todo el equipo", "Ver toda a equipe")) + "</div>";
    }
    // 3. ¿Qué sigue?
    if (has(/ahora|que sigue|proxim|siguiente|que hago|que tengo que|agora|depois|despues|luego|y ahora/)) {
      var inner = ahoraInner();
      if (inner) return '<div class="bot-now">' + inner + "</div>";
      var nx = nextItem();
      return nx ? LT("Lo próximo es: ", "O próximo é: ") + "<b>" + esc(nx.titulo) + "</b>, " + esc(dayName(nx.fecha)) + " " + LT("a las", "às") + " " + esc(nx.hora) + "." + '<div class="bot-acts">' + btn("goDay", nx.fecha, I.cal + T("tPrograma")) + "</div>"
        : LT("No hay más actividades en el programa.", "Não há mais atividades na programação.");
    }
    // 4. Comidas
    if (has(/comer|comem|comida|almuerz|almorz|cena|desayun|comedor|hambre|almoc|jantar|cafe da manha|refeic|fome/)) {
      var meals = D.programa.filter(function (x) { return x.tipo === "comida"; });
      return LT("Estas son las comidas:", "Estas são as refeições:") + "<ul>" + meals.map(function (m) { return "<li><b>" + esc(fmt(m.fecha, { weekday: "short", day: "numeric" })) + " " + esc(m.hora) + "</b> " + esc(m.titulo) + " <span>(" + esc(place(m.lugar).nombre) + ")</span></li>"; }).join("") + "</ul>" +
        LT("Las comidas en las iglesias tienen traslado en van desde el hotel.", "As refeições nas igrejas têm traslado de van desde o hotel.") +
        '<div class="bot-acts">' + btn("seeMap", "curva", I.pin + "Curva de Maroñas") + btn("seeMap", "cerroiglesia", I.pin + "El Cerro") + "</div>";
    }
    // 5. Vans y traslados
    if (has(/\bvan|vans|traslado|transporte|chofer|motorista|onibus|\bbus\b|taxi|uber|como voy|como llego|como vou/)) {
      var tr = (st.cur ? [st.cur] : []).concat(st.next).filter(function (x) { return x.tipo === "traslado"; }).slice(0, 3), ch = contact(p.chofer);
      return (tr.length ? LT("Próximas salidas de las vans:", "Próximas saídas das vans:") + "<ul>" + tr.map(line).join("") + "</ul>" : LT("No hay más salidas de vans en el programa.", "Não há mais saídas de vans na programação.")) +
        LT("Salen de la puerta del hotel, calle Soriano 868. ", "Saem da porta do hotel, rua Soriano 868. ") + (ch ? LT("Tu chofer es <b>", "Seu motorista é <b>") + esc(ch.nombre) + "</b> (" + esc(ch.detalle || "") + ")." : "") +
        (ch ? '<div class="bot-acts">' + btn("wa", ch.id, I.wa + T("driver"), "wa") + "</div>" : "");
    }
    // 6. Cultos y horarios
    if (has(/culto|horario|programa|predica|reunion|servicio|clausura|apertura|que hora|a que hora|cronograma|programac/)) {
      var cultos = D.programa.filter(function (x) { return x.tipo === "culto"; }), days = [];
      cultos.forEach(function (c) { if (days.indexOf(c.fecha) < 0) days.push(c.fecha); });
      return LT("Los cultos son en el <b>Teatro Cervantes</b>, dentro del hotel (entrada por calle Soriano):", "Os cultos são no <b>Teatro Cervantes</b>, dentro do hotel (entrada pela rua Soriano):") +
        days.map(function (d) { return "<p class=\"bot-day\">" + esc(dayName(d)) + "</p><ul>" + cultos.filter(function (c) { return c.fecha === d; }).map(line).join("") + "</ul>"; }).join("") +
        '<div class="bot-acts">' + btn("goDay", D.evento.inicio, I.cal + LT("Ver programa completo", "Ver programação completa")) + "</div>";
    }
    // 7. Llegada
    if (has(/llegada|llego|vuelo|aeropuerto|buquebus|barco|chegada|chego|voo|aeroporto|me busca|me buscan|recibe/)) {
      var r = contact(p.transporte);
      return LT("Llegás el <b>", "Você chega <b>") + esc(dayName(p.llegada.fecha)) + " " + LT("a las", "às") + " " + esc(p.llegada.hora) + "</b> · " + esc(p.llegada.numero) + " · " + esc(p.llegada.punto) + ". " +
        LT("Te recibe <b>", "Quem te recebe é <b>") + esc(r.nombre) + "</b>." + '<div class="bot-acts">' + btn("wa", r.id, I.wa + LT("Escribirle", "Escrever"), "wa") + "</div>";
    }
    // 8. Hotel y habitación
    if (has(/hotel|habitacion|cuarto|dormir|duermo|alojamiento|hospedaje|check|quarto|hospedagem|compart|llave|desayuno/)) {
      return LT("Te alojás en <b>", "Você fica no <b>") + esc(a.nombre) + "</b> (" + esc(a.direccion) + "), " + LT("habitación", "quarto") + " <b>" + esc(p.habitacion) + "</b>" +
        (p.comparte && p.comparte !== "—" ? LT(", con ", ", com ") + esc(p.comparte) : "") + ". Check-in " + esc(a.checkin) + " · check-out " + esc(a.checkout) + ". " + T("breakfast") + ": " + esc(a.desayuno) + "." +
        '<div class="bot-acts">' + btn("seeMap", a.id, I.pin + T("seeMap")) + btn("dir", a.id, I.nav + T("directions")) + "</div>";
    }
    // 9. WiFi
    if (has(/wifi|wi fi|internet|contrasena do wifi|\bred\b|\brede\b/)) {
      return LT("Los datos del <b>WiFi</b> te los damos personalmente cuando llegás. Si todavía no los tenés, escribile a tu encargado:", "Os dados do <b>WiFi</b> são entregues pessoalmente quando você chega. Se ainda não recebeu, escreva para o seu responsável:") + encargadoBtns();
    }
    // 10. Iglesias
    if (has(/iglesia|igreja|curva|maronas|ieanjesus/)) {
      var ig = D.lugares.filter(function (l) { return l.cat === "iglesia"; });
      return LT("Las comidas se sirven en dos iglesias de Montevideo:", "As refeições são servidas em duas igrejas de Montevidéu:") + "<ul>" + ig.map(function (l) { return "<li><b>" + esc(l.nombre) + "</b> · " + esc(timeText(l)) + "</li>"; }).join("") + "</ul>" +
        '<div class="bot-acts">' + ig.map(function (l) { return btn("seeMap", l.id, I.pin + esc(l.nombre.replace("Iglesia ", ""))); }).join("") + "</div>";
    }
    // 11. Un lugar por su nombre
    // el lugar con más palabras en común con la pregunta
    var STOP = ["iglesia", "plaza", "teatro", "playa", "parque", "palacio", "hospital", "terminal", "shopping", "montevideo"];
    var hit = null, best = 0;
    D.lugares.forEach(function (l) {
      var sc = 0;
      norm(l.nombre).split(/[\s·]+/).forEach(function (w) { if (w.length > 4 && STOP.indexOf(w) < 0 && n.indexOf(w) >= 0) sc++; });
      if (sc > best) { best = sc; hit = l; }
    });
    if (hit) {
      return "<b>" + esc(hit.nombre) + "</b>: " + esc(hit.desc) + " " + LT("Desde tu alojamiento: ", "Desde sua hospedagem: ") + esc(timeText(hit)) + "." +
        (hit.foto ? '<img class="bot-img" src="' + hit.foto + '" alt="' + esc(hit.nombre) + '">' : "") +
        '<div class="bot-acts">' + btn("seeMap", hit.id, I.pin + T("seeMap")) + btn("dir", hit.id, I.nav + T("directions")) + "</div>";
    }
    // 12. Turismo
    if (has(/conocer|pasear|turismo|visitar|playa|paseo|lugar|excursion|shopping|comprar|compras|passear|praia|conhecer|passeio/)) {
      var base = myBase(), near = D.lugares.filter(function (l) { return l.cat === "turismo"; }).sort(function (x, y) { return haversine(base, x) - haversine(base, y); }).slice(0, 4);
      return LT("Cerca de tu alojamiento te recomiendo:", "Perto da sua hospedagem eu recomendo:") + "<ul>" + near.map(function (l) { return "<li><b>" + esc(l.nombre) + "</b> · " + esc(timeText(l)) + "</li>"; }).join("") + "</ul>" +
        LT("Para un día libre: Punta del Este, Piriápolis o Colonia.", "Para um dia livre: Punta del Este, Piriápolis ou Colonia.") +
        '<div class="bot-acts">' + btn("tab", "mapa", I.map + LT("Abrir el mapa", "Abrir o mapa")) + "</div>";
    }
    // 13. Dinero
    if (has(/plata|dinero|cambio|pesos|dolar|moneda|reais|\breal\b|pagar|tarjeta|cartao|dinheiro/)) {
      var av = place("18julio");
      return LT("En Uruguay se usa el <b>peso uruguayo</b>. Hay casas de cambio y cajeros en la <b>Avenida 18 de Julio</b>, a ", "No Uruguai se usa o <b>peso uruguaio</b>. Há casas de câmbio e caixas eletrônicos na <b>Avenida 18 de Julio</b>, a ") + esc(timeText(av)) + LT(". En la mayoría de los comercios se puede pagar con tarjeta.", ". Na maioria das lojas dá para pagar com cartão.") +
        '<div class="bot-acts">' + btn("seeMap", "18julio", I.pin + T("seeMap")) + "</div>";
    }
    // 14. Clima y ropa
    if (has(/clima|tiempo|lluvia|calor|frio|ropa|vestimenta|tempo|chuva|roupa|abrigo/)) {
      return LT("Diciembre es verano en Montevideo: suele hacer entre 18 y 28 °C, con viento cerca de la rambla. Traé protector solar y un abrigo liviano para la noche. Para los cultos, ropa de culto.", "Dezembro é verão em Montevidéu: costuma fazer entre 18 e 28 °C, com vento perto da rambla. Traga protetor solar e um agasalho leve para a noite. Para os cultos, roupa de culto.");
    }
    // 15. Lema
    if (has(/lema|versiculo|tema|versiculo|biblia/)) return "«" + esc(D.evento.lema) + "» · " + esc(D.evento.versiculo);
    // 16. Saludos
    if (has(/^\s*(hola|buenas|buen dia|buenos dias|buenas tardes|buenas noches|ola|oi|bom dia|boa tarde|boa noite)\b/)) return LT("¡Hola, " + esc(firstName(p.nombre)) + "! ¿En qué te ayudo?", "Olá, " + esc(firstName(p.nombre)) + "! Como posso ajudar?");
    if (has(/gracias|obrigad|dios te bendiga|deus te abencoe|amen/)) return LT("¡Amén! Dios te bendiga. Acá estoy para lo que necesites.", "Amém! Deus te abençoe. Estou aqui para o que precisar.");
    // No entendí
    return LT("No estoy seguro de haber entendido. Probá con una de estas preguntas, o escribile directamente a tu encargado:", "Não tenho certeza se entendi. Tente uma destas perguntas ou escreva direto para o seu responsável:") + encargadoBtns();
  }
  var QUICK = {
    es: ["¿Qué sigue ahora?", "¿A qué hora son los cultos?", "¿Dónde comemos?", "¿Cuándo salen las vans?", "Mi habitación", "Mi llegada", "Lugares para conocer", "Cambio de dinero", "Emergencia"],
    pt: ["O que vem agora?", "Que horas são os cultos?", "Onde vamos comer?", "Quando saem as vans?", "Meu quarto", "Minha chegada", "Lugares para conhecer", "Câmbio de dinheiro", "Emergência"]
  };
  function chatGreeting() {
    var p = person(), e = encargado();
    return LT("¡Hola, " + esc(firstName(p.nombre)) + "! Soy el asistente de la convención. Preguntame lo que quieras: horarios de los cultos, dónde comemos, cuándo salen las vans, tu habitación…", "Olá, " + esc(firstName(p.nombre)) + "! Sou o assistente da convenção. Pergunte o que quiser: horários dos cultos, onde comemos, quando saem as vans, seu quarto…") +
      "<p class=\"bot-sub\">" + LT("Si preferís hablar con una persona, tu encargado es <b>", "Se preferir falar com uma pessoa, seu responsável é <b>") + esc(e.nombre) + "</b>.</p>" + encargadoBtns() +
      "<p class=\"bot-sub\">" + LT("¿Cómo estás? ¿Va todo bien con tu estadía?", "Como você está? Está tudo bem com a sua estadia?") + "</p>" +
      '<div class="bot-acts">' + btn("chatFeel", "ok", LT("Todo bien", "Tudo bem")) + btn("chatFeel", "help", LT("Necesito ayuda", "Preciso de ajuda")) + "</div>";
  }
  function msgHTML(m) { return '<div class="msg ' + m.from + '">' + (m.from === "bot" ? '<span class="bot-av">' + I.chat + "</span>" : "") + '<div class="bubble">' + m.html + "</div></div>"; }
  function openChat() {
    closeModal();
    if (!chatLog.length) chatLog.push({ from: "bot", html: chatGreeting() });
    var el = document.createElement("div");
    el.className = "chat-bg"; el.id = "modal";
    el.innerHTML = '<div class="chat" role="dialog" aria-modal="true" aria-label="' + LT("Asistente", "Assistente") + '">' +
      '<header class="chat-head"><span class="bot-av big">' + I.chat + "</span><div><b>" + LT("Asistente de la convención", "Assistente da convenção") + "</b><span>" + LT("Responde al instante, también sin internet", "Responde na hora, também sem internet") + "</span></div>" +
      '<button class="close" aria-label="' + T("close") + '" data-a="closeModal">' + I.x + "</button></header>" +
      '<div class="msgs" id="msgs">' + chatLog.map(msgHTML).join("") + "</div>" +
      '<div class="quick" id="quick">' + QUICK[S.lang === "pt" ? "pt" : "es"].map(function (q) { return '<button class="qchip press" data-a="chatQ" data-v="' + esc(q) + '">' + esc(q) + "</button>"; }).join("") + "</div>" +
      '<form class="composer" id="composer"><input id="chatIn" type="text" enterkeyhint="send" autocomplete="off" placeholder="' + LT("Escribí tu pregunta…", "Escreva sua pergunta…") + '" aria-label="' + LT("Tu pregunta", "Sua pergunta") + '">' +
      '<button type="submit" class="send" aria-label="' + LT("Enviar", "Enviar") + '">' + I.arrow + "</button></form></div>";
    el.addEventListener("click", function (e) { if (e.target === el) closeModal(); });
    $app.appendChild(el);
    el.querySelector("#composer").addEventListener("submit", function (e) { e.preventDefault(); var i = document.getElementById("chatIn"); if (i.value.trim()) { chatSend(i.value.trim()); i.value = ""; } });
    // Con el teclado abierto (iPhone, Samsung, Huawei), el chat se ajusta a la parte visible de la pantalla
    if (window.visualViewport) {
      var vv = window.visualViewport;
      var fit = function () {
        var c = document.getElementById("modal");
        if (!c || !c.classList.contains("chat-bg")) { vv.removeEventListener("resize", fit); vv.removeEventListener("scroll", fit); return; }
        c.style.top = vv.offsetTop + "px"; c.style.height = vv.height + "px"; c.style.bottom = "auto";
        scrollMsgs();
      };
      vv.addEventListener("resize", fit); vv.addEventListener("scroll", fit); fit();
    }
    scrollMsgs();
  }
  function scrollMsgs() { var m = document.getElementById("msgs"); if (m) m.scrollTop = m.scrollHeight; }
  function pushMsg(m) {
    chatLog.push(m);
    var box = document.getElementById("msgs"); if (!box) return;
    box.insertAdjacentHTML("beforeend", msgHTML(m)); scrollMsgs();
  }
  function botReply(html) {
    var box = document.getElementById("msgs"); if (!box) return;
    box.insertAdjacentHTML("beforeend", '<div class="msg bot typing" id="typing"><span class="bot-av">' + I.chat + '</span><div class="bubble"><i></i><i></i><i></i></div></div>'); scrollMsgs();
    setTimeout(function () { var t = document.getElementById("typing"); if (t) t.remove(); pushMsg({ from: "bot", html: html }); }, 650);
  }
  function chatSend(q) { pushMsg({ from: "me", html: esc(q) }); botReply(answer(q)); }
  function chatFeel(v) {
    if (v === "ok") { pushMsg({ from: "me", html: LT("Todo bien", "Tudo bem") }); botReply(LT("¡Qué alegría! Disfrutá la convención. Si necesitás algo, acá estoy.", "Que alegria! Aproveite a convenção. Se precisar de algo, estou aqui.")); }
    else { pushMsg({ from: "me", html: LT("Necesito ayuda", "Preciso de ajuda") }); botReply(LT("Contame qué pasa y te ayudo. Si preferís, escribile ya a tu encargado, que está para eso:", "Conte o que está acontecendo e eu ajudo. Se preferir, escreva agora para o seu responsável:") + encargadoBtns()); }
  }

  /* Prueba (solo versión de ejemplo): simular horas de la convención */
  var SIM = [null, "2026-12-04T09:30", "2026-12-05T17:10", "2026-12-06T12:03", "2026-12-06T12:50", "2026-12-06T18:30"];
  function simLabel() { return S.fakeNow ? fmt(isoDay(new Date(S.fakeNow)), { weekday: "short", day: "numeric" }) + " " + hhmm(new Date(S.fakeNow)) : LT("Hora real", "Hora real"); }

  /* ================= Paseo guiado automático (se mueve solo, como un video) ================= */
  var tour = null;
  function tourSteps() {
    var p = person();
    return [
      { title: LT("¡Bienvenido al portal!", "Bem-vindo ao portal!"), text: LT("Te mostramos cómo funciona en medio minuto. No hace falta tocar nada.", "Mostramos como funciona em meio minuto. Não precisa tocar em nada."), dur: 3600 },
      { tab: "inicio", sel: '.nav button[data-v="inicio"]', title: T("tInicio"), text: LT("Tu resumen del día: dónde dormís, tu llegada y lo que sigue.", "Seu resumo do dia: onde vai dormir, sua chegada e o que vem a seguir.") },
      { tab: "inicio", scroll: ".stay", sel: ".stay", up: ".panel", title: T("myStay"), text: LT("Tu hotel, tu habitación y con quién compartís. Con un toque, cómo llegar.", "Seu hotel, seu quarto e com quem divide. Com um toque, como chegar.") },
      { tab: "inicio", scroll: ".arrive-photo, .arrive", sel: ".arrive", up: ".panel", title: T("arrival"), text: LT("Cuándo llegás, quién te recibe y tu chofer, con WhatsApp directo.", "Quando você chega, quem te recebe e seu motorista, com WhatsApp direto.") },
      { tab: "inicio", scroll: ".pcard", sel: ".pcard", up: ".hscroll", title: T("toVisit"), text: LT("Lugares para conocer cerca del hotel. Deslizá para ver más.", "Lugares para conhecer perto do hotel. Deslize para ver mais.") },
      { tab: "inicio", scroll: "", sel: '.nav button[data-v="mapa"]', title: T("tMapa"), text: LT("El mapa de Montevideo con todo lo importante.", "O mapa de Montevidéu com tudo o que importa.") },
      { tab: "mapa", sel: ".chips", title: T("tMapa"), text: LT("Elegí qué ver: la convención, las iglesias donde comemos, llegadas, turismo y más.", "Escolha o que ver: a convenção, as igrejas onde comemos, chegadas, turismo e mais.") },
      { tab: "mapa", sel: "#sheet .handle", up: "#sheet", title: LT("Cada lugar", "Cada lugar"), text: LT("Tocá un lugar para ver su foto, la distancia y «Cómo llegar».", "Toque em um lugar para ver a foto, a distância e «Como chegar».") },
      { tab: "mapa", sel: '.nav button[data-v="programa"]', title: T("tPrograma"), text: LT("Todo el cronograma, día por día.", "Toda a programação, dia a dia.") },
      { tab: "programa", sel: ".item.culto", title: LT("Cultos, comidas y vans", "Cultos, refeições e vans"), text: LT("Los horarios de cada culto, las comidas y cuándo salen las vans.", "Os horários de cada culto, as refeições e quando saem as vans.") },
      { tab: "programa", sel: '.nav button[data-v="contactos"]', title: T("tContactos"), text: LT("Tu equipo de apoyo, siempre a mano.", "Sua equipe de apoio, sempre à mão.") },
      { tab: "contactos", sel: ".team-list .person", title: T("yourTeam"), text: LT("Escribiles por WhatsApp o llamalos con un toque.", "Escreva pelo WhatsApp ou ligue com um toque.") },
      { tab: "contactos", sel: ".chat-fab", title: LT("¿Dudas?", "Dúvidas?"), text: LT("El asistente responde al instante. También podés escribirle a tu encargado.", "O assistente responde na hora. Você também pode escrever para o seu responsável.") },
      { tab: "contactos", sel: '.nav button[data-v="perfil"]', title: T("tPerfil"), text: LT("Tus datos, el idioma y guardar el portal para usarlo sin internet.", "Seus dados, o idioma e salvar o portal para usar sem internet.") },
      { tab: "inicio", title: LT("¡Listo, " + firstName(p.nombre) + "!", "Pronto, " + firstName(p.nombre) + "!"), text: LT("Dios te bendiga. Te esperamos en la convención.", "Deus te abençoe. Esperamos você na convenção."), dur: 3200 }
    ];
  }
  function startTour() {
    if (tour || !person()) return;
    S.view = "app"; S.prevTab = S.tab; S.tab = "inicio"; S.place = null; S.sheetOpen = false; render();
    var el = document.createElement("div");
    el.className = "tour";
    el.setAttribute("role", "dialog"); el.setAttribute("aria-label", LT("Paseo guiado", "Tour guiado"));
    el.innerHTML = '<div class="tour-veil" id="tourVeil"></div><div class="tour-block"></div><div class="tour-ring" id="tourRing"></div>' +
      '<div class="tour-tip" id="tourTip" aria-live="polite"></div><div class="tour-bar"><i id="tourBar"></i></div>' +
      '<button class="tour-skip" id="tourSkip">' + T("skip") + "</button>";
    document.body.appendChild(el);
    tour = { el: el, i: -1, steps: tourSteps(), timers: [] };
    el.querySelector("#tourSkip").addEventListener("click", endTour);
    requestAnimationFrame(function () { el.classList.add("on"); });
    later(nextTourStep, 500);
  }
  function later(fn, ms) { if (tour) tour.timers.push(setTimeout(fn, ms)); }
  function nextTourStep() {
    if (!tour) return;
    tour.i++;
    var st = tour.steps[tour.i];
    if (!st) return endTour();
    document.getElementById("tourBar").style.width = ((tour.i + 1) / tour.steps.length * 100) + "%";
    var tip = document.getElementById("tourTip");
    tip.classList.remove("in");
    var delay = 0;
    if (st.tab && st.tab !== S.tab) {
      S.prevTab = S.tab; S.tab = st.tab; S.place = null; S.sheetOpen = false; render();
      delay = st.tab === "mapa" ? 1000 : 550;
    }
    if (st.scroll !== undefined) {
      later(function () {
        var c = document.getElementById("content"), t = st.scroll ? document.querySelector(st.scroll) : null;
        if (!c) return;
        var top = t ? t.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - 110 : 0;
        c.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }, delay);
      delay += 850;
    }
    later(function () {
      var target = st.sel ? document.querySelector(st.sel) : null;
      if (target && st.up) target = target.closest(st.up) || target;
      placeTour(target, st);
      later(nextTourStep, st.dur || 3700);
    }, delay);
  }
  function holePath(W, H, x, y, w, h, r) {
    var p = "M0 0H" + W + "V" + H + "H0Z";
    // sin foco: un hueco de tamaño cero en el centro (misma forma, así la transición es suave)
    if (w <= 0) { x = Math.round(W / 2); y = Math.round(H / 2); w = 0.02; h = 0.02; r = 0.01; }
    return p + "M" + (x + r) + " " + y + "H" + (x + w - r) + "A" + r + " " + r + " 0 0 1 " + (x + w) + " " + (y + r) + "V" + (y + h - r) + "A" + r + " " + r + " 0 0 1 " + (x + w - r) + " " + (y + h) +
      "H" + (x + r) + "A" + r + " " + r + " 0 0 1 " + x + " " + (y + h - r) + "V" + (y + r) + "A" + r + " " + r + " 0 0 1 " + (x + r) + " " + y + "Z";
  }
  function placeTour(target, st) {
    if (!tour) return;
    var W = window.innerWidth, H = window.innerHeight, app = $app.getBoundingClientRect();
    var veil = document.getElementById("tourVeil"), ring = document.getElementById("tourRing"), tip = document.getElementById("tourTip");
    var x = 0, y = 0, w = 0, h = 0, pad = 8;
    var c = document.getElementById("content"), cr0 = c ? c.getBoundingClientRect() : { top: 0, bottom: H };
    var navEl = document.querySelector(".nav"), navTop = navEl ? navEl.getBoundingClientRect().top : H;
    var cr = { top: cr0.top, bottom: Math.min(cr0.bottom, navTop) };   // zona visible entre la barra de arriba y el menú
    var inContent = target && c && c.contains(target);
    if (inContent) {
      // si quedó fuera de la vista, se acomoda al instante
      var r0 = target.getBoundingClientRect();
      if (r0.top < cr.top + 8 || r0.top > cr.bottom - 120) c.scrollTop += r0.top - cr.top - 110;
    }
    if (target) {
      var r = target.getBoundingClientRect();
      var inSheet = target.closest("#sheet");
      var minY = inContent ? cr.top + 4 : 4, maxY = (inContent || inSheet) ? cr.bottom - 4 : H - 4;
      x = Math.max(app.left + 4, r.left - pad); y = Math.max(minY, r.top - pad);
      w = Math.min(app.right - 4, r.right + pad) - x; h = Math.max(40, Math.min(maxY, r.bottom + pad) - y);
    }
    var rad = target && target.closest(".nav, .chat-fab, .chips") ? 18 : 12;
    veil.style.clipPath = "path(evenodd, '" + holePath(W, H, Math.round(x), Math.round(y), Math.round(w), Math.round(h), rad) + "')";
    ring.style.cssText = target ? "opacity:1;left:" + x + "px;top:" + y + "px;width:" + w + "px;height:" + h + "px;border-radius:" + rad + "px" : "opacity:0;left:" + (W / 2) + "px;top:" + (H / 2) + "px;width:0;height:0";
    // texto: arriba o abajo del foco, siempre dentro de la columna del portal
    var spaceAbove = y - cr.top, spaceBelow = cr.bottom - (y + h);
    var below = target ? spaceBelow > spaceAbove : false;
    var overlap = target && Math.max(spaceAbove, spaceBelow) < 150;   // el foco ocupa casi toda la pantalla
    if (overlap) { below = false; }
    var arrowX = target ? Math.min(Math.max(x + w / 2 - app.left - 16, 24), app.width - 56) : 0;
    tip.innerHTML = (target ? '<span class="tour-arrow ' + (below ? "up" : "down") + '" style="left:' + arrowX + 'px">' + I.arrow + "</span>" : "") +
      "<b>" + esc(st.title) + "</b><p>" + esc(st.text) + "</p>";
    tip.style.left = (app.left + 16) + "px"; tip.style.width = (app.width - 32) + "px";
    if (!target) { tip.style.top = Math.round(H * 0.36) + "px"; tip.style.bottom = "auto"; tip.className = "tour-tip center"; }
    else if (below) { tip.style.top = Math.round(y + h + 22) + "px"; tip.style.bottom = "auto"; tip.className = "tour-tip below"; }
    else if (overlap) { tip.style.bottom = Math.round(H - cr.bottom + 14) + "px"; tip.style.top = "auto"; tip.className = "tour-tip above"; tip.querySelector(".tour-arrow") && (tip.querySelector(".tour-arrow").className = "tour-arrow up"); }
    else { tip.style.bottom = Math.round(H - y + 22) + "px"; tip.style.top = "auto"; tip.className = "tour-tip above"; }
    void tip.offsetWidth; tip.classList.add("in");
  }
  function endTour() {
    if (!tour) return;
    tour.timers.forEach(clearTimeout);
    var el = tour.el; tour = null;
    el.classList.remove("on"); setTimeout(function () { el.remove(); }, 450);
    store.set("tourDone_" + S.personId, true);
    S.prevTab = S.tab; S.tab = "inicio"; S.place = null; render();
  }
  window.addEventListener("resize", function () { if (tour && tour.steps[tour.i]) { var st = tour.steps[tour.i], t = st.sel ? document.querySelector(st.sel) : null; if (t && st.up) t = t.closest(st.up) || t; placeTour(t, st); } });

  /* ---------------- Modales ---------------- */
  function modal(inner) {
    closeModal();
    var bg = document.createElement("div");
    bg.className = "modal-bg"; bg.id = "modal";
    bg.innerHTML = '<div class="modal" role="dialog" aria-modal="true">' + inner + '<div class="btn-row"><button class="btn btn-line press" data-a="closeModal">' + T("close") + "</button></div></div>";
    bg.addEventListener("click", function (e) { if (e.target === bg) closeModal(); });
    $app.appendChild(bg);
  }
  function closeModal() { var m = document.getElementById("modal"); if (m) m.remove(); }
  // foto a pantalla completa, sin recortar
  function modalPhoto(src) {
    closeModal();
    var g = (D.galeria || []).filter(function (x) { return x.foto === src; })[0];
    var bg = document.createElement("div");
    bg.className = "lightbox"; bg.id = "modal";
    bg.innerHTML = '<img src="' + esc(src) + '" alt="' + esc(g ? g.texto : "") + '">' + (g ? "<p>" + esc(g.texto) + "</p>" : "") +
      '<button class="close" aria-label="' + T("close") + '" data-a="closeModal">' + I.x + "</button>";
    bg.addEventListener("click", function (e) { if (e.target === bg || e.target.tagName === "IMG") closeModal(); });
    $app.appendChild(bg);
  }

  /* ---------------- Render ---------------- */
  function render() {
    closeModal();
    if (map && !(S.view === "app" && S.tab === "mapa")) { map.remove(); map = null; }
    document.documentElement.lang = S.lang === "pt" ? "pt-BR" : "es";
    var key = S.view + "|" + (S.view === "app" ? S.tab : "");
    var same = key === render._last;
    $app.innerHTML = { splash: vSplash, flags: vFlags, names: vNames, pin: vPin, welcome: vWelcome, install: vInstall, tutorial: vTutorial, app: vApp }[S.view]();
    if (same) { // misma pantalla: sin volver a animar la entrada
      var anim = $app.querySelectorAll(".rise,.pop,.fade,.tab-in,.kenburns");
      for (var i = 0; i < anim.length; i++) anim[i].style.animation = "none";
    }
    render._last = key;
    if (S.view === "tutorial") bindTutorial();
    if (S.view === "app" && S.tab === "mapa") initMap();
  }

  /* ---------------- Acciones ---------------- */
  function afterSplash() {
    session.set("splashSeen", true);
    var saved = store.get("person");
    if (saved && byId(D.personas, saved)) { S.view = entryView(saved); }
    else S.view = "flags";
    render();
  }
  function entryView(id) {
    if (!store.get("seen_" + id)) return "welcome";
    if (isStandalone() && wantsInstallScreen()) return "install"; // primera vez que abre la app instalada
    return "app";
  }
  function login(id) {
    S.personId = id; store.set("person", id);
    S.view = entryView(id); S.tab = "inicio";
    render(); notifyCheck();
  }
  function pressKey(k) {
    if (S.pin.length >= 4) return;
    S.pin += k; S.pinError = false;
    if (S.pin.length === 4) {
      var p = person();
      if (S.pin === String(p.pin)) { var dd = document.querySelector(".dots"); if (dd) dd.innerHTML = "<i class='on'></i><i class='on'></i><i class='on'></i><i class='on'></i>"; S.pin = ""; setTimeout(function () { login(p.id); }, 220); return; }
      S.pinError = true; S.pin = ""; render();
      if (navigator.vibrate) try { navigator.vibrate(120); } catch (e) {}
      setTimeout(function () { if (S.view === "pin") { S.pinError = false; render(); } }, 1100);
      return;
    }
    render();
  }
  function openWa(id) {
    var c = contact(id), p = person();
    if (D.demo) return toast(T("demoWa"));
    var msg = T("waMsg").replace("{c}", firstName(c.nombre)).replace("{n}", p.nombre).replace("{p}", country(p.pais).nombre);
    window.open("https://wa.me/" + digits(c.whatsapp) + "?text=" + encodeURIComponent(msg), "_blank");
  }
  function call(id) { if (D.demo) return toast(T("demoCall")); location.href = "tel:+" + digits(contact(id).whatsapp); }
  function locate() {
    if (!navigator.geolocation) return toast(T("locErr"));
    navigator.geolocation.getCurrentPosition(function (pos) {
      var ll = [pos.coords.latitude, pos.coords.longitude];
      if (!map) return;
      if (meMarker && map.hasLayer(meMarker)) meMarker.setLatLng(ll);
      else meMarker = L.marker(ll, { icon: L.divIcon({ className: "", html: '<div class="me-dot"></div>', iconSize: [18, 18] }), zIndexOffset: 1000 }).addTo(map);
      map.flyTo(ll, 16, { duration: .7 });
    }, function () { toast(T("locErr")); }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 });
  }
  function showWifi() {
    var h = "<h3>" + T("wifiTitle") + '</h3><div class="kv" style="padding:4px 0 0">';
    (D.evento.wifi || []).forEach(function (w) { h += "<div><span>" + esc(w.lugar) + "</span><b>" + esc(w.red) + "<br>" + T("password") + ": " + esc(w.clave) + "</b></div>"; });
    modal(h + "</div>");
  }
  // Instalar: Android abre la ventana del sistema; iPhone muestra los pasos de Safari
  function doInstall(then) {
    if (installEvt) {
      installEvt.prompt();
      installEvt.userChoice.then(function (r) { installEvt = null; if (r && r.outcome === "accepted") askNotif(then); else if (then) then(); else render(); });
      return;
    }
    modal(isIOS() ? iosGuide() : otherGuide());
    if (then) { var m = document.querySelector("#modal [data-a=closeModal]"); if (m) { m.textContent = LT("Entendido", "Entendi"); m.setAttribute("data-a", "instDone"); m.className = "btn btn-primary press"; } }
  }

  /* ----- Avisos ----- */
  // Guarda quién es la persona para que el service worker sepa qué avisos le tocan
  function syncNotifMeta() {
    if (!window.CONV_NOTIF || !S.personId) return Promise.resolve();
    return CONV_NOTIF.getMeta().then(function (m) {
      if (m.person === S.personId && m.lang === S.lang) return;
      if (m.person !== S.personId) m.sent = [];
      m.person = S.personId; m.lang = S.lang;
      return CONV_NOTIF.setMeta(m);
    });
  }
  function showNotif(n) {
    if (!n || !canNotify() || Notification.permission !== "granted") return;
    navigator.serviceWorker.ready.then(function (reg) { return reg.showNotification(n.title, CONV_NOTIF.options(n)); }).catch(function () {});
  }
  function notifyCheck() {
    if (!canNotify() || Notification.permission !== "granted" || !S.personId || !window.CONV_NOTIF) return;
    syncNotifMeta().then(function () { return CONV_NOTIF.check(D, Date.now()); }).then(showNotif).catch(function () {});
  }
  function registerPeriodic() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.ready.then(function (reg) {
      if (!reg.periodicSync) return;
      return navigator.permissions.query({ name: "periodic-background-sync" }).then(function (p) {
        if (p.state === "granted") return reg.periodicSync.register("conv-avisos", { minInterval: 3 * 36e5 });
      });
    }).catch(function () {});
  }
  function askNotif(then) {
    if (!canNotify()) { if (isIOS() && !isStandalone()) modal(iosGuide()); else toast(LT("Este navegador no permite avisos.", "Este navegador não permite avisos.")); if (then) then(); return; }
    Notification.requestPermission().then(function (st) {
      if (st === "granted") {
        syncNotifMeta().then(function () {
          registerPeriodic();
          showNotif({ k: "hola", title: LT("¡Avisos activados!", "Avisos ativados!"), body: LT("Te vamos a avisar lo que hacemos cada día, cuántos días faltan y lo que sigue después de cada culto.", "Vamos avisar o que fazemos cada dia, quantos dias faltam e o que vem depois de cada culto."), tab: "programa" });
        });
      } else if (st === "denied") toast(LT("Los avisos quedaron bloqueados. Podés activarlos en los ajustes.", "Os avisos ficaram bloqueados. Você pode ativá-los nos ajustes."));
      if (then) then(); else render();
    });
  }
  // Ejemplo para ver cómo llega un aviso
  function testNotif() {
    showNotif({ k: "prueba", title: LT("¡Qué bendición!", "Que bênção!"), body: LT("Esperamos que el culto haya sido de gran bendición. Te recordamos lo que sigue: 11:45 salen las vans hacia la Iglesia Curva de Maroñas para el almuerzo. Tocá para ver el programa.", "Esperamos que o culto tenha sido de grande bênção. Lembramos o que vem a seguir: 11:45 saem as vans para a Igreja Curva de Maroñas para o almoço. Toque para ver a programação."), tab: "programa" });
    toast(LT("Te mandamos un aviso de ejemplo", "Enviamos um aviso de exemplo"));
  }
  function wantsInstallScreen() {
    if (isStandalone()) return canNotify() && Notification.permission === "default" && !store.get("askedSA");
    return !store.get("askedInstall");
  }
  // Después de la invitación a instalar, sigue la pantalla que correspondía
  function afterInstall() {
    store.set(isStandalone() ? "askedSA" : "askedInstall", true);
    S.view = store.get("seen_" + S.personId) ? "app" : "tutorial"; render();
  }

  /* ----- Guardar para usar sin internet ----- */
  /* El mapa de OpenStreetMap no permite descargar zonas enteras por adelantado:
     el portal guarda automáticamente las partes del mapa que la persona ya miró (sw.js). */
  var SHELL = ["./", "index.html", "styles.css", "fonts.css", "app.js", "data.js", "notif.js", "manifest.webmanifest", "vendor/leaflet/leaflet.js", "vendor/leaflet/leaflet.css",
    "icons/icon-192.png", "icons/icon-512.png", "fonts/oswald-300_600.woff2", "fonts/poppins-400.woff2", "fonts/poppins-500.woff2", "fonts/poppins-600.woff2", "fonts/poppins-700.woff2",
    "img/aeropuerto.jpg", "img/aplauso.jpg", "img/artigas.jpg", "img/buquebus.jpg", "img/cerro.jpg", "img/culto1.jpg", "img/culto2.jpg", "img/culto4.jpg", "img/curva-grupo.jpg", "img/curva.jpg", "img/familia.jpg", "img/hotel.jpg", "img/jovenes.jpg", "img/logo.png", "img/montevideo.jpg", "img/musica.jpg", "img/ofrenda.jpg", "img/oracion2.jpg", "img/predica.jpg", "img/salon.jpg", "img/teatro.jpg", "img/lugares/18julio.jpg", "img/lugares/atlantida.jpg", "img/lugares/casapueblo.jpg", "img/lugares/centenario.jpg", "img/lugares/cerro.jpg", "img/lugares/ciudadvieja.jpg", "img/lugares/colonia.jpg", "img/lugares/legislativo.jpg", "img/lugares/matriz.jpg", "img/lugares/mercado.jpg", "img/lugares/mirador.jpg", "img/lugares/piriapolis.jpg", "img/lugares/pocitos.jpg", "img/lugares/punta.jpg", "img/lugares/rambla.jpg", "img/lugares/rodo.jpg", "img/lugares/s_puntacarretas.jpg", "img/lugares/trescruces.jpg"];
  function saveOffline() {
    if (S.dl) return;
    if (!("caches" in window)) return toast("Este navegador no permite guardar sin internet.");
    if (!navigator.onLine) return toast(T("offline"));
    S.dl = { done: 0, total: SHELL.length }; refreshOff();
    caches.open("conv-shell-v5").then(function (shellC) {
      function step() { S.dl.done++; refreshOff(); }
      return Promise.all(SHELL.map(function (u) { return fetch(u, { cache: "reload" }).then(function (r) { if (r.ok) return shellC.put(u, r); }).catch(function () {}).then(step); }));
    }).then(function () {
      S.dl = null; S.offlineReady = true; store.set("offlineReady", true); refreshOff(); toast(T("offDone"));
    }).catch(function () { S.dl = null; refreshOff(); });
  }
  function refreshOff() { var r = document.getElementById("offRow"); if (r) r.outerHTML = offlineRow(); }

  /* ----- Eventos ----- */
  $app.addEventListener("click", function (e) {
    var el = e.target.closest("[data-a]");
    if (!el) return;
    var a = el.getAttribute("data-a"), v = el.getAttribute("data-v");
    switch (a) {
      case "splashGo": afterSplash(); break;
      case "flag": S.country = v; S.lang = store.get("lang") || country(v).lang; S.view = "names"; render(); break;
      case "go": S.view = v; S.pin = ""; S.pinError = false; if (v === "flags") S.lang = "es"; render(); break;
      case "person": S.personId = v; S.pin = ""; S.view = "pin"; render(); break;
      case "key": pressKey(v); break;
      case "keydel": S.pin = S.pin.slice(0, -1); render(); break;
      case "welcomeNext": S.view = store.get("seen_" + S.personId) ? "app" : wantsInstallScreen() ? "install" : "tutorial"; render(); break;
      case "instGo":
        if (isStandalone()) askNotif(afterInstall);
        else doInstall(afterInstall);
        break;
      case "instDone": closeModal(); if (canNotify() && Notification.permission === "default") askNotif(afterInstall); else afterInstall(); break;
      case "instSkip": afterInstall(); break;
      case "notif":
        if (!canNotify()) break;
        if (Notification.permission === "granted") testNotif();
        else if (Notification.permission === "denied") toast(LT("Los avisos están bloqueados: activalos en los ajustes del navegador para este sitio.", "Os avisos estão bloqueados: ative nos ajustes do navegador para este site."));
        else askNotif();
        break;
      case "waCom":
        var com = D.evento.comunicaciones, me = person();
        if (D.demo) { toast(T("demoWa")); break; }
        window.open("https://wa.me/" + digits(com.whatsapp) + "?text=" + encodeURIComponent(LT("Hola, soy " + me.nombre + " de la delegación de " + country(me.pais).nombre + ". Les comparto fotos y mi testimonio de la convención: ", "Olá, sou " + me.nombre + " da delegação do " + country(me.pais).nombre + ". Compartilho fotos e meu testemunho da convenção: ")), "_blank");
        break;
      case "tutNext":
        var tr = document.getElementById("tutTrack"), i = Math.round(tr.scrollLeft / tr.clientWidth);
        if (i >= tr.children.length - 1) endTutorial(); else tr.scrollTo({ left: (i + 1) * tr.clientWidth, behavior: "smooth" });
        break;
      case "tutEnd": endTutorial(); break;
      case "tab":
        if (v === S.tab) { var c0 = document.getElementById("content"); if (c0) c0.scrollTo({ top: 0, behavior: "smooth" }); break; }
        S.prevTab = S.tab; S.tab = v; S.place = null; S.sheetOpen = false; render(); break;
      case "goDay": S.prevTab = S.tab; S.tab = "programa"; S.day = v; render(); break;
      case "cat": S.mapCat = v; S.place = null; S.sheetOpen = true; var cs = document.querySelectorAll(".chip"); for (var k = 0; k < cs.length; k++) cs[k].classList.toggle("on", cs[k].getAttribute("data-v") === v); initMap(); break;
      case "sheet": var shEl = document.getElementById("sheet"); if (shEl && shEl._swallow) break; S.sheetOpen = !S.sheetOpen; renderSheet(); break;
      case "photo": modalPhoto(v); break;
      case "chat": openChat(); break;
      case "chatQ": chatSend(v); break;
      case "chatFeel": chatFeel(v); break;
      case "sim":
        var si = SIM.indexOf(S.fakeNow); S.fakeNow = SIM[(si + 1) % SIM.length];
        S.tab = S.tab === "perfil" ? "perfil" : "inicio"; S.day = null; render();
        toast(LT("Simulando: ", "Simulando: ") + simLabel());
        break;
      case "place": openPlace(v); break;
      case "closePlace": S.place = null; renderSheet(); break;
      case "seeMap": S.prevTab = S.tab; S.tab = "mapa"; S.mapCat = "todo"; S.place = v; S.sheetOpen = false; render(); break;
      case "dir": window.open(dirUrl(place(v)), "_blank"); break;
      case "home": var b = myBase(); S.place = null; renderSheet(); if (map) map.flyTo([b.lat, b.lng], 16, { duration: .7 }); break;
      case "locate": locate(); break;
      case "day": S.day = v; render(); break;
      case "wa": openWa(v); break;
      case "call": call(v); break;
      case "sos": location.href = "tel:" + D.evento.emergencias; break;
      case "wifi": showWifi(); break;
      case "closeModal": closeModal(); break;
      case "lang": S.lang = v; store.set("lang", v); render(); syncNotifMeta(); break;
      case "showWelcome": S.view = "welcome"; render(); break;
      case "showTut": S.view = "tutorial"; render(); break;
      case "tour": startTour(); break;
      case "offline": saveOffline(); break;
      case "install": doInstall(); break;
      case "logout":
        modal("<h3>" + LT("¿Cerrar sesión?", "Sair?") + "</h3><p>" + LT("El portal va a empezar de nuevo, como la primera vez: vas a elegir tu bandera, tu nombre y poner tu PIN.", "O portal vai recomeçar como na primeira vez: você vai escolher sua bandeira, seu nome e digitar seu PIN.") + "</p>" +
          '<div class="btn-row"><button class="btn btn-primary press" data-a="logoutYes">' + I.out + LT("Cerrar sesión", "Sair") + "</button></div>");
        break;
      case "logoutYes":
        resetAll();
        S.personId = null; S.country = null; S.lang = "es"; S.tab = "inicio"; S.fakeNow = null; S.place = null; S.day = null; S.offlineReady = false;
        render._last = null; S.view = "splash"; render();
        break;
    }
  });
  function endTutorial() { store.set("seen_" + S.personId, true); S.view = "app"; S.tab = "inicio"; render(); if (!store.get("tourDone_" + S.personId)) setTimeout(startTour, 900); }

  document.addEventListener("keydown", function (e) {
    if (S.view !== "pin") return;
    if (/^\d$/.test(e.key)) pressKey(e.key);
    else if (e.key === "Backspace") { S.pin = S.pin.slice(0, -1); render(); }
  });
  function netChange() {
    S.online = navigator.onLine;
    var n = document.getElementById("net");
    if (n) { n.className = "net " + (S.online ? "" : "off"); n.innerHTML = "<i></i>" + (S.online ? T("online") : T("offline")); }
  }
  window.addEventListener("online", netChange);
  window.addEventListener("offline", netChange);
  window.addEventListener("resize", function () { if (map) { map.invalidateSize(); positionFabs(); } });
  // Cuenta regresiva en vivo: el número que cambia hace un pequeño salto
  setInterval(function () {
    var nc = document.getElementById("nowCard");
    if (nc) { var inner = ahoraInner(); if (inner) nc.innerHTML = inner; }
    var cd = document.getElementById("countdown");
    if (!cd) return;
    var old = {};
    cd.querySelectorAll("b[data-k]").forEach(function (b) { old[b.getAttribute("data-k")] = b.textContent; });
    cd.innerHTML = countdownHTML();
    cd.querySelectorAll("b[data-k]").forEach(function (b) { if (old[b.getAttribute("data-k")] !== b.textContent) b.classList.add("tick"); });
  }, 15000);
  // Avisos mientras el portal está abierto o vuelve a primer plano
  setInterval(notifyCheck, 60000);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") notifyCheck(); });
  // Al tocar un aviso con el portal ya abierto: ir a la sección del aviso
  if ("serviceWorker" in navigator) navigator.serviceWorker.addEventListener("message", function (e) {
    var ir = e.data && e.data.ir;
    if (ir && S.view === "app" && TAB_ORDER.indexOf(ir) >= 0) { S.prevTab = S.tab; S.tab = ir; S.day = null; render(); }
  });
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); installEvt = e; if (S.view === "app" && (S.tab === "inicio" || S.tab === "perfil")) render(); });
  if ("serviceWorker" in navigator && location.protocol !== "file:") window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });

  /* ---------------- Arranque ---------------- */
  // Enlace secreto para probar como alguien nuevo: index.html#desde-cero
  // Borra lo que este teléfono recuerda (persona, idioma, bienvenidas vistas) cada vez que se abre con ese enlace.
  // También lo usa «Cerrar sesión» en Perfil. (Lo guardado para usar sin internet se conserva.)
  function resetAll() {
    try {
      Object.keys(localStorage).forEach(function (k) { if (k.indexOf("conv_") === 0) localStorage.removeItem(k); });
      Object.keys(sessionStorage).forEach(function (k) { if (k.indexOf("conv_") === 0) sessionStorage.removeItem(k); });
      if (window.caches) caches.delete("conv-meta");
    } catch (e) {}
  }
  if (/(^|[#&?])desde-cero\b/.test(location.hash + "&" + location.search.slice(1))) resetAll();

  /* La portada «Bienvenidos al Uruguay» no aparece cada vez que se abre el portal. Vuelve a aparecer:
     - la primera vez,
     - si pasaron 5 días o más desde la última vez que lo abrió,
     - una vez en los 3 días antes de la convención,
     - una vez cuando la persona ya llegó a Uruguay (desde el día de su llegada). */
  function shouldShowSplash() {
    if (session.get("splashSeen")) return false;
    var now = NOW(), last = store.get("lastOpen"), show = false;
    if (!last || now.getTime() - last >= 5 * 864e5) show = true;
    var start = dateObj(D.evento.inicio, "00:00");
    if (now < start && start - now <= 3 * 864e5 && !store.get("splashNear")) { show = true; store.set("splashNear", true); }
    var p = byId(D.personas, store.get("person"));
    if (p && p.llegada && isoDay(now) >= p.llegada.fecha && !store.get("splashArrived")) { show = true; store.set("splashArrived", true); }
    return show;
  }
  var showSplash = shouldShowSplash();
  store.set("lastOpen", NOW().getTime());

  var saved = store.get("person");
  if (saved && byId(D.personas, saved)) {
    var sp = byId(D.personas, saved);
    S.personId = saved; S.country = sp.pais; S.lang = store.get("lang") || country(sp.pais).lang;
  } else if (saved) store.del("person");
  // Al abrir el portal desde un aviso (#ir=programa): mostrar esa sección
  var irM = /[#&]ir=(\w+)/.exec(location.hash);
  if (irM && TAB_ORDER.indexOf(irM[1]) >= 0) { S.tab = irM[1]; try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
  setTimeout(notifyCheck, 2500);
  // Solo en la versión de ejemplo: abrir una pantalla directa para revisar el diseño (#s=app&p=br1&t=mapa)
  var q = D.demo && location.hash.length > 1 ? location.hash.slice(1).split("&").reduce(function (o, kv) { var x = kv.split("="); o[x[0]] = decodeURIComponent(x[1] || ""); return o; }, {}) : null;
  if (q && q.s) {
    if (q.p && byId(D.personas, q.p)) { S.personId = q.p; S.country = byId(D.personas, q.p).pais; S.lang = q.l || country(S.country).lang; }
    if (q.c) { S.country = q.c; S.lang = q.l || country(q.c).lang; }
    if (q.t) S.tab = q.t;
    if (q.d) S.day = q.d;
    if (q.pl) S.place = q.pl;
    if (q.open) S.sheetOpen = true;
    if (q.now) S.fakeNow = q.now;
    S.view = q.s; render();
    if (q.tour) setTimeout(startTour, 600);
    if (q.chat) { openChat(); if (q.ask) { chatSend(q.ask); } }
  } else if (showSplash) render(); else afterSplash();
})();
