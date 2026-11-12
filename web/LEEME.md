# Web de delegaciones – cómo usarla

## Probarla en la computadora
En la carpeta `CONVE TURISMO`, ejecutar:

```
powershell -ExecutionPolicy Bypass -File serve.ps1
```

y abrir http://localhost:8080. En el navegador, usar la vista de celular (F12 → ícono de teléfono).
PIN de ejemplo: **1234**.

## Cargar los datos reales
Todo está en **`web/data.js`**: es lo único que hay que tocar.

| En la planilla | En `data.js` |
|---|---|
| 1. Evento | `evento` (nombre, fechas, bienvenida, firma, WiFi) |
| 2. Personas | `personas` (una línea por persona; poner un `pin` distinto a cada una) |
| 3. Alojamientos | `alojamientos` |
| 4. Contactos | `contactos` |
| 5. Programa | `programa` |
| 6. Lugares | `lugares` (la sede es `id: "teatro"`, dentro del hotel) |

Cuando estén los datos reales, cambiar `demo: true` por `demo: false` para que los botones abran WhatsApp y llamadas de verdad.
Con `demo: false` también se apagan los atajos de prueba (`#s=app&p=br1...` en la dirección).

## Fotos y tipografías
- Las fotos en `web/img/` salen de la línea gráfica de la convención (afiche, cultos anteriores, hotel y teatro).
- Tipografías: Oswald (titulares, como el afiche) y Poppins (texto), guardadas en `web/fonts/` para que funcionen sin internet.
- El mapa de calles es de Esri (sin clave). Si alguna vez falla, el portal pasa solo a OpenStreetMap.
  El portal guarda automáticamente las partes del mapa que cada persona ya miró, para verlas sin internet.

Avisos de último momento: agregar una línea en `avisos`.

## Probar como alguien nuevo (solo para vos)
Abrir el portal con `#desde-cero` al final de la dirección, por ejemplo `http://localhost:8080/#desde-cero`
(o `https://tu-sitio/#desde-cero` cuando esté publicado). Cada vez que se abre así, el teléfono olvida todo y se ve
la experiencia completa: portada, banderas, PIN, bienvenida y recorrido. Abriéndolo normal, recuerda a la persona.

Cuándo vuelve a aparecer la portada «Bienvenidos al Uruguay» para las delegaciones:
la primera vez; si pasaron 5 días o más sin entrar; una vez en los 3 días antes de la convención;
y una vez desde el día en que la persona llega. La bienvenida personal y el recorrido salen solo la primera vez.

## Paseo guiado
La primera vez que una persona entra (después de la bienvenida y las fotos), el portal se recorre solo durante
unos 55 segundos: se desenfoca todo, una flecha señala cada parte y las pestañas cambian solas. Tiene un botón
«Saltar». Se puede volver a ver desde Perfil → «Ver el paseo guiado».

## Asistente de chat y tarjeta «Ahora»
- El asistente responde con los datos de `data.js` (cultos, comidas, vans, habitación, llegada, WiFi, lugares,
  emergencias). Funciona sin internet. El botón de "hablar con una persona" usa el `encargado` de cada país en `paises`.
- La tarjeta «Ahora» de Inicio aparece sola desde el día de llegada hasta el último día del programa, y dice qué sigue
  según la hora. Para que sea precisa, conviene cargar en el programa la hora de fin (`fin`) de cada actividad.
- Para probarla antes de la convención: Perfil → «Probar: simular la hora» (solo en la versión de ejemplo).

## Publicarla
Subir la carpeta `web` completa a un hosting estático con HTTPS (por ejemplo Netlify o GitHub Pages).
HTTPS es necesario para que funcione sin internet y se pueda instalar como app.
