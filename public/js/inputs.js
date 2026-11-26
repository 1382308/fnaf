/* inputs.js — formas de entregar la respuesta (ver PLAN_RESPUESTAS.md).
 *
 * Un spot de levels.js con `input: 'dial'`, `'cards'`, `'catch'`, `'padK'`, `'slots'`, `'pipes'` o `'levers'` usa INPUTS.<nombre> en vez del campo de texto. No hay vía de escape:
 * ese cuadro no tiene campo de texto ni botón para cambiar de modo.
 *
 * Contrato: INPUTS.<nombre> = { mount(ctx) }
 *   ctx = {
 *     q, field,          pregunta y (si es 'multi') el campo que se responde; field.answer o q.answer es el valor correcto
 *     ans, box,          contenedor donde dibujar el widget y el cuadro completo
 *     night,             número de noche (para el skin)
 *     submit(v),         entrega un entero: compara con same(), pinta ok/mal y llama a win() o lose() (intentos, energía
 *                        y solución viven en openQuestion; aquí no se repiten). Devuelve true si acertó.
 *     win(), lose(extra), say(cls, html),
 *     decoys(n[, k]),    (INPUTS_DECOYS) el valor correcto + (n-1) señuelos típicos, sin repetidos y en orden mezclado (k = campo, con whole)
 *     px(s), rad(s),     el mismo px() y rad() de game.js (el − como barra dibujada, la √ con su raya)
 *     fields,            solo si el widget declara whole:true y la pregunta es 'multi': TODOS los campos (se monta una sola vez; submit(v, k) responde el campo k)
 *     done,              cuántas tareas de la noche ya se resolvieron (dificultad: más cartas, más barajadas)
 *     paused(),          true mientras el manual está abierto (las animaciones se detienen)
 *     confirm,           true si el spot tiene confirm: el botón de enviar (y cada palanca) se mantiene pulsado (ver holdBtn)
 *     debug              true con ?debug=1
 *   }
 *   mount devuelve { focus(), solve(), lock(), reveal() }: reveal() marca la respuesta correcta al pulsar VER SOLUCIÓN (todos los widgets); solve() entrega la respuesta correcta como lo haría un jugador
 *   (solo se usa con ?debug=1, para tools/prueba-noche.js).
 */
(function (G) {
  'use strict';
  var INPUTS = {};

  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0, t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* Señuelos: errores típicos del tema según calc ('negb', 'b2', 'disc'…), a partir de eq = [a, b, c]. Se MEZCLA el grupo
   * antes de cortarlo (la respuesta no se delata por la estructura del conjunto); ±1/±2 solo completan. */
  function typical(calc, e, ans) {
    var a = e[0], b = e[1], c = e[2], b2 = b * b, ac4 = 4 * a * c, D = b2 - ac4, r = Math.sqrt(Math.abs(D)), num1 = -b + r, num2 = -b - r;
    var T = {
      a: [-a, b, c, 2 * a], b: [-b, a, c, 2 * b], c: [-c, a, b, 2 * c],
      negb: [b, 2 * a, -2 * a, -a, c], twoa: [a, -2 * a, 4 * a, -a, a * a],
      b2: [-b2, 2 * b, -2 * b, b, 4 * b, b2 + Math.abs(b), b2 - Math.abs(b)], fourac: [-ac4, a * c, 2 * a * c, 4 * (a + c), b2],
      disc: [b2 + ac4, b2, -ac4, -D, b2 - 4 * Math.abs(a * c), ac4], sqrtd: [D, -r, 2 * r, r + 1, r - 1],
      plus: [num2, -num1, b + r, -b, r], minus: [num1, -num2, b - r, r, -b],
      x1: [num1, num2, -ans, 2 * ans, ans + 1], x2: [num1, num2, -ans, 2 * ans, ans - 1]
    };
    return T[calc] || [];
  }
  var CONF = { 1: [2, 5], 2: [1, 3], 3: [4, 2], 4: [3, 2], 5: [1, 2] };            // criterios que más se confunden (1 LLL, 2 LAL, 3 ALA, 4 AAL, 5 HC)
  var pools = new WeakMap();                                                         // señuelos fijos por pregunta/campo durante la noche; solo cambia el orden
  /* Los señuelos se reparten en «menores» y «mayores» (en valor absoluto) que la respuesta, con los típicos primero y rellenos ±1…8 después.
   * Cada pregunta sortea una vez cuántos señuelos menores lleva (u), así la respuesta no es siempre la mayor, la menor ni la central. */
  function decoys(q, field, n) {
    var f = field || q, ans = f.answer;
    if (f.crit) {                                                                     // criterios de congruencia: los confundibles primero, el resto después
      var Pc = pools.get(f);
      if (!Pc) { Pc = shuf(CONF[ans] || []).concat(shuf([1, 2, 3, 4, 5].filter(function (v) { return v !== ans && (CONF[ans] || []).indexOf(v) < 0; }))); pools.set(f, Pc); }
      return shuf([ans].concat(Pc.slice(0, Math.min(n, 5) - 1)));
    }
    if (q.opts) return shuf(q.opts);                                                  // choice: las opciones de la pregunta
    var e = q.eq, seen = {}, c = [], P = pools.get(f);
    function add(v) { if (typeof v === 'number' && isFinite(v) && v % 1 === 0 && v !== ans && !seen[v]) { seen[v] = 1; c.push(v); } }
    if (!P) {
      var ty = e && f.calc ? shuf(typical(f.calc, e, ans)) : [];
      function hub(v) { return v === -ans || v === 2 * ans || 2 * v === ans || Math.abs(v - ans) === 1; }   // «parientes» de la respuesta: la delatan, van al final
      ty.forEach(function (v) { if (v * ans > 0 && !hub(v)) add(v); });
      (q.fields || []).forEach(function (o) { if (o !== f) add(o.answer); });
      shuf([2, 4, 6, 8, 10, 12, -2, -4, -6, -8, -10, -12]).forEach(function (d) { if ((ans + d) * ans > 0) add(ans + d); });   // rellenos con la misma paridad y signo que la respuesta (ni «el par» ni «el positivo» la delatan)
      ty.forEach(add); add(ans + 1); add(ans - 1); add(-ans); add(2 * ans); if (ans % 2 === 0) add(ans / 2); [0, -1, 1, 3, -3, 5].forEach(add);
      P = { lo: [], hi: [], u: Math.random() };
      c.forEach(function (v) { (Math.abs(v) > Math.abs(ans) ? P.hi : P.lo).push(v); });
      pools.set(f, P);
    }
    var k = Math.min(n - 1, (P.u * n) | 0), out = P.lo.slice(0, k);
    out = out.concat(P.hi.slice(0, n - 1 - out.length)); out = out.concat(P.lo.slice(k, k + n - 1 - out.length));
    return shuf([ans].concat(out));
  }

  /* dial de criterios: un solo rodillo que recorre LLL, LAL, ALA, AAL y HC */
  function critDial(ctx) {
    var ans = (ctx.field || ctx.q).answer, lab = ctx.field ? ctx.field.label + ': ' : '', i = 0, locked = false, N = G.LV.NAME;
    var root = document.createElement('div'); root.className = 'dial dial-n' + ctx.night;
    var row = document.createElement('div'); row.className = 'dial-row'; root.appendChild(row);
    var w = document.createElement('div'); w.className = 'dial-w dial-crit'; w.tabIndex = 0; w.setAttribute('role', 'spinbutton'); w.setAttribute('aria-label', lab + 'Criterio');
    var v = document.createElement('div'); v.className = 'dial-v';
    function btn(txt, label, d) { var b = document.createElement('button'); b.type = 'button'; b.className = 'dial-a'; b.textContent = txt; b.tabIndex = -1; b.setAttribute('aria-label', label); b.onclick = function () { step(d); w.focus(); }; return b; }
    function paint() { v.textContent = N[i + 1]; w.setAttribute('aria-valuetext', N[i + 1]); w.setAttribute('aria-valuenow', String(i + 1)); }
    function step(d) { if (locked) return; i = (i + d + 5) % 5; paint(); }
    w.appendChild(btn('▲', 'Siguiente', 1)); w.appendChild(v); w.appendChild(btn('▼', 'Anterior', -1)); row.appendChild(w);
    w.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') step(e.key === 'ArrowUp' ? 1 : -1);
      else if (e.key === 'Enter') send();
      else return;
      e.preventDefault(); e.stopPropagation();
    });
    var acc = 0;
    w.addEventListener('wheel', function (e) {
      if (!e.deltaY) return;
      e.preventDefault(); acc += e.deltaY;
      while (Math.abs(acc) >= 50) { step(acc < 0 ? 1 : -1); acc -= Math.sign(acc) * 50; }
    }, { passive: false });
    function go() { if (locked) return false; var ok = ctx.submit(i + 1); if (!ok) { root.classList.add('bad'); setTimeout(function () { root.classList.remove('bad'); }, 400); } return ok; }
    var ok = document.createElement('button'); ok.type = 'button'; ok.className = 'dial-go'; ok.textContent = 'ABRIR'; ok.setAttribute('aria-label', 'Confirmar criterio');
    var send = sendBtn(ctx, ok, go); root.appendChild(ok);
    paint(); ctx.ans.appendChild(root);
    return {
      focus: function () { w.focus(); }, lock: function () { locked = true; root.classList.add('ok'); },
      reveal: function () { i = ans - 1; paint(); },
      solve: function () { i = ans - 1; paint(); return go(); }
    };
  }

  /* teclado de criterios (receta / caja registradora): una tecla por criterio */
  function critPad(ctx) {
    var ans = (ctx.field || ctx.q).answer, lab = ctx.field ? ctx.field.label + ': ' : '', cur = 0, locked = false, N = G.LV.NAME;
    var root = document.createElement('div'); root.className = 'padk padk-n' + ctx.night;
    var side = document.createElement('div'); side.className = 'padk-s';
    var disp = document.createElement('div'); disp.className = 'padk-d'; disp.setAttribute('role', 'status'); disp.setAttribute('aria-label', lab + 'Criterio elegido');
    var keys = document.createElement('div'); keys.className = 'padk-k'; side.appendChild(disp); root.appendChild(keys); root.appendChild(side);
    function show() { disp.innerHTML = cur ? ctx.px(N[cur]) : '<span class="padk-ph">?</span>'; }
    [1, 2, 3, 4, 5].forEach(function (k, j) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'padk-b'; b.tabIndex = j ? -1 : 0; b.textContent = N[k]; b.setAttribute('aria-label', lab + N[k]);
      b.onclick = function () { if (!locked) { cur = k; show(); } }; keys.appendChild(b);
    });
    var del = document.createElement('button'); del.type = 'button'; del.className = 'padk-b'; del.tabIndex = -1; del.textContent = '⌫'; del.setAttribute('aria-label', lab + 'Borrar');
    del.onclick = function () { if (!locked) { cur = 0; show(); } }; keys.appendChild(del);
    var ent = document.createElement('button'); ent.type = 'button'; ent.className = 'padk-go'; ent.textContent = ctx.night === 4 ? 'LISTO' : 'COBRAR'; ent.setAttribute('aria-label', lab + 'Confirmar'); side.appendChild(ent);
    function go() {
      if (locked) return false;
      if (!cur) { ctx.say('bad', 'Elige un criterio.'); return false; }
      var ok = ctx.submit(cur); if (!ok) { root.classList.add('bad'); setTimeout(function () { root.classList.remove('bad'); }, 400); }
      return ok;
    }
    var send = sendBtn(ctx, ent, go);
    root.addEventListener('keydown', function (e) {
      var bs = [].slice.call(keys.children), i = bs.indexOf(document.activeElement);
      if (e.key === 'Enter') send();
      else if (e.key === 'Backspace') { cur = 0; show(); }
      else if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && i >= 0 && i < bs.length - 1) bs[i + 1].focus();
      else if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && i > 0) bs[i - 1].focus();
      else return;
      e.preventDefault(); e.stopPropagation();
    });
    keys.addEventListener('focusin', function (e) { [].forEach.call(keys.children, function (b) { b.tabIndex = b === e.target ? 0 : -1; }); });
    show(); ctx.ans.appendChild(root);
    return {
      focus: function () { keys.children[0].focus(); },
      lock: function () { locked = true; root.classList.add('ok'); [].forEach.call(root.querySelectorAll('button'), function (b) { b.disabled = true; }); },
      reveal: function () { cur = ans; show(); },
      solve: function () { cur = ans; show(); return go(); }
    };
  }

  /* ---------- dial: rodillos con signo ---------- */
  INPUTS.dial = {
    mount: function (ctx) {
      if ((ctx.field || ctx.q).crit) return critDial(ctx);
      var ans = (ctx.field || ctx.q).answer, nd = Math.max(3, String(Math.abs(ans)).length);   // mínimo 3 cifras para no delatar la longitud; si una respuesta pasara de 999 la longitud se delata
      var lab = ctx.field ? ctx.field.label + ': ' : '', vals = [0], wheels = [], locked = false;                 // vals[0]: 0 = '+', 1 = '−'; el resto, dígitos
      for (var i = 0; i < nd; i++) vals.push(0);
      var root = document.createElement('div'); root.className = 'dial dial-n' + ctx.night;
      var row = document.createElement('div'); row.className = 'dial-row'; root.appendChild(row);
      function btn(cls, txt, label, fn) { var b = document.createElement('button'); b.type = 'button'; b.className = cls; b.textContent = txt; b.tabIndex = -1; b.setAttribute('aria-label', label); b.onclick = fn; return b; }
      function paint(i) { wheels[i].v.textContent = i === 0 ? (vals[0] ? '−' : '+') : vals[i]; wheels[i].w.setAttribute('aria-valuetext', wheels[i].v.textContent); wheels[i].w.setAttribute('aria-valuenow', i === 0 ? (vals[0] ? -1 : 1) : vals[i]); }
      function step(i, d) { if (locked) return; var m = i === 0 ? 2 : 10; vals[i] = (vals[i] + d + m) % m; paint(i); }
      function val() { var n = 0; for (var i = 1; i <= nd; i++) n = n * 10 + vals[i]; return vals[0] ? -n : n; }
      function go() { if (locked) return false; var ok = ctx.submit(val()); if (!ok) { root.classList.add('bad'); setTimeout(function () { root.classList.remove('bad'); }, 400); } return ok; }
      function lock() { locked = true; root.classList.add('ok'); }
      function focus(i) { wheels[i || 0].w.focus(); }
      for (var k = 0; k <= nd; k++) (function (i) {
        var w = document.createElement('div'); w.className = 'dial-w'; w.tabIndex = 0; w.setAttribute('role', 'spinbutton');
        w.setAttribute('aria-label', lab + (i === 0 ? 'Signo' : 'Dígito ' + i + ' de ' + nd));
        var v = document.createElement('div'); v.className = 'dial-v';
        w.appendChild(btn('dial-a', '▲', 'Subir', function () { step(i, 1); w.focus(); }));
        w.appendChild(v);
        w.appendChild(btn('dial-a', '▼', 'Bajar', function () { step(i, -1); w.focus(); }));
        w.addEventListener('keydown', function (e) {
          var k2 = e.key;
          if (k2 === 'ArrowUp' || k2 === 'ArrowDown') { step(i, k2 === 'ArrowUp' ? 1 : -1); }
          else if (k2 === 'ArrowLeft' && i > 0) focus(i - 1);
          else if (k2 === 'ArrowRight' && i < nd) focus(i + 1);
          else if (k2 === 'Enter') send();
          else return;
          e.preventDefault(); e.stopPropagation();
        });
        var acc = 0;
        w.addEventListener('wheel', function (e) {
          if (!e.deltaY) return;
          e.preventDefault(); acc += e.deltaY;
          while (Math.abs(acc) >= 50) { step(i, acc < 0 ? 1 : -1); acc -= Math.sign(acc) * 50; }
        }, { passive: false });
        wheels[i] = { w: w, v: v }; row.appendChild(w); paint(i);
      })(k);
      var ok = document.createElement('button'); ok.type = 'button'; ok.className = 'dial-go'; ok.textContent = 'ABRIR'; ok.setAttribute('aria-label', 'Confirmar combinación');
      var send = sendBtn(ctx, ok, go); root.appendChild(ok);
      ctx.ans.appendChild(root);
      return {
        focus: focus, lock: lock,
        solve: function () {
          var s = Math.abs(ans), t = String(s); while (t.length < nd) t = '0' + t;
          if ((ans < 0) !== !!vals[0]) step(0, 1);
          for (var i = 1; i <= nd; i++) { var d = +t[i - 1]; while (vals[i] !== d) step(i, 1); }
          return go();
        }
      };
    }
  };

  /* ---------- cards: cartas que se revuelven ----------
   * Las cartas se muestran con su valor; el jugador calcula y recuerda dónde está su resultado, pulsa BARAJAR (se voltean
   * y se mezclan con animación) y elige la carta. Un error muestra todo otra vez y hay que volver a barajar. */
  INPUTS.cards = {
    mount: function (ctx) {
      var ans = (ctx.field || ctx.q).answer, lab = ctx.field ? ctx.field.label + ': ' : '', vals = ctx.decoys(ctx.done >= 2 ? 4 : 3),
          n = vals.length, state = 'idle';                       // idle | show | shuffle | pick | done
      var root = document.createElement('div'); root.className = 'cards cards-n' + ctx.night + ' idle';
      var track = document.createElement('div'); track.className = 'cards-t'; root.appendChild(track);
      var go = document.createElement('button'); go.type = 'button'; go.className = 'cards-go'; root.appendChild(go);
      var els = vals.map(function (v) {
        var c = document.createElement('button'); c.type = 'button'; c.className = 'card'; c.tabIndex = -1;
        c.innerHTML = '<span class="cin"><span class="cf">' + ctx.px(G.LV.fmt(v)) + '</span><span class="cb"></span></span>';
        c.dataset.i = String(vals.indexOf(v)); return c;
      });
      els.forEach(function (c) { track.appendChild(c); });
      function seen(c) { return +c.dataset.i; }                                         // índice de la carta en vals
      function label() { [].forEach.call(track.children, function (c, k) { c.setAttribute('aria-label', state === 'pick' ? lab + 'Carta ' + (k + 1) + ' de ' + n : lab + 'Carta con el ' + G.LV.fmt(vals[seen(c)])); }); }
      function mode(s, text) {
        state = s; go.setAttribute('aria-label', lab + (s === 'show' ? text.toLowerCase() : text.replace('…', '').toLowerCase())); root.classList.toggle('down', s === 'shuffle' || s === 'pick');
        [].forEach.call(track.children, function (c) { c.tabIndex = s === 'pick' ? 0 : -1; });
        go.textContent = text; go.disabled = s !== 'show'; label();
      }
      function activate() {
        if (state !== 'idle') return;
        root.classList.remove('idle'); mode('show', 'BARAJAR');
      }
      /* animación: una cola de intercambios de casilla; cada fotograma mueve las dos cartas con un arco */
      function shuffle() {
        var pitch = track.children[1].offsetLeft - track.children[0].offsetLeft, lift = track.firstChild.offsetHeight * .22;
        var cs = [].slice.call(track.children), swaps = [], last = -1, k = 4 + 2 * Math.min(ctx.done, 4), dur = Math.max(240, 360 - 30 * ctx.done);
        for (var i = 0; i < k; i++) { var a, b; do { a = (Math.random() * n) | 0; b = (Math.random() * n) | 0; } while (a === b || Math.min(a, b) + '' + Math.max(a, b) === last); last = Math.min(a, b) + '' + Math.max(a, b); swaps.push([a, b]); }
        var pos = cs.map(function (_, i) { return i; }), s = 0, t = 0, prev = performance.now();
        mode('shuffle', 'BARAJANDO…');
        function place(c, i, x, y, z) { c.style.transform = 'translate(' + ((x - i) * pitch) + 'px,' + y + 'px)'; c.style.zIndex = z; }
        function frame(now) {
          if (!root.isConnected) return;
          var dt = Math.min(now - prev, 60); prev = now;
          if (!ctx.paused()) t += dt / dur;
          if (t >= 1) {
            var p = swaps[s], x = pos[p[0]]; pos[p[0]] = pos[p[1]]; pos[p[1]] = x; t = 0; s++;
          }
          if (s < swaps.length) {
            var q = swaps[s], arc = Math.sin(Math.PI * t) * lift;
            cs.forEach(function (c, i) { if (i !== q[0] && i !== q[1]) place(c, i, pos[i], 0, 0); });
            place(cs[q[0]], q[0], pos[q[0]] + (pos[q[1]] - pos[q[0]]) * t, -arc, 2);
            place(cs[q[1]], q[1], pos[q[1]] + (pos[q[0]] - pos[q[1]]) * t, arc * .5, 1);
            requestAnimationFrame(frame); return;
          }
          cs.slice().sort(function (a, b) { return pos[cs.indexOf(a)] - pos[cs.indexOf(b)]; }).forEach(function (c) { c.style.transform = ''; c.style.zIndex = ''; track.appendChild(c); });
          mode('pick', 'ELIGE UNA CARTA'); track.children[0].focus();
        }
        requestAnimationFrame(frame);
      }
      function pick(c) {
        if (state !== 'pick') return;
        var ok = ctx.submit(vals[seen(c)]);
        if (ok) { c.classList.add('ok'); return; }
        c.classList.add('bad'); mode('show', 'BARAJAR DE NUEVO'); go.focus();
      }
      go.onclick = function () { if (state === 'show') { [].forEach.call(track.children, function (c) { c.classList.remove('bad'); }); shuffle(); } };
      track.addEventListener('mousedown', function (e) { if (state !== 'pick') { e.preventDefault(); if (state === 'show') go.focus(); } });
      track.addEventListener('click', function (e) { var c = e.target.closest('.card'); if (c) pick(c); });
      track.addEventListener('keydown', function (e) {
        var k = [].indexOf.call(track.children, document.activeElement), d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (state !== 'pick' || k < 0 || !d) return;
        track.children[(k + d + n) % n].focus(); e.preventDefault(); e.stopPropagation();
      });
      ctx.ans.appendChild(root); label();
      function wait(f) { return new Promise(function (res) { (function w() { if (f()) res(); else setTimeout(w, 40); })(); }); }
      return {
        focus: function () { activate(); if (state === 'show') go.focus(); else if (state === 'pick') track.children[0].focus(); },
        reveal: function () {
          if (state === 'idle' || state === 'done' || state === 'shuffle') return;
          root.classList.remove('down'); mode('show', 'BARAJAR DE NUEVO');
          [].forEach.call(track.children, function (c) { c.classList.toggle('ok', vals[seen(c)] === ans); });
        },
        lock: function () { state = 'done'; root.classList.add('done'); root.classList.remove('down'); [].forEach.call(track.children, function (c) { c.tabIndex = -1; c.disabled = true; }); go.hidden = true; },
        solve: function () {
          activate(); if (state === 'show') go.click();
          return wait(function () { return state === 'pick' || state === 'done' || !root.isConnected; }).then(function () {
            if (state !== 'pick') return;
            var c = [].filter.call(track.children, function (x) { return vals[seen(x)] === ans; })[0]; c.click();
          });
        }
      };
    }
  };

  /* ---------- catch: atrapar al vuelo ----------
   * Los candidatos pasan en cinta (derecha a izquierda, en bucle, velocidad moderada, sin límite de tiempo). La red sigue al cursor
   * o se mueve con ←→; clic o Espacio atrapa lo que esté bajo la red. Una atrapada por intento; el candidato fallado se apaga.
   * Una red vacía no cuesta nada. */
  INPUTS.catch = {
    mount: function (ctx) {
      var ans = (ctx.field || ctx.q).answer, lab = ctx.field ? ctx.field.label + ': ' : '', vals = ctx.decoys(4), n = vals.length,
          sp = 1 / n, speed = 0.075, off = Math.random(), netX = .5, state = 'play', cw = 1, pw = .17;     // fracciones del ancho; sp = separación en la cinta; pw = ancho de un candidato
      var root = document.createElement('div'); root.className = 'catch catch-n' + ctx.night;
      var stage = document.createElement('div'); stage.className = 'catch-s'; stage.tabIndex = 0; stage.setAttribute('role', 'application');
      stage.setAttribute('aria-label', lab + 'Atrapa el resultado correcto: mueve la red con las flechas izquierda y derecha y pulsa Espacio');
      var net = document.createElement('div'); net.className = 'catch-net'; stage.appendChild(net);
      var items = vals.map(function (v) { var d = document.createElement('div'); d.className = 'catch-i'; d.innerHTML = ctx.px(G.LV.fmt(v)); d.dataset.v = String(v); stage.appendChild(d); return d; });
      root.appendChild(stage); ctx.ans.appendChild(root);
      function cx(i) { var x = ((off - i * sp) % 1 + 1) % 1; return 1.08 - x * 1.16; }       // centro del candidato (fracción del ancho): entra por la derecha y sale por la izquierda
      function draw() { cw = stage.clientWidth || 1; items.forEach(function (d, i) { d.style.transform = 'translateX(' + ((cx(i) - pw / 2) * cw) + 'px)'; }); net.style.transform = 'translateX(' + ((netX - .045) * cw) + 'px)'; }
      var prev = performance.now();
      function frame(now) {
        if (!root.isConnected) return;
        var dt = Math.min(now - prev, 60); prev = now;
        if (state === 'play' && !ctx.paused()) off = (off + speed * dt / 1000) % 1;
        draw(); requestAnimationFrame(frame);
      }
      function setNet(x) { netX = Math.max(.04, Math.min(.96, x)); }
      function grab() {
        if (state !== 'play') return;
        var best = -1, bd = 9;
        items.forEach(function (d, i) { if (d.classList.contains('bad')) return; var dist = Math.abs(cx(i) - netX); if (dist < pw / 2 + .01 && dist < bd) { bd = dist; best = i; } });
        net.classList.add('snap'); setTimeout(function () { net.classList.remove('snap'); }, 160);
        if (best < 0) return;
        items[best].classList.add(ctx.submit(vals[best]) ? 'ok' : 'bad');
      }
      stage.addEventListener('mousemove', function (e) { var r = stage.getBoundingClientRect(); setNet((e.clientX - r.left) / r.width); });
      stage.addEventListener('mousedown', function (e) { e.preventDefault(); if (document.activeElement !== stage && state === 'play') stage.focus(); });
      stage.addEventListener('click', function (e) { var r = stage.getBoundingClientRect(); setNet((e.clientX - r.left) / r.width); grab(); });
      stage.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') setNet(netX - .04);
        else if (e.key === 'ArrowRight') setNet(netX + .04);
        else if (e.key === ' ' || e.key === 'Enter') { if (!e.repeat) grab(); }
        else return;
        e.preventDefault(); e.stopPropagation();
      });
      requestAnimationFrame(frame);
      function wait(f) { return new Promise(function (res) { (function w() { if (f() || !root.isConnected) res(); else setTimeout(w, 30); })(); }); }
      return {
        focus: function () { if (state === 'play') stage.focus(); },
        lock: function () { state = 'done'; root.classList.add('done'); stage.tabIndex = -1; },
        reveal: function () { items.forEach(function (d) { d.classList.toggle('ok', +d.dataset.v === ans); }); },
        solve: function () {
          var i = vals.indexOf(ans);
          return wait(function () { return Math.abs(cx(i) - .5) < .02; }).then(function () { netX = .5; draw(); grab(); });
        }
      };
    }
  };

  /* ---------- slots: soltar en la ranura ----------
   * Fichas con valores (los correctos y señuelos típicos) y ranuras con etiqueta (a, b, c, o el nombre del resultado).
   * Clic en una ficha y clic en una ranura (en cualquier orden), o Tab/flechas + Enter/Espacio. Cada soltada se comprueba
   * sola: la buena se queda en la ranura; la mala vuelve a la bandeja y cuesta lo de siempre. En 'multi' se monta UNA vez (whole). */
  INPUTS.slots = {
    whole: true,
    mount: function (ctx) {
      /* En 'number' la etiqueta de la ranura sale de q.q con la forma «¿Cuánto vale X?» (X = etiqueta); si no coincide, «Resultado». */
      var fs = ctx.fields, many = !!fs, ask = String(ctx.q.q || '').match(/vale (.+)\?/),
          tg = many ? fs.map(function (f) { return { label: f.label, answer: f.answer }; }) : [{ label: ask ? ask[1] : ctx.q.crit ? 'Criterio' : 'Resultado', answer: ctx.q.answer }],
          n = tg.length, total = Math.max(4, n + 2) + (ctx.done >= 2 ? 1 : 0), vals = tg.map(function (t) { return t.answer; });
      for (var r = 0; vals.length < total && r < n * 3; r++) ctx.decoys(5, many ? r % n : undefined).forEach(function (v) { if (vals.length < total && vals.indexOf(v) < 0) vals.push(v); });
      vals = shuf(vals);
      var held = -1, sel = -1, locked = false, filled = tg.map(function () { return -1; });
      var root = document.createElement('div'); root.className = 'slots slots-n' + ctx.night;
      var hint = document.createElement('div'); hint.className = 'sl-hint'; hint.setAttribute('role', 'status'); root.appendChild(hint);
      var row = document.createElement('div'); row.className = 'sl-row'; root.appendChild(row);
      var tray = document.createElement('div'); tray.className = 'sl-tray'; root.appendChild(tray);
      var slots = tg.map(function (t, k) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'sl-slot'; b.tabIndex = k ? -1 : 0;
        b.innerHTML = '<span class="sl-lab">' + ctx.rad(ctx.px(t.label)) + '</span><span class="sl-box"></span>';
        b.setAttribute('aria-label', 'Ranura de ' + t.label); row.appendChild(b); return b;
      });
      var chips = vals.map(function (v, i) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'sl-chip'; b.tabIndex = i ? -1 : 0; b.setAttribute('aria-pressed', 'false');
        b.innerHTML = ctx.px(G.LV.fmt(v)); b.setAttribute('aria-label', 'Ficha ' + G.LV.fmt(v)); tray.appendChild(b); return b;
      });
      function freeS() { return slots.filter(function (b, k) { return filled[k] < 0; }); }
      function freeC() { return chips.filter(function (b) { return !b.classList.contains('used'); }); }
      function rove(list) { var cur = list.filter(function (b) { return b.tabIndex === 0; })[0] || list[0]; list.forEach(function (b) { b.tabIndex = b === cur ? 0 : -1; }); }
      function mark() {
        chips.forEach(function (c, i) { c.classList.toggle('held', i === held); c.setAttribute('aria-pressed', String(i === held)); });
        slots.forEach(function (s, k) { s.classList.toggle('sel', k === sel); });
        root.classList.toggle('arm', held >= 0 || sel >= 0);
        hint.textContent = locked ? '' : held >= 0 ? 'Ahora pulsa la ranura.' : sel >= 0 ? 'Ahora pulsa la ficha.' : n > 1 ? 'Toma una ficha y suéltala en su ranura.' : 'Toma la ficha con el resultado y suéltala en la ranura.';
      }
      function put(i, k) {                                                          // la ficha i queda dentro de la ranura k
        filled[k] = i; slots[k].classList.add('ok'); slots[k].tabIndex = -1; slots[k].setAttribute('aria-disabled', 'true');
        slots[k].querySelector('.sl-box').innerHTML = '<span class="sl-v">' + ctx.px(G.LV.fmt(vals[i])) + '</span>';
        slots[k].setAttribute('aria-label', 'Ranura de ' + tg[k].label + ': ' + G.LV.fmt(vals[i]));
        chips[i].classList.remove('ok'); chips[i].classList.add('used'); chips[i].tabIndex = -1; chips[i].setAttribute('aria-hidden', 'true'); chips[i].disabled = true;
        rove(freeC()); rove(freeS());
      }
      function drop() {
        var i = held, k = sel; held = sel = -1;
        var ok = many ? ctx.submit(vals[i], k) : ctx.submit(vals[i]);
        if (ok) put(i, k);
        else { chips[i].classList.add('bad'); slots[k].classList.add('bad'); root.classList.add('shake'); setTimeout(function () { chips[i].classList.remove('bad'); slots[k].classList.remove('bad'); root.classList.remove('shake'); }, 450); }
        mark();
        if (!locked) { var f = ok ? freeC()[0] : chips[i]; if (f) f.focus(); }
      }
      chips.forEach(function (c, i) {
        c.onclick = function () {
          if (locked || c.classList.contains('used')) return;
          held = held === i ? -1 : i; if (held >= 0 && sel >= 0) return drop();
          mark(); if (held >= 0 && freeS()[0]) (slots.filter(function (s) { return s.tabIndex === 0; })[0] || freeS()[0]).focus();
        };
      });
      slots.forEach(function (s, k) {
        s.onclick = function () {
          if (locked || filled[k] >= 0) return;
          sel = sel === k ? -1 : k; if (sel >= 0 && held >= 0) return drop();
          var cf = chips.filter(function (c) { return c.tabIndex === 0; })[0] || freeC()[0]; mark(); if (sel >= 0 && cf) cf.focus();
        };
      });
      root.addEventListener('focusin', function (e) { [chips, slots].forEach(function (g) { if (g.indexOf(e.target) >= 0) g.forEach(function (b) { b.tabIndex = b === e.target ? 0 : -1; }); }); });   // tabIndex itinerante: Tab salta de grupo en grupo
      root.addEventListener('keydown', function (e) {
        var t = e.target, isC = chips.indexOf(t) >= 0, isS = slots.indexOf(t) >= 0; if (!isC && !isS) return;
        var list = isC ? freeC() : freeS(), d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { if (list.length) list[(list.indexOf(t) + d + list.length) % list.length].focus(); }   // sin libres (pregunta ya ganada) no hay a dónde mover
        else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { var o = isC ? freeS() : freeC(); if (o.length) (o.filter(function (b) { return b.tabIndex === 0; })[0] || o[0]).focus(); }
        else return;
        e.preventDefault(); e.stopPropagation();
      });
      ctx.ans.appendChild(root); mark();
      function chipOf(v) { return chips.filter(function (c, i) { return !c.classList.contains('used') && vals[i] === v; })[0]; }
      return {
        focus: function () { var c = freeC()[0]; if (c) c.focus(); },
        lock: function () { locked = true; root.classList.add('done'); mark(); },
        reveal: function () { root.classList.add('rv'); chips.forEach(function (c, i) { c.classList.toggle('ok', tg.some(function (t, k) { return filled[k] < 0 && t.answer === vals[i]; })); }); },   // marca las fichas correctas; el jugador las suelta él mismo
        solve: function () {
          tg.forEach(function (t, k) { if (filled[k] >= 0) return; held = chips.indexOf(chipOf(t.answer)); sel = k; drop(); });
          return locked;
        }
      };
    }
  };

  /* ---------- padK: teclado temático (receta de cocina en la noche 4; caja registradora en las demás) ---------- */
  INPUTS.padK = {
    mount: function (ctx) {
      if ((ctx.field || ctx.q).crit) return critPad(ctx);
      var ans = (ctx.field || ctx.q).answer, lab = ctx.field ? ctx.field.label + ': ' : '', txt = '', locked = false;
      var root = document.createElement('div'); root.className = 'padk padk-n' + ctx.night;
      var side = document.createElement('div'); side.className = 'padk-s';
      var disp = document.createElement('div'); disp.className = 'padk-d'; disp.setAttribute('role', 'status'); disp.setAttribute('aria-label', lab + 'Valor escrito');
      var keys = document.createElement('div'); keys.className = 'padk-k'; side.appendChild(disp); root.appendChild(keys); root.appendChild(side);      // teclas primero en el DOM (Tab: teclas → LISTO); CSS pone el panel a la izquierda
      function show() { disp.innerHTML = txt ? ctx.px(txt.replace('-', '−')) : '<span class="padk-ph">?</span>'; }
      function press(k) {
        if (locked) return;
        if (k === 'back') txt = txt.slice(0, -1);
        else if (k === '-') txt = txt[0] === '-' ? txt.slice(1) : '-' + txt;
        else if (txt.replace('-', '').length < 4) txt += k;
        show();
      }
      function go() {
        if (locked) return false;
        if (txt === '' || txt === '-') { ctx.say('bad', 'Escribe un número (usa − para negativos).'); return false; }
        var ok = ctx.submit(parseInt(txt, 10)); if (!ok) { root.classList.add('bad'); setTimeout(function () { root.classList.remove('bad'); }, 400); }
        return ok;
      }
      ['7', '8', '9', 'back', '4', '5', '6', '-', '1', '2', '3', '0'].forEach(function (k) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'padk-b'; b.tabIndex = k === '7' ? 0 : -1;
        if (k === '-') b.innerHTML = ctx.px('−'); else b.textContent = k === 'back' ? '⌫' : k; b.setAttribute('aria-label', lab + (k === 'back' ? 'Borrar' : k === '-' ? 'Menos' : k));
        b.onclick = function () { press(k); }; keys.appendChild(b);
      });
      var ent = document.createElement('button'); ent.type = 'button'; ent.className = 'padk-go'; ent.textContent = ctx.night === 4 ? 'LISTO' : 'COBRAR'; ent.setAttribute('aria-label', lab + 'Confirmar'); side.appendChild(ent); var send = sendBtn(ctx, ent, go);
      root.addEventListener('keydown', function (e) {
        var k = e.key;
        if (/^\d$/.test(k)) press(k);
        else if (k === '-' || k === '−') press('-');
        else if (k === 'Backspace') press('back');
        else if (k === 'Enter') send();
        else if (k.indexOf('Arrow') === 0) {
          var bs = [].slice.call(keys.children), i = bs.indexOf(document.activeElement);
          if (i < 0) { if (k === 'ArrowUp') bs[8].focus(); else return; }
          else {
            var j = i + (k === 'ArrowLeft' ? -1 : k === 'ArrowRight' ? 1 : k === 'ArrowUp' ? -4 : 4);
            if (k === 'ArrowLeft' && i % 4 === 0 || k === 'ArrowRight' && i % 4 === 3 || j < 0) return;
            if (j > 11) ent.focus(); else bs[j].focus();
          }
        } else return;
        e.preventDefault(); e.stopPropagation();
      });
      keys.addEventListener('focusin', function (e) { [].forEach.call(keys.children, function (b) { b.tabIndex = b === e.target ? 0 : -1; }); });      // tabIndex itinerante: Tab entra a las teclas y sale a LISTO
      show(); ctx.ans.appendChild(root);
      return {
        focus: function () { keys.children[0].focus(); },
        lock: function () { locked = true; root.classList.add('ok'); [].forEach.call(root.querySelectorAll('button'), function (b) { b.disabled = true; }); },
        reveal: function () { txt = String(ans); show(); },
        solve: function () { txt = String(ans); show(); return go(); }
      };
    }
  };
  /* ---------- pipes: tubería ----------
   * Cuadrícula de tubos (rectos y codos; algunas casillas bloqueadas) con la fuente a la izquierda y una salida con valor por fila a la derecha
   * (el correcto y señuelos típicos). Los tubos se giran con clic, Espacio o Enter (flechas mueven el foco). El agua sale de la fuente y sigue
   * el tubo; ABRIR manda el valor de la salida que recibe agua (sin agua en ninguna salida no cuesta nada). Como solo hay rectos y codos, el
   * agua forma UN camino y nunca llega a dos salidas. La distribución se sortea hasta que cada salida tenga exactamente UN camino posible
   * (layout) y desde el inicio ninguna salida tenga agua ni quede a menos de 3 giros. Un error desordena los tubos mojados (no se puede «barrer»). */
  var PD = [[-1, 0], [0, 1], [1, 0], [0, -1]];                                         // N, E, S, O; máscara de lados: 1 << dirección
  function turn(m, k) { for (; k > 0; k--) m = ((m << 1) | (m >> 3)) & 15; return m; }  // k giros de un cuarto, sentido del reloj
  function pmask(t, k) { return turn(t === 1 ? 10 : 3, k); }                           // t: 0 bloqueada, 1 recto (E+O), 2 codo (N+E)
  /* caminos de la fuente (entra por el oeste en la fila rs) a cada salida: { cnt[k], path[k] = [{ r, c, m }] con la máscara que necesita cada casilla } */
  function pipePaths(T, R, C, rs) {
    var cnt = [], path = [], seen = {}, k;
    for (k = 0; k < R; k++) cnt[k] = 0;
    function walk(r, c, d, cur) {                                                      // llega a (r, c) viajando hacia d
      var t = T[r][c], from = 1 << ((d + 2) % 4);
      if (!t || seen[r * C + c]) return;
      seen[r * C + c] = 1;
      (t === 1 ? [d] : [(d + 1) % 4, (d + 3) % 4]).forEach(function (nd) {
        var nr = r + PD[nd][0], nc = c + PD[nd][1];
        cur.push({ r: r, c: c, m: from | 1 << nd });
        if (nc >= C && nd === 1) { cnt[r]++; path[r] = cur.slice(); }
        else if (nr >= 0 && nr < R && nc >= 0 && nc < C) walk(nr, nc, nd, cur);
        cur.pop();
      });
      seen[r * C + c] = 0;
    }
    walk(rs, 0, 1, []);
    return { cnt: cnt, path: path };
  }
  /* giros que faltan para que la casilla (t, k) quede con la máscara m */
  function need(t, k, m) { for (var j = 0; j < 4; j++) if (pmask(t, (k + j) % 4) === m) return j; return 0; }
  function layout(R, C) {
    for (;;) {                                                                          // ~250-400 sorteos de media (< 1 ms) para 3x3, 3x4 y 4x4; sin tope: la probabilidad de acierto por sorteo es constante
      var rs = (Math.random() * R) | 0, T = [], r, c;
      for (r = 0; r < R; r++) { T.push([]); for (c = 0; c < C; c++) { var x = Math.random(); T[r].push(x < .12 ? 0 : x < .5 ? 1 : 2); } }
      var P = pipePaths(T, R, C, rs);
      if (P.cnt.every(function (n) { return n === 1; })) return { T: T, rs: rs, path: P.path };
    }
  }
  INPUTS.pipes = {
    mount: function (ctx) {
      var ans = (ctx.field || ctx.q).answer, lab = ctx.field ? ctx.field.label + ': ' : '', small = !!ctx.field, n7 = ctx.night === 7,
          vals = ctx.decoys(small ? 3 : ctx.done >= 2 ? 4 : 3), R = vals.length, C = small ? 3 : 4, tk = vals.indexOf(ans), locked = false,
          L = layout(R, C), T = L.T, rs = L.rs, rot = [], deg = [], cells = [], plates = [], cur = [rs, 0], r, c;
      for (r = 0; r < R; r++) { rot.push([]); deg.push([]); for (c = 0; c < C; c++) { rot[r].push(0); deg[r].push(0); } }
      function cost(k) { return L.path[k].reduce(function (s, p) { return s + need(T[p.r][p.c], rot[p.r][p.c], p.m); }, 0); }
      for (var g = 0; g < 400; g++) {                                                  // estado inicial: sin agua en ninguna salida y todas a 3 giros o más
        for (r = 0; r < R; r++) for (c = 0; c < C; c++) rot[r][c] = (Math.random() * 4) | 0;
        var ok0 = flow().out < 0; for (var k = 0; k < R; k++) if (cost(k) < 3) ok0 = false;
        if (ok0) break;
      }
      for (r = 0; r < R; r++) for (c = 0; c < C; c++) deg[r][c] = rot[r][c] * 90;
      /* el agua: desde la fuente, casilla a casilla, mientras el tubo tenga el lado por donde entra */
      function flow() {
        var wet = {}, rr = rs, cc = 0, from = 3, out = -1;
        for (var i = 0; i <= R * C; i++) {
          var m = pmask(T[rr][cc], rot[rr][cc]);
          if (!(m & 1 << from)) break;
          wet[rr * C + cc] = 1;
          var nd = [0, 1, 2, 3].filter(function (d) { return d !== from && (m & 1 << d); })[0], nr = rr + PD[nd][0], nc = cc + PD[nd][1];
          if (nc >= C) { if (nd === 1) out = rr; break; }
          if (nr < 0 || nr >= R || nc < 0) break;
          rr = nr; cc = nc; from = (nd + 2) % 4;
        }
        return { wet: wet, out: out };
      }
      var root = document.createElement('div'); root.className = 'pipes pipes-n' + ctx.night + (small ? ' pp-sm' : '');
      var hint = document.createElement('div'); hint.className = 'pp-hint'; hint.setAttribute('role', 'status');
      hint.textContent = n7 ? 'Gira los ductos para que el aire llegue a la salida con tu resultado.' : 'Gira los tubos para que el agua llegue a la salida con tu resultado.';
      if (!small) root.appendChild(hint);
      var board = document.createElement('div'); board.className = 'pp-b'; board.style.setProperty('--rs', String(rs)); board.style.setProperty('--nc', String(C)); board.style.setProperty('--nr', String(R));
      var src = document.createElement('div'); src.className = 'pp-src'; src.innerHTML = '<i class="pp-nz"></i>'; board.appendChild(src);
      var SIDES = ['arriba', 'a la derecha', 'abajo', 'a la izquierda'];
      function paint() {
        var f = flow();
        for (var r = 0; r < R; r++) for (var c = 0; c < C; c++) {
          var b = cells[r][c]; if (!b) continue;
          var w = !!f.wet[r * C + c], m = pmask(T[r][c], rot[r][c]);
          b.firstChild.style.transform = 'rotate(' + deg[r][c] + 'deg)'; b.classList.toggle('wet', w);
          b.setAttribute('aria-label', lab + 'Tubo fila ' + (r + 1) + ', columna ' + (c + 1) + ': ' + (T[r][c] === 1 ? 'recto' : 'codo') + ', abierto ' + [0, 1, 2, 3].filter(function (d) { return m & 1 << d; }).map(function (d) { return SIDES[d]; }).join(' y ') + (w ? ', con ' + (n7 ? 'aire' : 'agua') : ''));
        }
        plates.forEach(function (p, k) { p.classList.toggle('lit', k === f.out); p.setAttribute('aria-label', 'Salida ' + (k + 1) + ': ' + G.LV.fmt(vals[k]) + (k === f.out ? ', recibe ' + (n7 ? 'aire' : 'agua') : '')); });
        return f;
      }
      function spin(r, c, j) { rot[r][c] = (rot[r][c] + j) % 4; deg[r][c] += 90 * j; }
      function rove(r, c) { cur = [r, c]; cells.forEach(function (row) { row.forEach(function (b) { if (b) b.tabIndex = -1; }); }); cells[r][c].tabIndex = 0; }
      for (r = 0; r < R; r++) { cells.push([]); for (c = 0; c < C; c++) (function (r, c) {
        var t = T[r][c], b;
        if (!t) { b = document.createElement('div'); b.className = 'pp-c pp-x'; b.setAttribute('aria-hidden', 'true'); cells[r].push(null); }
        else {
          b = document.createElement('button'); b.type = 'button'; b.className = 'pp-c pp-t' + t; b.tabIndex = -1;
          b.innerHTML = '<span class="pp-i">' + (t === 1 ? '<i class="pa pa-e"></i><i class="pa pa-w"></i>' : '<i class="pa pa-n"></i><i class="pa pa-e"></i>') + '<i class="pp-j"></i></span>';
          b.onclick = function () { if (locked) return; spin(r, c, 1); rove(r, c); paint(); };
          b.addEventListener('focus', function () { rove(r, c); });
          cells[r].push(b);
        }
        b.style.gridRow = String(r + 1); b.style.gridColumn = String(c + 2); board.appendChild(b);
      })(r, c); }
      vals.forEach(function (v, k) {
        var o = document.createElement('div'); o.className = 'pp-out'; o.style.gridRow = String(k + 1); o.style.gridColumn = String(C + 2);
        o.innerHTML = '<i class="pp-os"></i><span class="pp-plate">' + ctx.px(G.LV.fmt(v)) + '</span>'; board.appendChild(o); plates.push(o);
      });
      var main = document.createElement('div'); main.className = 'pp-main'; main.appendChild(board); root.appendChild(main);
      var ok = document.createElement('button'); ok.type = 'button'; ok.className = 'pp-go'; ok.textContent = n7 ? 'ENCENDER' : 'ABRIR VÁLVULA'; ok.setAttribute('aria-label', lab + (n7 ? 'Encender la turbina' : 'Abrir la válvula') + ' hacia la salida conectada');
      main.appendChild(ok);
      function go() {
        if (locked) return false;
        var f = flow();
        if (f.out < 0) { ctx.say('bad', 'Todavía no llega ' + (n7 ? 'el aire' : 'el agua') + ' a ninguna salida.'); return false; }
        var good = ctx.submit(vals[f.out]);
        if (!good) {
          root.classList.add('bad'); setTimeout(function () { root.classList.remove('bad'); }, 400);
          for (var i in f.wet) { var r = (i / C) | 0, c = i % C; spin(r, c, T[r][c] === 1 ? 1 : 1 + ((Math.random() * 3) | 0)); }     // la presión desordena el tramo mojado
          paint();
        }
        return good;
      }
      sendBtn(ctx, ok, go);
      root.addEventListener('keydown', function (e) {
        var k = e.key, d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[k];
        if (!d && k !== ' ' && k !== 'Enter') return;
        e.stopPropagation();                                                           // Espacio y Enter los resuelve el clic nativo del botón
        if (!d) return;
        e.preventDefault();
        if (document.activeElement === ok) { if (k === 'ArrowUp') cells[cur[0]][cur[1]].focus(); return; }
        var r = cur[0] + d[0], c = cur[1] + d[1];
        while (r >= 0 && r < R && c >= 0 && c < C && !cells[r][c]) { r += d[0]; c += d[1]; }       // salta las casillas bloqueadas
        if (r >= R) ok.focus(); else if (r >= 0 && c >= 0 && c < C) cells[r][c].focus();
      });
      ctx.ans.appendChild(root); rove(rs, 0); paint();
      function setSolution() { L.path[tk].forEach(function (p) { spin(p.r, p.c, need(T[p.r][p.c], rot[p.r][p.c], p.m)); }); return paint(); }
      return {
        focus: function () { cells[cur[0]][cur[1]].focus(); },
        lock: function () { locked = true; root.classList.add('ok'); ok.disabled = true; cells.forEach(function (row) { row.forEach(function (b) { if (b) { b.tabIndex = -1; b.disabled = true; } }); }); },
        reveal: function () { setSolution(); plates[tk].classList.add('ok'); },
        solve: function () { setSolution(); return go(); }
      };
    }
  };

  /* ---------- levers: palancas ----------
   * Una fila de palancas, cada una con un valor (el correcto y señuelos típicos; en 'choice', las opciones). Se baja la del resultado:
   * clic, o ←→ para elegir y Espacio/Enter. Una palanca mala se queda abajo y ya no se puede usar (no se puede «barrer»). Con confirm,
   * hay que MANTENERLA pulsada hasta que llegue al fondo; si se suelta antes, sube sola. */
  INPUTS.levers = {
    mount: function (ctx) {
      var ans = (ctx.field || ctx.q).answer, lab = ctx.field ? ctx.field.label + ': ' : '', vals = ctx.decoys(ctx.done >= 2 ? 4 : 3), locked = false;
      var root = document.createElement('div'); root.className = 'levers levers-n' + ctx.night;
      var hint = document.createElement('div'); hint.className = 'lv-hint'; hint.setAttribute('role', 'status');
      hint.textContent = 'Baja la palanca con tu resultado.' + (ctx.confirm ? ' Mantenla pulsada hasta el fondo.' : '');
      var row = document.createElement('div'); row.className = 'lv-row'; root.appendChild(hint); root.appendChild(row);
      var us = vals.map(function (v, i) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'lv-u'; b.tabIndex = i ? -1 : 0;
        b.innerHTML = '<span class="lv-p">' + ctx.px(G.LV.fmt(v)) + '</span><span class="lv-h"><i class="lv-s"></i></span>';
        b.setAttribute('aria-label', lab + 'Palanca con el ' + G.LV.fmt(v) + (ctx.confirm ? ', mantén pulsado para bajarla' : ''));
        row.appendChild(b); return b;
      });
      function free() { return us.filter(function (b) { return !b.disabled; }); }
      function pull(i) {
        var b = us[i]; if (locked || b.disabled) return false;
        b.classList.add('down'); b.disabled = true;
        var ok = ctx.submit(vals[i]);
        b.classList.add(ok ? 'ok' : 'bad');
        if (!ok) { var f = free(); f.forEach(function (x, k) { x.tabIndex = k ? -1 : 0; }); if (f[0]) f[0].focus(); }
        return ok;
      }
      us.forEach(function (b, i) {
        if (ctx.confirm) holdBtn(b, function () { pull(i); }, function (p) { b.style.setProperty('--pull', String(p)); });
        else b.onclick = function () { pull(i); };
      });
      row.addEventListener('keydown', function (e) {
        var f = free(), k = f.indexOf(document.activeElement), d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d || k < 0) return;
        var nx = f[(k + d + f.length) % f.length]; f.forEach(function (x) { x.tabIndex = x === nx ? 0 : -1; }); nx.focus();
        e.preventDefault(); e.stopPropagation();
      });
      ctx.ans.appendChild(root);
      return {
        focus: function () { var f = free(); if (f[0]) (f.filter(function (x) { return x.tabIndex === 0; })[0] || f[0]).focus(); },
        lock: function () { locked = true; root.classList.add('done'); us.forEach(function (b) { b.disabled = true; }); },
        reveal: function () { us.forEach(function (b, i) { b.classList.toggle('ok', vals[i] === ans); }); },
        solve: function () { return pull(vals.indexOf(ans)); }
      };
    }
  };

  /* ---------- confirm: mantener pulsado para enviar ----------
   * Con `confirm: true` en el spot, el botón que envía (ABRIR, COBRAR, ABRIR VÁLVULA, una palanca) no responde al clic: hay que
   * mantenerlo pulsado HOLD ms (botón del mouse, o Espacio / Enter / E). Al soltar antes, se cancela sin costo. */
  var HOLD = 700;
  function holdBtn(b, fn, prog) {
    var t0 = 0, by = '', raf = 0;
    function set(p) { b.style.setProperty('--hold', String(p)); if (prog) prog(p); }
    function tick(now) {
      if (!t0) return;
      if (!b.isConnected || b.disabled) { stop(by); return; }
      var p = Math.min(1, (now - t0) / HOLD); set(p);
      if (p < 1) { raf = requestAnimationFrame(tick); return; }
      t0 = 0; b.classList.remove('holding'); fn(); if (!b.classList.contains('down')) set(0);
    }
    function start(src) { if (t0 || b.disabled) return; by = src; t0 = performance.now(); b.classList.add('holding'); raf = requestAnimationFrame(tick); }
    function stop(src) { if (!t0 || src !== by) return; t0 = 0; cancelAnimationFrame(raf); b.classList.remove('holding'); set(0); }
    function isKey(e) { return e.key === ' ' || e.key === 'Enter' || e.key === 'e' || e.key === 'E'; }
    b.classList.add('hold-b');
    b.addEventListener('pointerdown', function (e) { if (e.button === 0) { e.preventDefault(); b.focus(); start('p'); } });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { b.addEventListener(ev, function () { stop('p'); }); });
    b.addEventListener('keydown', function (e) { if (!isKey(e)) return; e.preventDefault(); e.stopPropagation(); if (!e.repeat) start('k'); });
    b.addEventListener('keyup', function (e) { if (!isKey(e)) return; e.preventDefault(); stop('k'); });
    b.addEventListener('blur', function () { stop(by); });
  }
  /* El botón de enviar de un widget: sin confirm, un clic; con confirm, mantener pulsado. Devuelve lo que hace Enter desde otra parte
   * del widget (un rodillo, el teclado): sin confirm envía; con confirm lleva el foco al botón y explica que hay que mantenerlo. */
  function sendBtn(ctx, b, fn) {
    if (!ctx.confirm) { b.onclick = fn; return fn; }
    holdBtn(b, fn); b.insertAdjacentHTML('beforeend', '<small class="hold-t">mantén pulsado</small>');
    b.setAttribute('aria-label', b.getAttribute('aria-label') + ' (mantén pulsado)');
    return function () { b.focus(); ctx.say('', 'Mantén pulsado <b>' + b.firstChild.textContent + '</b> (o Espacio / E) para confirmar.'); return false; };
  }

  INPUTS.levers.types = ['number', 'choice'];
  INPUTS.dial.types = ['number', 'multi'];
  INPUTS.cards.types = ['number', 'multi', 'choice'];
  INPUTS.catch.types = ['number', 'choice'];
  INPUTS.padK.types = ['number', 'multi'];
  INPUTS.slots.types = ['number', 'multi'];
  INPUTS.pipes.types = ['number', 'multi'];

  G.INPUTS_DECOYS = decoys;
  G.INPUTS_RESET = function () { pools = new WeakMap(); };
  G.INPUTS = INPUTS;
})(window);
