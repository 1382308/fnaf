# Plan: pasar las noches 2 a 7 al modo exploración

La **Noche 1** ya se juega caminando (vista 3/4 desde arriba, WASD, lámpara, tareas, enemigo que acecha).
Este plan convierte las otras seis noches **al mismo estilo y con el mismo nivel de detalle**, una noche por fase.

## Cómo se trabaja

| Rol | Quién | Qué hace |
|---|---|---|
| Orquestador | Claude (sesión principal) | Lanza cada fase, reenvía dudas, marca el ✅ |
| Implementador | Agente de contexto limpio (uno nuevo por fase) | Lee este archivo y construye **solo su noche** |
| Revisor | **Opus** (agente aparte, sin ver la conversación) | Revisa la fase y responde `✅ APROBADA` o `❌ RECHAZADA` con lista de problemas |

Reglas del proceso:

1. Las fases son **secuenciales**. No se empieza una fase hasta que la anterior tenga ✅.
2. **Dudas:** si algo de *diseño o ambigüedad* bloquea el avance (no por gusto estético), el implementador **se detiene y devuelve `DUDAS:`** con preguntas numeradas. El orquestador las consulta a Opus y responde al mismo implementador. Lo estético se decide solo y se anota en el informe.
3. Al terminar, el implementador entrega un **informe** (ver «Entrega»). Opus revisa con la lista de «Criterios de aprobación».
4. Si Opus rechaza, el mismo implementador corrige y se vuelve a revisar. Solo con `✅ APROBADA` se marca la casilla de abajo y se pasa a la siguiente noche.
5. **Nada de git commit**, no se toca `iniciar.command`, la lógica de sesión de `game.js`, ni las demás noches (salvo cambios de motor retrocompatibles, ver «Qué se puede tocar»).

## Estado de las fases

> **Completado:** las 7 fases están implementadas y aprobadas por Opus.

| Fase | Noche | Tema | Enemigo | Implementada | Opus ✅ |
|---|---|---|---|---|---|
| 0 | — | Base: borrado por sesión, enemigos por noche, herramienta de pruebas | — | ✅ (orquestador) | ✅ |
| 1 | 2 | El Escenario | Bonnie | ✅ | ✅ |
| 2 | 3 | Pirate Cove | Foxy | ✅ | ✅ |
| 3 | 4 | La Cocina (solo audio) | Chica | ✅ | ✅ |
| 4 | 5 | Pasillo Oeste | Bonnie | ✅ | ✅ |
| 5 | 6 | La Trastienda | Freddy | ✅ | ✅ |
| 6 | 7 | Golden Freddy | Golden Freddy | ✅ | ✅ |
| 9 | todas | Linterna con batería | — | ✅ | ✅ |

## Requisito transversal (ya resuelto en la Fase 0)

Al apagar el servidor se cierra la **sesión**: el siguiente encendido borra nombre, avance y estrellas de todos los navegadores
(ver `iniciar.command` y `loadSession()` en `game.js`). El atajo `?n=` solo existe con `./iniciar.command --pruebas`.
**No lo rompas:** no guardes datos nuevos en `localStorage` y no agregues otros atajos para saltar de noche.

---

## Contexto técnico (léelo antes de empezar)

Proyecto: `/home/escolopendro/Documents/FNAF` (juego web estático en `public/`, sin dependencias).
Lee primero: `public/js/world.js` (motor), `public/js/maps.js` (mapa de la Noche 1: **tu modelo a seguir**),
`public/js/props-a.js` (estilo de arte y helpers), `public/js/tiles.js`, y la entrada de la Noche 1 en `public/js/levels.js`.

### Piezas

- **Mapa** (`MAPS.nocheN` en un archivo nuevo `public/js/maps-nN.js`): `{ cols, rows, build(B) }`. Unidad = baldosa de 16 px.
- **Constructor `B`** dentro de `build`:
  - `B.room(id, nombre, x0, y0, x1, y1, tipoDePiso, {ambient, color, hall, alwaysVisible})` → devuelve el índice del cuarto (úsalo en `clip:` de las luces). `ambient` 0 = claro, 1 = negro total. Un pasillo/zona también es un `room`. Se pueden hacer cuartos no rectangulares juntando varios `room`.
  - `B.door(x0, y0, x1, y1)` → abertura caminable (umbral). Las puertas miden **2 de ancho y 3 filas de espesor**.
  - `B.prop(nombre, tx, ty, opts)` → mueble. `(tx, ty)` = **esquina inferior izquierda** en baldosas (la huella sólida ocupa las filas `ty-fh … ty-1`). `opts`: `ox/oy` (píxeles), `v` (variante), `solid:false`, `sb` (línea de orden de dibujo: para objetos sobre un escritorio usa la base del escritorio + 0.5), `light:{dx,dy,r,col,glow,flick,clip}`, `act:{id,name,zone:[dx,dy,w,h]}` (convierte el objeto en TAREA; `zone` es relativa a la esquina superior izquierda del sprite y debe cubrir **al menos el centro de una baldosa de piso alcanzable** donde se para el jugador; la prueba solo prueba centros de baldosa).
  - `B.wall(nombre, tx, ty, {ox,oy,...})` → decoración **de pared** (tx,ty = baldosa de la cara superior de la pared).
  - `B.decorPx(nombre, x, y, opts)` → decoración **de piso** (alfombras, manchas) o de pared en píxeles.
  - `B.light(x, y, r, color, {clip, glow, flick})` → luz fija. `B.spawn(x,y)` → puntos donde aparece el enemigo (lejos del inicio). `B.start = [x,y]`.
- **Geometría de paredes (muy importante):** cada franja de pared mide **3 filas**: 1 de tapa + 2 de cara. La cara se ve desde el piso que tiene **justo debajo**.
  Ejemplo: cuarto al norte de un pasillo → piso del cuarto hasta la fila F, tapa en F+1, cara en F+2 y F+3, piso del pasillo desde F+4. Copia el patrón de `maps.js`.
- **Tema de pared/piso:** la letra del piso decide el tema de la pared que lo rodea. Existentes: `H` pasillo, `S` seguridad, `F` fiestas, `W` madera/gerente, `K` cocina, `A` arcade, `C` concreto, `D` umbral.
  **Para temas nuevos** agrega la letra en `TILES.FLOOR` y `TILES.FACE` (en `tiles.js`) con el mismo formato (baldosa 16×16; cara 16×32).
- **Objetos y decoración** (`PROPS` / `DECOR`): se registran con `PROPS_API.reg(nombre, w, h, fw, fh, draw, {anim, light})` y `PROPS_API.dec(nombre, w, h, draw, {floor:true})` (ver `props-a.js`). Dibujo con `PX.Pen`
  (`r, ell, circ, bell, box, line, poly, dith, txt, pat`); ejemplos de animación y de luz en `props-b.js` / `props-c.js`. **Tus objetos nuevos van en `public/js/props-nN.js`** (un archivo por noche) y se cargan en `index.html`
  **antes de `world.js`**. Objetos ya existentes que puedes reutilizar (con moderación): `deskL cabinet locker crt phone fan chairO trash plant coffee bench wetsign fountain trashC mopBucket stage partyTable kidChair balloons speaker prizeCounter giftPile discoStand arcadeM airHockey clawM ballpit beanBag ticketM counterK sinkK stove fridge prepTable cupcake pizzaBoxes shelfK ovenBig deskMgr pcMgr bookshelf safe sofa coffeeTbl lampFloor shelfBoxes headShelf boxStack barrel toolBench ladder` y decoraciones `potRack hood menuBoard rugMgr framedA framedB posterA kidDraw notice vent fireExt sconce plate windowN bannerL bannerR neonGames neonStar cobweb partsFloor stain puddle rubberMat hazard`.
- **Animaciones:** `anim(ctx, x, y, t, inst, st)` donde `st = {done, px, py}` (`px,py` = posición del jugador en el mundo; sirve para que algo te siga con la mirada).
- **Enemigo:** lo crea el motor según `lv.enemy` (`freddy|bonnie|chica|foxy|golden`); el mapa solo define `B.spawn(...)`.
- **Datos de la noche** (`public/js/levels.js`): en la entrada de la noche agrega `explore: 'nocheN'`, y a **cada** spot agrega `task` (≤ 4 palabras, imperativo) y `room` (nombre **exacto** de un `B.room` del mapa). **No cambies** `q`, `id`, `final`, `step` ni ninguna pregunta: las respuestas se calculan solas.
  Quita `dark`, `darkA`, `darkR`, `rect` (ya no se usan en modo exploración). Ajusta `intro` (2–4 líneas cortas de Phone Guy hablando de tareas y de moverse por el lugar; conserva la idea matemática de la noche) y `outro`.
  El `id` del spot debe ser el mismo `act.id` del objeto en el mapa. La tarea con `final: true` queda bloqueada hasta terminar las demás; en la Noche 7 (`steps`) las tareas son secuenciales por `step`.
- **Cómo se integra:** `game.js` ya arranca el modo exploración si la noche tiene `explore` (tareas, minimapa, lámpara, enemigo, susto, fin de noche). **No necesitas tocar `game.js`.**

### Herramienta de pruebas

```bash
export PW_DIR=/tmp/claude-1000/-home-escolopendro-Documents-FNAF/21b76202-3252-406a-9714-d3ccaa9de789/scratchpad/pw
export PLAYWRIGHT_BROWSERS_PATH=/tmp/claude-1000/-home-escolopendro-Documents-FNAF/21b76202-3252-406a-9714-d3ccaa9de789/scratchpad/browsers
cd /home/escolopendro/Documents/FNAF
node tools/prueba-noche.js N --shots /tmp/claude-1000/-home-escolopendro-Documents-FNAF/21b76202-3252-406a-9714-d3ccaa9de789/scratchpad/fases/faseK
node tools/prueba-noche.js all          # regresión de las 7 noches
```
Levanta su propio servidor (con `session.json` virtual de pruebas) y lo apaga solo. Comprueba que cada tarea exista, sea **alcanzable caminando**, la final empiece bloqueada, el enemigo aparezca, el rendimiento con CPU 6× más lenta ≤ 20 ms/fotograma, que se llegue al amanecer y que no haya errores de consola.
Con `--shots` guarda `nN_mapa.png` (mapa completo) y una captura por cuarto `nN_<idDelCuarto>.png`: **míralas con la herramienta de lectura de imágenes** y corrige lo que se vea mal (objetos encimados, puertas bloqueadas, texto cortado, huecos vacíos, cosas flotando).
Para ver una captura más cercana puedes teletransportar al jugador con `__G.WORLD.teleport(x,y)` desde un script (ver `tools/prueba-noche.js`).
Si Playwright no existe: `mkdir -p $PW_DIR && cd $PW_DIR && npm i playwright && PLAYWRIGHT_BROWSERS_PATH=… npx playwright install chromium`.
**Seguridad:** no uses `pkill -f`; si levantas procesos, mátalos por PID/puerto.

---

## Trampas conocidas (aprendidas en fases anteriores)

- **`pen.at(x, y, escala)` usa coordenadas ABSOLUTAS del lienzo.** Dentro de una *decoración* (`dec`) el pincel `p` ya está desplazado a la posición de la decoración: usa `p.at(p.ox + x, p.oy + y, escala)` (como `sprites.js`). En un objeto (`reg`) `p.ox = p.oy = 0`, por eso allí no se nota. Si lo olvidas, las cabezas/cuerpos aparecen en la esquina superior izquierda del mapa: **mira siempre la esquina (0,0) de `nN_mapa.png`**.
- Los carteles de pared no deben quedar tapados por muebles altos (revisa cada cartel de cerca).
- Los puntos `B.spawn` deben quedar en baldosas libres y alcanzables y lejos del inicio.

## Estándar de calidad (igual que la Noche 1)

- **Distinto y reconocible:** cada noche debe sentirse como otro lugar (distribución, paleta, ambiente), no un clon del pasillo de la Noche 1. Puedes usar pasillos en L/T, varios pasillos, salas grandes, etc.
- **Tamaño:** mínimo **5 zonas** (cuartos o pasillos) con nombre; mapa de hasta 90×50 baldosas. Todas las tareas en al menos **4 zonas distintas**.
- **Detalle («súper detallados»):** cada cuarto con **≥ 12 objetos/decoraciones** distintos entre sí, pisos y paredes con textura (manchas, grietas, alfombras), luces con color, y al menos un objeto **animado** por cuarto importante. Crea **≥ 20 objetos/decoraciones nuevos** por noche (en `props-nN.js`); reutilizar está bien pero no debe dominar.
- **Lore FNAF 1** y humor ligero: letreros, carteles, pistas ambientales, huellas del enemigo de la noche.
- **Navegación justa:** pasillos de ≥ 3 baldosas, puertas libres (no pongas muebles frente a ellas), nada que atrape al jugador, todas las tareas alcanzables, un punto de inicio claro y un letrero con el nombre de cada cuarto (`plate`, `floorText`, `doormat`, etc.).
- **Luz:** `ambient` por cuarto, luces fijas con `clip` al cuarto, `glow` para colores. El cuarto de inicio algo más claro (el jugador debe orientarse).
- **Enemigo:** `B.spawn` ≥ 2 puntos, lejos del inicio y en lugares con sentido (la cala de Foxy, la cocina de Chica…).
- **Texto:** frases cortas; **no uses** las palabras «alumno», «profe», «docente», «maestro» en ningún texto ni comentario (di «jugador»).
- **Matemáticas intactas:** no edites preguntas, respuestas ni explicaciones.
- **Rendimiento:** ≤ 20 ms/fotograma con CPU 6× más lenta (la prueba lo mide). Pensado para Chromebook: teclado y trackpad, sin controles táctiles.

## Qué se puede tocar

- Libre: archivos nuevos `maps-nN.js`, `props-nN.js`; `index.html` (solo agregar los `<script>` antes de `world.js` / después de `maps.js`); `tiles.js` (solo **agregar** temas nuevos, sin alterar los existentes); la entrada de **tu noche** en `levels.js`; la fila de tu noche en `README.md`.
- Con cuidado: `world.js`, solo cambios **retrocompatibles** (la Noche 1 y las demás deben seguir pasando `node tools/prueba-noche.js all`). Si necesitas algo del motor (p. ej. un tipo de objeto móvil), pregúntalo como duda o hazlo mínimo y explícalo en el informe.
- No tocar: `iniciar.command`, `firebase.json`, sesión/guardado en `game.js`, preguntas, otras noches.

## Entrega (informe del implementador)

1. Archivos creados/modificados.
2. Zonas del mapa y dónde está cada tarea (tabla `id → zona → objeto`).
3. Lista de objetos/decoraciones nuevos (nombre + una línea).
4. Salida completa de `node tools/prueba-noche.js N --shots …` y de `… all`.
5. Decisiones tomadas por tu cuenta y `DUDAS:` abiertas (si las hay).

## Criterios de aprobación (los usa Opus)

Opus ejecuta la prueba, **mira las capturas** (`nN_mapa.png` y una por cuarto) y revisa el código. Para `✅ APROBADA` deben cumplirse **todos**:

1. `node tools/prueba-noche.js N` y `node tools/prueba-noche.js all` terminan sin fallos.
2. Todas las tareas con su objeto, `task`/`room` coherentes con el mapa, la final bloqueada al inicio.
3. Calidad visual al nivel de la Noche 1: sin objetos encimados o cortados, sin cuartos vacíos, texturas y luces con intención, estilo 3/4 consistente, se distingue de otras noches.
4. Cumple los mínimos (5 zonas, ≥ 12 objetos por cuarto, ≥ 20 objetos nuevos, tareas en ≥ 4 zonas, un animado por cuarto importante).
5. Enemigo correcto para la noche y puntos de aparición con sentido.
6. Sin regresiones: Noche 1 y las demás siguen funcionando; sin cambios a preguntas, sesión, `iniciar.command`.
7. Sin palabras prohibidas; textos cortos; `intro` coherente con el modo exploración.
8. Código ordenado: archivos nuevos por noche, comentarios en español breves, sin código muerto ni `console.log`.
9. README actualizado (fila de la noche).

Formato de respuesta de Opus: primera línea `✅ APROBADA` o `❌ RECHAZADA`; después lista numerada de problemas (bloqueante / menor) con archivo y qué corregir.

---

# Fases

## Fase 1 — Noche 2: El Escenario (enemigo: Bonnie)

Lugar: **el comedor y el escenario del restaurante** (Show Stage, Dining Area) más sus cuartos de servicio. Ambiente festivo pero abandonado de noche; el escenario muestra a Freddy y Chica y **el lugar vacío de Bonnie** (él es quien acecha).
Concepto matemático: −b y 2a. Piso del comedor en damero, cortinas, mesas, serpentinas.

| id | Objeto | `task` sugerida | `room` sugerida |
|---|---|---|---|
| `guitar` | guitarra de Bonnie | Encuentra la guitarra | Escenario |
| `mic` | micrófono de Freddy | Busca el micrófono | Escenario o Cabina de sonido |
| `cake` | pastel de Chica | Revisa el pastel | Comedor |
| `lights` | panel de luces del escenario | Ajusta las luces | Cabina de luces |
| `control` (final) | consola de control del show | Usa la consola | Cabina de control |

Ideas de zonas: Escenario grande con telón, Comedor con mesas largas, Cabina de luces y sonido (pupitres, faders, cables), Bodega de instrumentos (guitarras, amplificadores, estuches), Pasillo de servicio. Objetos nuevos: telón animado, pedestales de animatrónicos, consola de mezcla animada, focos de escenario con luz de color, guitarras en soportes, amplificadores, carteles de «Show 6 PM», sillas apiladas.
(En la Noche 1 ya existe `stage`; la Noche 2 debe tener **su propio escenario más grande y distinto**.)

## Fase 2 — Noche 3: Pirate Cove (enemigo: Foxy, el más rápido)

Lugar: **la cala pirata** y áreas con temática de barco: madera, cuerdas, faroles, agua en el piso, cortina morada con estrellas y el cartel «Out of order». Foxy se asoma tras la cortina.
Concepto: b² (negativo² = positivo).

| id | Objeto | `task` sugerida | `room` sugerida |
|---|---|---|---|
| `hook` | garfio de Foxy | Encuentra el garfio | Cubierta |
| `sign` | cartel «fuera de servicio» | Lee el cartel | Cala |
| `chest` | cofre del tesoro | Abre el cofre | Bodega |
| `map` | mapa pirata | Revisa el mapa | Camarote |
| `wheel` (final) | timón del barco | Gira el timón | Puente de mando |

Ideas: cubierta de madera con mástil y velas, camarote del capitán (cama, brújulas, mapas), bodega con barriles y cajas, la cala con cortina animada, puente con timón. Temas nuevos de piso/pared (tablones, cuerdas). Objetos: mástil, velas, anclas, jaulas, loro de peluche, cañones de juguete, faroles con luz cálida, charcos de agua, redes. Foxy es **rápido** (el motor ya lo acelera).

## Fase 3 — Noche 4: La Cocina, «solo audio» (enemigo: Chica)

Lugar: **cocina industrial y su zona de servicio**. En el juego original esa cámara es solo audio: aquí el ambiente es el **más oscuro** (`ambient` ≥ 0.9 salvo pequeñas luces), con ruidos y vapor, y la lámpara es imprescindible.
Concepto: 4ac.

| id | Objeto | `task` sugerida | `room` sugerida |
|---|---|---|---|
| `pot` | olla | Busca la olla | Cocina |
| `pan` | sartén | Revisa la sartén | Cocina |
| `oven` | horno | Abre el horno | Horno de pizza |
| `bib` | babero de Chica | Encuentra el babero | Comedor trasero / Vestidor |
| `fridge` (final) | refrigerador (cámara fría) | Abre el refrigerador | Cámara fría |

Ideas: cocina grande (estufas, campanas, mesones), cámara fría con escarcha y luz azul, despensa con latas, área de lavado, comedor trasero con mesas del personal. Objetos nuevos animados: vapor, gotera, ventilador de extractor, olla hirviendo, luz de refri parpadeante. Pistas ambientales: platos rotos, huellas de salsa. No reutilices la cocina de la Noche 1: debe ser **otra** (más grande, industrial).

## Fase 4 — Noche 5: Pasillo Oeste (enemigo: Bonnie)

Lugar: **el pasillo oeste largo** con cuartos pegados: almacén de suministros, baños, sala de máquinas y un cuarto de «objetos perdidos». Focos que parpadean y zonas apagadas. Piso mojado, carteles de seguridad.
Concepto: discriminante b² − 4ac.

| id | Objeto | `task` sugerida | `room` sugerida |
|---|---|---|---|
| `sign` | letrero de piso mojado | Lee el letrero | Pasillo Oeste |
| `closet` | puerta/candado del almacén | Abre el almacén | Almacén |
| `poster` | póster arrugado | Revisa el póster | Objetos perdidos |
| `lamp` | interruptor de luz | Prende el interruptor | Baños / Pasillo |
| `breaker` (final) | caja de breakers | Usa los breakers | Sala de máquinas |

Ideas: pasillo en forma de L o con nichos, baños (azulejo, lavabos, espejos rotos, cubículos), sala de máquinas (tubos, calderas, tableros con luces), objetos perdidos (cajas con peluches, mochilas). Objetos: espejos, lavabos, cubículos, tuberías con vapor, tablero de breakers animado, extintores, cinta de precaución.

## Fase 5 — Noche 6: La Trastienda (enemigo: Freddy)

Lugar: **Backstage / taller de repuestos**: estanterías con cabezas de repuesto, mesas de reparación, endoesqueletos colgados, cables y herramientas.
Concepto: √D y el ±; la tarea final es **armar la fórmula** (pregunta tipo `order`).

| id | Objeto | `task` sugerida | `room` sugerida |
|---|---|---|---|
| `freddyHead` | cabeza de Freddy | Revisa la cabeza | Sala de cabezas |
| `bonnieHead` | cabeza de Bonnie | Revisa la cabeza | Sala de cabezas |
| `chicaHead` | cabeza de Chica | Revisa la cabeza | Almacén de partes |
| `foxyHead` | cabeza de Foxy | Revisa la cabeza | Taller |
| `endo` | endoesqueleto colgado | Examina el endo | Taller |
| `terminal` (final) | terminal | Arma la fórmula | Oficina de servicio |

Detalle clave: las **cabezas de repuesto siguen al jugador con la mirada** (usa `st.px, st.py` en `anim` y `SPR.head(..., {lx, ly})`; mira `backstage` en `scenes-b.js`). Distingue las tareas de cabezas con `task` distintas (p. ej. «Cabeza de Freddy», «Cabeza de Bonnie»…).
Ideas: taller con mesas, soldadores, endoesqueletos en ganchos, cajas «PARTS», pasillos estrechos, trajes colgados, luces de taller con parpadeo.

## Fase 6 — Noche 7: Golden Freddy (enemigo: Golden Freddy)

Lugar: **el complejo de la oficina de seguridad de noche**, ahora tétrico: luz roja de emergencia, pósteres «IT'S ME», pasillos oeste/este, la sala de ventilación y el cuarto donde está Golden Freddy desplomado. Es la **noche final**: la más oscura y cargada de detalles.
Concepto: la fórmula completa, **paso a paso** (`steps`: las tareas son secuenciales, ya numeradas en la lista).

| step | id | Objeto | `task` sugerida | `room` sugerida |
|---|---|---|---|---|
| 1 | `poster` | póster «IT'S ME» | Lee el póster | Pasillo |
| 2 | `golden` | Golden Freddy | Examina a Golden | Cuarto de Golden |
| 3 | `monitor` | monitor | Revisa el monitor | Oficina |
| 4 | `phone` | teléfono | Contesta el teléfono | Oficina |
| 5 | `fan` | ventilador | Revisa el ventilador | Ventilación |
| 6 | `panel` (final) | panel final | Usa el panel | Oficina |

Debe **recordar la Noche 1 pero cambiada** (mismo ADN, otra distribución, todo más oscuro y roto). Golden Freddy (enemigo) es **más lento pero aparece y desaparece**: si lo implementas, que sea con un cambio mínimo y retrocompatible en el motor (por ejemplo, parpadeo de su sprite), explicado en el informe.
Objetos nuevos: pósteres rotos, luz roja pulsante, cámaras de seguridad, ductos de ventilación, peluches caídos, cables chispeando, sombras.
Al terminar la última tarea el juego muestra el final (cheque); no cambies ese flujo.

---

## Fase 8 — Objetos y secuencia de tareas (todas las noches)

Cada tarea resuelta entrega un objeto (`gives` en `levels.js`) que otra tarea pide (`needs`). El orden no se indica al jugador. La tarea final pide todas las demás. Bandeja «OBJETOS» y aviso «Conseguiste: …» en `game.js`. Estado: implementado y probado con `node tools/prueba-noche.js all`.

### Noche 1 — El Pasillo
_Tema: Identifica a, b y c._ Enemigo: freddy.

1. **Lee el póster** (Póster de fiesta, Sala de fiestas) — libre → respuesta: −6 → obtienes: **Llave del gerente**
2. **Encuentra la computadora** (Computadora, Oficina del gerente) — usa: Llave del gerente → respuesta: −4 → obtienes: **Tarjeta de seguridad**
3. **Busca el pastelito** (Pastelito de Chica, Cocina) — libre → respuesta: 1 → obtienes: **Cable del teléfono**
4. **Contesta el teléfono** (Teléfono, Oficina de seguridad) — usa: Cable del teléfono → respuesta: 2
5. **Abre el panel** (Panel de la puerta, Oficina de seguridad) — usa: Tarjeta de seguridad — FINAL → respuesta: a = 4, b = 0, c = −9

### Noche 2 — El Escenario
_Tema: Calcula −b y 2a._ Enemigo: bonnie.

1. **Busca el micrófono** (Micrófono de Freddy, Escenario) — libre → respuesta: 8 → obtienes: **Fusible**
2. **Revisa el pastel** (Pastel de Chica, Comedor) — libre → respuesta: 6 → obtienes: **Llave de afinación**
3. **Encuentra la guitarra** (Guitarra de Bonnie, Escenario) — usa: Llave de afinación → respuesta: −5
4. **Ajusta las luces** (Luces del escenario, Cabina de luces) — usa: Fusible → respuesta: 8 → obtienes: **Llave de la consola**
5. **Usa la consola** (Consola de control, Cabina de control) — usa: Llave de la consola — FINAL → respuesta: −b = 6, 2a = 2

### Noche 3 — Pirate Cove
_Tema: Calcula b²._ Enemigo: foxy.

1. **Encuentra el garfio** (Garfio de Foxy, Cubierta) — libre → respuesta: 16 → obtienes: **Llave del cofre**
2. **Lee el cartel** (Cartel, Cala) — libre → respuesta: 36 → obtienes: **Brújula**
3. **Abre el cofre** (Cofre del tesoro, Bodega) — usa: Llave del cofre → respuesta: 25
4. **Revisa el mapa** (Mapa pirata, Camarote) — usa: Brújula → respuesta: 9 → obtienes: **Manija del timón**
5. **Gira el timón** (Timón del barco, Puente de mando) — usa: Manija del timón — FINAL → respuesta: 81

### Noche 4 — La Cocina
_Tema: Calcula 4ac._ Enemigo: chica.

1. **Busca la olla** (Olla, Cocina) — libre → respuesta: 12 → obtienes: **Fósforos**
2. **Abre el horno** (Horno, Horno de pizza) — usa: Fósforos → respuesta: −24 → obtienes: **Llave de la cámara fría**
3. **Encuentra el babero** (Babero de Chica, Vestidor) — libre → respuesta: 24 → obtienes: **Espátula**
4. **Revisa la sartén** (Sartén, Cocina) — usa: Espátula → respuesta: 40
5. **Abre el refrigerador** (Refrigerador, Cámara fría) — usa: Llave de la cámara fría — FINAL → respuesta: 24

### Noche 5 — Pasillo Oeste
_Tema: El discriminante b² − 4ac._ Enemigo: bonnie.

1. **Lee el letrero** (Piso mojado, Pasillo Oeste) — libre → respuesta: 1 → obtienes: **Llave del almacén**
2. **Abre el almacén** (Almacén, Almacén) — usa: Llave del almacén → respuesta: 16 → obtienes: **Foco nuevo**
3. **Revisa el póster** (Póster arrugado, Objetos perdidos) — libre → respuesta: 0 → obtienes: **Fusible**
4. **Prende el interruptor** (Interruptor, Baños) — usa: Foco nuevo → respuesta: 1
5. **Usa los breakers** (Caja de breakers, Sala de máquinas) — usa: Fusible — FINAL → respuesta: 25

### Noche 6 — La Trastienda
_Tema: La raíz √ y el ±._ Enemigo: freddy.

1. **Cabeza de Freddy** (Cabeza de Freddy, Sala de cabezas) — libre → respuesta: 7 → obtienes: **Destornillador**
2. **Cabeza de Bonnie** (Cabeza de Bonnie, Sala de cabezas) — libre → respuesta: 7 → obtienes: **Batería**
3. **Cabeza de Chica** (Cabeza de Chica, Almacén de partes) — usa: Batería → respuesta: 0 → obtienes: **Llave del taller**
4. **Cabeza de Foxy** (Cabeza de Foxy, Taller) — usa: Llave del taller → respuesta: 6
5. **Examina el endo** (Endoesqueleto, Taller) — usa: Destornillador → respuesta: −b + √D = 6, −b − √D = 4 → obtienes: **Disco de datos**
6. **Arma la fórmula** (Terminal, Oficina de servicio) — usa: Disco de datos — FINAL → respuesta: ordenar la fórmula

### Noche 7 — Golden Freddy
_Tema: La fórmula completa._ Enemigo: golden.

1. **Lee el póster** (Póster “IT’S ME”, Pasillo Oeste) — libre → respuesta: a = 1, b = −5, c = 6 → obtienes: **Llave del cuarto de Golden**
2. **Examina a Golden** (Golden Freddy, Cuarto de Golden) — usa: Llave del cuarto de Golden → respuesta: −b = 5, 2a = 2 → obtienes: **Tarjeta de la oficina**
3. **Revisa el monitor** (Monitor, Oficina) — usa: Tarjeta de la oficina → respuesta: 1 → obtienes: **Código del panel**
4. **Revisa el ventilador** (Ventilador, Ventilación) — libre → respuesta: −b + √D = 6, −b − √D = 4 → obtienes: **Cable del teléfono**
5. **Contesta el teléfono** (Teléfono, Oficina) — usa: Cable del teléfono → respuesta: 1
6. **Usa el panel** (Panel final, Oficina) — usa: Código del panel — FINAL → respuesta: x₁ = 3, x₂ = 2


---

## Fase 9 — Linterna con batería (se hace al final, después de la Fase R5 de `PLAN_RESPUESTAS.md`)

Objetivo: que el jugador no tenga la linterna prendida siempre, y que sea útil prenderla.

1. **Batería:** barra junto al ícono de la lámpara. Se gasta con la lámpara prendida y se recarga lento apagada. Con 0 % se apaga sola y tarda unos segundos en volver.
2. **Atracción:** tras 3 s seguidos prendida, el enemigo se acerca más rápido (cuanto más tiempo, más rápido). Al apagarla deja de apresurarse. Pasos e interferencia suben al acercarse. Si te alcanza con la lámpara prendida: susto.
3. **Ventaja 1, tareas en la oscuridad:** en zonas muy oscuras (`ambient` alto) el objeto de una tarea solo se puede usar con E si la lámpara está prendida (p. ej. breakers, fusibles). Elegir 1 o 2 tareas por noche; las zonas con tarea oscura deben quedar alcanzables y justas.
4. **Ventaja 2, destello:** con el enemigo cerca y apuntándole, el jugador pulsa **Q** y el enemigo retrocede unos segundos. Gasta mucha batería de golpe y tiene recarga corta.
5. **Dificultad por noche:** la Noche 1 es suave (tutorial); desde la 2 la batería dura menos y el enemigo se apresura más.
6. **Tocar:** `world.js` (cambios retrocompatibles), `game.js` (barra y teclas), `levels.js` (marcar tareas oscuras), `tools/prueba-noche.js` (las tareas oscuras se resuelven con la lámpara prendida; el enemigo se acerca más rápido con la lámpara prendida).
7. **Prohibido:** flechas o ayudas que indiquen a dónde ir o qué tarea sigue.

Revisión: Opus, mismos criterios que las demás fases (prueba `all`, capturas, rendimiento, sin regresiones).
