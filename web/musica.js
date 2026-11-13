/* Música de la convención (del documento «MÚSICA CONVENCIÓN 2026»).
   Lo usan las dos versiones del portal (delegaciones y nacional).
   Cada canción puede llevar su letra en "letra" (texto con saltos de línea \n): la carga la iglesia
   con las letras que usa en sus cultos. Si no tiene letra cargada, el portal ofrece buscarla. */
window.MUSICA = {
  repertorio: [
    { titulo: "Fiel hacia mí", autor: "Israel Houghton" },
    { titulo: "Por toda la tierra", autor: "Verbo y Vida" }
  ],
  // canciones de cada culto, en el orden del programa
  cultos: [
    { coros: [{ titulo: "El Espíritu de Dios se mueve" }, { titulo: "Es un canto de libertad" }, { titulo: "Libre tú me hiciste libre" }, { titulo: "Vamos a adorar al Rey" }, { titulo: "No son 3" }, { titulo: "No puedo parar" }, { titulo: "Alaba, alábale" }, { titulo: "Esta alabanza es" }] },
    { coros: [{ titulo: "Cuando el pueblo del Señor alaba a Dios" }, { titulo: "Ven, ven, ven Espíritu divino" }, { titulo: "Aquí se siente" }, { titulo: "Elías oraba" }, { titulo: "Bendíceme, bendíceme" }, { titulo: "Si tuvieras fe" }, { titulo: "En el Salmo 22" }, { titulo: "Bajo la sombra de Pedro" }] },
    { coros: [{ titulo: "Majestuoso, victorioso" }, { titulo: "Nombre sobre todo nombre" }] },
    { coros: [] },
    { coros: [] }
  ],
  avivamiento: [
    { nombre: "Preludios", coros: [{ titulo: "Alaba a Dios, mi corazón" }, { titulo: "Que se llene tu casa" }, { titulo: "Santidad hay en tu casa, Señor" }, { titulo: "Dios poderoso" }, { titulo: "Mi Dios es grande" }, { titulo: "Derrama de tu fuego" }, { titulo: "Transformados a su imagen" }] },
    { nombre: "Popurrí", coros: [{ titulo: "Dios está aquí" }, { titulo: "Estamos de fiesta con Jesús" }] },
    { nombre: "Popurrí", coros: [{ titulo: "Celebremos y adoremos" }, { titulo: "Dios subió a su trono" }] },
    { nombre: "Popurrí", coros: [{ titulo: "El Señor es mi Rey, mi todo" }, { titulo: "El Señor está en este lugar" }, { titulo: "Cuando el Señor hiciere volver" }] },
    { nombre: "Popurrí", coros: [{ titulo: "Hay victoria" }, { titulo: "Clamando estoy" }, { titulo: "Vamos escalando peldaños" }] },
    { nombre: "Popurrí", coros: [{ titulo: "El victorioso vive en mí" }, { titulo: "Me gozaré en tu presencia, Jehová" }] },
    { nombre: "Popurrí", coros: [{ titulo: "Celebra victorioso" }, { titulo: "Dios es Espíritu" }, { titulo: "El León de Judá" }] },
    { nombre: "Popurrí", coros: [{ titulo: "Grande y fuerte es nuestro Dios" }, { titulo: "Hosanna" }, { titulo: "Hay un lugar" }] },
    { nombre: "Otros", coros: [{ titulo: "Hay muchas formas de alabar su nombre" }, { titulo: "Hay libertad en la casa de Dios" }, { titulo: "Eres todopoderoso" }, { titulo: "La fortaleza de mi vida" }, { titulo: "Los muros caerán" }] }
  ],
  adoracion: [{ titulo: "Lo harás otra vez" }, { titulo: "Amado de mi alma" }, { titulo: "Como dijiste" }, { titulo: "Al final" }, { titulo: "Al entrar en la presencia" }, { titulo: "Tú eres mi razón de ser" }, { titulo: "En totalidad a ti" }, { titulo: "Cristo, yo te amo" }, { titulo: "No hay lugar más alto" }, { titulo: "Milagroso" }, { titulo: "Hermoso nombre" }, { titulo: "No hay otro nombre igual" }, { titulo: "Como Zaqueo" }, { titulo: "Por un momento en tu presencia" }]
};
