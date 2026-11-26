/* world.js — motor de exploración en vista 3/4 (estilo Zelda/Pokémon): mapa de baldosas, colisiones,
   cuartos, linterna con sombras de paredes, objetos interactivos y un animatrónico que acecha. */
(function (G) {
  'use strict';

  var T = 16, VW = 320, VH = 180, C = PX.C, TL = G.TILES;
  var M = null;                       // mapa activo
  var sprCache = {};
  var dk = PX.mk(VW, VH);             // lienzo de oscuridad

  /* ======================================================= */
  /*  Constructor de mapas                                    */
  /* ======================================================= */
  function Builder(cols, rows) {
    this.cols = cols; this.rows = rows;
    this.floor = []; this.roomOf = [];
    for (var y = 0; y < rows; y++) {
      var f = [], r = [];
      for (var x = 0; x < cols; x++) { f.push(''); r.push(-1); }
      this.floor.push(f); this.roomOf.push(r);
    }
    this.rooms = []; this.props = []; this.decor = []; this.lights = []; this.spawns = []; this.start = [64, 160];
  }
  Builder.prototype = {
    /* habitación rectangular (coordenadas de baldosa, inclusivas) */
    room: function (id, name, x0, y0, x1, y1, type, o) {
      o = o || {};
      var idx = this.rooms.length;
      this.rooms.push({ id: id, name: name, x0: x0, y0: y0, x1: x1, y1: y1, type: type, ambient: o.ambient == null ? 0.85 : o.ambient, color: o.color || '#3d3760', hall: !!o.hall, alwaysVisible: !!o.alwaysVisible });
      for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) { this.floor[y][x] = type; this.roomOf[y][x] = idx; }
      return idx;
    },
    /* abertura de puerta (umbral caminable) */
    door: function (x0, y0, x1, y1) {
      for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) { this.floor[y][x] = 'D'; this.roomOf[y][x] = -2; }
    },
    /* mueble/objeto: (tx,ty) = esquina inferior izquierda en baldosas; o.ox/o.oy desplazan en píxeles */
    prop: function (name, tx, ty, o) { var pr = { name: name, tx: tx, ty: ty, o: o || {} }; this.props.push(pr); return pr; },
    /* decoración fija (piso o pared). x,y en píxeles (esquina superior izquierda) */
    decorPx: function (name, x, y, o) { this.decor.push({ name: name, x: x, y: y, o: o || {} }); },
    /* decoración de pared: (tx,ty) = baldosa de la cara superior de la pared */
    wall: function (name, tx, ty, o) { o = o || {}; this.decor.push({ name: name, x: tx * T + (o.ox || 0), y: ty * T + (o.oy || 0), o: o }); },
    light: function (x, y, r, col, o) { var l = Object.assign({ x: x, y: y, r: r, col: col }, o || {}); this.lights.push(l); },
    spawn: function (x, y) { this.spawns.push([x, y]); }
  };

  /* ======================================================= */
  /*  Inicialización del mapa                                 */
  /* ======================================================= */
  function init(def, enemyKind, night) {
    var B = new Builder(def.cols, def.rows);
    def.build(B);
    var cols = B.cols, rows = B.rows, x, y;

    // tipo de pared según el piso que tiene debajo: 0 piso, 1 cara baja, 2 cara alta, 3 tapa
    var wk = [];
    for (y = 0; y < rows; y++) {
      wk.push([]);
      for (x = 0; x < cols; x++) {
        if (B.floor[y][x]) { wk[y].push(0); continue; }
        var d = 1, yy = y + 1;
        while (yy < rows && !B.floor[yy][x]) { d++; yy++; }
        wk[y].push(yy >= rows ? 3 : (d === 1 ? 1 : d === 2 ? 2 : 3));
      }
    }

    // props: instancias, sólidos y sprites
    var solid = [];
    for (y = 0; y < rows; y++) { solid.push([]); for (x = 0; x < cols; x++) solid[y].push(!B.floor[y][x]); }
    var props = [];
    B.props.forEach(function (b) {
      var def2 = G.PROPS[b.name];
      if (!def2) { console.warn('prop desconocido:', b.name); return; }
      var o = b.o, left = b.tx * T + (o.ox || 0), bottom = b.ty * T + (o.oy || 0);
      var inst = { type: def2, name: b.name, o: o, x: left, y: bottom - def2.h, w: def2.w, h: def2.h, bottom: bottom, sb: o.sb != null ? o.sb : bottom, act: o.act || null, v: o.v };
      if (o.sbOf) inst.sb = o.sbOf + 0.5;
      var solidOn = o.solid !== false && def2.fw > 0;
      if (solidOn) {
        var fw = o.fw || def2.fw, fh = o.fh || def2.fh;
        for (var j = 0; j < fh; j++) for (var i = 0; i < fw; i++) {
          var sx = b.tx + i, sy = b.ty - fh + j;
          if (sy >= 0 && sy < rows && sx >= 0 && sx < cols) solid[sy][sx] = true;
        }
        inst.fp = [b.tx * T, (b.ty - fh) * T, fw * T, fh * T];
      }
      var lt = o.light || def2.light;
      if (lt) B.lights.push(Object.assign({}, lt, { x: left + (lt.dx || 0), y: inst.y + (lt.dy || 0), r: lt.r, col: lt.col, prop: true }));
      props.push(inst);
    });
    props.sort(function (a, b2) { return a.sb - b2.sb; });

    M = {
      cols: cols, rows: rows, floor: B.floor, roomOf: B.roomOf, wk: wk, solid: solid, rooms: B.rooms,
      props: props, decor: B.decor, lights: B.lights, spawns: B.spawns, start: B.start,
      pw: cols * T, ph: rows * T, bg: null,
      field: new Int16Array(cols * rows), fieldKey: -1, fieldT: 0
    };
    M.bg = renderBackground(B);
    // jugador y enemigo
    LC = lampCfg(night || 1); P.bat = 1; P.dead = 0; P.onT = 0; P.cd = 0; E.stun = 0; flashA = 0;
    P.x = B.start[0]; P.y = B.start[1]; P.dir = 'd'; P.lamp = true; P.faceAng = Math.PI / 2; P.moving = false; P.anim = 0;
    cam.x = clamp(P.x - VW / 2, 0, M.pw - VW); cam.y = clamp(P.y - 12 - VH / 2, 0, M.ph - VH);
    E.on = false; E.stage = 0; E.fade = 0; E.kind = enemyKind || def.enemy || 'freddy';
    P.room = -9; visited = {};
    return M;
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ======================================================= */
  /*  Fondo estático (pisos, paredes, decoración, sombras)    */
  /* ======================================================= */
  function renderBackground(B) {
    var t = PX.mk(M.pw, M.ph), c = t.ctx, x, y;
    c.fillStyle = '#05030a'; c.fillRect(0, 0, M.pw, M.ph);
    for (y = 0; y < M.rows; y++) for (x = 0; x < M.cols; x++) {
      var p = new PX.Pen(c, 1, x * T, y * T), f = M.floor[y][x], k = M.wk[y][x];
      if (f) { (TL.FLOOR[f] || TL.FLOOR.H)(p, x, y); continue; }
      if (k === 3) {
        TL.cap(p, x, y, { n: !!(M.floor[y - 1] && M.floor[y - 1][x]), s: false, w: !!(M.floor[y][x - 1]), e: !!(M.floor[y][x + 1]) });
        // borde inferior si debajo hay una cara
        if (M.wk[y + 1] && (M.wk[y + 1][x] === 2)) p.r(0, 14, 16, 2, '#14102a');
      } else if (k === 2 || k === 1) {
        var theme = floorBelow(x, y);
        var face = TL.FACE[theme] || TL.FACE.H;
        if (k === 2) {
          var pf = new PX.Pen(c, 1, x * T, y * T);
          face(pf, x);
          TL.jamb(pf, isOpen(x - 1, y) || isOpen(x - 1, y + 1), isOpen(x + 1, y) || isOpen(x + 1, y + 1));
        } else if (!(M.wk[y - 1] && M.wk[y - 1][x] === 2)) {
          c.save(); c.beginPath(); c.rect(x * T, y * T, T, T); c.clip();
          var pf2 = new PX.Pen(c, 1, x * T, (y - 1) * T); face(pf2, x); c.restore();
        }
      }
    }
    var pen = new PX.Pen(c, 1, 0, 0);
    // decoración de piso
    M.decor.forEach(function (d) { var dd = G.DECOR[d.name]; if (dd && dd.floor) dd.draw(new PX.Pen(c, 1, d.x, d.y), d.o); });
    // sombras de muebles sólidos
    M.props.forEach(function (pr) {
      if (!pr.fp) return;
      pen.dith(pr.fp[0] - 1, pr.fp[1] + pr.fp[3] - 2, pr.fp[2] + 3, 5, '#05030a', 7);
      pen.dith(pr.fp[0], pr.fp[1] + pr.fp[3] - 1, pr.fp[2] + 1, 3, '#05030a', 11);
    });
    // decoración de pared
    M.decor.forEach(function (d) { var dd = G.DECOR[d.name]; if (dd && !dd.floor) dd.draw(new PX.Pen(c, 1, d.x, d.y), d.o); });
    return t.cv;
  }
  function isOpen(x, y) { return x >= 0 && y >= 0 && x < M.cols && y < M.rows && !!M.floor[y][x]; }
  function floorBelow(x, y) {
    for (var yy = y + 1; yy < M.rows; yy++) if (M.floor[yy][x]) return M.floor[yy][x] === 'D' ? floorNear(x, yy) : M.floor[yy][x];
    return 'H';
  }
  function floorNear(x, y) {   // un umbral toma el tema del cuarto vecino
    var cand = [[x - 1, y], [x + 1, y], [x, y + 1], [x, y - 1]];
    for (var i = 0; i < cand.length; i++) { var f = M.floor[cand[i][1]] && M.floor[cand[i][1]][cand[i][0]]; if (f && f !== 'D') return f; }
    return 'H';
  }

  /* ======================================================= */
  /*  Jugador                                                 */
  /* ======================================================= */
  var P = { x: 0, y: 0, dir: 'd', moving: false, anim: 0, speed: 54, lamp: true, faceAng: 0, room: -9, bat: 1, dead: 0, onT: 0, cd: 0 };
  /* Batería de la lámpara (por noche): dur = segundos de batería llena prendida; rech = segundos para recargarla apagada; dead = segundos
   * sin poder prenderla tras agotarla; tras 3 s seguidos prendida el enemigo se apresura (rush por segundo, hasta cap extra);
   * destello (Q): flash = batería que gasta, cool = recarga en s, stun = s que el enemigo retrocede. La Noche 1 es suave (tutorial). */
  function lampCfg(n) {
    var k = Math.max(0, n - 2);
    return n <= 1 ? { dur: 120, rech: 40, dead: 3, rush: 0.04, cap: 0.35, flash: 0.3, cool: 5, stun: 3.5 }
      : { dur: 80 - 6 * k, rech: 45, dead: 4, rush: 0.08 + 0.02 * k, cap: 0.6 + 0.08 * k, flash: 0.35, cool: 6, stun: 3 };
  }
  var LC = lampCfg(1), flashA = 0;
  function rush() { return P.lamp && P.onT > 3 ? 1 + Math.min(LC.cap, (P.onT - 3) * LC.rush) : 1; }
  function updateLamp(dt) {
    P.cd = Math.max(0, P.cd - dt);
    if (P.lamp) {
      P.onT += dt; P.bat -= dt / LC.dur;
      if (P.bat <= 0) { P.bat = 0; P.lamp = false; P.onT = 0; P.dead = LC.dead; if (hooks.onLamp) hooks.onLamp(false); }
    } else { P.dead = Math.max(0, P.dead - dt); P.bat = Math.min(1, P.bat + dt / LC.rech); }
  }
  /* destello: gasta batería; si el enemigo está cerca y dentro del cono (un poco más ancho que la luz), retrocede LC.stun s */
  function flash() {
    if (!P.lamp) return 'off';
    if (P.cd > 0) return 'cool';
    if (P.bat < LC.flash) return 'low';
    P.bat -= LC.flash; P.cd = LC.cool; flashA = 1;
    var o = beamOrigin(), ex = E.x, ey = E.y - 14;
    var hit = E.on && Math.hypot(ex - o[0], ey - o[1]) < BEAM.len * 1.3 && Math.abs(angDiff(Math.atan2(ey - o[1], ex - o[0]), P.faceAng)) < BEAM.half * 1.5 && lineClear(o[0], o[1], ex, ey);
    if (hit) E.stun = LC.stun;
    return hit ? 'hit' : 'miss';
  }
  var cam = { x: 0, y: 0 };
  var visited = {};
  var mouse = { x: 160, y: 90, t: -9 };
  var hooks = { onRoom: null, onCatch: null, onNear: null, onLamp: null, taskState: function () { return 'pending'; } };
  var target = null;

  function solidPx(px, py) {
    var tx = Math.floor(px / T), ty = Math.floor(py / T);
    if (tx < 0 || ty < 0 || tx >= M.cols || ty >= M.rows) return true;
    return M.solid[ty][tx];
  }
  function blocked(x, y, hw, hd) {
    return solidPx(x - hw, y) || solidPx(x + hw, y) || solidPx(x - hw, y - hd) || solidPx(x + hw, y - hd);
  }
  function movePlayer(dx, dy) {
    var nx = P.x + dx;
    if (!blocked(nx, P.y, 5, 4)) P.x = nx;
    var ny = P.y + dy;
    if (!blocked(P.x, ny, 5, 4)) P.y = ny;
  }

  /* longitud de un rayo hasta chocar con una pared (las caras de pared se iluminan 28 px) */
  function rayLen(x0, y0, ang, maxLen, step) {
    step = step || 2;
    var dx = Math.cos(ang) * step, dy = Math.sin(ang) * step, x = x0, y = y0, n = (maxLen / step) | 0, inFace = -1;
    var sx0 = (x0 / T) | 0, sy0 = (y0 / T) | 0;
    // si el origen ya está sobre la cara de una pared (pegado al muro), esa cara no frena el rayo
    if (sx0 >= 0 && sy0 >= 0 && sx0 < M.cols && sy0 < M.rows && (M.wk[sy0][sx0] === 1 || M.wk[sy0][sx0] === 2)) inFace = 9999;
    for (var i = 1; i <= n; i++) {
      x += dx; y += dy;
      var tx = (x / T) | 0, ty = (y / T) | 0;
      if (x < 0 || y < 0 || tx >= M.cols || ty >= M.rows) return i * step;
      var k = M.wk[ty][tx];
      if (k === 0) { inFace = -1; continue; }
      if (k === 3) return i * step;
      if (inFace < 0) inFace = Math.round(28 / step); else { inFace--; if (inFace <= 0) return i * step; }
    }
    return maxLen;
  }
  function lineClear(x0, y0, x1, y1) {
    var dist = Math.hypot(x1 - x0, y1 - y0), ang = Math.atan2(y1 - y0, x1 - x0);
    return rayLen(x0, y0, ang, dist) >= dist - 3;
  }
  var BEAM = { len: 92, half: 0.46 };
  function beamOrigin() { return [P.x, P.y - 11]; }
  /* ¿está el punto (x,y) iluminado por la linterna o el halo del jugador? */
  function lit(x, y) {
    var o = beamOrigin(), d = Math.hypot(x - o[0], y - o[1]);
    if (d < 20 && lineClear(o[0], o[1], x, y)) return true;
    return beamHits(x, y);
  }
  /* solo el cono de la lámpara encendida (el halo no cuenta): es lo que frena al animatrónico */
  function beamHits(x, y) {
    if (!P.lamp) return false;
    var o = beamOrigin(), dx = x - o[0], dy = y - o[1], d = Math.hypot(dx, dy);
    if (d > BEAM.len) return false;
    var da = Math.abs(angDiff(Math.atan2(dy, dx), P.faceAng));
    return da < BEAM.half + 0.08 && lineClear(o[0], o[1], x, y);
  }
  function angDiff(a, b) { var d = a - b; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; }

  /* ======================================================= */
  /*  Enemigo                                                 */
  /* ======================================================= */
  var E = { on: false, x: 0, y: 0, stage: 0, walk: 0, lit: 0, fade: 0, face: 'd', near: 0, kind: 'freddy', stun: 0 };
  var SPEED = [0, 9, 17, 29];
  /* cada animatrónico: colores del cuerpo, color de los ojos y qué tan rápido camina */
  var KIND = {
    freddy: { body: C.fr2, dark: C.fr1, belly: C.fr4, eye: '#5ab4ff', mult: 1, tie: '#241a40' },
    bonnie: { body: C.bn2, dark: C.bn1, belly: C.bn3, eye: '#ff4adf', mult: 1.1, tie: '#b3182b' },
    chica: { body: C.yl2, dark: C.yl1, belly: '#f2f0ff', eye: '#ff4adf', mult: 1, tie: '#ff5fd2' },
    foxy: { body: C.fx2, dark: C.fx1, belly: '#3a4560', eye: '#ffe45c', mult: 1.45, tie: null },
    golden: { body: C.gd2, dark: C.gd1, belly: C.gd3, eye: '#ffffff', mult: 0.85, tie: C.gd2 }
  };
  function computeField(force) {
    var tx = (P.x / T) | 0, ty = ((P.y - 2) / T) | 0, key = ty * M.cols + tx;
    if (!force && key === M.fieldKey && M.fieldT < 0.5) return;
    M.fieldKey = key; M.fieldT = 0;
    var f = M.field, n = M.cols * M.rows, i, q = [], head = 0;
    for (i = 0; i < n; i++) f[i] = 9999;
    if (ty < 0 || ty >= M.rows || tx < 0 || tx >= M.cols) return;
    f[key] = 0; q.push(key);
    var nb = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (head < q.length) {
      var cur = q[head++], cx = cur % M.cols, cy = (cur / M.cols) | 0, cd = f[cur];
      for (var k = 0; k < 4; k++) {
        var nx = cx + nb[k][0], ny = cy + nb[k][1];
        if (nx < 0 || ny < 0 || nx >= M.cols || ny >= M.rows || M.solid[ny][nx]) continue;
        var ni = ny * M.cols + nx;
        if (f[ni] > cd + 1) { f[ni] = cd + 1; q.push(ni); }
      }
    }
  }
  /* Golden Freddy aparece y desaparece; los demás siempre se ven */
  function enemyVis(t) {
    if (E.kind !== 'golden') return 1;
    var c = t % 8;
    return c < 4 ? 1 : (c < 4.5 || c > 7.5) ? (Math.sin(t * 50) > 0 ? 0.6 : 0) : 0;
  }
  function spawnEnemy() {
    var best = null, bd = -1;
    M.spawns.forEach(function (s) { var d = Math.hypot(s[0] - P.x, s[1] - P.y); if (d > bd) { bd = d; best = s; } });
    if (!best) return;
    E.x = best[0]; E.y = best[1]; E.on = true; E.fade = 0; E.lit = 0; E.near = 0;
  }
  function updateEnemy(dt) {
    if (!E.on) return;
    E.fade = Math.min(1, E.fade + dt * 1.5);
    M.fieldT += dt; computeField(false);
    var tx = (E.x / T) | 0, ty = ((E.y - 2) / T) | 0;
    var litNow = beamHits(E.x, E.y - 14) || beamHits(E.x, E.y - 4);
    E.lit = litNow ? Math.min(1.5, E.lit + dt) : Math.max(0, E.lit - dt * 2);
    var sp = (SPEED[E.stage] || 0) * (KIND[E.kind] || KIND.freddy).mult * rush(), dir = 1;
    E.stun = Math.max(0, E.stun - dt);
    if (litNow) { sp = 14; dir = -1; }
    if (E.stun > 0) { sp = 24; dir = -1; }
    var best = null, bv = dir > 0 ? 99999 : -1, nb = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (var k = 0; k < 4; k++) {
      var nx = tx + nb[k][0], ny = ty + nb[k][1];
      if (nx < 0 || ny < 0 || nx >= M.cols || ny >= M.rows || M.solid[ny][nx]) continue;
      var v = M.field[ny * M.cols + nx];
      if (v >= 9999) continue;
      if (dir > 0 ? v < bv : v > bv) { bv = v; best = [nx, ny]; }
    }
    var dist = Math.hypot(E.x - P.x, E.y - P.y);
    if (best && sp > 0) {
      var gx = best[0] * T + 8, gy = best[1] * T + 14, ddx = gx - E.x, ddy = gy - E.y, dd = Math.hypot(ddx, ddy) || 1;
      var step = Math.min(dd, sp * dt);
      E.x += ddx / dd * step; E.y += ddy / dd * step;
      E.walk += dt * 6;
      if (Math.abs(ddx) > Math.abs(ddy)) E.face = ddx > 0 ? 'r' : 'l'; else E.face = ddy > 0 ? 'd' : 'u';
    }
    E.near -= dt;
    if (dist < 110 && E.near <= 0 && hooks.onNear) { E.near = 0.9 + dist / 120; hooks.onNear(dist); }
    if (dist < 11 && !litNow && !E.stun && hooks.onCatch) { hooks.onCatch(); }
  }

  /* ======================================================= */
  /*  Actualización                                           */
  /* ======================================================= */
  function update(dt, keys) {
    updateLamp(dt);
    var ax = (keys.d ? 1 : 0) - (keys.a ? 1 : 0), ay = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);
    if (ax || ay) {
      var l = Math.hypot(ax, ay), vx = ax / l * P.speed * dt, vy = ay / l * P.speed * dt;
      movePlayer(vx, vy);
      P.moving = true; P.anim += dt * 8;
      if (Math.abs(ax) >= Math.abs(ay) && ax) P.dir = ax > 0 ? 'r' : 'l'; else P.dir = ay > 0 ? 'd' : 'u';
      P.moveAng = Math.atan2(ay, ax);
    } else { P.moving = false; P.anim = 0; }

    // dirección de la linterna: hacia el mouse si se movió hace poco; si no, hacia donde caminas
    var want;
    if (nowT - mouse.t < 2.5) want = Math.atan2(mouse.y + cam.y - (P.y - 11), mouse.x + cam.x - P.x);
    else if (P.moving) want = P.moveAng;
    else want = P.faceAng;
    P.faceAng += angDiff(want, P.faceAng) * Math.min(1, dt * 12);

    // cuarto actual
    var tx = (P.x / T) | 0, ty = ((P.y - 2) / T) | 0, ri = M.roomOf[ty] ? M.roomOf[ty][tx] : -1;
    if (ri >= 0 && ri !== P.room) { P.room = ri; visited[ri] = true; if (hooks.onRoom) hooks.onRoom(M.rooms[ri]); }

    updateEnemy(dt);

    // objeto interactivo más cercano
    target = null;
    var best = 1e9, fx = P.x, fy = P.y - 2;
    for (var i = 0; i < M.props.length; i++) {
      var pr = M.props[i]; if (!pr.act) continue;
      var z = pr.zone || (pr.zone = zoneOf(pr));
      var cx = clamp(fx, z[0], z[0] + z[2]), cy = clamp(fy, z[1], z[1] + z[3]), d = Math.hypot(fx - cx, fy - cy);
      if (d < 1 && d + 0 < best) { best = d; target = pr; }
    }
  }
  function zoneOf(pr) {
    var a = pr.act, o = pr.o;
    if (a.zone) return [pr.x + a.zone[0], pr.y + a.zone[1], a.zone[2], a.zone[3]];
    return [pr.x - 8, pr.y - 6, pr.w + 16, pr.h + 14];
  }
  var nowT = 0;

  /* ======================================================= */
  /*  Sprites del jugador y del enemigo                       */
  /* ======================================================= */
  function playerSprite(dir, frame, lamp) {
    var key = 'P' + dir + frame + (lamp ? 1 : 0);
    if (sprCache[key]) return sprCache[key];
    var t = PX.mk(18, 26), p = t.pen, cap = '#24409a', cap2 = '#3a5ad0', capD = '#1a2f78', sk = C.sk1, shirt = '#2c4aa8', shirtL = '#4a6ad0', pants = '#1c2438', ink = C.ink;
    var sw = frame === 1 ? 1 : frame === 3 ? -1 : 0;           // balanceo al caminar
    var flip = dir === 'l', d = flip ? 'r' : dir;
    p.ell(9, 24, 6, 2, 'rgba(0,0,0,0.35)');
    if (d === 'd') {
      p.r(5 + 0, 17, 3, 5 - (sw > 0 ? 1 : 0), pants); p.r(10, 17, 3, 5 - (sw < 0 ? 1 : 0), pants);
      p.r(5, 21 - (sw > 0 ? 1 : 0), 3, 2, ink); p.r(10, 21 - (sw < 0 ? 1 : 0), 3, 2, ink);
      p.r(4, 11, 10, 7, shirt); p.r(4, 11, 10, 1, shirtL); p.r(8, 12, 2, 5, shirtL); p.r(4, 17, 10, 1, '#14102a');
      p.r(10, 13, 2, 2, C.yl3);                                   // placa
      p.r(2, 12, 2, 6, shirt); p.r(14, 12, 2, 6, shirt);
      p.r(2, 18, 2, 2, sk); p.r(14, 18 + sw, 2, 2, sk);
      p.r(5, 5, 8, 6, sk); p.r(5, 5, 8, 1, '#c88858');
      p.r(6, 8, 2, 2, ink); p.r(11, 8, 2, 2, ink); p.p(6, 8, C.wh); p.p(11, 8, C.wh);
      p.r(7, 10, 5, 1, '#3a1a0c');
      p.r(4, 1, 10, 5, cap); p.r(4, 1, 10, 1, cap2); p.r(3, 5, 12, 2, capD); p.r(8, 2, 2, 2, C.yl2);
      // linterna en la mano derecha
      p.r(15, 17, 3, 4, '#46526a'); p.r(15, 16, 3, 2, lamp ? '#fff6b0' : '#7e90b0');
    } else if (d === 'u') {
      p.r(5, 17, 3, 5 - (sw > 0 ? 1 : 0), pants); p.r(10, 17, 3, 5 - (sw < 0 ? 1 : 0), pants);
      p.r(5, 21 - (sw > 0 ? 1 : 0), 3, 2, ink); p.r(10, 21 - (sw < 0 ? 1 : 0), 3, 2, ink);
      p.r(4, 11, 10, 7, '#233f96'); p.r(4, 17, 10, 1, '#14102a'); p.r(8, 12, 2, 5, '#2c4aa8');
      p.r(2, 12, 2, 6, '#233f96'); p.r(14, 12, 2, 6, '#233f96'); p.r(2, 18, 2, 2, sk); p.r(14, 18 - sw, 2, 2, sk);
      p.r(5, 5, 8, 6, '#3a1a0c');
      p.r(4, 1, 10, 6, cap); p.r(4, 1, 10, 1, cap2); p.r(5, 6, 8, 1, capD);
      p.r(1, 12, 2, 6, '#46526a');
    } else {   // perfil derecho
      var lg = sw;
      p.r(7 + lg, 17, 3, 5, pants); p.r(8 - lg, 17, 3, 5, '#141a2a');
      p.r(7 + lg, 21, 4, 2, ink); p.r(8 - lg, 21, 4, 2, ink);
      p.r(5, 11, 8, 7, shirt); p.r(5, 11, 8, 1, shirtL); p.r(5, 17, 8, 1, '#14102a');
      p.r(10, 13, 2, 2, C.yl3);
      p.r(6, 5, 7, 6, sk); p.r(11, 7, 3, 3, sk); p.r(11, 7, 1, 1, ink); p.r(12, 7, 2, 1, ink);
      p.r(6, 10, 6, 1, '#3a1a0c');
      p.r(5, 1, 9, 5, cap); p.r(5, 1, 9, 1, cap2); p.r(4, 5, 11, 2, capD); p.r(7, 2, 2, 2, C.yl2);
      p.r(5, 12, 2, 5, '#233f96');
      p.r(10 + sw, 12, 2, 5, shirt); p.r(11 + sw, 16, 6, 2, sk);                       // brazo extendido
      p.r(13 + sw, 15, 5, 4, '#46526a'); p.r(17 + sw, 15, 1, 4, lamp ? '#fff6b0' : '#7e90b0');
    }
    var cv = t.cv;
    if (flip) { var f = PX.mk(18, 26); f.ctx.translate(18, 0); f.ctx.scale(-1, 1); f.ctx.drawImage(cv, 0, 0); cv = f.cv; }
    return (sprCache[key] = cv);
  }

  function enemySprite(kind, frame, glow) {
    var key = 'E' + kind + frame + (glow ? 1 : 0);
    if (sprCache[key]) return sprCache[key];
    var K = KIND[kind] || KIND.freddy;
    var t = PX.mk(30, 46), p = t.pen, s = 0.42, sw = frame ? 1 : 0;
    p.ell(15, 43, 9, 2.4, 'rgba(0,0,0,0.4)');
    // piernas y pies
    p.box(9, 33, 5, 8 - sw, K.body, C.ink); p.box(16, 33, 5, 7 + sw, K.body, C.ink);
    p.box(8, 40 - sw, 7, 3, K.dark, C.ink); p.box(15, 39 + sw, 7, 3, K.dark, C.ink);
    if (kind === 'foxy') { p.r(10, 36, 3, 2, C.mt3); p.r(17, 37, 3, 2, C.mt3); }
    // torso, panza y brazos
    p.box(8, 22, 14, 12, K.body, C.ink);
    if (kind === 'foxy') { p.r(11, 24, 8, 8, '#1a2030'); for (var i = 0; i < 3; i++) p.r(12, 25 + i * 3, 6, 1, C.mt4); }
    else if (kind === 'chica') { p.box(10, 24, 10, 8, '#f2f0ff', C.ink, 0); p.r(11, 26, 8, 1, C.pu1); p.r(11, 29, 6, 1, C.pu1); }
    else p.ell(15, 29, 4.5, 4.5, K.belly);
    p.box(3, 23, 4, 11, K.body, C.ink); p.box(23, 23, 4, 11, K.body, C.ink);
    if (kind === 'foxy') { p.r(24, 33, 2, 6, C.mt4); p.r(22, 38, 4, 2, C.mt5); }           // garfio
    if (kind === 'bonnie') { p.box(1, 28, 5, 9, C.rd2, C.ink); }                              // guitarra roja
    // cabeza
    SPR.head(kind === 'golden' ? 'golden' : kind, p.at(5, 1, s), { eye: glow ? '#ffffff' : K.eye, angry: true });
    if (K.tie) SPR.tie(p, 15, 22, K.tie, 5);
    return (sprCache[key] = t.cv);
  }

  /* ======================================================= */
  /*  Dibujo                                                  */
  /* ======================================================= */
  function draw(ctx, t, dt) {
    nowT = t;
    var tx = clamp(P.x - VW / 2, 0, M.pw - VW), ty = clamp(P.y - 14 - VH / 2, 0, M.ph - VH);
    cam.x += (tx - cam.x) * Math.min(1, dt * 7); cam.y += (ty - cam.y) * Math.min(1, dt * 7);
    var cx = Math.round(cam.x), cy = Math.round(cam.y);
    ctx.drawImage(M.bg, cx, cy, VW, VH, 0, 0, VW, VH);

    // entidades ordenadas por la línea base
    var ents = [], i;
    for (i = 0; i < M.props.length; i++) {
      var pr = M.props[i];
      if (pr.x + pr.w < cx - 4 || pr.x > cx + VW + 4 || pr.y + pr.h < cy - 4 || pr.y > cy + VH + 4) continue;
      ents.push({ sb: pr.sb, k: 0, o: pr });
    }
    ents.push({ sb: P.y, k: 1 });
    if (E.on) ents.push({ sb: E.y, k: 2 });
    ents.sort(function (a, b) { return a.sb - b.sb; });
    for (i = 0; i < ents.length; i++) {
      var en = ents[i];
      if (en.k === 0) {
        var pr2 = en.o, spr = spriteFor(pr2), sx = pr2.x - cx, sy = pr2.y - cy;
        ctx.drawImage(spr, sx, sy);
        if (pr2.type.anim) pr2.type.anim(ctx, sx, sy, t, pr2, { done: pr2.act ? hooks.taskState(pr2.act.id) : null, px: P.x, py: P.y });
      } else if (en.k === 1) {
        var fr = P.moving ? [0, 1, 0, 3][(P.anim | 0) & 3] : 0;
        ctx.drawImage(playerSprite(P.dir, fr, P.lamp), Math.round(P.x - 9 - cx), Math.round(P.y - 24 - cy));
      } else {
        var ef = Math.floor(E.walk) & 1;
        ctx.globalAlpha = E.fade * enemyVis(t);
        var ex = Math.round(E.x - 15 - cx) + (E.lit > 0.2 ? ((Math.random() * 3 - 1) | 0) : 0), ey = Math.round(E.y - 44 - cy);
        ctx.drawImage(enemySprite(E.kind, ef, E.lit > 0.2), ex, ey);
        ctx.globalAlpha = 1;
      }
    }
    lighting(ctx, t, cx, cy);
    if (flashA > 0) { ctx.fillStyle = 'rgba(255,250,225,' + (flashA * 0.8).toFixed(3) + ')'; ctx.fillRect(0, 0, VW, VH); flashA = Math.max(0, flashA - dt * 4); }
  }

  function spriteFor(pr) {
    var key = pr.name + '|' + (pr.v || '');
    if (sprCache[key]) return sprCache[key];
    var t = PX.mk(pr.w, pr.h);
    pr.type.draw(t.pen, { v: pr.v, o: pr.o });
    return (sprCache[key] = t.cv);
  }

  function lighting(ctx, t, cx, cy) {
    var d = dk.ctx, pen = dk.pen, i, st = E.stage;
    // polígono de visión desde el jugador (no se ve a través de las paredes)
    var vo = [P.x, P.y - 8], NV = 112, vpts = [], a3, ln;
    for (i = 0; i < NV; i++) {
      a3 = i / NV * Math.PI * 2; ln = rayLen(vo[0], vo[1], a3, 210, 3) + 4;
      vpts.push(vo[0] - cx + Math.cos(a3) * ln, vo[1] - cy + Math.sin(a3) * ln);
    }
    d.globalCompositeOperation = 'source-over'; d.clearRect(0, 0, VW, VH);
    d.fillStyle = 'rgba(3,2,10,0.92)'; d.fillRect(0, 0, VW, VH);
    // ambiente por cuarto
    M.rooms.forEach(function (rm) {
      var r = lrect(rm), x = r[0] - cx, y = r[1] - cy;
      if (x > VW || y > VH || x + r[2] < 0 || y + r[3] < 0) return;
      d.clearRect(x, y, r[2], r[3]); d.fillStyle = 'rgba(3,2,10,' + rm.ambient + ')'; d.fillRect(x, y, r[2], r[3]);
    });
    d.globalCompositeOperation = 'destination-out';
    // luces fijas (recortadas a su cuarto)
    M.lights.forEach(function (l) {
      var lx = l.x - cx, ly = l.y - cy;
      if (lx < -l.r || lx > VW + l.r || ly < -l.r || ly > VH + l.r) return;
      var fl = l.flick ? (Math.sin(t * l.flick * 6.3 + l.x) + Math.sin(t * 17.1 + l.y) > -1.1 ? 1 : 0.35) : 1;
      var rr = l.r * (0.97 + 0.03 * Math.sin(t * 9 + l.x));
      d.save();
      if (l.clip) { var rm = M.rooms[l.clip]; var r = lrect(rm); d.beginPath(); d.rect(r[0] - cx, r[1] - cy, r[2], r[3]); d.clip(); }
      [[1, 0.16], [0.8, 0.22], [0.6, 0.32], [0.4, 0.45]].forEach(function (s) { pen.circ(lx, ly, rr * s[0], 'rgba(0,0,0,' + (s[1] * fl) + ')'); });
      d.restore();
    });
    // halo del jugador y linterna (con sombras de pared)
    var o = beamOrigin(), ox = o[0] - cx, oy = o[1] - cy, i2, n;
    var hp = [];
    n = 20;
    for (i2 = 0; i2 < n; i2++) { var a = i2 / n * Math.PI * 2; var rl = rayLen(o[0], o[1], a, 26); hp.push(ox + Math.cos(a) * rl, oy + Math.sin(a) * rl); }
    pen.poly(hp, 'rgba(0,0,0,0.55)');
    var hp2 = [];
    for (i2 = 0; i2 < n; i2++) { var a2 = i2 / n * Math.PI * 2; var rl2 = rayLen(o[0], o[1], a2, 15); hp2.push(ox + Math.cos(a2) * rl2, oy + Math.sin(a2) * rl2); }
    pen.poly(hp2, 'rgba(0,0,0,0.7)');
    var flick = E.on && st >= 2 && Math.sin(t * 41) * Math.sin(t * 5.7) > (Math.hypot(E.x - P.x, E.y - P.y) < 110 ? 0.45 : 0.72); // más parpadeo cerca del enemigo
    if (P.lamp && !flick) {
      var N = 26, lens = [], angs = [];
      for (i2 = 0; i2 <= N; i2++) { var ag = P.faceAng - BEAM.half + (2 * BEAM.half) * i2 / N; angs.push(ag); lens.push(rayLen(o[0], o[1], ag, BEAM.len)); }
      [[1, 0.2], [0.82, 0.25], [0.64, 0.33], [0.46, 0.5]].forEach(function (s) {
        var pts = [ox, oy];
        for (var j = 0; j <= N; j++) pts.push(ox + Math.cos(angs[j]) * lens[j] * s[0], oy + Math.sin(angs[j]) * lens[j] * s[0]);
        pen.poly(pts, 'rgba(0,0,0,' + s[1] + ')');
      });
    }
    // todo lo que queda fuera de la línea de visión se oscurece por completo (misma capa, un solo dibujo)
    d.globalCompositeOperation = 'source-over'; d.fillStyle = '#05030a';
    d.beginPath(); d.rect(0, 0, VW, VH); d.moveTo(vpts[0], vpts[1]);
    for (i = 2; i < vpts.length; i += 2) d.lineTo(vpts[i], vpts[i + 1]);
    d.closePath(); d.fill('evenodd');
    ctx.drawImage(dk.cv, 0, 0);

    // brillos de color de las luces fijas (sobre la oscuridad)
    var p2 = new PX.Pen(ctx, 1, 0, 0);
    M.lights.forEach(function (l) {
      if (!l.glow) return;
      var lx = l.x - cx, ly = l.y - cy;
      if (lx < -l.r || lx > VW + l.r || ly < -l.r || ly > VH + l.r) return;
      if (!lineClear(vo[0], vo[1], l.x, l.y)) return;
      p2.ell(lx, ly, l.r * 0.5, l.r * 0.4, p2.pat(l.glow, 2));
    });
    // ojos del animatrónico (se ven aun en la oscuridad)
    if (E.on) {
      var ex = E.x - cx, ey = E.y - 36 - cy, bl = (Math.floor(t * 1.4) % 6 === 5);
      if (!bl && E.fade * enemyVis(t) > 0.5 && lineClear(vo[0], vo[1], E.x, E.y - 36)) {
        var col = E.lit > 0.2 ? '#ffffff' : (KIND[E.kind] || KIND.freddy).eye;
        (E.kind === 'foxy' ? [3] : [-3, 3]).forEach(function (dx) { p2.ell(ex + dx, ey, 4, 3, p2.pat(col, 3)); p2.r(ex + dx - 1, ey - 1, 2, 2, col); });
      }
    }
    // destellos de pistas pendientes cuando la luz las alcanza (se dibujan antes de la máscara de visión)
    drawSparkles(p2, t, cx, cy);
  }
  function drawSparkles(p2, t, cx, cy) {
    M.props.forEach(function (pr) {
      if (!pr.act) return;
      var st2 = hooks.taskState(pr.act.id);
      if (st2 !== 'pending') return;
      var z = pr.zone || (pr.zone = zoneOf(pr)), zx = z[0] + z[2] / 2, zy = pr.y + pr.h * 0.4;
      var ins = lit(pr.x + pr.w / 2, pr.y + pr.h / 2) || Math.hypot(zx - P.x, zy - P.y) < 46;
      if (!ins || !lineClear(P.x, P.y - 8, pr.x + pr.w / 2, pr.y + pr.h / 2)) return;
      var sx = pr.x + pr.w / 2 - cx, sy = pr.y - 3 - cy + Math.sin(t * 4) * 1.5;
      if (Math.sin(t * 6 + pr.x) > -0.3) { p2.r(sx - 3, sy, 7, 1, '#fff6b0'); p2.r(sx, sy - 3, 1, 7, '#fff6b0'); p2.r(sx - 1, sy - 1, 3, 3, '#ffe45c'); }
    });
  }
  function lrect(rm) { return [rm.x0 * T - 8, (rm.y0 - 2) * T, (rm.x1 - rm.x0 + 1) * T + 16, (rm.y1 - rm.y0 + 3) * T]; }

  /* ======================================================= */
  /*  Minimapa                                                */
  /* ======================================================= */
  function drawMini(c, w, h) {
    c.clearRect(0, 0, w, h);
    c.fillStyle = 'rgba(5,3,10,0.78)'; c.fillRect(0, 0, w, h);
    var s = Math.min(w / M.cols, h / M.rows), ox = (w - M.cols * s) / 2, oy = (h - M.rows * s) / 2, x, y;
    for (y = 0; y < M.rows; y++) for (x = 0; x < M.cols; x++) {
      var f = M.floor[y][x]; if (!f) continue;
      var ri = M.roomOf[y][x], rm = ri >= 0 ? M.rooms[ri] : null;
      var seen = !rm || rm.hall || visited[ri] || rm.alwaysVisible;
      c.fillStyle = f === 'D' ? '#5a4630' : (seen ? (rm ? rm.color : '#3d3760') : '#1b1736');
      c.fillRect(ox + x * s, oy + y * s, Math.ceil(s), Math.ceil(s));
    }
    if (E.on && E.stage >= 3 && Math.sin(nowT * 8) > 0) { c.fillStyle = '#ff3b4a'; c.fillRect(ox + E.x / T * s - 1, oy + E.y / T * s - 1, 3, 3); }
    c.fillStyle = Math.sin(nowT * 6) > -0.2 ? '#ffe45c' : '#ffffff';
    c.fillRect(ox + P.x / T * s - 1.5, oy + P.y / T * s - 1.5, 3.5, 3.5);
  }

  /* ======================================================= */
  /*  API pública                                             */
  /* ======================================================= */
  G.WORLD = {
    T: T, VW: VW, VH: VH,
    init: init, update: update, draw: draw, drawMini: drawMini,
    hooks: hooks,
    get map() { return M; }, get player() { return P; }, get enemy() { return E; }, get target() { return target; },
    get cam() { return cam; },
    toggleLamp: function () { if (P.lamp || P.dead <= 0) { P.lamp = !P.lamp; P.onT = 0; } return P.lamp; },   // agotada: no prende hasta que pasen LC.dead s
    setLamp: function (v) { P.lamp = !!v; P.onT = 0; if (v) { P.dead = 0; P.bat = Math.max(P.bat, 0.05); } },
    flash: flash,
    lampState: function () { return { on: P.lamp, bat: P.bat, dead: P.dead, cool: P.cd / LC.cool, rush: rush() }; },
    setMouse: function (x, y, t) { mouse.x = x; mouse.y = y; mouse.t = t; },
    setStage: function (s) {
      if (s === E.stage && (E.on || s === 0)) return;
      E.stage = s;
      if (s >= 1 && !E.on) spawnEnemy();
      if (s === 0) E.on = false;
    },
    resetEnemy: function () { E.on = false; if (E.stage >= 1) spawnEnemy(); },
    teleport: function (x, y) { P.x = x; P.y = y; cam.x = clamp(x - VW / 2, 0, M.pw - VW); cam.y = clamp(y - 14 - VH / 2, 0, M.ph - VH); },
    /* rectángulo en pantalla (320x180) de un objeto interactivo */
    screenRect: function (id) {
      for (var i = 0; i < M.props.length; i++) { var p = M.props[i]; if (p.act && p.act.id === id) return [p.x - Math.round(cam.x), p.y - Math.round(cam.y), p.w, p.h]; }
      return null;
    },
    roomAt: function (x, y) { var ri = M.roomOf[(y / T) | 0] && M.roomOf[(y / T) | 0][(x / T) | 0]; return ri >= 0 ? M.rooms[ri] : null; },
    props: function () { return M.props; },
    /* imagen completa del mapa (para revisar el arte) */
    renderAll: function () {
      var t = PX.mk(M.pw, M.ph), c = t.ctx; c.drawImage(M.bg, 0, 0);
      M.props.forEach(function (pr) {
        c.drawImage(spriteFor(pr), pr.x, pr.y);
        if (pr.type.anim) pr.type.anim(c, pr.x, pr.y, 1.3, pr, { done: 'pending', px: P.x, py: P.y });
      });
      return t.cv;
    },
    lit: lit,
    /* zona de interacción de un objeto con tarea [x, y, w, h] */
    actZone: function (pr) { return pr.zone || (pr.zone = zoneOf(pr)); },
    /* punto (x,y) alcanzable CAMINANDO desde (x0,y0) dentro de la zona de interacción de pr; null si no se puede */
    standPoint: function (pr, x0, y0) {
      var z = pr.zone || (pr.zone = zoneOf(pr)), sx = (x0 / T) | 0, sy = ((y0 - 2) / T) | 0, seen = {}, q = [[sx, sy]], head = 0;
      seen[sy * M.cols + sx] = true;
      while (head < q.length) {
        var c = q[head++], cx = c[0], cy = c[1], px = cx * T + 8, py = cy * T + 12;
        if (!blocked(px, py, 5, 4)) {
          var zx = clamp(px, z[0], z[0] + z[2]), zy = clamp(py - 2, z[1], z[1] + z[3]);
          if (Math.hypot(px - zx, py - 2 - zy) < 1) return [px, py];
        }
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
          var nx = cx + d[0], ny = cy + d[1];
          if (nx < 0 || ny < 0 || nx >= M.cols || ny >= M.rows || M.solid[ny][nx] || seen[ny * M.cols + nx]) return;
          seen[ny * M.cols + nx] = true; q.push([nx, ny]);
        });
      }
      return null;
    }
  };
})(window);
