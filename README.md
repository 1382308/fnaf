# La Noche de los Triángulos Congruentes (FNAF × geometría)

Actividad interactiva de ~40 min: 7 noches, 37 pistas, todas sobre los criterios de congruencia de triángulos
(**LLL, LAL, ALA, AAL y HC**): se muestran dos triángulos con marcas y hay que decir qué criterio aplica. Sin dependencias ni internet (fuentes y audio incluidos / sintetizados).

## Cómo correrla

**Requiere Node.js** (https://nodejs.org). Doble clic en `iniciar.command` (macOS) o `./iniciar.command` (Linux): levanta `server.js`, abre el **dashboard del profesor**
y muestra la dirección para que los equipos entren desde sus compus (misma red Wi-Fi). `Ctrl + C` lo detiene. Si macOS dice que no se puede abrir: clic derecho → Abrir, o `chmod +x iniciar.command`.
A mano: `PORT=5000 node server.js`. Si el 5000 está ocupado (en macOS lo usa AirPlay) el lanzador busca otro puerto libre.

**Los alumnos solo pueden jugar si el profesor los acepta en el dashboard** (`http://localhost:5000/dashboard.html`, solo desde la computadora del profesor; desde la red devuelve 403):

1. Los equipos entran, escriben el nombre y esperan.
2. En **Solicitudes** el profesor revisa los nombres y pulsa **ACEPTAR** o **RECHAZAR** (el equipo rechazado vuelve al título y elige otro nombre).
3. Con todos aceptados, **▶ INICIAR**: en cada equipo y en el panel hay una **cuenta regresiva de 5 segundos** y arranca el juego.
4. El panel es una **escena 3D de FNAF (Three.js, incluido en `public/vendor/`, sin internet)**: el salón de Freddy Fazbear's Pizza visto por la cámara de seguridad (REC, hora, estática). Cada equipo es un animatrónico (Freddy, Bonnie, Chica o Foxy) que corre hacia la puerta de las **6 AM**; el reloj rojo sube de 12 AM a 6 AM con el avance de la clase y las luces parpadean al pasar de noche. Hay marcador en vivo, chispas de fiesta por cada avance, banners y confeti al terminar. **No muestra el número de pistas**: solo porcentaje y noche, con una curva que hace que el arranque se vea grande (25 % real → 37 % mostrado). Un aviso discreto «¿AYUDA?» marca a quien lleva 3 min sin avanzar. En el botón **PANEL** están las solicitudes, **SACAR** y los rechazados.

5. **Eventos (el animatrónico se acerca):** cuando el líder cruza el 12 / 30 / 50 / 70 % (o con el botón **⚡ EVENTO**), un animatrónico se acerca: en la pantalla de cada equipo aparece su cara creciendo a pantalla completa con la figura de un par de triángulos y **5 segundos** para elegir el criterio (botones o teclas 1–5). En el dashboard la **cámara es el animatrónico** y avanza hacia los equipos; una barra se llena con el % de equipos que ya contestaron (en el dashboard y en cada equipo). Al terminar se muestran los **nombres de quienes fallaron o no contestaron**: esos equipos sufren el susto (energía al 60 % y suma un susto) y en el dashboard se desploman. **Nadie puede terminar sin haber vivido al menos 3 eventos** (si un equipo está por terminar y faltan, el servidor fuerza los que falten; el equipo espera en «ALGO SE ACERCA…»). Solo participan los equipos aceptados, en línea y que no hayan terminado.

**Si un equipo cierra o recarga el navegador**, al volver entra solo a la sala y **reanuda su partida** (noche, pistas resueltas, energía y errores; la posición y el enemigo no se guardan).
Todo se borra únicamente cuando se apaga el servidor (la sala vive en memoria y cada encendido es una sesión nueva).
Sin el servidor (`server.js`) el juego no se puede jugar. Prueba automática: `PW_DIR=… node tools/prueba-lobby.js`.

## Las noches

| Noche | Escena | Tema | Peligro |
|---|---|---|---|
| 1 | **Exploración:** pasillo con 6 cuartos (seguridad, fiestas, gerente, cocina, almacén, juegos) | los **5 criterios**, uno por tarea | Freddy |
| 2 | **Exploración:** escenario grande, comedor, cabinas de luces y control, pasillo de servicio, bodega y camerino | **LLL** y **LAL** (lados) | Bonnie |
| 3 | **Exploración:** barco pirata varado con puente de mando, cubierta, la cala de Foxy, camarote, bodega y calabozo | **ALA** y **AAL** (ángulos) | Foxy |
| 4 | **Exploración:** cocina industrial a oscuras (solo audio, con lámpara) con horno de pizza, cámara fría, despensa, lavado, pasillo de servicio, comedor trasero y vestidor | **HC** (triángulos rectángulos) | Chica |
| 5 | **Exploración:** pasillo oeste en forma de C con almacén, baños, cuarto de limpieza, sala de máquinas, objetos perdidos y sala de guardia (focos que parpadean) | figuras **con medidas** (cm y °) | Bonnie |
| 6 | **Exploración:** trastienda con pasillo de servicio, sala de cabezas (que te siguen con la mirada), almacén de partes, vestidor de trajes, taller y oficina de servicio | **todos** los criterios, con rayitas y con medidas | Freddy |
| 7 | **Exploración:** la oficina de la Noche 1, rota y a oscuras: pasillos oeste, sur y este en anillo, oficina, cuarto de Golden, ventilación y sala de peluches (luz roja de emergencia) | reto final: varios pares por tarea | Golden Freddy (aparece y desaparece) |

Las **noches 1 a 7** se juegan caminando (vista desde arriba).

### Controles de la Noche 1

| Tecla | Acción |
|---|---|
| **W A S D** (o flechas) | moverte |
| **F** | prender / apagar la lámpara (también el botón de abajo a la derecha) |
| **Q** | destello: si el animatrónico está cerca y le apuntas, retrocede unos segundos (gasta batería, recarga corta) |
| **Mouse** | apuntar la lámpara (si no lo mueves, apunta hacia donde caminas) |
| **E** (o Espacio / clic) | interactuar con el objeto que tienes cerca |
| **M** | manual |

Hay lista de **tareas** (arriba a la izquierda) y minimapa. Cada tarea resuelta da un **objeto** (bandeja «OBJETOS») que otra tarea necesita; el orden no se indica. Está pensada para teclado y trackpad (Chromebook).
No se ve a través de las paredes: hay que entrar a cada cuarto. Con 2 errores Freddy aparece en la oscuridad y
camina hacia ti; **el cono de la lámpara lo detiene** y lo hace retroceder, pero si te alcanza hay susto.

Cada error gasta 15 % de energía y el animatrónico se acerca; con 0 % hay susto y la energía vuelve a 60 %
(nunca se bloquea). Tras 3 errores en una pregunta aparece **VER SOLUCIÓN**. Al final cada jugador ve un
"cheque" con nombre, tiempo, errores y estrellas (para tomarle captura).

## Sesión y datos (importante)

- Cada vez que se enciende `./iniciar.command` se crea una **sesión nueva**; al apagarlo (Ctrl + C o cerrar la ventana) se cierra.
  Al abrir el juego, cada navegador compara su sesión: si cambió, **borra nombre, avance y estrellas** y se empieza en la Noche 1.
  Una pestaña que quedó abierta de la sesión anterior también se reinicia sola (se revisa al volver a ella y cada 15 s).
- El avance dentro de una sesión se guarda por navegador (botón CONTINUAR, p. ej. si se recarga la página).
- **Usa siempre `iniciar.command`.** Si alguien arranca el emulador a mano (`firebase emulators:start`) no hay sesión y el juego **no guarda nada**.
- El atajo `?n=3` (saltar de noche) y las herramientas de prueba **solo funcionan** con `./iniciar.command --pruebas`.
- Límite honesto: es un juego 100 % en el navegador; quien abra las herramientas de desarrollo podría manipular su propio avance.
  En Chromebooks administradas se bloquea con la política `DeveloperToolsAvailability = 2`.

## Atajos de uso

- `M` abre el manual · `Esc` cierra.
- Con `--pruebas`: `?n=1` entra directo a la noche 1 · `?n=3&fast` salta a la noche 3 sin cinemáticas.

## Pruebas automáticas

`node tools/prueba-noche.js 1` (o `all`) prueba noches completas: tareas alcanzables, enemigo, rendimiento y fin de noche
(requiere Playwright; ver el encabezado del archivo). El plan de conversión de las noches está en `PLAN_NOCHES.md`.

## Formas de responder

Cada pregunta se responde eligiendo un criterio (botones LLL, LAL, ALA, AAL, HC). Un spot de `levels.js` puede llevar `input: 'dial'`, `'cards'`, `'catch'`, `'padK'`, `'slots'`, `'pipes'` o `'levers'` (fuera de `q`) para usar otro widget de
`public/js/inputs.js` / `inputs2.js` (también `'overlay'`, `'detective'`, `'odd'`); ese cuadro se responde **solo** con el widget (sin campo de texto ni cambio de modo).
El contrato (`ctx`, `decoys`, `_solve`) está documentado al inicio de `inputs.js`; el plan completo en `PLAN_RESPUESTAS.md`.

- **`dial` (candado/ruleta)**: un rodillo que recorre los 5 criterios. `↑`/`↓` o rueda del trackpad lo cambian, `Enter` o `ABRIR` confirma. En `multi` hay un candado por par.
- **`cards` (cartas que se revuelven)**: se ven 3 o 4 cartas con sus valores (más cartas y más barajadas según avanza la noche); calcula, recuerda dónde está tu resultado y pulsa `BARAJAR` (`Enter`/`Espacio`). Las cartas se voltean y se mezclan; elige una con clic o con `←`/`→` + `Enter`/`Espacio`. Si fallas se muestran de nuevo y hay que volver a barajar (el error cuesta energía como siempre). Sirve para `number`, `multi` (una ronda por campo) y `choice`.
- **`catch` (atrapar al vuelo)**: los candidatos pasan en cinta de derecha a izquierda, en bucle y a velocidad moderada (sin límite de tiempo). La red sigue al cursor del trackpad o se mueve con `←`/`→`; clic o `Espacio` atrapa lo que esté bajo la red. Atrapar uno equivale a un intento: si es el equivocado cuesta energía y ese candidato se apaga; una red vacía no cuesta nada. Se pausa con el manual abierto. Sirve para `number` (con señuelos) y `choice`.
- **`padK` (teclado temático)**: una tecla por criterio con aspecto de receta de cocina (Noche 4) o caja registradora; flechas para moverse, `Backspace` borra y `Enter` confirma. Sirve para `number` y `multi` (un teclado por par).
- **`slots` (soltar en la ranura)**: fichas con valores (los correctos y señuelos típicos) y ranuras con etiqueta (`−b + √D`, `−b − √D`…; en `number`, una sola ranura con el nombre del resultado). Clic en una ficha y clic en una ranura (en cualquier orden), o Tab/`←`/`→` para moverse, `↑`/`↓` para pasar de fichas a ranuras y `Enter`/`Espacio` para tomar y soltar. Cada soltada se comprueba sola: la buena se queda en la ranura; la mala vuelve a la bandeja y cuesta energía como siempre. Fichas de comanda en la cocina (Noche 4) y placas de taller en la trastienda (Noche 6). Sirve para `number` y `multi` (una sola vez, con todas las ranuras).
- **`pipes` (tubería)**: cuadrícula de tubos (rectos y codos; algunas casillas bloqueadas) con la fuente a la izquierda y una salida con valor por fila a la derecha (el resultado correcto y señuelos típicos). Gira un tubo con clic, `Espacio` o `Enter` (las flechas mueven el foco); el agua sale de la fuente y sigue el tubo. Cuando llegue a la salida con tu resultado pulsa `ABRIR VÁLVULA` (`ENCENDER` en los ductos; con las flechas, `↓` desde la última fila llega al botón). Sin agua en ninguna salida no cuesta nada; abrir hacia una salida equivocada cuesta energía como siempre y la presión desordena el tramo mojado. Cada salida tiene **un solo camino posible** (se sortea la distribución hasta lograrlo) y al empezar todas están a 3 giros o más. Tuberías de la sala de máquinas en la Noche 5 y ductos de ventilación en la 7. Sirve para `number` y `multi` (un tablero pequeño por campo).
- **`levers` (palancas)**: una fila de 3 o 4 palancas, cada una con un valor (el resultado y señuelos típicos; en `choice`, las opciones). Baja la del resultado con clic, o `←`/`→` y `Espacio`/`Enter`. Una palanca equivocada cuesta energía como siempre y se queda abajo (no se puede volver a usar). Interruptores amarillos en la Noche 5, palancas de taller en la 6 y de emergencia en la 7. Sirve para `number` y `choice`.
- **`overlay` (superponer)**: arrastra el triángulo de la derecha sobre el de la izquierda (mouse/trackpad, o flechas), gíralo con ⟲ ⟳ (o `Q`/`E`) y voltéalo con ⇋ (o `F`); al encajar aparecen los 5 criterios para elegir.
- **`detective` (marcas)**: se pide un criterio y hay que tocar las partes (lados y ángulos) que lo prueban; se marcan igual en los dos triángulos y se pulsa COMPROBAR.
- **`odd` (el intruso)**: 4 pares, tres usan el mismo criterio; se toca el que no (o teclas 1–4).
- **`confirm: true`** (en el spot, junto a `input`): el botón que envía (`ABRIR`, `COBRAR`, `ABRIR VÁLVULA`/`ENCENDER` o la palanca) hay que **mantenerlo pulsado** ~0,7 s (botón del mouse, o `Espacio`/`Enter`/`E`); si se suelta antes no pasa nada. Evita envíos por accidente. Se usa en la Noche 7.
- Reparto: Noche 1 teclear · 2 candado y cartas · 3 cofre y atrapar · 4 teclado de cocina y ranuras · 5 palancas, cartas y tubería · 6 palancas y ranuras · 7 ranuras, cartas, tubería, palancas, candado y teclado (con `confirm`).
- Con `?debug=1` el cuadro expone `box._solve()` y `tools/prueba-noche.js` lo usa para resolver las preguntas con widget.

## Editar preguntas

Todo está en `public/js/levels.js`. Una pregunta es `crit('LAL', { vals: true })` (un par de triángulos; `vals` pone medidas en vez de rayitas)
o `critMulti(['HC', 'LLL'])` (varios pares, un campo por par). Criterios: `LLL`, `LAL`, `ALA`, `AAL`, `HC`.
La figura la dibuja `public/js/tri.js` (`TRI.pair(criterio, { seed, vals })`): el segundo triángulo es una copia girada o reflejada y las marcas
quedan en las mismas partes; la explicación y la pista salen solas del criterio. En el código la respuesta es un número 1–5 (LLL=1 … HC=5) y `LV.fmt` lo muestra como nombre.
Con `SHOTQ=/carpeta node tools/prueba-noche.js all` se guarda una captura de cada pregunta.

## Editar el mundo (Noche 1)

- `public/js/maps.js` — el mapa: cuartos, puertas, qué mueble va en qué baldosa, luces y puntos donde aparece Freddy.
- `public/js/props-a.js`, `props-b.js`, `props-c.js` — el arte de muebles y decoración (pixel art dibujado con código).
- `public/js/tiles.js` — pisos y paredes · `public/js/world.js` — motor (movimiento, colisiones, luz, enemigo).
- Para que un objeto sea una tarea, se le pone `act: { id: 'phone', ... }` en el mapa con el mismo `id` que la pregunta en `levels.js`.
