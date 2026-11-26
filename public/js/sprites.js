/* sprites.js — animatrónicos y personajes dibujados con formas (pixel art procedural).
   Las cabezas viven en una caja de 48x48 "unidades de diseño"; se pueden dibujar a cualquier escala. */
(function (G) {
  'use strict';
  var C = PX.C;

  function look(o) { return { lx: o.lx || 0, ly: o.ly || 0 }; }

  /* ojo redondo con pupila que sigue al cursor */
  function eyeBall(p, cx, cy, rs, iris, o) {
    var l = look(o);
    p.ell(cx, cy, rs, rs, C.ink);
    if (o.blink) { p.r(cx - rs, cy - 1, rs * 2, 2, C.ink); return; }
    p.ell(cx + l.lx * 1.2, cy + l.ly * 1.2, rs - 1.5, rs - 1.5, iris);
    p.ell(cx + l.lx * 2.2, cy + l.ly * 2.2, 1.5, 1.5, C.ink);
    p.p(cx + l.lx * 2.2 - 1, cy + l.ly * 2.2 - 1, C.wh);
  }

  /* ---------- FREDDY (y Golden Freddy) ---------- */
  function freddy(p, o) {
    var g = o.gold;
    var b0 = g ? C.gd0 : C.fr0, b1 = g ? C.gd1 : C.fr1, b2 = g ? C.gd2 : C.fr2, b3 = g ? C.gd3 : C.fr3, b4 = g ? C.gd4 : C.fr4;
    var hat = g ? C.gd1 : C.n2, hat2 = g ? C.gd3 : C.n4;
    // orejas
    p.bell(8, 17, 6, 6, b1, C.ink); p.ell(8, 17, 3.5, 3.5, g ? b0 : b4);
    p.bell(40, 17, 6, 6, b1, C.ink); p.ell(40, 17, 3.5, 3.5, g ? b0 : b4);
    // cabeza
    p.bell(24, 29, 18, 16, b1, C.ink);
    p.ell(23, 28, 16.5, 14.5, b2);
    p.ell(17, 21, 9, 4, p.pat(b3, 9));
    // hocico
    p.bell(24, 35.5, 10.5, 7, b4, b0);
    p.ell(24, 38, 8, 4, p.pat(b3, 5));
    // nariz
    p.ell(24, 31, 4.5, 2.6, C.ink);
    p.r(21, 30, 2, 1, C.mt3);
    // puntitos
    p.p(17, 33, b1); p.p(19, 34, b1); p.p(17, 35, b1);
    p.p(30, 33, b1); p.p(28, 34, b1); p.p(30, 35, b1);
    // boca
    if (o.mouth > 0) {
      var mh = Math.round(3 + 9 * o.mouth);
      p.ell(24, 36 + mh / 2, 12, mh / 2 + 1, C.ink);
      for (var i = 0; i < 6; i++) { p.r(14 + i * 3.4, 35, 2.6, 3, C.wh); p.r(14 + i * 3.4, 36 + mh - 2, 2.6, 3, C.wh); }
      p.ell(24, 36 + mh - 1, 7, 2, C.rd1);
    } else {
      p.r(23, 33, 2, 2, b0);
      p.r(17, 37, 2, 1, b0); p.r(19, 38, 4, 1, b0); p.r(25, 38, 4, 1, b0); p.r(29, 37, 2, 1, b0);
    }
    // ojos
    var eye = o.eye || (g ? C.wh : '#5ab4ff');
    if (g) {
      p.ell(15, 24, 6, 6, C.ink); p.ell(33, 24, 6, 6, C.ink);
      if (!o.blink) { p.r(15, 24, 1, 1, C.wh); p.r(33, 24, 1, 1, C.wh); }
    } else {
      eyeBall(p, 15, 24, 5, eye, o); eyeBall(p, 33, 24, 5, eye, o);
    }
    // cejas
    if (o.angry) { p.line(8, 16, 20, 20, b0, 2); p.line(28, 20, 40, 16, b0, 2); }
    else { p.line(9, 18, 20, 19, b0, 2); p.line(28, 19, 39, 18, b0, 2); }
    // sombrero
    p.box(15, 1, 18, 10, hat, C.ink);
    p.r(16, 2, 2, 8, hat2);
    p.r(15, 8, 18, 2, g ? C.gd2 : C.n4);
    p.ell(24, 12, 14, 2.4, C.ink);
    p.ell(24, 11.5, 13, 1.6, hat);
    if (o.tie) tie(p, 24, 48, g ? C.gd2 : C.n3);
  }

  function tie(p, cx, cy, col, w) {
    w = w || 9;
    p.poly([cx, cy, cx - w, cy - 5, cx - w, cy + 5], C.ink);
    p.poly([cx, cy, cx + w, cy - 5, cx + w, cy + 5], C.ink);
    p.poly([cx - 1, cy, cx - w + 1.5, cy - 3.2, cx - w + 1.5, cy + 3.2], col);
    p.poly([cx + 1, cy, cx + w - 1.5, cy - 3.2, cx + w - 1.5, cy + 3.2], col);
    p.box(cx - 2, cy - 2, 4, 4, col, C.ink);
  }

  /* ---------- BONNIE ---------- */
  function bonnie(p, o) {
    var b0 = C.bn0, b1 = C.bn1, b2 = C.bn2, b3 = C.bn3, b4 = C.bn4;
    // orejas largas
    p.bell(13, 12, 5, 12, b1, C.ink); p.ell(13, 12, 2.2, 9, b4);
    p.bell(35, 12, 5, 12, b1, C.ink); p.ell(35, 12, 2.2, 9, b4);
    p.ell(13, 6, 3, 3, p.pat(b3, 8)); p.ell(35, 6, 3, 3, p.pat(b3, 8));
    // cabeza
    p.bell(24, 31, 17, 13.5, b1, C.ink);
    p.ell(23, 30, 15.5, 12, b2);
    p.ell(17, 24, 8, 3.4, p.pat(b3, 9));
    // mejillas rojas
    p.ell(11, 35, 3.2, 2.8, C.rd2); p.p(10, 34, C.rd4);
    p.ell(37, 35, 3.2, 2.8, C.rd2); p.p(36, 34, C.rd4);
    // hocico
    p.bell(24, 38, 9.5, 6, b4, b0);
    p.ell(24, 33.5, 3, 2, C.rd1); p.r(23, 32, 2, 1, C.rd3);
    if (o.mouth > 0) {
      var mh = Math.round(3 + 8 * o.mouth);
      p.ell(24, 38 + mh / 2, 9, mh / 2 + 1, C.ink);
      p.r(15, 37, 18, 3, C.wh); p.r(15, 38 + mh, 18, 2, C.wh);
      p.ell(24, 38 + mh - 1, 5, 2, C.rd1);
    } else {
      p.box(22, 40, 2, 3, C.wh, b0, 1); p.box(24, 40, 2, 3, C.wh, b0, 1);
      p.r(18, 39, 12, 1, b0);
    }
    // ojos
    var eye = o.eye || '#d04aff';
    eyeBall(p, 16, 27, 4.5, eye, o); eyeBall(p, 32, 27, 4.5, eye, o);
    if (o.angry) { p.line(10, 20, 20, 24, b0, 2); p.line(28, 24, 38, 20, b0, 2); }
    else { p.line(10, 22, 20, 22, b0, 2); p.line(28, 22, 38, 22, b0, 2); }
    if (o.tie) tie(p, 24, 48, C.rd2);
  }

  /* ---------- CHICA ---------- */
  function chica(p, o) {
    var b0 = C.yl0, b1 = C.yl1, b2 = C.yl2, b3 = C.yl3;
    // cresta
    p.bell(19, 9, 2.6, 6, b2, C.ink); p.bell(24, 7, 2.6, 6.5, b2, C.ink); p.bell(29, 9, 2.6, 6, b2, C.ink);
    // cabeza
    p.bell(24, 27, 19.5, 15, b1, C.ink);
    p.ell(23, 26, 18, 13.5, b2);
    p.ell(16, 19, 9, 3.6, p.pat(b3, 10));
    // mejillas
    p.ell(8, 31, 2.6, 2, p.pat(C.pk, 8)); p.ell(40, 31, 2.6, 2, p.pat(C.pk, 8));
    // ojos
    var eye = o.eye || '#e040e0', l = look(o);
    [15, 33].forEach(function (cx) {
      p.bell(cx, 22.5, 5.8, 5.8, C.wh, C.ink);
      if (o.blink) { p.r(cx - 6, 22, 12, 2, C.ink); return; }
      p.ell(cx + l.lx * 1.4, 22.5 + l.ly * 1.4, 3, 3, eye);
      p.ell(cx + l.lx * 1.8, 22.5 + l.ly * 1.8, 1.4, 1.4, C.ink);
      p.p(cx + l.lx * 1.8 - 1, 22 + l.ly * 1.8, C.wh);
    });
    p.line(8, 15, 11, 17, C.ink, 1); p.line(40, 15, 37, 17, C.ink, 1);
    // pico
    var gap = o.mouth > 0 ? Math.round(2 + 9 * o.mouth) : 1;
    p.bell(24, 32.5, 12.5, 4.5, C.or1, C.or0);
    p.ell(24, 31, 9.5, 1.4, C.or2);
    p.r(11, 35, 26, gap, C.ink);
    if (o.mouth > 0) {
      for (var i = 0; i < 6; i++) p.r(12 + i * 4, 35, 3, 2, C.wh);
      p.ell(24, 35 + gap - 1, 8, 2, C.rd1);
    }
    p.bell(24, 38.5 + gap - 1, 10.5, 3.6, '#e0801a', C.or0);
    p.p(21, 31, C.or0); p.p(26, 31, C.or0);
    if (o.tie) { p.r(14, 46, 20, 4, C.pk); }
  }

  /* ---------- FOXY ---------- */
  function foxy(p, o) {
    var b0 = C.fx0, b1 = C.fx1, b2 = C.fx2, b3 = C.fx3, b4 = C.fx4;
    // orejas (la derecha está rota y deja ver el esqueleto)
    p.tri([2, 17, 6, 0, 19, 12], b2, C.ink);
    p.tri([7, 13, 8, 5, 13, 11], b0, b0, 0.4);
    p.tri([46, 17, 42, 6, 38, 4, 35, 9, 29, 12], b2, C.ink);
    p.r(38, 5, 4, 3, C.mt3); p.r(39, 4, 2, 1, C.mt4);
    // cabeza
    p.bell(24, 27, 17.5, 15, b1, C.ink);
    p.ell(23, 26, 16, 13.5, b2);
    p.ell(17, 19, 8, 3.4, p.pat(b3, 8));
    // rotos / metal
    p.r(5, 31, 4, 3, C.mt3); p.r(6, 31, 2, 1, C.mt4);
    // hocico
    p.bell(24, 36, 11, 8.5, b4, b0);
    p.ell(24, 39, 8, 4, p.pat(b3, 5));
    p.ell(24, 31.5, 4, 2.6, C.ink); p.r(22, 30, 2, 1, C.mt3);
    // boca / colmillos
    var mh = o.mouth > 0 ? Math.round(3 + 9 * o.mouth) : 2;
    p.ell(24, 37 + mh / 2, 9, mh / 2 + 0.6, C.ink);
    var k;
    for (k = 0; k < 4; k++) {
      p.poly([16 + k * 5.3, 36, 18.6 + k * 5.3, 36, 17.3 + k * 5.3, 40], C.wh);
      if (o.mouth > 0) p.poly([16 + k * 5.3, 37 + mh, 18.6 + k * 5.3, 37 + mh, 17.3 + k * 5.3, 33 + mh], C.wh);
    }
    if (o.mouth > 0) p.ell(24, 37 + mh - 1, 6, 2, C.rd1);
    // parche y ojo
    p.ell(15, 24, 6, 5.5, C.ink);
    p.line(1, 14, 12, 21, C.ink, 2);
    p.line(18, 22, 40, 14, C.ink, 1);
    p.ell(15, 24, 4.4, 3.8, C.n2); p.r(12, 23, 3, 1, C.n4);
    var eye = o.eye || C.yl3;
    eyeBall(p, 33, 24, 5, eye, o);
    p.line(28, 18, 39, 21, b0, 2);
    if (o.tie) { p.r(14, 46, 20, 3, b1); }
  }

  /* ---------- Guardia (Mike) ---------- */
  function mike(p, o) {
    var cap = '#24409a', cap2 = '#3a5ad0';
    p.bell(10, 32, 2.4, 3.2, C.sk1, C.ink); p.bell(38, 32, 2.4, 3.2, C.sk1, C.ink);
    p.bell(24, 30, 13.5, 14.5, C.sk1, C.ink);
    p.ell(24, 37, 11, 6, p.pat(C.sk0, 4));
    // gorra
    p.bell(24, 15, 14.5, 9, cap, C.ink);
    p.ell(19, 12, 7, 3, p.pat(cap2, 9));
    p.box(8, 18, 32, 4, '#1a2f78', C.ink);
    p.box(21, 9, 6, 6, C.yl2, C.ink); p.r(23, 10, 2, 4, C.yl4);
    // cara
    if (o.blink) { p.r(16, 28, 5, 1, C.ink); p.r(28, 28, 5, 1, C.ink); }
    else { p.r(17, 27, 4, 4, C.wh); p.r(18, 28, 3, 3, C.ink); p.r(28, 27, 4, 4, C.wh); p.r(29, 28, 3, 3, C.ink); }
    p.line(15, 25, 21, 25, '#3a1a0c', 1); p.line(28, 25, 34, 25, '#3a1a0c', 1);
    p.r(23, 30, 3, 4, C.sk0);
    p.r(17, 36, 15, 3, '#3a1a0c');
    p.r(20, 41, 9, 1, '#a84a3a');
    // camisa
    p.box(12, 44, 24, 5, cap, C.ink);
    p.r(22, 45, 5, 4, C.wh);
  }

  /* ---------- Teléfono (voz del "chico del teléfono") ---------- */
  function phoneGuy(p, o) {
    var ring = o.ring ? 1 : 0;
    p.box(6, 28, 36, 16, C.mt2, C.ink, 1);
    p.r(8, 30, 32, 3, C.mt3);
    p.ell(24, 38, 9, 5, C.mt1);
    p.ell(24, 38, 6, 3, C.mt4);
    p.box(5, 14, 38, 9, C.rd2, C.ink, 1);
    p.r(7, 16, 34, 2, C.rd3);
    p.box(2, 17, 7, 13, C.rd2, C.ink, 1); p.box(39, 17, 7, 13, C.rd2, C.ink, 1);
    p.r(10, 24, 28, 2, C.rd1);
    // ondas de sonido
    var wc = ring ? C.yl3 : C.bn3;
    p.line(0, 8, 4, 4, wc, 1); p.line(8, 4, 12, 2, wc, 1);
    p.line(48, 8, 44, 4, wc, 1); p.line(40, 4, 36, 2, wc, 1);
  }

  var HEAD = { freddy: freddy, bonnie: bonnie, chica: chica, foxy: foxy, golden: function (p, o) { o.gold = true; freddy(p, o); }, mike: mike, phone: phoneGuy };

  function head(kind, pen, o) { (HEAD[kind] || freddy)(pen, o || {}); }

  /* ---------- Retratos (data URL, para diálogos) ---------- */
  var portraitCache = {};
  function portrait(kind) {
    if (portraitCache[kind]) return portraitCache[kind];
    var t = PX.mk(48, 50);
    head(kind, t.pen, {});
    return (portraitCache[kind] = t.cv.toDataURL());
  }

  /* ---------- Cuerpos completos (para escenas) ---------- */
  var BODY = {};

  BODY.freddy = function (p, o) {
    var dy = o.dy || 0;
    // piernas
    p.box(14, 92, 9, 16, C.fr2, C.ink); p.box(25, 92, 9, 16, C.fr2, C.ink);
    p.box(12, 106, 12, 6, C.fr1, C.ink); p.box(24, 106, 12, 6, C.fr1, C.ink);
    // torso
    p.box(9, 48, 30, 46, C.fr2, C.ink);
    p.ell(24, 76, 10, 15, C.fr4); p.ell(24, 78, 8, 11, p.pat(C.fr3, 6));
    p.r(10, 49, 3, 44, C.fr3);
    // brazos
    p.box(1, 52, 8, 28, C.fr2, C.ink); p.bell(5, 82, 4.5, 4.5, C.fr2, C.ink);
    p.box(39, 52, 8, o.mic ? 18 : 28, C.fr2, C.ink);
    if (o.mic) {
      p.bell(43, 72, 4.5, 4.5, C.fr2, C.ink);
      p.box(42, 56, 3, 14, C.mt2, C.ink, 1); p.bell(43.5, 53, 3.4, 3.4, C.mt4, C.ink);
    } else p.bell(43, 82, 4.5, 4.5, C.fr2, C.ink);
    head('freddy', p.at(p.ox, p.oy + Math.round(dy * p.s), p.s), { tie: true, lx: o.lx, ly: o.ly, blink: o.blink, eye: o.eye, mouth: o.mouth, angry: o.angry });
  };

  BODY.bonnie = function (p, o) {
    p.box(14, 92, 9, 16, C.bn2, C.ink); p.box(25, 92, 9, 16, C.bn2, C.ink);
    p.box(12, 106, 12, 6, C.bn1, C.ink); p.box(24, 106, 12, 6, C.bn1, C.ink);
    p.box(10, 48, 28, 46, C.bn2, C.ink);
    p.r(11, 49, 3, 44, C.bn3);
    p.ell(24, 72, 8, 13, p.pat(C.bn3, 7));
    // brazos + guitarra
    p.box(2, 52, 8, 26, C.bn2, C.ink); p.bell(6, 80, 4.5, 4.5, C.bn2, C.ink);
    p.box(38, 52, 8, 22, C.bn2, C.ink);
    if (o.guitar !== false) {
      p.line(40, 58, 46, 50, C.wd2, 2);
      p.bell(36, 74, 7, 8, C.rd2, C.ink); p.ell(36, 74, 2.5, 2.5, C.rd0); p.ell(33, 71, 3, 2, p.pat(C.rd4, 5));
      p.bell(43, 70, 4.5, 4.5, C.bn2, C.ink);
    } else p.bell(42, 76, 4.5, 4.5, C.bn2, C.ink);
    head('bonnie', p.at(p.ox, p.oy + Math.round((o.dy || 0) * p.s), p.s), { tie: true, lx: o.lx, ly: o.ly, blink: o.blink, eye: o.eye, mouth: o.mouth, angry: o.angry });
  };

  BODY.chica = function (p, o) {
    p.box(14, 92, 9, 16, C.yl2, C.ink); p.box(25, 92, 9, 16, C.yl2, C.ink);
    p.box(12, 106, 12, 6, C.or1, C.ink); p.box(24, 106, 12, 6, C.or1, C.ink);
    p.box(9, 48, 30, 46, C.yl2, C.ink);
    p.r(10, 49, 3, 44, C.yl3);
    // babero
    p.box(13, 52, 22, 24, C.wh, C.ink);
    p.txt('LETS', 14, 56, C.pu1, 1); p.txt('EAT', 14, 63, C.pu1, 1);
    p.r(14, 70, 20, 1, C.pk);
    // brazos + plato con pastelito
    p.box(1, 52, 8, 28, C.yl2, C.ink); p.bell(5, 82, 4.5, 4.5, C.yl2, C.ink);
    p.box(39, 52, 8, 22, C.yl2, C.ink); p.bell(43, 75, 4.5, 4.5, C.yl2, C.ink);
    if (o.cake !== false) {
      p.box(37, 70, 14, 2, C.mt4, C.ink);
      p.box(40, 62, 8, 7, C.pk, C.ink); p.r(40, 62, 8, 2, C.wh); p.p(44, 59, C.rd3); p.box(43, 60, 2, 2, C.rd3, C.ink, 0);
    }
    head('chica', p.at(p.ox, p.oy + Math.round((o.dy || 0) * p.s), p.s), { tie: true, lx: o.lx, ly: o.ly, blink: o.blink, eye: o.eye, mouth: o.mouth, angry: o.angry });
  };

  BODY.foxy = function (p, o) {
    p.box(14, 92, 9, 16, C.fx2, C.ink); p.box(25, 92, 9, 16, C.fx2, C.ink);
    p.r(14, 98, 9, 5, C.mt3); p.r(25, 100, 9, 4, C.mt3);
    p.box(12, 106, 12, 6, C.fx1, C.ink); p.box(24, 106, 12, 6, C.fx1, C.ink);
    p.box(10, 48, 28, 46, C.fx2, C.ink);
    p.r(11, 49, 3, 44, C.fx3);
    // pecho roto con esqueleto
    p.r(16, 58, 16, 20, C.mt1);
    for (var i = 0; i < 4; i++) p.r(17, 60 + i * 5, 14, 2, C.mt3);
    p.r(23, 58, 2, 20, C.mt4);
    // brazos: izquierdo normal, derecho con garfio
    p.box(2, 52, 8, 28, C.fx2, C.ink); p.bell(6, 82, 4.5, 4.5, C.fx2, C.ink);
    p.box(38, 52, 8, 24, C.fx2, C.ink);
    p.box(40, 76, 4, 6, C.mt3, C.ink);
    p.line(42, 82, 42, 90, C.mt4, 2); p.line(42, 90, 38, 94, C.mt5, 2); p.line(38, 94, 36, 90, C.mt5, 1);
    head('foxy', p.at(p.ox, p.oy + Math.round((o.dy || 0) * p.s), p.s), { tie: true, lx: o.lx, ly: o.ly, blink: o.blink, eye: o.eye, mouth: o.mouth, angry: o.angry });
  };

  /* Golden Freddy sentado y desplomado */
  BODY.golden = function (p, o) {
    p.box(8, 84, 14, 12, C.gd1, C.ink); p.box(26, 84, 14, 12, C.gd1, C.ink);
    p.box(10, 94, 12, 8, C.gd0, C.ink); p.box(28, 94, 12, 8, C.gd0, C.ink);
    p.box(10, 54, 28, 34, C.gd2, C.ink);
    p.ell(24, 72, 9, 12, C.gd3); p.r(11, 55, 3, 32, C.gd3);
    p.box(2, 58, 8, 26, C.gd2, C.ink); p.bell(6, 86, 4.5, 4.5, C.gd2, C.ink);
    p.box(38, 58, 8, 26, C.gd2, C.ink); p.bell(42, 86, 4.5, 4.5, C.gd2, C.ink);
    var tilt = o.tilt || 0;
    head('golden', p.at(p.ox + Math.round(tilt * p.s), p.oy + Math.round(8 * p.s), p.s), { tie: true, lx: o.lx, ly: o.ly, blink: o.blink, mouth: o.mouth, angry: o.angry });
  };

  function body(kind, pen, o) { (BODY[kind] || BODY.freddy)(pen, o || {}); }

  /* silueta oscura de un cuerpo (para criaturas en la penumbra) */
  function silhouette(kind, pen, o) {
    var t = PX.mk(Math.ceil(52 * pen.s) + 4, Math.ceil(116 * pen.s) + 4);
    body(kind, t.pen.at(2, 2, pen.s), o || {});
    var d = t.ctx.getImageData(0, 0, t.cv.width, t.cv.height), a = d.data;
    for (var i = 0; i < a.length; i += 4) { a[i] = 6; a[i + 1] = 4; a[i + 2] = 14; }
    t.ctx.putImageData(d, 0, 0);
    pen.c.drawImage(t.cv, pen.ox - 2, pen.oy - 2);
  }

  G.SPR = { head: head, body: body, portrait: portrait, silhouette: silhouette, tie: tie, eyeBall: eyeBall };
})(window);
