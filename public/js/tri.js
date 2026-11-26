/* tri.js — dibuja pares de triángulos congruentes con marcas (SVG) para las preguntas de criterios de congruencia.
 *
 *   TRI.pair(kind, { seed, vals })  →  cadena SVG con dos triángulos (kind: 'LLL' | 'LAL' | 'ALA' | 'AAL' | 'HC')
 *
 * Las figuras están a escala (T2 es una copia exacta de T1). Marcas (modo normal): lados iguales llevan el mismo número de rayitas; ángulos iguales, el mismo número de arcos;
 * el ángulo recto lleva un cuadradito. Con vals:true las marcas se cambian por valores (cm y °, medidos de la figura).
 * El segundo triángulo es una copia girada o reflejada: las marcas quedan en los mismos vértices y lados.
 * Lado i = de vértice i a vértice i+1. Ángulo i = en el vértice i. Todo es determinista según `seed`.
 */
(function (G) {
  'use strict';
  var INK = 'ink', ACC = 'acc', ARC = 'arc';                                          // clases CSS (colores en style.css; el manual usa otros)

  /* formas base por longitud de lados enteros (lado 0, 1 y 2); en HC el ángulo recto está en el vértice 1 (ternas pitagóricas) */
  var SHAPES = [[5, 6, 7], [6, 8, 9], [5, 7, 8], [7, 8, 9], [4, 5, 6], [6, 7, 9]];
  var RIGHT = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10]];
  function build(L) {                                                                    // vértices 0,1,2 a partir de los tres lados
    var x = (L[0] * L[0] + L[2] * L[2] - L[1] * L[1]) / (2 * L[0]);
    return [[0, 0], [L[0], 0], [x, Math.sqrt(L[2] * L[2] - x * x)]];
  }

  function rng(seed) { var s = (seed || 1) * 9301 + 49297; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function f1(n) { return String(Math.round(n * 10) / 10); }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function len(v) { return Math.hypot(v[0], v[1]); }
  function unit(v) { var l = len(v) || 1; return [v[0] / l, v[1] / l]; }

  /* copia girada/reflejada, escalada para que el lado mayor mida 70 */
  function place(base, rot, flip, cx) {
    var big = Math.max(len(sub(base[1], base[0])), len(sub(base[2], base[1])), len(sub(base[0], base[2]))), k = 70 / big;
    var c = [(base[0][0] + base[1][0] + base[2][0]) / 3, (base[0][1] + base[1][1] + base[2][1]) / 3], co = Math.cos(rot), si = Math.sin(rot);
    return base.map(function (p) {
      var x = (p[0] - c[0]) * k * (flip ? -1 : 1), y = (p[1] - c[1]) * k;
      return [cx + x * co - y * si, 60 + x * si + y * co];
    });
  }

  function marks(kind, r, vals) {
    var k = (r() * 3) | 0, i = function (j) { return (j + k) % 3; }, m;
    if (kind === 'LLL') m = [['s', i(0), 1], ['s', i(1), 2], ['s', i(2), 3]];
    else if (kind === 'LAL') m = [['s', i(0), 1], ['s', i(1), 2], ['a', i(1), 1]];
    else if (kind === 'ALA') m = [['a', i(0), 1], ['a', i(1), 2], ['s', i(0), 1]];
    else if (kind === 'AAL') m = [['a', i(0), 1], ['a', i(1), 2], ['s', r() < 0.5 ? i(1) : i(2), 1]];
    else m = [['r', 1, 1], ['s', 2, 1], ['s', r() < 0.5 ? 0 : 1, 2]];                    // HC: hipotenusa (lado 2, opuesto al recto) y un cateto
    return m;
  }

  function tick(p, q, n, out) {                                                          // n rayitas en el centro del lado p→q
    var d = unit(sub(q, p)), nr = [-d[1], d[0]], mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    for (var j = 0; j < n; j++) {
      var o = (j - (n - 1) / 2) * 5, a = [mid[0] + d[0] * o + nr[0] * 5, mid[1] + d[1] * o + nr[1] * 5], b = [mid[0] + d[0] * o - nr[0] * 5, mid[1] + d[1] * o - nr[1] * 5];
      out.push('<line x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '" class="t-' + ACC + '"/>');
    }
  }
  function arc(P, i, n, out) {                                                           // n arcos en el vértice i
    var v = P[i], u = unit(sub(P[(i + 2) % 3], v)), w = unit(sub(P[(i + 1) % 3], v)), sw = u[0] * w[1] - u[1] * w[0] > 0 ? 1 : 0;
    for (var j = 0; j < n; j++) {
      var R = 15 + j * 4, a = [v[0] + u[0] * R, v[1] + u[1] * R], b = [v[0] + w[0] * R, v[1] + w[1] * R];
      out.push('<path d="M' + f1(a[0]) + ' ' + f1(a[1]) + ' A' + R + ' ' + R + ' 0 0 ' + sw + ' ' + f1(b[0]) + ' ' + f1(b[1]) + '" class="t-' + ARC + '"/>');
    }
  }
  function square(P, i, out) {
    var v = P[i], u = unit(sub(P[(i + 2) % 3], v)), w = unit(sub(P[(i + 1) % 3], v)), s = 10;
    out.push('<path d="M' + f1(v[0] + u[0] * s) + ' ' + f1(v[1] + u[1] * s) + ' L' + f1(v[0] + (u[0] + w[0]) * s) + ' ' + f1(v[1] + (u[1] + w[1]) * s) + ' L' + f1(v[0] + w[0] * s) + ' ' + f1(v[1] + w[1] * s) + '" class="t-' + ARC + '"/>');
  }
  function text(x, y, t, col, out) { out.push('<text x="' + f1(x) + '" y="' + f1(y) + '" class="x-' + col + '" font-size="10.5" text-anchor="middle" dominant-baseline="middle">' + t + '</text>'); }

  function drawTri(P, names, mk, vals, num, out) {
    var c = [(P[0][0] + P[1][0] + P[2][0]) / 3, (P[0][1] + P[1][1] + P[2][1]) / 3];
    out.push('<polygon points="' + P.map(function (p) { return f1(p[0]) + ',' + f1(p[1]); }).join(' ') + '" class="t-poly"/>');
    mk.forEach(function (m) {
      var t = m[0], i = m[1], n = m[2];
      if (t === 'r') square(P, i, out);
      else if (t === 's') {
        if (!vals) tick(P[i], P[(i + 1) % 3], n, out);
        else { var a = P[i], b = P[(i + 1) % 3], mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], d = unit(sub(mid, c)); text(mid[0] + d[0] * 17, mid[1] + d[1] * 17, num.s[i] + ' cm', ACC, out); }
      } else if (!vals) arc(P, i, n, out);
      else { var v = P[i], bis = unit([unit(sub(P[(i + 1) % 3], v))[0] + unit(sub(P[(i + 2) % 3], v))[0], unit(sub(P[(i + 1) % 3], v))[1] + unit(sub(P[(i + 2) % 3], v))[1]]); text(v[0] + bis[0] * 21, v[1] + bis[1] * 21, num.a[i] + '°', ARC, out); }
    });
    if (names) P.forEach(function (p, i) { var d = unit(sub(p, c)); text(p[0] + d[0] * 11, p[1] + d[1] * 11, names[i], INK, out); });
  }

  /* lados (cm, enteros) y ángulos (°, redondeados) de la forma base */
  function numbers(L) {
    var base = build(L), a = [];
    for (var i = 0; i < 3; i++) {
      var u = sub(base[(i + 1) % 3], base[i]), w = sub(base[(i + 2) % 3], base[i]);
      a.push(Math.round(Math.acos((u[0] * w[0] + u[1] * w[1]) / (len(u) * len(w))) * 180 / Math.PI));
    }
    return { s: L, a: a };
  }

  /* datos de un par: A (izquierda) y B (derecha, girado y a veces volteado); mk = marcas; num = lados y ángulos */
  function geom(kind, o) {
    o = o || {};
    var r = rng(o.seed || 7), pool = kind === 'HC' ? RIGHT : SHAPES, L = pool[(r() * pool.length) | 0], base = build(L);
    var mk = marks(kind, r, o.vals), num = numbers(L);
    var rot0 = r() * 6.28, flip0 = r() < 0.5, flip = r() < 0.5, d = 0.9 + r() * 4.5;       // T2 siempre queda girado (≥ ~50°) y a veces volteado
    return { kind: kind, mk: mk, num: num, vals: o.vals, A: place(base, rot0, flip0, o.ax == null ? 70 : o.ax), B: place(base, rot0 + d, flip, o.bx == null ? 210 : o.bx) };
  }
  /* marcado SVG de un triángulo (sin <svg>); names = null no dibuja letras; mk = [] no dibuja marcas */
  function inner(P, names, mk, vals, num) { var out = []; drawTri(P, names, mk, vals, num, out); return out.join(''); }

  function pair(kind, o) {
    o = o || {};
    var g = geom(kind, o), nm = o.names || ['ABC', 'DEF'], out = [];
    drawTri(g.A, nm[0].split(''), g.mk, o.vals, g.num, out);
    out.push('<text x="140" y="60" class="x-' + INK + '" font-size="18" text-anchor="middle" dominant-baseline="middle">?</text>');
    drawTri(g.B, nm[1].split(''), g.mk, o.vals, g.num, out);
    return '<svg class="tri" viewBox="0 0 280 120" role="img" aria-label="Dos triángulos ' + nm[0] + ' y ' + nm[1] + ' con sus partes marcadas" xmlns="http://www.w3.org/2000/svg">' + out.join('') + '</svg>';
  }

  G.TRI = { pair: pair, geom: geom, inner: inner, f1: f1, unit: unit, sub: sub };
})(window);
