/* =====================================================================
   DATOS · VERSIÓN NACIONAL (un perfil por iglesia, sin clave)
   ---------------------------------------------------------------------
   REAL: nombre, lema, fechas, sede, horarios de cultos, iglesias,
   pastores, direcciones (6 exactas, 4 aproximadas), comisiones.
   DE EJEMPLO: teléfonos y encargados de la convención.
   Mientras "demo" sea true, WhatsApp y llamar NO abren números reales.
   Las fotos de la sede y de la convención anterior se toman de ../img.
   ===================================================================== */
window.DATA = {
  demo: true,
  nacional: true,

  evento: {
    iglesia: "Iglesia Evangélica Apostólica del Nombre de Jesús",
    nombre: "Convención Nacional Uruguay 2026",
    lema: "Transformados a su imagen",
    versiculo: "2 Corintios 3:18",
    ciudad: "Montevideo, Uruguay",
    inicio: "2026-12-05",
    fin: "2026-12-06",
    sede: "Teatro Cervantes · Hotel Esplendor",
    direccionSede: "Soriano 868, Centro, Montevideo",
    firma: { nombre: "Comisión de la Convención Nacional", cargo: "IEANJESÚS Uruguay" },
    bienvenida: "Oramos por cada iglesia y preparamos esta convención con mucho amor. Acá tienen el programa de los cultos, cómo llegar al Teatro Cervantes, los contactos y todo lo necesario para vivir estos dos días juntos.",
    logo: "../img/logo.png",
    anterior: "Convención 2025 · «Llamados para servir»",
    emergencias: "911",
    fotosAntes: true, // el día antes, el portal pide fotos de los preparativos
    comunicaciones: { nombre: "Comunicaciones IEANJESÚS Uruguay", whatsapp: "+598 99 000 100" },
    consejeria: { nombre: "Oración y consejería", whatsapp: "+598 99 000 102" }
  },

  galeria: [
    { foto: "../img/culto1.jpg", texto: "Adoración en el culto de apertura" },
    { foto: "../img/culto2.jpg", texto: "Alabanza" },
    { foto: "../img/predica.jpg", texto: "La Palabra" },
    { foto: "../img/musica.jpg", texto: "Ministerio de música" },
    { foto: "../img/familia.jpg", texto: "En familia" },
    { foto: "../img/jovenes.jpg", texto: "Jóvenes en oración" },
    { foto: "../img/ofrenda.jpg", texto: "Tiempo de ofrenda" },
    { foto: "../img/aplauso.jpg", texto: "Hermanos de todo el país" },
    { foto: "../img/oracion2.jpg", texto: "Oración" },
    { foto: "../img/culto4.jpg", texto: "El salón lleno" }
  ],

  avisos: [
    { texto: "Versión de ejemplo: los teléfonos y los encargados todavía no son los reales." }
  ],

  /* Encargado de la comisión de la convención a nivel nacional (de ejemplo) */
  nacionalContacto: { id: "nac", area: "Comisión de la Convención · Nacional", nombre: "Pr. Ricardo Méndez", whatsapp: "+598 99 000 101", horario: "Todo el día" },

  /* Una tarjeta por iglesia. exacta: false = el mapa marca la ciudad o el barrio, no el templo.
     encargado = la persona de esa iglesia a cargo de la convención (de ejemplo). */
  iglesias: [
    { id: "maldonado", nombre: "Maldonado", saludo: "Hermanos de Maldonado", depto: "Maldonado",
      pastor: "Pr. Franklin Salas", pastorTel: "+598 99 000 111", encargado: "Hna. Lucía Pereira", encargadoTel: "+598 99 000 112",
      direccion: "Av. Wilson Ferreira Aldunate y 25 de Agosto, Maldonado", lat: -34.8954677, lng: -54.9595889, exacta: true,
      horarios: ["Jueves 19:30 · reunión general", "Domingo 10:00 · evangelismo en la feria", "Domingo 18:30 · celebración dominical"],
      web: "https://ieanjesusmaldonado.org", facebook: "https://www.facebook.com/profile.php?id=100066598476732",
      foto: "img/iglesias/maldonado.jpg", fotoPos: "50% 45%" },
    { id: "melo", nombre: "Melo", saludo: "Hermanos de Melo", depto: "Cerro Largo",
      pastor: "Pr. Santiago Pérez", pastorTel: "+598 99 000 121", encargado: "Hno. Martín Silva", encargadoTel: "+598 99 000 122",
      direccion: "Ruta 26 Nº 1223, Barrio Murgia, Melo", lat: -32.3767014, lng: -54.158278, exacta: true,
      horarios: ["Martes 19:00", "Domingo 18:00"],
      facebook: "https://www.facebook.com/profile.php?id=100086098477357",
      foto: "img/iglesias/melo.jpg", fotoPos: "50% 55%" },
    { id: "acegua", nombre: "Aceguá", saludo: "Hermanos de Aceguá", depto: "Cerro Largo",
      pastor: "Pr. Santiago Pérez", pastorTel: "+598 99 000 121", encargado: "Hna. Rosa Machado", encargadoTel: "+598 99 000 132",
      direccion: "Aceguá, Cerro Largo", lat: -31.87, lng: -54.162, exacta: false,
      facebook: "https://www.facebook.com/iansjesus.acegua",
      foto: "img/iglesias/acegua.jpg", fotoPos: "50% 72%" },
    { id: "treintaytres", nombre: "Treinta y Tres", saludo: "Hermanos de Treinta y Tres", depto: "Treinta y Tres",
      pastor: "Pr. Santiago Pérez", pastorTel: "+598 99 000 121", encargado: "Hno. Diego Olivera", encargadoTel: "+598 99 000 142",
      direccion: "Diego Lamas y Areguatí, Treinta y Tres", lat: -33.2249465, lng: -54.3822522, exacta: true,
      horarios: ["Sábado 16:00 · actividades especiales"],
      web: "https://sites.google.com/view/iean-jesus-treinta-y-tres/inicio", facebook: "https://www.facebook.com/profile.php?id=100069780722086",
      foto: "img/iglesias/treinta-y-tres.jpg", fotoPos: "50% 40%" },
    { id: "tacuarembo", nombre: "Tacuarembó", saludo: "Hermanos de Tacuarembó", depto: "Tacuarembó",
      pastor: "Pr. Héctor Rúa", pastorTel: "+598 99 000 151", encargado: "Hna. Carmen Núñez", encargadoTel: "+598 99 000 152",
      direccion: "Joaquín Correa 176, Tacuarembó", lat: -31.7226756, lng: -55.991354, exacta: true,
      horarios: ["Jueves 17:00", "Domingo 18:00"],
      facebook: "https://www.facebook.com/ieanjesus.tacuarembo",
      foto: "img/iglesias/tacuarembo.jpg", fotoPos: "50% 70%" },
    { id: "artigas", nombre: "Artigas", saludo: "Hermanos de Artigas", depto: "Artigas",
      pastor: "Pr. Antonio Farro", pastorTel: "+598 99 000 161", encargado: "Hno. Pablo Acosta", encargadoTel: "+598 99 000 162",
      direccion: "Aparicio Saravia y Zunín Padilla, Artigas", lat: -30.3982248, lng: -56.4598935, exacta: true,
      facebook: "https://www.facebook.com/ieanjesus.artigas.uruguay",
      foto: "img/iglesias/artigas.jpg", fotoPos: "50% 60%" },
    { id: "salto", nombre: "Salto", saludo: "Hermanos de Salto", depto: "Salto",
      pastor: "Pr. Josué Rivera", pastorTel: "+598 99 000 171", encargado: "Hna. Andrea Suárez", encargadoTel: "+598 99 000 172",
      direccion: "Salto", lat: -31.3833, lng: -57.9667, exacta: false,
      facebook: "https://www.facebook.com/profile.php?id=100016911125717",
      foto: "img/iglesias/salto.jpg", fotoPos: "50% 88%" },
    { id: "curva", nombre: "Curva de Maroñas", saludo: "Hermanos de Curva de Maroñas", depto: "Montevideo",
      pastor: "Pr. Jorge Cevallos", pastorTel: "+598 99 000 181", encargado: "Hno. Gustavo Ferreira", encargadoTel: "+598 99 000 182",
      direccion: "Roma 5064, entre Av. Belloni y Camino Maldonado, Montevideo", lat: -34.854865, lng: -56.133439, exacta: true,
      facebook: "https://www.facebook.com/profile.php?id=100064568956981",
      foto: "img/iglesias/curva.jpg", fotoPos: "50% 55%" },
    { id: "elcerro", nombre: "El Cerro", saludo: "Hermanos de El Cerro", depto: "Montevideo",
      pastor: "Pr. Abel González", pastorTel: "+598 99 000 191", encargado: "Hna. Patricia Rodríguez", encargadoTel: "+598 99 000 192",
      direccion: "Barrio Cerro, Montevideo", lat: -34.8862, lng: -56.2567, exacta: false,
      facebook: "https://www.facebook.com/profile.php?id=100092995239132",
      foto: "img/iglesias/el-cerro.jpg", fotoPos: "50% 50%" },
    { id: "lapaz", nombre: "La Paz", saludo: "Hermanos de La Paz", depto: "Canelones", nueva: true,
      pastor: "Pr. William Jiménez", pastorTel: "+598 99 000 201", encargado: "Hno. Javier Cabrera", encargadoTel: "+598 99 000 202",
      direccion: "La Paz, Canelones", lat: -34.7606, lng: -56.2253, exacta: false,
      facebook: "https://www.facebook.com/profile.php?id=61595336649599",
      foto: "img/iglesias/la-paz.jpg", fotoPos: "50% 78%" }
  ],

  comisiones: [],
  /* Solo los cultos (comision = quién lo dirige) */
  programa: [
    { fecha: "2026-12-05", hora: "16:00", tipo: "culto", titulo: "Culto de apertura", equipo: "Administración Nacional", comision: "junta", nota: "Acto de inauguración: Congregación de Melo", lugar: "teatro", destacado: true },
    { fecha: "2026-12-05", hora: "19:00", tipo: "culto", titulo: "Segundo culto", equipo: "Comité Nacional de Jóvenes", comision: "jovenes", lugar: "teatro" },
    { fecha: "2026-12-06", hora: "10:00", tipo: "culto", titulo: "Tercer culto", equipo: "Administración Nacional DED", comision: "escuela", nota: "Acto conmemorativo: Congregación Curva de Maroñas", lugar: "teatro" },
    { fecha: "2026-12-06", hora: "14:30", tipo: "culto", titulo: "Cuarto culto", equipo: "Comité Nacional de Damas Dorcas", comision: "dorcas", lugar: "teatro" },
    { fecha: "2026-12-06", hora: "16:00", tipo: "culto", titulo: "Culto de clausura", equipo: "Comité de Misiones", comision: "misiones", nota: "Acto de clausura: Congregación El Cerro", lugar: "teatro", destacado: true }
  ],

  /* La sede funciona como "base" del mapa */
  alojamientos: [
    { id: "hotel", nombre: "Teatro Cervantes · Hotel Esplendor", direccion: "Soriano 868, Centro, Montevideo", lat: -34.9083342, lng: -56.1975172, foto: "../img/teatro.jpg" }
  ],

  lugares: [
    { id: "teatro", cat: "convencion", nombre: "Teatro Cervantes", desc: "La sede de la convención: el antiguo Teatro Cervantes, restaurado, dentro del Hotel Esplendor. Entrada por calle Soriano 868.", lat: -34.9083342, lng: -56.1975172, enHotel: true, foto: "../img/teatro.jpg" },

    { id: "trescruces", cat: "viaje", nombre: "Terminal Tres Cruces", desc: "Llegan los ómnibus del interior. Desde acá, unos 10 minutos en taxi o en ómnibus por 18 de Julio hasta el teatro.", lat: -34.8938, lng: -56.1665, t: "10 min en auto", foto: "../img/lugares/trescruces.jpg", cred: "NaBUru38 · CC BY-SA 4.0" },

    { id: "c_18julio", cat: "comida", nombre: "Avenida 18 de Julio", desc: "Sector con muchos lugares para comer al paso: pizzerías, chivitos, cafés y panaderías, a pocas cuadras del teatro.", lat: -34.9058, lng: -56.1917, t: "8 min a pie", foto: "../img/lugares/18julio.jpg", cred: "NaBUru38 · CC BY-SA 4.0" },
    { id: "c_mam", cat: "comida", nombre: "Mercado Agrícola (MAM)", desc: "Mercado histórico con puestos de comida, frutas y almacenes. Ideal para almorzar en familia.", lat: -34.8889, lng: -56.1839, t: "10 min en auto", foto: "../img/lugares/mam.jpg", cred: "Shirley Olivera · CC BY-SA 3.0" },
    { id: "c_trescruces", cat: "comida", nombre: "Patio de comidas Tres Cruces", desc: "Muchas opciones juntas en el shopping de la terminal de ómnibus.", lat: -34.8941, lng: -56.1660, t: "10 min en auto", foto: "../img/lugares/trescruces.jpg", cred: "NaBUru38 · CC BY-SA 4.0" },
    { id: "c_puntacarretas", cat: "comida", nombre: "Patio de comidas Punta Carretas", desc: "Patio de comidas del shopping, cerca de la rambla.", lat: -34.9235, lng: -56.1590, t: "15 min en auto", foto: "../img/lugares/s_puntacarretas.jpg", cred: "Felipe Restrepo Acosta · CC BY-SA 4.0" },

    { id: "plaza", cat: "turismo", imperdible: true, nombre: "Plaza Independencia", desc: "La plaza principal, con el monumento y el Mausoleo de Artigas y el Palacio Salvo.", lat: -34.9066, lng: -56.2001, t: "5 min a pie", foto: "../img/montevideo.jpg" },
    { id: "solis", cat: "turismo", imperdible: true, nombre: "Teatro Solís", desc: "El teatro más importante del Uruguay, de 1856. Tiene visitas guiadas por dentro: vale la pena.", lat: -34.9073, lng: -56.2009, t: "6 min a pie", foto: "../img/lugares/solis.jpg", cred: "Felipe Restrepo Acosta · CC BY-SA 4.0" },
    { id: "mercado", cat: "turismo", imperdible: true, nombre: "Mercado del Puerto", desc: "El mercado de 1868 con las parrillas tradicionales uruguayas.", lat: -34.9064, lng: -56.2122, t: "20 min a pie", foto: "../img/lugares/mercado.jpg", cred: "Ypsilon from Finland · CC0" },
    { id: "centenario", cat: "turismo", imperdible: true, nombre: "Estadio Centenario", desc: "Estadio del primer Mundial (1930), con el Museo del Fútbol.", lat: -34.8945, lng: -56.1528, t: "15 min en auto", foto: "../img/lugares/centenario.jpg", cred: "Marcelo Campi · CC BY-SA 2.0" },
    { id: "ciudadvieja", cat: "turismo", imperdible: true, nombre: "Ciudad Vieja", desc: "Calle peatonal con artesanías, cafés y arquitectura colonial.", lat: -34.9068, lng: -56.2035, t: "10 min a pie", foto: "../img/lugares/ciudadvieja.jpg", cred: "Santiago Mazzarovich · CC BY-SA 4.0" },
    { id: "matriz", cat: "turismo", nombre: "Plaza Matriz y Catedral", desc: "El corazón de la Ciudad Vieja.", lat: -34.9067, lng: -56.2048, t: "12 min a pie", foto: "../img/lugares/matriz.jpg", cred: "Derys Benitez · CC BY-SA 3.0" },
    { id: "rambla", cat: "turismo", imperdible: true, nombre: "Rambla de Montevideo", desc: "La costanera, a dos cuadras: para caminar y ver el atardecer.", lat: -34.9110, lng: -56.1975, t: "4 min a pie", foto: "../img/lugares/rambla.jpg", cred: "Falk2 · CC BY-SA 3.0 DE" },
    { id: "mirador", cat: "turismo", nombre: "Mirador de la Intendencia", desc: "Vista de toda la ciudad desde lo alto del Palacio Municipal.", lat: -34.9055, lng: -56.1866, t: "15 min a pie", foto: "../img/lugares/mirador.jpg", cred: "Intendencia de Montevideo · CC BY-SA 4.0" },
    { id: "legislativo", cat: "turismo", imperdible: true, nombre: "Palacio Legislativo", desc: "El Parlamento uruguayo, con visitas guiadas.", lat: -34.8913, lng: -56.1872, t: "10 min en auto", foto: "../img/lugares/legislativo.jpg", cred: "GameOfLight · CC BY-SA 3.0" },
    { id: "rodo", cat: "turismo", nombre: "Parque Rodó y Playa Ramírez", desc: "Parque con lago y playa urbana.", lat: -34.9150, lng: -56.1670, t: "10 min en auto", foto: "../img/lugares/rodo.jpg", cred: "VaneMD · CC0" },
    { id: "pocitos", cat: "turismo", nombre: "Playa de Pocitos", desc: "La playa urbana más conocida de Montevideo.", lat: -34.9135, lng: -56.1440, t: "15 min en auto", foto: "../img/lugares/pocitos.jpg", cred: "Elemaki · CC BY 3.0" },

    { id: "s_trescruces", cat: "shopping", nombre: "Tres Cruces Shopping", desc: "Junto a la terminal de ómnibus.", lat: -34.8941, lng: -56.1660, t: "10 min en auto", foto: "../img/lugares/trescruces.jpg", cred: "NaBUru38 · CC BY-SA 4.0" },
    { id: "s_puntacarretas", cat: "shopping", nombre: "Punta Carretas Shopping", desc: "Shopping en una antigua cárcel restaurada.", lat: -34.9235, lng: -56.1590, t: "15 min en auto", foto: "../img/lugares/s_puntacarretas.jpg", cred: "Felipe Restrepo Acosta · CC BY-SA 4.0" },

    { id: "maciel", cat: "salud", nombre: "Hospital Maciel", desc: "Hospital público más cercano al teatro.", lat: -34.9045, lng: -56.2105, t: "6 min en auto" },
    { id: "britanico", cat: "salud", nombre: "Hospital Británico", desc: "Hospital privado.", lat: -34.8915, lng: -56.1660, t: "12 min en auto" }
  ]
};
