# Plan: formas de responder más dinámicas

Hoy casi toda respuesta es **teclear un número** (`number` 21, `multi` 7, `choice` 7, `order` 1, `tokens` 1).
Este plan agrega **otras formas de entregar la respuesta** sin tocar las preguntas: mismo `q`, mismo `answer`, mismo `expl`, mismo `hint`.
Cambia solo el *widget de entrada*. Cada noche usa 2 o 3 formas, una de ellas ligada al lugar.

## Cómo se trabaja

Igual que `PLAN_NOCHES.md`:

| Rol | Quién | Qué hace |
|---|---|---|
| Orquestador | Claude (sesión principal) | Lanza cada fase, reenvía dudas, marca el ✅ |
| Implementador | Agente Sonnet de contexto limpio (uno nuevo por fase) | Lee este archivo y construye **solo su fase** |
| Revisor | Agente **Opus** aparte, sin ver la conversación | Revisa y responde `✅ APROBADA` o `❌ RECHAZADA` con lista de problemas |

1. Fases **secuenciales**; la siguiente no empieza hasta tener ✅.
2. Dudas de diseño: el implementador se detiene y devuelve `DUDAS:` numeradas. Lo estético lo decide solo y lo anota.
3. Si Opus rechaza, el mismo implementador corrige y se revisa de nuevo. Solo con `✅ APROBADA` se marca la casilla.
4. **Nada de git commit.** No usar `pkill -f`. No dejar procesos en segundo plano al terminar. No instalar nada.
5. Prueba (macOS, usa Chrome instalado):
   `PW_DIR=/private/tmp/claude-501/-Users-parlos-Documents-FNAF/0674bee7-8a30-4ab4-a1b6-f187caa8f8ef/scratchpad/pw node tools/prueba-noche.js all`
   Con `--shots <carpeta>` guarda capturas; hay que **mirarlas** con la herramienta de lectura de imágenes.

## Estado de las fases

| Fase | Contenido | Noches que lo usan | Implementada | Opus ✅ |
|---|---|---|---|---|
| R0 | Base: registro de widgets, señuelos, ganchos de prueba, **candado/ruleta** | 2, 3 | ✅ | ✅ |
| R1 | **Cartas que se revuelven** | 2, 5 | ✅ | ✅ |
| R2 | **Atrapar al vuelo** y **teclado temático** | 3, 4 | ✅ | ✅ |
| R3 | **Soltar en la ranura** (clic para tomar, clic para soltar) | 4, 6 | ✅ | ✅ |
| R4 | **Tubería** (girar piezas) | 5, 7 | ✅ | ✅ |
| R5 | **Palancas / caminar hasta la respuesta** y **confirmar con acción**; reparto final por noche | 5, 6, 7 | ✅ | ✅ (revisión en la sesión principal) |

## Reparto por noche (objetivo final)

| Noche | Tema | Formas |
|---|---|---|
| 1 | Oficina (tutorial) | Teclear (sin cambios) |
| 2 | El Escenario | Candado (R0), cartas barajadas (R1) |
| 3 | Pirate Cove | Cofre con combinación (R0), atrapar al vuelo (R2) |
| 4 | La Cocina | Teclado de cocina (R2), soltar en la ranura (R3) |
| 5 | Pasillo Oeste | Cartas (R1), tubería (R4), palancas (R5) |
| 6 | La Trastienda | Soltar en la ranura (R3), palancas (R5) |
| 7 | Golden Freddy | Mezcla de todas, con confirmación por acción (R5) |

No es requisito dejar preguntas tecleadas en cada noche: lo que se busca es variedad de formas.

---

## Contexto técnico (léelo antes de empezar)

Proyecto en `/Users/parlos/Documents/FNAF` (juego web estático en `public/`, sin dependencias).

### Dónde vive hoy la respuesta (`public/js/game.js`)

- `openQuestion(sp)` arma el cuadro `#qm` y **ramifica por `q.type`** con código en línea (`choice`, `tokens`, `number`, `multi`, `order`).
- Cada rama usa las mismas piezas: `win()` (acierto), `lose(extra)` (error: resta energía con `penalty()`, a los 3 intentos muestra «VER SOLUCIÓN»), `say2(cls, html)` (mensaje), `sol.onclick` (solución), `same(a, b)`, `parseNum(s)`, `fmt(v)`, `shuffle(a)`, `rad(...)`, `px(...)`, `el(tag, cls, html)`.
- Hay botones `RESPONDER`, `MANUAL`, `VER SOLUCIÓN` y `CONTINUAR ▶`.
- `keypadFor(box, inputs)` ya pone un teclado en pantalla, solo en pantallas táctiles.
- `tools/prueba-noche.js` (función `answer`) responde cada pregunta según su tipo (`fill` + Enter, clic en `.opt`).
- Los datos de preguntas están en `public/js/levels.js` (`build({ type, eq, calc, ... })`). **Las respuestas se calculan solas.**

### Diseño que se busca

Un **registro de widgets de entrada** en un archivo nuevo `public/js/inputs.js` (cargado antes de `game.js`):

```js
INPUTS.dial = {
  // numérico: q.type 'number' (y cada campo de 'multi')
  mount(ctx) { /* dibuja en ctx.ans; llama ctx.submit(valor) */ }
}
```

Contrato (decídelo y documéntalo al inicio de `inputs.js`):

- `ctx = { q, field, ans, box, submit(v), win(), lose(extra), say(cls, html), decoys(n), debug }`.
- `submit(v)` compara con `q.answer` (o `field.answer`) usando `same()`, dibuja ok/bad y llama a `win()` o `lose()`. **La lógica de intentos, energía y solución no se duplica**: sale de `openQuestion`.
- Un widget puede mostrar candidatos: `ctx.decoys(n)` devuelve el valor correcto más `n−1` señuelos, **sin repetidos** y **sin que el correcto sea siempre el primero**.
- **Sin vía de escape:** un spot con `input` se responde **solo con ese widget**. No hay botón «TECLADO», ni campo de texto, ni cambio de modo.
- Para la prueba automática, con `?debug=1` cada widget expone `box._solve()` que entrega la respuesta correcta como lo haría un jugador. `tools/prueba-noche.js` lo llama cuando el spot tiene `input`; las preguntas sin `input` se responden como hoy.

### Cómo se asigna una forma a una pregunta

Campo **nuevo y opcional** en el spot de `levels.js`, fuera de `q`:

```js
{ id: 'cake', ..., input: 'cards', q: build({ ... }) }   // sin 'input' = teclear
```

`openQuestion` usa `INPUTS[sp.input]` si existe y la pregunta es compatible (ver «Compatibilidad»); si no, usa la rama de siempre. **No se tocan `q`, `id`, `final`, `step`, preguntas, respuestas ni explicaciones.**

### Señuelos (`decoys`)

Son errores típicos del tema, no valores al azar: signo cambiado (`−r`), `b` sin negar, el doble o la mitad, `b²` en vez de `Δ`, `4ac` en vez de `2a`, ±1. Se generan desde los coeficientes de `q.eq` cuando existen; si no, ±1, ±2 y el opuesto. Deben ser distintos entre sí y del correcto.

### Compatibilidad por tipo de pregunta

| Forma | `number` | `multi` | `choice` | `order`/`tokens` |
|---|---|---|---|---|
| Candado / ruleta | ✔ (enteros y negativos) | ✔ un candado por campo | — | — |
| Cartas barajadas | ✔ (con señuelos) | ✔ por campo | ✔ | — |
| Atrapar al vuelo | ✔ (con señuelos) | — | ✔ | — |
| Teclado temático | ✔ | ✔ | — | — |
| Soltar en la ranura | ✔ | ✔ (ideal) | — | ✔ (`order`) |
| Tubería | ✔ | ✔ | — | — |
| Palancas / caminar | ✔ (con señuelos) | — | ✔ | — |

Todas las respuestas del juego son **números enteros** (positivos, negativos o cero). Los widgets solo necesitan mostrar enteros; no hay decimales ni fracciones.

### Restricciones de entrada (Chromebook)

- **Teclado y trackpad**, sin pantalla táctil. Nada que dependa de arrastrar con el dedo: usar **clic para tomar y clic para soltar** y también flechas/Tab/Enter/Espacio.
- Todo widget se maneja solo con teclado (foco visible, `aria-label`).
- Rendimiento: ≤ 20 ms/fotograma con CPU 6× más lenta (la prueba lo mide). Las animaciones usan `requestAnimationFrame` y se detienen al cerrar el cuadro.
- No guardar nada nuevo en `localStorage` ni crear atajos para saltar de noche (ver `PLAN_NOCHES.md`, requisito transversal).
- **Sin adivinar a ciegas:** con opciones, los señuelos son errores típicos y el widget no se puede «barrer» (no repetir el mismo intento sin costo). El manejo de errores es el de siempre (`lose()`).

### Estilo

Mismo arte que el resto: tipografías del proyecto, borde `pbox`, colores del tema de cada noche (`lv.colors` si aplica). Sprites y dibujos con `PX` (ver `public/js/px.js`). CSS nuevo en `public/css/style.css` bajo un bloque comentado «respuestas», o `public/css/inputs.css` enlazado en `index.html`.

### Qué se puede tocar

- Libre: `public/js/inputs.js` (nuevo), CSS de widgets, `index.html` (solo `<script>`/`<link>`), campo `input` en spots de `levels.js` **de las noches de la fase**, `README.md` (sección de formas de respuesta).
- Con cuidado: `game.js`, solo el enganche en `openQuestion` y `tools/prueba-noche.js` (soportar `_solve`). Cambios mínimos y sin alterar el flujo de sesión, energía, susto o final.
- No tocar: preguntas/respuestas/explicaciones, `world.js` salvo necesidad (R5), mapas y props de las noches, `iniciar.command`.

## Entrega (informe del implementador)

1. Archivos creados/modificados.
2. Qué widgets agregaste, qué preguntas los usan (tabla `noche → spot id → forma`) y cuáles quedan tecleadas.
3. Cómo se juega cada widget (teclado y trackpad) en 3 líneas.
4. Salida completa de `node tools/prueba-noche.js all` y de la prueba específica de widgets (ver abajo).
5. Decisiones propias y `DUDAS:` abiertas.

## Criterios de aprobación (los usa Opus)

Opus ejecuta la prueba, abre cada widget en el navegador (Playwright), **mira capturas** y revisa el código. Para `✅ APROBADA`:

1. `node tools/prueba-noche.js all` termina sin fallos y cada pregunta con widget se resuelve usando el widget (`_solve`) y no existe ningún campo de texto ni botón alterno dentro de esos cuadros.
2. Responder mal funciona: `lose()` resta energía, a los 3 intentos aparece «VER SOLUCIÓN» y la solución se muestra bien.
3. Cada widget se juega **solo con teclado** y con trackpad; foco visible y `aria-label`.
4. Señuelos correctos: sin repetidos, correcto en posición variable (muestras varias aperturas), errores típicos y no al azar.
5. Preguntas, respuestas, explicaciones, `id`, `step`, `final` intactos (`git diff` de `levels.js` solo agrega `input`).
6. Sin regresiones: noches sin `input` se comportan igual; `order`, `tokens` y los teclados táctiles siguen.
7. Estilo coherente con el juego; sin texto cortado ni elementos encimados; legible en 1366×768.
8. Rendimiento ≤ 20 ms/fotograma con CPU 6× más lenta; sin errores de consola.
9. Sin palabras prohibidas («alumno», «profe», «docente», «maestro»), sin `console.log`, sin código muerto; nombres sin colisiones con otros archivos.
10. README actualizado.

Formato de Opus: primera línea `✅ APROBADA` o `❌ RECHAZADA`; después lista numerada (bloqueante / menor) con archivo y qué corregir.

## Trampas probables (aprendidas en el plan anterior)

- Registrar un nombre ya usado sobrescribe el existente en silencio: revisa colisiones de nombres (`INPUTS`, clases CSS, funciones globales).
- La prueba automática no ve lo visual: **mira las capturas**, con zoom.
- Textos dentro de sprites o fichas no deben cortarse por el borde.
- Nada estático dentro de un bucle de animación; limpiar `requestAnimationFrame` y escuchas al cerrar el cuadro con `Esc`/`✕`.

---

# Fases

## Fase R0 — Base y candado/ruleta

Crear `inputs.js` con el registro, `ctx`, `decoys`, el gancho `_solve` y el enganche en `openQuestion`. Adaptar `tools/prueba-noche.js` para usar `_solve` cuando exista.
Primer widget: **`dial` (candado/ruleta)**. Un rodillo por dígito (con signo `−`) que gira con ↑↓, rueda del trackpad o clic en las flechas; `←→`/Tab cambian de rodillo; Enter confirma. Para `multi`, un candado por campo. Skin por noche (candado de caja fuerte en la 2, cofre pirata en la 3: solo cambia el dibujo y los colores).
Aplicar `input: 'dial'` a 2–3 preguntas `number` de la Noche 2 y de la 3.

## Fase R1 — Cartas que se revuelven

Widget `cards`. Se muestran 3 o 4 cartas boca arriba con valores (el correcto y señuelos), se voltean, **se barajan con animación** y el jugador señala cuál contiene la respuesta (clic o flechas+Enter). Más cartas y más barajadas según el avance de la noche. Para `multi`, una ronda por campo. Funciona también con `choice`.
Aplicar a Noche 2 (pastel de Chica, etc.) y Noche 5.

## Fase R2 — Atrapar al vuelo y teclado temático

- `catch`: los candidatos cruzan o caen por el cuadro y se atrapa solo el correcto moviendo el cursor o con ←→ y Espacio. Dificultad baja y velocidad moderada; un error cuesta lo de siempre. Pausa si se abre el manual.
- `padK`: teclado numérico por clic con skin temático (caja registradora, receta de cocina). Reemplaza al teclado táctil solo cuando se asigna; funciona con teclado físico también.
Aplicar a Noche 3 (`catch`) y Noche 4 (`padK`).

## Fase R3 — Soltar en la ranura

Widget `slots`. Fichas con valores y ranuras con etiqueta (`a`, `b`, `c`; o los huecos de la fórmula). **Clic en la ficha y clic en la ranura**, o Tab + Enter. Ideal para `multi` (unir el valor con su letra). También sirve para `order` si se quiere extender sin romper el actual.
Aplicar a Noche 4 y Noche 6.

## Fase R4 — Tubería

Widget `pipes`. Cuadrícula pequeña de tubos que se giran con clic o Espacio para que el valor llegue a la salida correcta. Cada salida corresponde a un campo o a una opción. Los caminos se generan para que **exista una única solución** y no se pueda resolver por azar en pocos clics.
Aplicar a Noche 5 y Noche 7.

## Fase R5 — Palancas / caminar, confirmación por acción y reparto final

- `levers`: varias palancas o interruptores con valores; se activa la correcta. En modo exploración se puede hacer **caminando hasta una baldosa/cartel** con el valor (esto puede requerir un cambio mínimo y retrocompatible en `world.js`; explícalo en el informe).
- `confirm`: paso final opcional que pide girar una llave o mantener `E` para enviar, evita envíos por accidente.
- Reparto final según la tabla de arriba, balanceo por variedad (sin exigir preguntas tecleadas), actualización del README y regresión completa.
