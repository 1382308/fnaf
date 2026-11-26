/* px.js — herramientas de pixel art.
   Todo se dibuja en un lienzo de 320x180 y el navegador lo escala sin suavizado. */
(function (G) {
  'use strict';

  var W = 320, H = 180;

  /* ---------- Paleta ---------- */
  var C = {
    ink: '#05030a', n0: '#0a0714', n1: '#120d24', n2: '#1b1436', n3: '#2a1f4d', n4: '#3d2e6b', n5: '#56428e',
    wl0: '#241f38', wl1: '#2f2a49', wl2: '#3d3760', wl3: '#4e4778', wl4: '#675e96',
    wd0: '#2a180c', wd1: '#4a2c16', wd2: '#6b4223', wd3: '#905a30', wd4: '#b87a42',
    mt0: '#141a26', mt1: '#222b3c', mt2: '#364158', mt3: '#53627e', mt4: '#7e90b0', mt5: '#aebfd8',
    gr0: '#06180f', gr1: '#0e4026', gr2: '#1f8a4c', gr3: '#3fd479', gr4: '#a4ffc4',
    rd0: '#2e060c', rd1: '#6b0f1c', rd2: '#b3182b', rd3: '#ff3b4a', rd4: '#ff9aa0',
    yl0: '#5a3c06', yl1: '#b8820c', yl2: '#f2c21c', yl3: '#ffe45c', yl4: '#fff6b0',
    bn0: '#2c2470', bn1: '#4a3fb0', bn2: '#6e62e0', bn3: '#9a90ff', bn4: '#c4beff',
    fr0: '#3a1a0c', fr1: '#6b3216', fr2: '#9a4c22', fr3: '#c8703a', fr4: '#e8a068',
    fx0: '#4a0f10', fx1: '#80201a', fx2: '#b33a24', fx3: '#d9663c', fx4: '#f0a070',
    gd0: '#6a4a00', gd1: '#a87800', gd2: '#d8a410', gd3: '#f4cc3c', gd4: '#fff0a0',
    or0: '#a04a08', or1: '#ff9a2e', or2: '#ffc866',
    pu0: '#3a1070', pu1: '#6a2cc0', pu2: '#a05cff', pk: '#ff5fd2', cy: '#4de0ff', cy0: '#0e5a70',
    wh: '#f2f0ff', gy: '#9a9ab0', sk0: '#a8683c', sk1: '#d89466', sk2: '#f0b888'
  };

  /* ---------- Aleatorio con semilla (para texturas estables) ---------- */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- Lienzos auxiliares ---------- */
  function mk(w, h) {
    var cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    var ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { cv: cv, ctx: ctx, pen: new Pen(ctx) };
  }

  /* ---------- Patrones de tramado (dither) ---------- */
  var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  var patCache = {};
  function pattern(ctx, col, lvl) {
    var key = col + '|' + lvl;
    var p = patCache[key];
    if (!p) {
      var t = mk(4, 4);
      t.ctx.fillStyle = col;
      for (var i = 0; i < 16; i++) {
        if (BAYER[i] < lvl) t.ctx.fillRect(i % 4, (i / 4) | 0, 1, 1);
      }
      p = patCache[key] = t.cv;
    }
    return ctx.createPattern(p, 'repeat');
  }

  /* ---------- Fuente diminuta 3x5 para letreros dentro de la escena ---------- */
  var FONT = {
    A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110',
    E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101',
    I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111',
    M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100',
    Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
    U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
    Y: '101101010010010', Z: '111001010100111',
    '0': '111101101101111', '1': '010110010010111', '2': '110001010100111', '3': '110001010001110',
    '4': '101101111001001', '5': '111100110001110', '6': '011100111101111', '7': '111001010010010',
    '8': '111101111101111', '9': '111101111001110',
    '!': '010010010000010', '?': '110001010000010', '.': '000000000000010', ':': '000010000010000',
    '-': '000000111000000', '\'': '010010000000000', '+': '000010111010000', '=': '000111000111000',
    '/': '001001010100100', ',': '000000000010100', '$': '011110010011110', ' ': '000000000000000'
  };

  /* ---------- Pluma: dibuja en "unidades de diseño" con escala s ---------- */
  function Pen(ctx, s, ox, oy) {
    this.c = ctx;
    this.s = s || 1;
    this.ox = ox || 0;
    this.oy = oy || 0;
  }
  Pen.prototype = {
    at: function (ox, oy, s) { return new Pen(this.c, s || this.s, ox, oy); },
    X: function (x) { return this.ox + Math.round(x * this.s); },
    Y: function (y) { return this.oy + Math.round(y * this.s); },
    fill: function (col) { this.c.fillStyle = col; },

    r: function (x, y, w, h, col) {
      var x0 = this.X(x), y0 = this.Y(y), x1 = this.X(x + w), y1 = this.Y(y + h);
      if (x1 <= x0) x1 = x0 + 1;
      if (y1 <= y0) y1 = y0 + 1;
      this.c.fillStyle = col;
      this.c.fillRect(x0, y0, x1 - x0, y1 - y0);
    },
    p: function (x, y, col) { this.r(x, y, 1, 1, col); },

    /* elipse con bordes nítidos (coordenadas de diseño) */
    ell: function (cx, cy, rx, ry, col) {
      var s = this.s, c = this.c;
      var X = this.ox + cx * s, Y = this.oy + cy * s, RX = Math.max(rx * s, 0.6), RY = Math.max(ry * s, 0.6);
      c.fillStyle = col;
      for (var yy = Math.floor(Y - RY); yy < Math.ceil(Y + RY); yy++) {
        var dy = (yy + 0.5 - Y) / RY;
        if (dy < -1 || dy > 1) continue;
        var half = RX * Math.sqrt(1 - dy * dy);
        var x0 = Math.round(X - half), x1 = Math.round(X + half);
        if (x1 <= x0) x1 = x0 + 1;
        c.fillRect(x0, yy, x1 - x0, 1);
      }
    },
    circ: function (cx, cy, r, col) { this.ell(cx, cy, r, r, col); },
    /* elipse con contorno */
    bell: function (cx, cy, rx, ry, fill, out, t) {
      t = t || 1;
      this.ell(cx, cy, rx + t, ry + t, out);
      this.ell(cx, cy, rx, ry, fill);
    },
    /* caja con contorno */
    box: function (x, y, w, h, fill, out, t) {
      t = t || 1;
      this.r(x - t, y - t, w + 2 * t, h + 2 * t, out);
      this.r(x, y, w, h, fill);
    },

    line: function (x0, y0, x1, y1, col, th) {
      var s = this.s, c = this.c;
      var ax = Math.round(this.ox + x0 * s), ay = Math.round(this.oy + y0 * s);
      var bx = Math.round(this.ox + x1 * s), by = Math.round(this.oy + y1 * s);
      var t = Math.max(1, Math.round((th || 1) * s));
      var dx = Math.abs(bx - ax), dy = -Math.abs(by - ay);
      var sx = ax < bx ? 1 : -1, sy = ay < by ? 1 : -1, err = dx + dy;
      c.fillStyle = col;
      for (var n = 0; n < 4000; n++) {
        c.fillRect(ax, ay, t, t);
        if (ax === bx && ay === by) break;
        var e2 = 2 * err;
        if (e2 >= dy) { err += dy; ax += sx; }
        if (e2 <= dx) { err += dx; ay += sy; }
      }
    },

    /* polígono relleno (lista plana [x,y,x,y,...] en unidades de diseño) */
    poly: function (pts, col) {
      var s = this.s, c = this.c, n = pts.length / 2, i, j;
      var px = [], py = [], miny = 1e9, maxy = -1e9;
      for (i = 0; i < n; i++) {
        px.push(this.ox + pts[2 * i] * s);
        py.push(this.oy + pts[2 * i + 1] * s);
        miny = Math.min(miny, py[i]); maxy = Math.max(maxy, py[i]);
      }
      c.fillStyle = col;
      for (var y = Math.floor(miny); y < Math.ceil(maxy); y++) {
        var yc = y + 0.5, xs = [];
        for (i = 0, j = n - 1; i < n; j = i++) {
          if ((py[i] <= yc && py[j] > yc) || (py[j] <= yc && py[i] > yc)) {
            xs.push(px[i] + (yc - py[i]) / (py[j] - py[i]) * (px[j] - px[i]));
          }
        }
        xs.sort(function (a, b) { return a - b; });
        for (i = 0; i + 1 < xs.length; i += 2) {
          var x0 = Math.round(xs[i]), x1 = Math.round(xs[i + 1]);
          if (x1 <= x0) x1 = x0 + 1;
          c.fillRect(x0, y, x1 - x0, 1);
        }
      }
    },

    /* tramado: lvl 0..16 (16 = relleno completo) */
    dith: function (x, y, w, h, col, lvl) {
      if (lvl <= 0) return;
      var x0 = this.X(x), y0 = this.Y(y), x1 = this.X(x + w), y1 = this.Y(y + h);
      if (lvl >= 16) { this.c.fillStyle = col; this.c.fillRect(x0, y0, x1 - x0, y1 - y0); return; }
      this.c.fillStyle = pattern(this.c, col, lvl);
      this.c.fillRect(x0, y0, x1 - x0, y1 - y0);
    },
    /* degradado tramado entre dos colores (vertical por defecto) */
    grad: function (x, y, w, h, c1, c2, horiz) {
      this.r(x, y, w, h, c1);
      var steps = 8, i;
      for (i = 0; i < steps; i++) {
        if (horiz) this.dith(x + w * i / steps, y, w / steps + 1, h, c2, Math.round((i + 1) * 16 / (steps + 1)));
        else this.dith(x, y + h * i / steps, w, h / steps + 1, c2, Math.round((i + 1) * 16 / (steps + 1)));
      }
    },

    /* patrón de tramado utilizable como color en ell()/poly() */
    pat: function (col, lvl) { return pattern(this.c, col, lvl); },

    /* triángulo/polígono con contorno (el relleno se encoge hacia el centro) */
    tri: function (pts, fill, out, inset) {
      var n = pts.length / 2, cx = 0, cy = 0, i, q = [];
      for (i = 0; i < n; i++) { cx += pts[2 * i]; cy += pts[2 * i + 1]; }
      cx /= n; cy /= n;
      inset = inset || 1.4;
      this.poly(pts, out);
      for (i = 0; i < n; i++) {
        var dx = cx - pts[2 * i], dy = cy - pts[2 * i + 1], d = Math.sqrt(dx * dx + dy * dy) || 1;
        q.push(pts[2 * i] + dx / d * inset, pts[2 * i + 1] + dy / d * inset);
      }
      this.poly(q, fill);
    },

    /* texto 3x5. k = tamaño del punto en píxeles de salida */
    txt: function (str, x, y, col, k) {
      k = k || 1;
      var c = this.c, cx = this.X(x), cy = this.Y(y);
      c.fillStyle = col;
      str = String(str).toUpperCase();
      for (var i = 0; i < str.length; i++) {
        var g = FONT[str[i]] || FONT['?'];
        for (var j = 0; j < 15; j++) {
          if (g[j] === '1') c.fillRect(cx + (j % 3) * k, cy + ((j / 3) | 0) * k, k, k);
        }
        cx += 4 * k;
      }
    },
    txtW: function (str, k) { return (String(str).length * 4 - 1) * (k || 1); }
  };

  /* ---------- Sprites ASCII (iconos pequeños) ---------- */
  function stamp(pen, rows, pal, x, y) {
    for (var j = 0; j < rows.length; j++) {
      for (var i = 0; i < rows[j].length; i++) {
        var ch = rows[j][i];
        if (ch !== '.' && ch !== ' ' && pal[ch]) pen.p(x + i, y + j, pal[ch]);
      }
    }
  }

  var ICON_DEFS = {
    star: { pal: { a: '#ffe45c', b: '#b8820c' }, rows: ['....a....', '....a....', '...aaa...', 'aaaaaaaaa', '.aaaaaaa.', '..aabaa..', '.aaa.aaa.', '.aa...aa.'] },
    starOff: { pal: { a: '#3d2e6b', b: '#2a1f4d' }, rows: ['....a....', '....a....', '...aaa...', 'aaaaaaaaa', '.aaaaaaa.', '..aabaa..', '.aaa.aaa.', '.aa...aa.'] },
    bolt: { pal: { a: '#ffe45c', b: '#b8820c' }, rows: ['....aaa.', '...aaa..', '..aaa...', '.aaaaaa.', '...aaa..', '..aa....', '.aa.....', '.a......'] },
    book: { pal: { a: '#b3182b', b: '#ff3b4a', c: '#f2f0ff', d: '#6b0f1c' }, rows: ['.aaaaaaa.', 'abbbbbbbd', 'abccccbbd', 'abbbbbbbd', 'abccccbbd', 'abbbbbbbd', 'abccccbbd', '.ddddddd.'] },
    phone: { pal: { a: '#222b3c', b: '#53627e', c: '#7e90b0', d: '#ff3b4a' }, rows: ['.aaaaaaa.', 'abbbbbbba', 'abcccccba', '.aaaaaaa.', '..abbba..', '.abbbbba.', 'abbbddbba', 'aaaaaaaaa'] },
    lock: { pal: { a: '#7e90b0', b: '#ffe45c', c: '#b8820c' }, rows: ['..aaaaa..', '.aa...aa.', '.a.....a.', 'bbbbbbbbb', 'bbbcccbbb', 'bbbcccbbb', 'bbbbcbbbb', 'bbbbbbbbb'] },
    key: { pal: { a: '#ffe45c' }, rows: ['.aaa.......', 'a...a......', 'a...aaaaaaa', 'a...a..a.aa', '.aaa.......'] },
    card: { pal: { a: '#7e90b0', b: '#f2f0ff', c: '#ff3b4a', d: '#46526a' }, rows: ['aaaaaaaaa', 'abbbbbbba', 'addddddda', 'abbbbbbba', 'abccbbbba', 'abbbbbbba', 'aaaaaaaaa'] },
    cable: { pal: { a: '#ff3b4a', b: '#9a9ab0' }, rows: ['bb.......', 'bbaaaaa..', 'bb....a..', '....aaa..', '....a....', '....aaabb', '......abb'] },
    fuse: { pal: { a: '#c4beff', b: '#b8820c', c: '#ffe45c' }, rows: ['bbaaaaabb', 'bba...abb', 'bbacccabb', 'bba...abb', 'bbaaaaabb'] },
    compass: { pal: { a: '#9a9ab0', c: '#ff3b4a', d: '#f2f0ff' }, rows: ['..aaaaa..', '.a..c..a.', 'a..ccc..a', 'a...c...a', 'a...d...a', 'a..ddd..a', '.a..d..a.', '..aaaaa..'] },
    wheel: { pal: { a: '#b8820c' }, rows: ['..aaaaa..', '.a..a..a.', 'a...a...a', 'aaaaaaaaa', 'a...a...a', '.a..a..a.', '..aaaaa..'] },
    match: { pal: { b: '#b8820c', c: '#ff3b4a' }, rows: ['......cc.', '.....ccc.', '....bb...', '...bb....', '..bb.....', '.bb......', 'bb.......'] },
    spatula: { pal: { a: '#9a9ab0', b: '#b8820c' }, rows: ['.aaaaaaa.', '.aaaaaaa.', '.aaaaaaa.', '....b....', '....b....', '....b....', '....b....'] },
    bulb: { pal: { a: '#fff6b0', c: '#7e90b0', d: '#46526a' }, rows: ['..aaa..', '.aaaaa.', '.aaaaa.', '.aaaaa.', '..aaa..', '..ccc..', '..ddd..', '...c...'] },
    screwdriver: { pal: { a: '#9a9ab0', c: '#ff3b4a' }, rows: ['.......aa', '......aa.', '.....aa..', '....aa...', '...cc....', '..ccc....', '.ccc.....', 'ccc......'] },
    disc: { pal: { a: '#46526a', c: '#c4beff', d: '#f2f0ff' }, rows: ['aaaaaaaa.', 'a.cccc.aa', 'a.cccc.aa', 'a......aa', 'a.dddd..a', 'a.dddd..a', 'a.dddd..a', 'aaaaaaaaa'] },
    battery: { pal: { a: '#9a9ab0', b: '#3fd479', c: '#ffe45c' }, rows: ['aaaaaaaaa.', 'abbbbbbbaa', 'abbcbbbbaa', 'abbbbbbbaa', 'aaaaaaaaa.'] },
    check: { pal: { a: '#3fd479', b: '#1f8a4c' }, rows: ['.......aa', '......aab', '.....aab.', 'aa..aab..', 'baaaab...', '.baab....', '..bb.....'] },
    cross: { pal: { a: '#ff3b4a', b: '#b3182b' }, rows: ['aa...aa', 'aaa.aaa', '.aaaaa.', '..aaa..', '.aaaaa.', 'aaa.aaa', 'aa...aa'] },
    spk: { pal: { a: '#9a90ff', b: '#c4beff' }, rows: ['...a....a.', '..aa.a...a', 'aaaa..a..a', 'aaaa..a..a', '..aa.a...a', '...a....a.'] },
    eye: { pal: { a: '#f2f0ff', b: '#05030a', c: '#ff3b4a' }, rows: ['..aaaaa..', '.aabbbaa.', 'aabbcbbaa', '.aabbbaa.', '..aaaaa..'] },
    skull: { pal: { a: '#f2f0ff', b: '#05030a', c: '#9a9ab0' }, rows: ['.aaaaaaa.', 'aaaaaaaaa', 'abbaaabba', 'abbaaabba', 'aaaabaaaa', '.aaaaaaa.', '.acacaca.', '..a.a.a..'] },
    lamp: { pal: { a: '#fff6b0', b: '#ffe45c', c: '#7e90b0', d: '#46526a' }, rows: ['...ccc...', '..aaaaa..', '.abbbbba.', '..dccd...', '..dccd...', '..dccd...', '..dccd...', '...dd....'] },
    lampOff: { pal: { a: '#6a7a94', b: '#46526a', c: '#7e90b0', d: '#364158' }, rows: ['...ccc...', '..aaaaa..', '.abbbbba.', '..dccd...', '..dccd...', '..dccd...', '..dccd...', '...dd....'] },
    mute: { pal: { a: '#9a90ff', b: '#ff3b4a' }, rows: ['...a....b', '..aa...b.', 'aaaa..b..', 'aaaa.b...', '..aab....', '...b.....'] }
  };
  var iconCache = {};
  function icon(name) {
    if (iconCache[name]) return iconCache[name];
    var d = ICON_DEFS[name];
    if (!d) return '';
    var w = Math.max.apply(null, d.rows.map(function (r) { return r.length; })), h = d.rows.length;
    var t = mk(w, h);
    stamp(t.pen, d.rows, d.pal, 0, 0);
    return (iconCache[name] = t.cv.toDataURL());
  }

  G.PX = { W: W, H: H, C: C, Pen: Pen, mk: mk, rng: rng, stamp: stamp, icon: icon, FONT: FONT };
})(window);
