/* inputs2.js — tres formas de responder que trabajan sobre la figura (se suman a las de inputs.js):
 *   overlay   · Superponer: arrastra, gira y voltea un triángulo sobre el otro; al encajar elige el criterio.
 *   detective · Detective de marcas: toca las partes (lados y ángulos) que prueban el criterio pedido.
 *   odd       · El intruso: de 4 pares, tres usan el mismo criterio; toca el que no.
 * Mismo contrato que inputs.js (ctx.submit(v) compara con la respuesta); `own: true` = el widget dibuja su propia figura
 * (game.js no pone la figura fija encima). Datos de la pregunta: q.kind + q.seed (overlay, detective) o q.odd (odd). */
(function (G) {
  'use strict';
  var INPUTS = G.INPUTS, NAME = ['', 'LLL', 'LAL', 'ALA', 'AAL', 'HC'], FULL = { LLL: 'los tres lados', LAL: 'dos lados y el ángulo entre ellos', ALA: 'dos ángulos y el lado entre ellos', AAL: 'dos ángulos y un lado que no está entre ellos', HC: 'la hipotenusa y un cateto' };
  var NS = 'http://www.w3.org/2000/svg';

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function setQ(ctx, text) { var n = ctx.box.querySelector('.qm-q'); if (n) n.textContent = text; }
  function centroid(P) { return [(P[0][0] + P[1][0] + P[2][0]) / 3, (P[0][1] + P[1][1] + P[2][1]) / 3]; }
  function critButtons(ctx, onPick) {
    var row = el('div', 'opts ov-crit');
    [1, 2, 3, 4, 5].forEach(function (c) { var b = el('button', 'opt', ctx.px(NAME[c])); b.type = 'button'; b.dataset.v = String(c); b.setAttribute('aria-label', NAME[c]); b.onclick = function () { onPick(c, b); }; row.appendChild(b); });
    return row;
  }

  /* ---------------- overlay: superponer ---------------- */
  INPUTS.overlay = {
    own: true,
    mount: function (ctx) {
      var q = ctx.q, g = TRI.geom(q.kind, { seed: q.seed }), A = g.A, B0 = g.B, cB = centroid(B0), cA = centroid(A), W = 280, H = 120;
      var st = { dx: 0, dy: 0, rot: 0, flip: false }, matched = false, locked = false;
      var root = el('div', 'ov'), hint = el('div', 'sl-hint', 'Arrastra el triángulo de la derecha sobre el de la izquierda. Gíralo con ⟲ ⟳ y voltéalo con ⇋.'); root.appendChild(hint);
      var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('class', 'tri ov-svg'); svg.setAttribute('tabindex', '0'); svg.setAttribute('role', 'application');
      svg.setAttribute('aria-label', 'Superponer triángulos: flechas mueven, Q y E giran, F voltea');
      var ga = document.createElementNS(NS, 'g'); ga.innerHTML = TRI.inner(A, null, g.mk, false, g.num);
      var gb = document.createElementNS(NS, 'g'); gb.setAttribute('class', 'ov-b'); gb.innerHTML = TRI.inner(B0, null, g.mk, false, g.num);
      svg.appendChild(ga); svg.appendChild(gb); root.appendChild(svg);
      function apply() {
        gb.setAttribute('transform', 'translate(' + st.dx + ' ' + st.dy + ') translate(' + cB[0] + ' ' + cB[1] + ') rotate(' + st.rot + ') scale(' + (st.flip ? -1 : 1) + ' 1) translate(' + -cB[0] + ' ' + -cB[1] + ')');
      }
      function pts() {                                                              // vértices de B ya movidos
        var a = st.rot * Math.PI / 180, co = Math.cos(a), si = Math.sin(a);
        return B0.map(function (p) { var x = (p[0] - cB[0]) * (st.flip ? -1 : 1), y = p[1] - cB[1]; return [cB[0] + x * co - y * si + st.dx, cB[1] + x * si + y * co + st.dy]; });
      }
      function fits() {                                                              // los tres vértices de B coinciden con los de A (en cualquier orden)
        var P = pts(), perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]], best = 1e9;
        perms.forEach(function (pm) { var m = 0; for (var i = 0; i < 3; i++) m = Math.max(m, Math.hypot(P[i][0] - A[pm[i]][0], P[i][1] - A[pm[i]][1])); best = Math.min(best, m); });
        return best < 9;
      }
      function exact() {                                                             // transformación exacta B → A (prueba ambos volteos)
        [false, true].some(function (fl) {
          var P = B0.map(function (p) { return [fl ? 2 * cB[0] - p[0] : p[0], p[1]]; }), a0 = Math.atan2(P[0][1] - cB[1], P[0][0] - cB[0]), t0 = Math.atan2(A[0][1] - cA[1], A[0][0] - cA[0]), th = t0 - a0;
          if (fl) { /* el volteo se aplica antes del giro, igual que en apply() */ }
          st.flip = fl; st.rot = th * 180 / Math.PI; st.dx = cA[0] - cB[0]; st.dy = cA[1] - cB[1];
          return fits();
        });
        apply();
      }
      function check() {
        if (matched || locked || !fits()) return;
        matched = true; exact(); root.classList.add('matched'); hint.textContent = '¡Encajan! Son congruentes. ¿Qué criterio lo demuestra?';
        if (!crit.parentNode) root.appendChild(crit);
      }
      /* arrastre con puntero (mouse o trackpad) */
      var drag = null;
      function toUnits(e) { var r = svg.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; }
      gb.addEventListener('pointerdown', function (e) { if (matched || locked) return; drag = { p: toUnits(e), dx: st.dx, dy: st.dy }; gb.setPointerCapture(e.pointerId); svg.focus(); e.preventDefault(); });
      gb.addEventListener('pointermove', function (e) { if (!drag) return; var p = toUnits(e); st.dx = drag.dx + p[0] - drag.p[0]; st.dy = drag.dy + p[1] - drag.p[1]; apply(); });
      function up() { if (drag) { drag = null; check(); } }
      gb.addEventListener('pointerup', up); gb.addEventListener('pointercancel', up);
      function rot(d) { if (matched || locked) return; st.rot += d; apply(); check(); }
      function flip() { if (matched || locked) return; st.flip = !st.flip; apply(); check(); }
      function nudge(x, y) { if (matched || locked) return; st.dx += x; st.dy += y; apply(); check(); }
      svg.addEventListener('keydown', function (e) {
        var k = e.key, used = true;
        if (k === 'ArrowLeft') nudge(-4, 0); else if (k === 'ArrowRight') nudge(4, 0); else if (k === 'ArrowUp') nudge(0, -4); else if (k === 'ArrowDown') nudge(0, 4);
        else if (k === 'q' || k === 'Q') rot(-15); else if (k === 'e' || k === 'E') rot(15); else if (k === 'f' || k === 'F') flip(); else used = false;
        if (used) { e.preventDefault(); e.stopPropagation(); }
      });
      var tools = el('div', 'ov-tools');
      [['⟲', 'Girar a la izquierda', function () { rot(-15); }], ['⟳', 'Girar a la derecha', function () { rot(15); }], ['⇋', 'Voltear', flip]].forEach(function (t) { var b = el('button', 'btn ghost', t[0]); b.type = 'button'; b.setAttribute('aria-label', t[1]); b.onclick = t[2]; tools.appendChild(b); });
      root.appendChild(tools);
      st.rot = 0; st.dx = 0; st.dy = 0; apply();
      var crit = critButtons(ctx, function (c, b) { if (locked) return; if (ctx.submit(c)) b.classList.add('ok'); else b.classList.add('bad'); });
      ctx.ans.appendChild(root);
      return {
        focus: function () { svg.focus(); },
        lock: function () { locked = true; root.classList.add('done'); },
        reveal: function () { matched = true; exact(); root.classList.add('matched'); if (!crit.parentNode) root.appendChild(crit); [].forEach.call(crit.children, function (b) { b.classList.toggle('ok', b.dataset.v === String(q.answer)); }); },
        solve: function () { matched = true; exact(); if (!crit.parentNode) root.appendChild(crit); return ctx.submit(q.answer); }
      };
    }
  };

  /* ---------------- detective: toca las partes que prueban el criterio ---------------- */
  /* lado i = de vértice i a i+1; ángulo i = vértice i. Reglas de cada criterio sobre lo que se toca. */
  var RULE = {
    LLL: function (S, A) { return S.length === 3 && !A.length; },
    LAL: function (S, A) { return S.length === 2 && A.length === 1 && S.some(function (i) { return S.indexOf((i + 1) % 3) >= 0 && A[0] === (i + 1) % 3; }); },
    ALA: function (S, A) { return S.length === 1 && A.length === 2 && A.indexOf(S[0]) >= 0 && A.indexOf((S[0] + 1) % 3) >= 0; },
    AAL: function (S, A) { return S.length === 1 && A.length === 2 && !(A.indexOf(S[0]) >= 0 && A.indexOf((S[0] + 1) % 3) >= 0); },
    HC: function (S, A) { return S.length === 2 && S.indexOf(2) >= 0 && !A.length; }                // el ángulo recto ya está marcado; hipotenusa = lado 2
  };
  var PICK = { LLL: [[0, 1, 2], []], LAL: [[0, 1], [1]], ALA: [[0], [0, 1]], AAL: [[1], [0, 1]], HC: [[2, 0], []] };
  INPUTS.detective = {
    own: true,
    mount: function (ctx) {
      var q = ctx.q, kind = q.kind, g = TRI.geom(kind, { seed: q.seed, ax: 70, bx: 210 }), base = kind === 'HC' ? [['r', 1, 1]] : [];
      var S = [], A = [], locked = false, W = 280, H = 130;
      setQ(ctx, kind === 'HC' ? 'Toca la hipotenusa y un cateto: las partes que deben ser iguales para usar HC.' : 'Toca las 3 partes que deben ser iguales para usar ' + kind + ' (' + FULL[kind] + ').');
      var root = el('div', 'dt'), hint = el('div', 'sl-hint', 'Toca lados y ángulos del triángulo izquierdo. Se marcan igual en los dos.'); root.appendChild(hint);
      var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('class', 'tri dt-svg'); root.appendChild(svg);
      function marksNow() { var m = base.slice(); S.forEach(function (i, n) { m.push(['s', i, n + 1]); }); A.forEach(function (i, n) { m.push(['a', i, n + 1]); }); return m; }
      function draw() {
        var mk = marksNow(), h = '';
        h += TRI.inner(g.A, ['A', 'B', 'C'], mk, false, g.num) + '<text x="140" y="60" class="x-ink" font-size="18" text-anchor="middle" dominant-baseline="middle">?</text>' + TRI.inner(g.B, ['D', 'E', 'F'], mk, false, g.num);
        for (var i = 0; i < 3; i++) {                                                // zonas para tocar (lados y ángulos del triángulo A)
          var a = g.A[i], b = g.A[(i + 1) % 3];
          h += '<g class="hit' + (S.indexOf(i) >= 0 ? ' on' : '') + '" tabindex="0" role="button" aria-pressed="' + (S.indexOf(i) >= 0) + '" aria-label="Lado ' + 'ABC'[i] + 'ABC'[(i + 1) % 3] + '" data-t="s" data-i="' + i + '"><line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" class="hit-l"/></g>';
        }
        for (var j = 0; j < 3; j++) {
          var v = g.A[j], c = centroid(g.A), d = TRI.unit(TRI.sub(c, v));
          if (kind === 'HC' && j === 1) continue;                                    // el ángulo recto ya viene marcado
          h += '<g class="hit' + (A.indexOf(j) >= 0 ? ' on' : '') + '" tabindex="0" role="button" aria-pressed="' + (A.indexOf(j) >= 0) + '" aria-label="Ángulo ' + 'ABC'[j] + '" data-t="a" data-i="' + j + '"><circle cx="' + TRI.f1(v[0] + d[0] * 9) + '" cy="' + TRI.f1(v[1] + d[1] * 9) + '" r="11" class="hit-c"/></g>';
        }
        svg.innerHTML = h;
        [].forEach.call(svg.querySelectorAll('.hit'), function (n) {
          var fn = function () { toggle(n.dataset.t, +n.dataset.i); };
          n.addEventListener('click', fn); n.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); fn(); } });
        });
      }
      function toggle(t, i) {
        if (locked) return; var L = t === 's' ? S : A, k = L.indexOf(i);
        if (k >= 0) L.splice(k, 1); else if (S.length + A.length < 3 && !(kind === 'HC' && S.length + A.length >= 2)) L.push(i);
        draw(); ctx.say('', '');
      }
      var tools = el('div', 'ov-tools'), go = el('button', 'btn chk', 'COMPROBAR'), clr = el('button', 'btn ghost', 'BORRAR');
      go.type = clr.type = 'button'; tools.appendChild(go); tools.appendChild(clr); root.appendChild(tools);
      function check() {
        if (locked) return false;
        var ok = RULE[kind](S.slice().sort(), A.slice().sort());
        if (!ok) { root.classList.add('bad'); setTimeout(function () { root.classList.remove('bad'); }, 400); }
        return ctx.submit(ok ? q.answer : -1);
      }
      go.onclick = check; clr.onclick = function () { if (!locked) { S = []; A = []; draw(); } };
      draw(); ctx.ans.appendChild(root);
      return {
        focus: function () { var h = svg.querySelector('.hit'); if (h) h.focus(); },
        lock: function () { locked = true; root.classList.add('done'); },
        reveal: function () { S = PICK[kind][0].slice(); A = PICK[kind][1].slice(); draw(); },
        solve: function () { S = PICK[kind][0].slice(); A = PICK[kind][1].slice(); draw(); return check(); }
      };
    }
  };

  /* ---------------- odd: el intruso ---------------- */
  INPUTS.odd = {
    own: true,
    mount: function (ctx) {
      var q = ctx.q, o = q.odd, locked = false, btns = [];
      var root = el('div', 'od'), grid = el('div', 'od-grid'); root.appendChild(grid);
      for (var i = 0; i < 4; i++) {
        (function (i) {
          var kind = i === o.idx ? o.other : o.main, b = el('button', 'od-b', '<span class="od-n">' + 'ABCD'[i] + '</span>' + TRI.pair(kind, { seed: o.seeds[i], names: [['ABC', 'DEF'], ['PQR', 'XYZ'], ['MNO', 'STU'], ['GHI', 'JKL']][i] }));
          b.type = 'button'; b.setAttribute('aria-label', 'Par ' + 'ABCD'[i]);
          b.onclick = function () { if (locked) return; if (ctx.submit(i === o.idx ? q.answer : -1)) b.classList.add('ok'); else { b.classList.add('bad'); setTimeout(function () { b.classList.remove('bad'); }, 500); } };
          grid.appendChild(b); btns.push(b);
        })(i);
      }
      root.addEventListener('keydown', function (e) { var n = '1234'.indexOf(e.key); if (n >= 0 && btns[n]) { btns[n].click(); e.preventDefault(); e.stopPropagation(); } });
      ctx.ans.appendChild(root);
      return {
        focus: function () { btns[0].focus(); }, lock: function () { locked = true; root.classList.add('done'); },
        reveal: function () { btns[o.idx].classList.add('ok'); },
        solve: function () { return ctx.submit(q.answer); }
      };
    }
  };
  INPUTS.overlay.types = INPUTS.detective.types = INPUTS.odd.types = ['number', 'choice'];
})(window);
