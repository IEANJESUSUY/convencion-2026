/* =====================================================================
   DATOS DE LA CONVENCIÓN
   ---------------------------------------------------------------------
   REAL (de la línea gráfica): nombre, lema, fechas, sede, horarios de
   cultos y equipos responsables, países que vienen.
   DE EJEMPLO: nombres de personas, teléfonos, habitaciones, vuelos,
   casas de hospedaje, comedor, firma de la bienvenida.
   Mientras "demo" sea true, WhatsApp y llamar NO abren números reales.
   ===================================================================== */
window.DATA = {
  demo: true,

  evento: {
    iglesia: "Iglesia Evangélica Apostólica del Nombre de Jesús",
    nombre: "Convención Nacional Uruguay 2026",
    lema: "Transformados a su imagen",
    versiculo: "2 Corintios 3:18",
    ciudad: "Montevideo, Uruguay",
    inicio: "2026-12-05",
    fin: "2026-12-06",
    sede: "Teatro Cervantes · Hotel Esplendor",
    firma: { nombre: "Pr. Héctor Almada (ejemplo)", cargo: "Comisión organizadora" },
    portada: {
      es: "Es un placer tenerte con nosotros. Sabemos que vas a ser de mucha bendición en esta Convención y queremos que la disfrutes al máximo. Por eso preparamos este portal: todo lo de tu estadía, en tu mano.",
      pt: "É uma alegria ter você conosco. Sabemos que você será uma grande bênção nesta Convenção e queremos que aproveite ao máximo. Por isso preparamos este portal: tudo da sua estadia, na palma da mão."
    },
    bienvenida: {
      es: "Oramos por tu viaje y preparamos cada detalle con amor para que te sientas en casa. Acá tenés dónde te alojás, quién te va a buscar, los horarios de los cultos y todo lo que necesitás para disfrutar Montevideo.",
      pt: "Oramos pela sua viagem e preparamos cada detalhe com amor para que você se sinta em casa. Aqui você encontra onde vai ficar, quem vai te buscar, os horários dos cultos e tudo o que precisa para aproveitar Montevidéu."
    },
    logo: "img/logo.png",
    anterior: "Convención 2025 · «Llamados para servir»",
    emergencias: "911",
    // Al terminar la convención, el portal invita a mandar fotos y testimonios a este WhatsApp
    comunicaciones: { nombre: "Comunicaciones IEANJESÚS Uruguay", whatsapp: "+598 99 000 012" },
    // Oración y consejería: abre WhatsApp en privado con un pastor (número de ejemplo)
    consejeria: { nombre: "Oración y consejería", whatsapp: "+598 99 000 013" }
  },

  /* Foto que ve cada persona en "Tu llegada", según cómo llega. */
  llegadas: {
    avion: { foto: "img/aeropuerto.jpg", texto: "Aeropuerto Internacional de Carrasco" },
    barco: { foto: "img/buquebus.jpg", texto: "Buquebus · Puerto de Montevideo" },
    bus:   { foto: "img/montevideo.jpg", texto: "Montevideo te recibe" }
  },

  /* Fotos de la convención anterior (no fue en este hotel). */
  galeria: [
    { foto: "img/culto1.jpg", texto: "Adoración en el culto de apertura" },
    { foto: "img/culto2.jpg", texto: "Alabanza" },
    { foto: "img/predica.jpg", texto: "La Palabra" },
    { foto: "img/musica.jpg", texto: "Ministerio de música" },
    { foto: "img/familia.jpg", texto: "En familia" },
    { foto: "img/jovenes.jpg", texto: "Jóvenes en oración" },
    { foto: "img/ofrenda.jpg", texto: "Tiempo de ofrenda" },
    { foto: "img/aplauso.jpg", texto: "Hermanos de todo el país" },
    { foto: "img/oracion2.jpg", texto: "Oración" },
    { foto: "img/culto4.jpg", texto: "El salón lleno" }
  ],

  avisos: [
    { texto: "Versión de ejemplo: los nombres y teléfonos todavía no son los reales." }
  ],

  paises: [
    /* encargado = la persona que acompaña a esa delegación (aparece en el asistente de chat) */
    { id: "br", nombre: "Brasil", lang: "pt", encargado: "c10" },
    { id: "ar", nombre: "Argentina", lang: "es", encargado: "c11" },
    { id: "co", nombre: "Colombia", lang: "es", encargado: "c11" },
    { id: "ec", nombre: "Ecuador", lang: "es", encargado: "c11" },
    { id: "cl", nombre: "Chile", lang: "es", encargado: "c10" },
    { id: "us", nombre: "Estados Unidos", lang: "es", encargado: "c10" }
  ],

  alojamientos: [
    { id: "hotel", nombre: "Hotel Esplendor Cervantes", tipo: "Hotel", direccion: "Soriano 868, Centro, Montevideo",
      lat: -34.9083342, lng: -56.1975172, checkin: "15:00", checkout: "11:00", desayuno: "07:00 a 10:30",
      foto: "img/hotel.jpg", fotoPos: "50% 30%", maps: "https://maps.app.goo.gl/Ue2mnhVdcpa3Tnw56",
      nota: "Edificio de 1920 en el Barrio de las Artes. La convención es acá mismo, en el Teatro Cervantes." },
    { id: "casa1", nombre: "Casa Familia Pereira (ejemplo)", tipo: "Casa de hospedaje", direccion: "Calle de ejemplo 1234, La Blanqueada",
      lat: -34.8935, lng: -56.1585, checkin: "A coordinar", checkout: "A coordinar", desayuno: "Incluido" },
    { id: "casa2", nombre: "Casa Hogar Betania (ejemplo)", tipo: "Casa de hospedaje", direccion: "Calle de ejemplo 567, Cordón",
      lat: -34.9025, lng: -56.1795, checkin: "A coordinar", checkout: "A coordinar", desayuno: "Incluido" }
  ],

  /* Áreas reales de las comisiones; nombres y números de ejemplo. paises: [] = todos */
  contactos: [
    { id: "c1", area: "Traslado de delegaciones", nombre: "Pr. Walter Ibáñez", whatsapp: "+598 99 000 001", horario: "Todo el día", paises: [] },
    { id: "c2", area: "Hospedaje", nombre: "Pr. Julio Cardozo", whatsapp: "+598 99 000 002", horario: "8:00 a 22:00", paises: [] },
    { id: "c3", area: "Recepción", nombre: "Hna. Marta Torres", whatsapp: "+598 99 000 003", horario: "Durante los cultos", paises: [] },
    { id: "c4", area: "Chofer", nombre: "Hno. Sergio Núñez", detalle: "Van 1", whatsapp: "+598 99 000 004", horario: "Según programa", paises: ["br", "cl", "us"] },
    { id: "c5", area: "Chofer", nombre: "Hno. Marcelo Silva", detalle: "Van 2", whatsapp: "+598 99 000 005", horario: "Según programa", paises: ["ar"] },
    { id: "c6", area: "Chofer", nombre: "Hno. Javier Cabrera", detalle: "Van 3", whatsapp: "+598 99 000 006", horario: "Según programa", paises: ["co", "ec"] },
    { id: "c7", area: "Alimentación", nombre: "Hna. Rosa Fernández", whatsapp: "+598 99 000 007", horario: "7:00 a 21:00", paises: [] },
    { id: "c8", area: "Vigilancia", nombre: "Pr. Gabriel Martínez", whatsapp: "+598 99 000 008", horario: "Todo el día", paises: [] },
    { id: "c10", area: "Encargada de tu delegación", nombre: "Hna. Silvia Rodríguez", whatsapp: "+598 99 000 010", horario: "Todo el día", paises: ["br", "cl", "us"] },
    { id: "c11", area: "Encargado de tu delegación", nombre: "Pr. Óscar Viera", whatsapp: "+598 99 000 011", horario: "Todo el día", paises: ["ar", "co", "ec"] },
    { id: "c9", area: "Protocolo", nombre: "Pr. Daniel Quintana", whatsapp: "+598 99 000 009", horario: "Durante los cultos", paises: [] }
  ],

  /* Personas de EJEMPLO. pin de prueba: 1234 */
  personas: [
    { id: "br1", pais: "br", nombre: "Pr. Rafael Moreira", rango: "Pastor", whatsapp: "+55 11 90000 0001", alojamiento: "hotel", habitacion: "502", comparte: "Pr. Tiago Nunes",
      llegada: { medio: "bus", fecha: "2026-12-04", hora: "08:30", numero: "Ómnibus desde Porto Alegre (ejemplo)", punto: "Terminal Tres Cruces" }, transporte: "c1", chofer: "c4", obs: "", pin: "1234" },
    { id: "br2", pais: "br", nombre: "Pr. Tiago Nunes", rango: "Pastor", whatsapp: "+55 11 90000 0002", alojamiento: "hotel", habitacion: "502", comparte: "Pr. Rafael Moreira",
      llegada: { medio: "bus", fecha: "2026-12-04", hora: "08:30", numero: "Ómnibus desde Porto Alegre (ejemplo)", punto: "Terminal Tres Cruces" }, transporte: "c1", chofer: "c4", obs: "", pin: "1234" },
    { id: "br3", pais: "br", nombre: "Bispo Eduardo Campos", rango: "Obispo", whatsapp: "+55 21 90000 0003", alojamiento: "hotel", habitacion: "601", comparte: "Ir. Helena Campos",
      llegada: { medio: "bus", fecha: "2026-12-04", hora: "08:30", numero: "Ómnibus desde Porto Alegre (ejemplo)", punto: "Terminal Tres Cruces" }, transporte: "c1", chofer: "c4", obs: "Viaja con su esposa", pin: "1234" },
    { id: "br4", pais: "br", nombre: "Ir. Camila Rocha", rango: "Misionero", whatsapp: "+55 31 90000 0004", alojamiento: "casa2", habitacion: "Hab. 1", comparte: "—",
      llegada: { medio: "bus", fecha: "2026-12-04", hora: "08:30", numero: "Ómnibus desde Porto Alegre (ejemplo)", punto: "Terminal Tres Cruces" }, transporte: "c1", chofer: "c4", obs: "Sin gluten", pin: "1234" },

    { id: "ar1", pais: "ar", nombre: "Obispo Daniel Sosa", rango: "Obispo", whatsapp: "+54 11 0000 0001", alojamiento: "hotel", habitacion: "604", comparte: "—",
      llegada: { medio: "barco", fecha: "2026-12-04", hora: "11:30", numero: "Buquebus (ejemplo)", punto: "Puerto de Montevideo" }, transporte: "c1", chofer: "c5", obs: "", pin: "1234" },
    { id: "ar2", pais: "ar", nombre: "Pr. Martín Ferreyra", rango: "Pastor", whatsapp: "+54 11 0000 0002", alojamiento: "hotel", habitacion: "505", comparte: "Pr. Gustavo Ledesma",
      llegada: { medio: "barco", fecha: "2026-12-04", hora: "11:30", numero: "Buquebus (ejemplo)", punto: "Puerto de Montevideo" }, transporte: "c1", chofer: "c5", obs: "", pin: "1234" },
    { id: "ar3", pais: "ar", nombre: "Pr. Gustavo Ledesma", rango: "Pastor", whatsapp: "+54 351 000 0003", alojamiento: "hotel", habitacion: "505", comparte: "Pr. Martín Ferreyra",
      llegada: { medio: "barco", fecha: "2026-12-04", hora: "11:30", numero: "Buquebus (ejemplo)", punto: "Puerto de Montevideo" }, transporte: "c1", chofer: "c5", obs: "Diabético", pin: "1234" },
    { id: "ar4", pais: "ar", nombre: "Hna. Lucía Benítez", rango: "Misionero", whatsapp: "+54 341 000 0004", alojamiento: "casa1", habitacion: "Hab. 2", comparte: "—",
      llegada: { medio: "barco", fecha: "2026-12-04", hora: "11:30", numero: "Buquebus (ejemplo)", punto: "Puerto de Montevideo" }, transporte: "c1", chofer: "c5", obs: "", pin: "1234" },

    { id: "co1", pais: "co", nombre: "Pr. Andrés Restrepo", rango: "Pastor", whatsapp: "+57 300 000 0001", alojamiento: "hotel", habitacion: "507", comparte: "Hno. Camilo Ospina",
      llegada: { medio: "avion", fecha: "2026-12-04", hora: "06:55", numero: "Vuelo XX 5005", punto: "Aeropuerto de Carrasco" }, transporte: "c1", chofer: "c6", obs: "", pin: "1234" },
    { id: "co2", pais: "co", nombre: "Hno. Camilo Ospina", rango: "Hermano/a", whatsapp: "+57 300 000 0002", alojamiento: "hotel", habitacion: "507", comparte: "Pr. Andrés Restrepo",
      llegada: { medio: "avion", fecha: "2026-12-04", hora: "06:55", numero: "Vuelo XX 5005", punto: "Aeropuerto de Carrasco" }, transporte: "c1", chofer: "c6", obs: "", pin: "1234" },
    { id: "co3", pais: "co", nombre: "Hna. Paola Cárdenas", rango: "Misionero", whatsapp: "+57 300 000 0003", alojamiento: "casa2", habitacion: "Hab. 2", comparte: "Hna. Diana Mejía",
      llegada: { medio: "avion", fecha: "2026-12-04", hora: "06:55", numero: "Vuelo XX 5005", punto: "Aeropuerto de Carrasco" }, transporte: "c1", chofer: "c6", obs: "Vegetariana", pin: "1234" },
    { id: "co4", pais: "co", nombre: "Hna. Diana Mejía", rango: "Hermano/a", whatsapp: "+57 300 000 0004", alojamiento: "casa2", habitacion: "Hab. 2", comparte: "Hna. Paola Cárdenas",
      llegada: { medio: "avion", fecha: "2026-12-04", hora: "06:55", numero: "Vuelo XX 5005", punto: "Aeropuerto de Carrasco" }, transporte: "c1", chofer: "c6", obs: "", pin: "1234" },
    { id: "co5", pais: "co", nombre: "Hno. Felipe Arango", rango: "Hermano/a", whatsapp: "+57 300 000 0005", alojamiento: "casa1", habitacion: "Hab. 3", comparte: "—",
      llegada: { medio: "avion", fecha: "2026-12-04", hora: "21:10", numero: "Vuelo XX 5006", punto: "Aeropuerto de Carrasco" }, transporte: "c1", chofer: "c6", obs: "", pin: "1234" },

    { id: "ec1", pais: "ec", nombre: "Pr. Fernando Cevallos", rango: "Pastor", whatsapp: "+593 9 0000 0001", alojamiento: "hotel", habitacion: "602", comparte: "Hno. Esteban Guerrero",
      llegada: { medio: "avion", fecha: "2026-12-03", hora: "22:45", numero: "Vuelo XX 4004", punto: "Aeropuerto de Carrasco" }, transporte: "c1", chofer: "c6", obs: "Movilidad reducida: necesita ascensor", pin: "1234" },
    { id: "ec2", pais: "ec", nombre: "Hno. Esteban Guerrero", rango: "Hermano/a", whatsapp: "+593 9 0000 0002", alojamiento: "hotel", habitacion: "602", comparte: "Pr. Fernando Cevallos",
      llegada: { medio: "avion", fecha: "2026-12-03", hora: "22:45", numero: "Vuelo XX 4004", punto: "Aeropuerto de Carrasco" }, transporte: "c1", chofer: "c6", obs: "", pin: "1234" },

    { id: "cl1", pais: "cl", nombre: "Pr. Cristián Fuentes", rango: "Pastor", whatsapp: "+56 9 0000 0001", alojamiento: "hotel", habitacion: "509", comparte: "—",
      llegada: { medio: "avion", fecha: "2026-12-04", hora: "16:05", numero: "Vuelo XX 3003", punto: "Aeropuerto de Carrasco" }, transporte: "c1", chofer: "c4", obs: "", pin: "1234" },

    { id: "us1", pais: "us", nombre: "Hno. Daniel Herrera", rango: "Hermano/a", whatsapp: "+1 305 000 0001", alojamiento: "hotel", habitacion: "510", comparte: "—",
      llegada: { medio: "avion", fecha: "2026-12-04", hora: "09:20", numero: "Vuelo XX 6006", punto: "Aeropuerto de Carrasco" }, transporte: "c1", chofer: "c4", obs: "Ministra en alabanza", pin: "1234" }
  ],

  /* Cultos: horarios y equipos REALES. Comidas y traslados: de ejemplo. */
  programa: [
    { fecha: "2026-12-04", hora: "Todo el día", tipo: "traslado", titulo: "Llegada de delegaciones y traslado al alojamiento", lugar: "aeropuerto" },
    { fecha: "2026-12-04", hora: "20:00", tipo: "traslado", titulo: "Salida de las vans hacia la Iglesia Curva de Maroñas", nota: "En la puerta del hotel, calle Soriano 868. Horario a confirmar", lugar: "hotel", destino: "curva" },
    { fecha: "2026-12-04", hora: "20:30", fin: "22:00", tipo: "comida", titulo: "Cena de bienvenida", nota: "Horario a confirmar", lugar: "curva" },

    { fecha: "2026-12-05", hora: "07:00", fin: "10:30", tipo: "comida", titulo: "Desayuno en el hotel", lugar: "hotel" },
    { fecha: "2026-12-05", hora: "11:45", tipo: "traslado", titulo: "Salida de las vans hacia la Iglesia Curva de Maroñas", nota: "En la puerta del hotel, calle Soriano 868. Horario a confirmar", lugar: "hotel", destino: "curva" },
    { fecha: "2026-12-05", hora: "12:30", fin: "14:00", tipo: "comida", titulo: "Almuerzo", nota: "Horario a confirmar", lugar: "curva" },
    { fecha: "2026-12-05", hora: "16:00", tipo: "culto", titulo: "Culto de apertura", equipo: "Administración Nacional", nota: "Acto de inauguración: Congregación de Melo", lugar: "teatro", destacado: true },
    { fecha: "2026-12-05", hora: "19:00", tipo: "culto", titulo: "Segundo culto", equipo: "Comité Nacional de Jóvenes", lugar: "teatro" },
    { fecha: "2026-12-05", hora: "21:30", fin: "22:30", tipo: "comida", titulo: "Cena", nota: "Lugar y horario a confirmar", lugar: "hotel" },

    { fecha: "2026-12-06", hora: "07:00", fin: "09:30", tipo: "comida", titulo: "Desayuno en el hotel", lugar: "hotel" },
    { fecha: "2026-12-06", hora: "10:00", tipo: "culto", titulo: "Tercer culto", equipo: "Administración Nacional DED", nota: "Acto conmemorativo: Congregación Curva de Maroñas", lugar: "teatro" },
    { fecha: "2026-12-06", hora: "12:00", tipo: "traslado", titulo: "Salida de las vans hacia la Iglesia El Cerro", nota: "En la puerta del hotel, calle Soriano 868. Horario a confirmar", lugar: "hotel", destino: "cerroiglesia" },
    { fecha: "2026-12-06", hora: "12:30", fin: "13:45", tipo: "comida", titulo: "Almuerzo", nota: "Horario a confirmar", lugar: "cerroiglesia" },
    { fecha: "2026-12-06", hora: "14:30", tipo: "culto", titulo: "Cuarto culto", equipo: "Comité Nacional de Damas Dorcas", lugar: "teatro" },
    { fecha: "2026-12-06", hora: "16:00", tipo: "culto", titulo: "Culto de clausura", equipo: "Comité de Misiones", nota: "Acto de clausura: Congregación El Cerro", lugar: "teatro", destacado: true },

    { fecha: "2026-12-07", hora: "Según tu vuelo", tipo: "traslado", titulo: "Traslados al aeropuerto, puerto y terminal", lugar: "aeropuerto" }
  ],

  /* Lugares del mapa. cat: convencion | llegada | turismo | excursion | shopping | comida | salud
     t = tiempo estimado desde el hotel. enHotel = está dentro del hotel. */
  lugares: [
    { id: "teatro", cat: "convencion", nombre: "Teatro Cervantes", desc: "La sede de la convención: el antiguo Teatro Cervantes, restaurado, dentro del hotel. Entrada independiente por calle Soriano. 400 lugares.", lat: -34.9083342, lng: -56.1975172, enHotel: true, foto: "img/teatro.jpg" },

    { id: "curva", cat: "iglesia", nombre: "Iglesia Curva de Maroñas", desc: "IEANJESÚS Montevideo. Acá se sirven comidas de la convención. Calle Roma 5064, entre Belloni y Camino Maldonado.", lat: -34.854865, lng: -56.133439, t: "20 min en auto", foto: "img/curva.jpg", fotos: ["img/curva.jpg", "img/curva-grupo.jpg"] },
    { id: "cerroiglesia", cat: "iglesia", nombre: "Iglesia El Cerro", desc: "IEANJESÚS El Cerro. Acá se sirven comidas de la convención. San Fuentes y Los Helechos, Cerro.", lat: -34.875620, lng: -56.280926, t: "25 min en auto", foto: "img/cerro.jpg" },

    { id: "aeropuerto", cat: "llegada", nombre: "Aeropuerto de Carrasco", desc: "Llegada y salida de vuelos.", lat: -34.8384, lng: -56.0308, t: "35 min en auto", foto: "img/aeropuerto.jpg" },
    { id: "puerto", cat: "llegada", nombre: "Puerto · Terminal Buquebus", desc: "Barcos desde y hacia Buenos Aires.", lat: -34.9040, lng: -56.2095, t: "5 min en auto", foto: "img/buquebus.jpg" },
    { id: "trescruces", cat: "llegada", nombre: "Terminal Tres Cruces", desc: "Ómnibus nacionales e internacionales. Tiene shopping.", lat: -34.8938, lng: -56.1665, t: "10 min en auto", foto: "img/lugares/trescruces.jpg", cred: "NaBUru38 · CC BY-SA 4.0" },

    { id: "plaza", cat: "turismo", imperdible: true, nombre: "Plaza Independencia", desc: "La plaza principal, con el monumento y el Mausoleo de Artigas y el Palacio Salvo.", lat: -34.9066, lng: -56.2001, t: "5 min a pie", foto: "img/montevideo.jpg" },
    { id: "solis", cat: "turismo", imperdible: true, nombre: "Teatro Solís", desc: "El teatro más importante del Uruguay, de 1856. Tiene visitas guiadas por dentro: vale la pena.", lat: -34.9073, lng: -56.2009, t: "6 min a pie", foto: "img/lugares/solis.jpg", cred: "Felipe Restrepo Acosta · CC BY-SA 4.0" },
    { id: "ciudadvieja", cat: "turismo", imperdible: true, nombre: "Ciudad Vieja · Peatonal Sarandí", desc: "Calle peatonal con artesanías, cafés y arquitectura colonial.", lat: -34.9068, lng: -56.2035, t: "10 min a pie", foto: "img/lugares/ciudadvieja.jpg", cred: "Santiago Mazzarovich · CC BY-SA 4.0" },
    { id: "matriz", cat: "turismo", nombre: "Plaza Matriz y Catedral", desc: "El corazón de la Ciudad Vieja.", lat: -34.9067, lng: -56.2048, t: "12 min a pie", foto: "img/lugares/matriz.jpg", cred: "Derys Benitez · CC BY-SA 3.0" },
    { id: "mercado", cat: "turismo", imperdible: true, nombre: "Mercado del Puerto", desc: "Parrillas tradicionales uruguayas. Ideal para almorzar.", lat: -34.9064, lng: -56.2122, t: "20 min a pie", foto: "img/lugares/mercado.jpg", cred: "Ypsilon from Finland · CC0" },
    { id: "rambla", cat: "turismo", imperdible: true, nombre: "Rambla de Montevideo", desc: "La costanera, a dos cuadras: para caminar y ver el atardecer sobre el Río de la Plata.", lat: -34.9110, lng: -56.1975, t: "4 min a pie", foto: "img/lugares/rambla.jpg", cred: "Falk2 · CC BY-SA 3.0 DE" },
    { id: "18julio", cat: "turismo", nombre: "Avenida 18 de Julio", desc: "La avenida principal: comercios, casas de cambio y farmacias.", lat: -34.9058, lng: -56.1917, t: "8 min a pie", foto: "img/lugares/18julio.jpg", cred: "NaBUru38 · CC BY-SA 4.0" },
    { id: "mirador", cat: "turismo", nombre: "Mirador de la Intendencia", desc: "Vista de toda la ciudad desde lo alto del Palacio Municipal.", lat: -34.9055, lng: -56.1866, t: "15 min a pie", foto: "img/lugares/mirador.jpg", cred: "Intendencia de Montevideo · CC BY-SA 4.0" },
    { id: "legislativo", cat: "turismo", imperdible: true, nombre: "Palacio Legislativo", desc: "El Parlamento uruguayo, con visitas guiadas.", lat: -34.8913, lng: -56.1872, t: "10 min en auto", foto: "img/lugares/legislativo.jpg", cred: "GameOfLight · CC BY-SA 3.0" },
    { id: "rodo", cat: "turismo", nombre: "Parque Rodó y Playa Ramírez", desc: "Parque con lago y playa urbana.", lat: -34.9150, lng: -56.1670, t: "10 min en auto", foto: "img/lugares/rodo.jpg", cred: "VaneMD · CC0" },
    { id: "centenario", cat: "turismo", imperdible: true, nombre: "Estadio Centenario", desc: "Estadio del primer Mundial (1930), con museo.", lat: -34.8945, lng: -56.1528, t: "15 min en auto", foto: "img/lugares/centenario.jpg", cred: "Marcelo Campi · CC BY-SA 2.0" },
    { id: "pocitos", cat: "turismo", nombre: "Playa de Pocitos", desc: "La playa urbana más conocida de Montevideo.", lat: -34.9135, lng: -56.1440, t: "15 min en auto", foto: "img/lugares/pocitos.jpg", cred: "Elemaki · CC BY 3.0" },
    { id: "cerro", cat: "turismo", nombre: "Fortaleza del Cerro", desc: "Fortaleza histórica y mirador de la bahía.", lat: -34.8888, lng: -56.2603, t: "25 min en auto", foto: "img/lugares/cerro.jpg", cred: "Juan Garré · CC BY-SA 3.0" },

    { id: "atlantida", cat: "excursion", nombre: "Atlántida", desc: "Balneario tranquilo de la Costa de Oro.", lat: -34.7720, lng: -55.7600, t: "50 min en auto", foto: "img/lugares/atlantida.jpg", cred: "MichikoLaffitte · CC BY-SA 3.0" },
    { id: "piriapolis", cat: "excursion", nombre: "Piriápolis", desc: "Balneario con aerosilla al Cerro San Antonio.", lat: -34.8728, lng: -55.2620, t: "1 h 20 min en auto", foto: "img/lugares/piriapolis.jpg", cred: "Wikimedia Commons · CC BY 4.0" },
    { id: "casapueblo", cat: "excursion", nombre: "Casapueblo", desc: "La obra blanca de Carlos Páez Vilaró frente al mar.", lat: -34.9070, lng: -55.0435, t: "1 h 40 min en auto", foto: "img/lugares/casapueblo.jpg", cred: "Re Uruguayo · CC BY-SA 4.0" },
    { id: "punta", cat: "excursion", nombre: "Punta del Este", desc: "El balneario más conocido del Uruguay, con La Mano en la playa Brava.", lat: -34.9567, lng: -54.9387, t: "1 h 45 min en auto", foto: "img/lugares/punta.jpg", cred: "Isabeltorrado · CC BY-SA 3.0" },
    { id: "colonia", cat: "excursion", nombre: "Colonia del Sacramento", desc: "Barrio Histórico, Patrimonio de la Humanidad.", lat: -34.4717, lng: -57.8517, t: "2 h 15 min en auto", foto: "img/lugares/colonia.jpg", cred: "Banfield · CC BY-SA 3.0" },

    { id: "s_trescruces", cat: "shopping", nombre: "Tres Cruces Shopping", desc: "Junto a la terminal de ómnibus.", lat: -34.8941, lng: -56.1660, t: "10 min en auto", foto: "img/lugares/trescruces.jpg", cred: "NaBUru38 · CC BY-SA 4.0" },
    { id: "s_puntacarretas", cat: "shopping", nombre: "Punta Carretas Shopping", desc: "Shopping en una antigua cárcel restaurada.", lat: -34.9235, lng: -56.1590, t: "15 min en auto", foto: "img/lugares/s_puntacarretas.jpg", cred: "Felipe Restrepo Acosta · CC BY-SA 4.0" },
    { id: "s_montevideo", cat: "shopping", nombre: "Montevideo Shopping", desc: "El shopping más grande de la ciudad.", lat: -34.9035, lng: -56.1365, t: "20 min en auto" },
    { id: "s_nuevocentro", cat: "shopping", nombre: "Nuevocentro Shopping", desc: "Shopping moderno con patio de comidas.", lat: -34.8695, lng: -56.1685, t: "15 min en auto" },

    { id: "maciel", cat: "salud", nombre: "Hospital Maciel", desc: "Hospital público más cercano al hotel.", lat: -34.9045, lng: -56.2105, t: "6 min en auto" },
    { id: "britanico", cat: "salud", nombre: "Hospital Británico", desc: "Hospital privado.", lat: -34.8915, lng: -56.1660, t: "12 min en auto" }
  ]
};
