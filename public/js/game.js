/* game.js — motor de la actividad: flujo de noches, pistas, preguntas, energía y final. */
(function () {
  'use strict';

  var W = PX.W, H = PX.H;
  var LV = window.LV, LEVELS = LV.LEVELS, fmt = LV.fmt;
  var qs = new URLSearchParams(location.search);

  /* ---------- utilidades ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function rand(a) { return a[(Math.random() * a.length) | 0]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0, t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function px(s) { return String(s).replace(/\u2212/g, '<i class="mn"></i>'); }
  function rad(s) { return s.replace(/√/g, '<span class="rad">√</span>'); }

  var game = $('#game'), view = $('#view'), ctx = view.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  /* ---------- estado ---------- */
  var S = {
    mode: 'title', name: '', lvl: 0, solved: {}, energy: 100, lErr: 0, tErr: 0, scares: 0,
    elapsed: 0, stars: [], manualMax: 1, active: false, busy: false, lastAct: Date.now(),
    mx: 160, my: 90, dawn: 0, confetti: false, jumpT0: 0, lvStart: 0, qOpen: false
  };
  var T0 = performance.now();
  function nowS() { return (performance.now() - T0) / 1000; }
  function curLv() { return LEVELS[S.lvl]; }
  function stage() { var e = S.energy; return e > 75 ? 0 : e > 50 ? 1 : e > 25 ? 2 : 3; }

  /* ---------- escenas ---------- */
  var bgCache = {}, cur = { key: null, sc: null, bg: null };
  function setScene(key) {
    var sc = SC.reg[key];
    if (!sc) return;
    if (!bgCache[key]) { var m = PX.mk(W, H); sc.paint(m.pen, m.ctx); bgCache[key] = m.cv; }
    cur.key = key; cur.sc = sc; cur.bg = bgCache[key];
  }
  var dk = PX.mk(W, H);
  function unsolvedMap() {
    var m = {}, lv = curLv();
    if (S.mode === 'play' && lv) lv.spots.forEach(function (s) { if (!S.solved[s.id]) m[s.id] = true; });
    return m;
  }
  function drawDark(t, lv) {
    var c = dk.ctx, p = dk.pen, a = lv.darkA || 0.93, R = (lv.darkR || 36) * (0.97 + Math.sin(t * 19) * 0.015 + Math.sin(t * 7.3) * 0.015);
    c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, W, H);
    c.fillStyle = 'rgba(2,1,8,' + a + ')'; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'destination-out';
    [[1, 0.2], [0.84, 0.28], [0.68, 0.4], [0.52, 0.55], [0.36, 1]].forEach(function (r) { p.circ(S.mx, S.my, R * r[0], 'rgba(0,0,0,' + r[1] + ')'); });
    c.globalCompositeOperation = 'source-over';
    ctx.drawImage(dk.cv, 0, 0);
  }
  function drawSparkles(t, lv) {
    if (Date.now() - S.lastAct < 14000) return;
    var p = new PX.Pen(ctx, 1, 0, 0);
    lv.spots.forEach(function (sp) {
      if (S.solved[sp.id] || lockedMsg(lv, sp)) return;
      if (Math.sin(t * 4 + sp.rect[0]) < 0.2) return;
      var cx = Math.round(sp.rect[0] + sp.rect[2] / 2), cy = Math.round(sp.rect[1] + sp.rect[3] / 2);
      p.r(cx - 3, cy, 7, 1, '#fff6b0'); p.r(cx, cy - 3, 1, 7, '#fff6b0'); p.r(cx - 1, cy - 1, 3, 3, '#ffe45c');
    });
  }
  function grain() {
    for (var i = 0; i < 22; i++) {
      ctx.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.07) + ')';
      ctx.fillRect((Math.random() * W) | 0, (Math.random() * H) | 0, 1, 1);
    }
  }

  var lastDraw = 0;
  function loop(now) {
    requestAnimationFrame(loop);
    if (now - lastDraw < 32) return;      // ~30 fps: suficiente para pixel art y ligero para laptops escolares
    lastDraw = now;
    var t = nowS();
    try { render(t); } catch (e) { if (!render.warned) { render.warned = true; console.error(e); } }
  }
  function render(t) {
    if (S.mode === 'jump') { SC.jump(ctx, curLv().enemy, t - S.jumpT0); grain(); return; }
    if (S.mode === 'play' && curLv().explore) { exploreFrame(t); return; }
    if (!cur.sc) return;
    var lv = curLv();
    var st = { stage: S.mode === 'play' ? stage() : 0, mx: S.mx, my: S.my, solved: S.solved, unsolved: unsolvedMap(), prog: S.dawn, confetti: S.confetti };
    ctx.drawImage(cur.bg, 0, 0);
    cur.sc.frame(ctx, t, st);
    if (S.mode === 'play' && lv.dark) drawDark(t, lv);
    if (cur.sc.overlay) cur.sc.overlay(ctx, t, st);
    if (S.mode === 'play' && lv.dark) drawSparkles(t, lv);
    grain();
  }

  /* ---------- diálogo ---------- */
  var dlg = { box: $('#dialog'), name: $('#dlg-name'), txt: $('#dlg-text'), img: $('#dlg-img'), next: $('#dlg-next'), pic: $('.dlg-pic'), skip: $('#dlg-skip') };
  var NAMES = { phone: 'CHICO DEL TELÉFONO', mike: 'MIKE', sys: '' };
  var dlgState = null;
  function say(lines, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var i = 0, typing = false, timer = null, full = '', done = false;
      dlg.box.classList.remove('hidden');
      dlg.skip.style.display = opts.noskip ? 'none' : '';
      function showLine() {
        var L = lines[i], who = L.w || 'sys';
        dlg.name.textContent = NAMES[who] || '';
        dlg.name.style.display = who === 'sys' ? 'none' : '';
        if (who === 'sys') { dlg.pic.style.display = 'none'; }
        else { dlg.pic.style.display = ''; dlg.img.src = SPR.portrait(who === 'phone' ? 'phone' : 'mike'); }
        full = L.t; var n = 0; typing = true; dlg.txt.textContent = ''; dlg.next.classList.remove('on');
        clearInterval(timer);
        timer = setInterval(function () {
          n++; dlg.txt.innerHTML = rad(full.slice(0, n));
          if (n % 3 === 0) SND.play('type');
          if (n >= full.length) { clearInterval(timer); typing = false; dlg.next.classList.add('on'); }
        }, 24);
      }
      function finish() {
        if (done) return; done = true;
        clearInterval(timer); dlg.box.classList.add('hidden'); dlgState = null; resolve();
      }
      function advance() {
        if (done) return;
        SND.play('click');
        if (typing) { clearInterval(timer); dlg.txt.innerHTML = rad(full); typing = false; dlg.next.classList.add('on'); return; }
        i++;
        if (i >= lines.length) finish(); else showLine();
      }
      dlgState = { advance: advance, finish: finish };
      showLine();
    });
  }
  $('.dlg-box').addEventListener('click', function (e) { if (e.target === dlg.skip) return; if (dlgState) dlgState.advance(); });
  dlg.skip.addEventListener('click', function (e) { e.stopPropagation(); if (dlgState) dlgState.finish(); });

  /* ---------- toast, efectos ---------- */
  var toastT = null;
  function toast(msg, bad) {
    var t = $('#toast'); t.textContent = msg; t.classList.toggle('bad', !!bad); t.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 2200);
  }
  function shake() { game.classList.remove('shake'); void game.offsetWidth; game.classList.add('shake'); $('#flash').classList.remove('on'); void $('#flash').offsetWidth; $('#flash').classList.add('on'); }
  var noiseUrl = (function () {
    var m = PX.mk(64, 36), d = m.ctx.createImageData(64, 36);
    for (var i = 0; i < d.data.length; i += 4) { var v = (Math.random() * 255) | 0; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    m.ctx.putImageData(d, 0, 0); return m.cv.toDataURL();
  })();
  $('#static').style.backgroundImage = 'url(' + noiseUrl + ')';
  function wipe(ms) { var s = $('#static'); s.classList.add('on'); SND.play('static'); return sleep(ms || 380).then(function () { s.classList.remove('on'); }); }

  /* ---------- HUD ---------- */
  function setIcons() {
    $('#ic-book').src = PX.icon('book'); $('#ic-book2').src = PX.icon('book');
    $('#ic-snd').src = PX.icon(SND.isMuted() ? 'mute' : 'spk');
    $('#ic-lamp').src = PX.icon('lamp');
    document.documentElement.style.setProperty('--ic-check', 'url(' + PX.icon('check') + ')');
  }
  function updateHUD(tick) {
    var lv = curLv(), total = lv.spots.length, done = Object.keys(S.solved).length;
    $('#hud-night').textContent = 'NOCHE ' + lv.n;
    var hr = done >= total ? 6 : Math.floor(done * 5 / total);
    var ck = $('#hud-clock'); ck.innerHTML = (hr === 0 ? 12 : hr) + '<small> AM</small>';
    if (tick) { ck.classList.remove('tick'); void ck.offsetWidth; ck.classList.add('tick'); }
    var pw = $('#pwr'); pw.innerHTML = '';
    var on = Math.max(0, Math.ceil(S.energy / 10));
    for (var i = 0; i < 10; i++) pw.appendChild(el('i', i < on ? 'on' : ''));
    pw.className = S.energy > 50 ? '' : S.energy > 25 ? 'mid' : 'low';
    $('#pwr-n').textContent = Math.max(0, S.energy) + '%';
    if (lv.explore) refreshTasks();
    var note = $('#hud-note');
    note.classList.add('hidden');
    report();
  }
  /* avance → dashboard del profesor (lobby.js lo limita en frecuencia) */
  function report(finished) {
    if (!window.LOBBY || S.mode === 'title') return;
    var total = 0, before = 0;
    LEVELS.forEach(function (l, i) { total += l.spots.length; if (i < S.lvl) before += l.spots.length; });
    var cur = finished ? total : before + Object.keys(S.solved).length;
    LOBBY.report({ night: S.lvl + 1, tasks: cur, total: total, errors: S.tErr, scares: S.scares, energy: Math.max(0, S.energy), elapsed: S.elapsed + (S.active ? Math.round((Date.now() - S.lvStart) / 1000) : 0), finished: !!finished });
  }
  function rebuildTray() {
    var lv = curLv(), c = $('#chips'); c.innerHTML = '';
    lv.spots.forEach(function (sp) { c.appendChild(el('span', 'chip' + (S.solved[sp.id] ? '' : ' empty'), S.solved[sp.id] ? rad(px(chipText(sp))) : '?')); });
    var it = $('#items'); it.innerHTML = '';
    lv.spots.forEach(function (sp) {
      if (!sp.gives || !S.solved[sp.id]) return;
      var used = lv.spots.some(function (o) { return o.needs === sp.gives[0] && S.solved[o.id]; });
      if (!used) it.appendChild(el('span', 'chip item', '<img alt="" src="' + PX.icon(sp.gives[2]) + '"> ' + sp.gives[1]));
    });
  }
  function chipText(sp) {
    var q = sp.q;
    if (q.type === 'multi') return q.fields.map(function (f) { return f.label + '=' + fmt(f.answer); }).join(' · ');
    if (q.crit) return fmt(q.answer);
    return '✔';
  }

  /* ---------- puntos calientes ---------- */
  /* objetos: se obtienen al resolver una tarea (gives) y se gastan al resolver la que los pide (needs) */
  function hasItem(lv, id) { return lv.spots.some(function (s) { return s.gives && s.gives[0] === id && S.solved[s.id]; }); }
  function lockedMsg(lv, sp) {
    if (sp.needs && !hasItem(lv, sp.needs)) return 'Te falta algo para usar esto';
    if (sp.final) {
      var rest = lv.spots.filter(function (s) { return !s.final && !S.solved[s.id]; }).length;
      if (rest) return 'Primero termina las otras tareas (' + rest + ')';
    }
    return '';
  }
  function buildHotspots(lv) {
    var hot = $('#hot'); hot.innerHTML = '';
    if (lv.explore) return;
    lv.spots.forEach(function (sp) {
      var b = el('button', 'hs' + (lv.dark ? ' dk' : ''));
      b.dataset.id = sp.id;
      b.style.left = (sp.rect[0] / W * 100) + '%'; b.style.top = (sp.rect[1] / H * 100) + '%';
      b.style.width = (sp.rect[2] / W * 100) + '%'; b.style.height = (sp.rect[3] / H * 100) + '%';
      b.setAttribute('aria-label', sp.name);
      b.innerHTML = '<span class="tag">' + sp.name + '</span>' + '<img class="mk" alt="" src="' + PX.icon(sp.final ? 'lock' : 'star') + '">';
      b.addEventListener('click', function () { onSpot(sp); });
      b.addEventListener('pointerenter', function () { if (!S.busy && S.active) SND.play('hover'); });
      hot.appendChild(b);
    });
    refreshHotspots();
  }
  function refreshHotspots() {
    var lv = curLv(); if (lv.explore) return;
    var idle = Date.now() - S.lastAct > 9000 && S.active && !S.busy;
    lv.spots.forEach(function (sp) {
      var b = $('.hs[data-id="' + sp.id + '"]'); if (!b) return;
      var locked = !!lockedMsg(lv, sp), done = !!S.solved[sp.id];
      b.classList.toggle('done', done);
      b.classList.toggle('locked', locked && !done);
      b.classList.toggle('ready', !locked && !done && !!sp.final);
      b.classList.toggle('hint', idle && !locked && !done);
      var img = b.querySelector('.mk');
      img.src = PX.icon(locked ? 'lock' : (sp.final ? 'bolt' : 'star'));
    });
  }
  function updateLit() {
    var lv = curLv(); if (!lv.dark) return;
    var R = (lv.darkR || 36) * 1.0;
    lv.spots.forEach(function (sp) {
      var b = $('.hs[data-id="' + sp.id + '"]'); if (!b) return;
      var r = sp.rect, dx = Math.max(r[0] - S.mx, 0, S.mx - (r[0] + r[2])), dy = Math.max(r[1] - S.my, 0, S.my - (r[1] + r[3]));
      b.classList.toggle('lit', Math.sqrt(dx * dx + dy * dy) < R * 0.8);
    });
  }
  function poke() { S.lastAct = Date.now(); }
  setInterval(function () { if (S.mode === 'play') refreshHotspots(); }, 700);

  game.addEventListener('pointermove', function (e) {
    var r = view.getBoundingClientRect();
    S.mx = Math.max(0, Math.min(W, (e.clientX - r.left) / r.width * W));
    S.my = Math.max(0, Math.min(H, (e.clientY - r.top) / r.height * H));
    if (S.mode === 'play') { updateLit(); }
    if (exploring()) WORLD.setMouse(S.mx, S.my, nowS());
  });
  game.addEventListener('pointerdown', function (e) {
    poke();
    var r = view.getBoundingClientRect();
    S.mx = (e.clientX - r.left) / r.width * W; S.my = (e.clientY - r.top) / r.height * H;
    if (S.mode === 'play') updateLit();
  });
  document.addEventListener('keydown', function (e) {
    poke();
    var tag = (e.target && e.target.tagName) || '';
    if (exploring() && tag !== 'INPUT') {
      var mk = KEYMAP[e.code];
      if (mk) { keys[mk] = true; e.preventDefault(); }
      if (!paused()) {
        if (e.code === 'KeyF' || e.code === 'KeyL') { toggleLamp(); }
        else if (e.code === 'KeyQ' && !e.repeat) { flashLamp(); }
        else if ((e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') && !e.repeat) { e.preventDefault(); interact(); }
      }
    }
    if (e.key === 'Escape') {
      if (!$('#manual').classList.contains('hidden')) { closeManual(); return; }
      if (S.qOpen) { closeQuestion(); return; }
    }
    if ((e.key === ' ' || e.key === 'Enter') && dlgState && tag !== 'INPUT' && tag !== 'BUTTON') { e.preventDefault(); dlgState.advance(); return; }
    if ((e.key === 'm' || e.key === 'M') && tag !== 'INPUT' && (S.mode === 'play' || S.mode === 'intro')) { toggleManual(); }
  });

  /* ---------- modo exploración ---------- */
  var KEYMAP = { KeyW: 'w', ArrowUp: 'w', KeyA: 'a', ArrowLeft: 'a', KeyS: 's', ArrowDown: 's', KeyD: 'd', ArrowRight: 'd' };
  var keys = { w: false, a: false, s: false, d: false };
  var xui = $('#xui'), promptEl = $('#prompt'), mini = $('#mini'), miniCtx = mini.getContext('2d');
  miniCtx.imageSmoothingEnabled = false;
  var lastT = 0, miniT = 0, stepT = 0, roomTimer = null;
  function exploring() { return S.mode === 'play' && !!curLv().explore; }
  function paused() {
    return !S.active || S.busy || S.qOpen || S.evt || !!dlgState || !$('#manual').classList.contains('hidden') || !$('#howto').classList.contains('hidden');
  }
  function spotById(id) { return curLv().spots.filter(function (s) { return s.id === id; })[0]; }

  WORLD.hooks.taskState = function (id) {
    var lv = curLv(), sp = spotById(id);
    if (!sp) return 'pending';
    if (S.solved[id]) return 'done';
    return lockedMsg(lv, sp) ? 'locked' : 'pending';
  };
  WORLD.hooks.onRoom = function (rm) {
    var n = $('#roomname'); n.textContent = rm.name.toUpperCase(); n.classList.remove('on'); void n.offsetWidth; n.classList.add('on');
  };
  WORLD.hooks.onCatch = function () { if (exploring() && !paused()) scare(); };
  WORLD.hooks.onNear = function () { SND.play('thud'); };
  WORLD.hooks.onLamp = function (on) { setLampUI(on); if (!on) { SND.play('static'); toast('¡Se acabó la batería! Espera a que se recargue.', true); } };

  function exploreFrame(t) {
    var dt = Math.min(0.05, (t - lastT) || 0.033); lastT = t;
    WORLD.setStage(stage());
    var pz = paused();
    if (!pz) {
      WORLD.update(dt, keys);
      if (WORLD.player.moving) { stepT -= dt; if (stepT <= 0) { SND.play('step'); stepT = 0.3; } }
    }
    WORLD.draw(ctx, t, dt);
    grain();
    updatePrompt(pz);
    updateBattery();
    if (t - miniT > 0.1) { miniT = t; WORLD.drawMini(miniCtx, 128, 72); }
  }
  function updatePrompt(pz) {
    var tg = WORLD.target;
    if (!tg || pz) { promptEl.classList.add('hidden'); return; }
    var id = tg.act.id, state = WORLD.hooks.taskState(id), cam = WORLD.cam, sp = spotById(id);
    if (state === 'pending' && sp && sp.dark && !WORLD.player.lamp) state = 'dark';
    promptEl.style.left = ((tg.x + tg.w / 2 - Math.round(cam.x)) / W * 100) + '%';
    promptEl.style.top = ((tg.y - Math.round(cam.y) - 3) / H * 100) + '%';
    var key = id + state;
    if (promptEl.dataset.k !== key) {
      promptEl.dataset.k = key;
      promptEl.innerHTML = (state === 'done' ? '<img alt="" src="' + PX.icon('check') + '">' : state === 'locked' ? '<img alt="" src="' + PX.icon('lock') + '">' : state === 'dark' ? '<img alt="" src="' + PX.icon('lampOff') + '">' : '<kbd>E</kbd>') + '<span>' + (state === 'dark' ? 'Muy oscuro: prende la lámpara' : tg.act.name) + '</span>';
    }
    promptEl.className = state === 'done' ? 'done' : state === 'locked' || state === 'dark' ? 'locked' : '';
  }
  function interact() {
    if (!exploring() || paused()) return;
    var tg = WORLD.target; if (!tg) return;
    var sp = spotById(tg.act.id); if (sp) onSpot(sp);
  }
  function toggleLamp() {
    var was = WORLD.player.lamp, on = WORLD.toggleLamp(); SND.play('click'); setLampUI(on);
    if (!was && !on) toast('La lámpara se está recargando…', true);
  }
  function flashLamp() {
    var r = WORLD.flash();
    if (r === 'off') toast('Prende la lámpara (F) para usar el destello.', true);
    else if (r === 'cool') toast('El destello se está recargando…', true);
    else if (r === 'low') toast('No queda batería para el destello.', true);
    else SND.play(r === 'hit' ? 'whoosh' : 'static');
  }
  var batEl = $('#lamp-bat'), batPct = -1;
  function updateBattery() {
    var ls = WORLD.lampState(), pc = Math.round(ls.bat * 100);
    var cool = ls.cool > 0; batEl.classList.toggle('cool', cool); // destello recargando
    if (pc === batPct) return;
    batPct = pc; batEl.firstChild.style.width = pc + '%'; batEl.classList.toggle('low', pc < 25); batEl.setAttribute('aria-valuenow', String(pc));
  }
  function setLampUI(on) {
    $('#lampbtn').classList.toggle('off', !on); $('#lamp-st').textContent = on ? 'ON' : 'OFF'; $('#ic-lamp').src = PX.icon(on ? 'lamp' : 'lampOff');
  }
  function buildTasks(lv) {
    var ul = $('#tk-list'); ul.innerHTML = '';
    lv.spots.forEach(function (sp) {
      var li = el('li', 'tk', '<i class="tk-box"></i><span class="tk-t">' + sp.task + '</span><span class="tk-r">' + sp.room + '</span>');
      li.dataset.id = sp.id; ul.appendChild(li);
    });
    refreshTasks();
  }
  function refreshTasks() {
    var lv = curLv(); if (!lv.explore) return;
    [].forEach.call($('#tk-list').children, function (li) {
      var sp = spotById(li.dataset.id); if (!sp) return;
      var done = !!S.solved[sp.id], lk = !done && !!lockedMsg(lv, sp);
      li.classList.toggle('done', done); li.classList.toggle('locked', lk); li.classList.toggle('next', !!sp.final && !lk && !done);
    });
  }
  document.addEventListener('keyup', function (e) { var k = KEYMAP[e.code]; if (k) keys[k] = false; });
  window.addEventListener('blur', function () { keys.w = keys.a = keys.s = keys.d = false; });
  $('#lampbtn').onclick = function () { if (exploring() && !paused()) toggleLamp(); this.blur(); };
  $('#hot').addEventListener('click', function (e) {
    if (!exploring() || paused()) return;
    var r = view.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * H, tg = WORLD.target;
    if (!tg) return;
    var cx = Math.round(WORLD.cam.x), cy = Math.round(WORLD.cam.y);
    if (x >= tg.x - cx - 6 && x <= tg.x - cx + tg.w + 6 && y >= tg.y - cy - 6 && y <= tg.y - cy + tg.h + 6) interact();
  });

  function same(a, b) { return Math.abs(a - b) < 1e-9; }

  /* ---------- pregunta ---------- */
  var QM = $('#qm'), qCtx = null;
  function onSpot(sp) {
    var lv = curLv();
    if (!S.active || S.busy || S.qOpen) return;
    poke();
    if (S.solved[sp.id]) { toast('Ya tienes esta pista ✔'); return; }
    var msg = lockedMsg(lv, sp);
    if (msg) { SND.play('bad'); toast(msg, true); return; }
    if (sp.dark && exploring() && !WORLD.player.lamp) { SND.play('bad'); toast('Está muy oscuro. Prende la lámpara (F) para usarlo.', true); return; }
    SND.play('click');
    openQuestion(sp);
  }
  function openQuestion(sp) {
    var lv = curLv(), q = sp.q;
    S.qOpen = true; QM.classList.remove('hidden'); QM.innerHTML = '';
    qCtx = { sp: sp, attempts: 0, locked: false };
    var box = el('div', 'qm-box pbox');
    var head = el('div', 'qm-head', '<img alt="" src="' + PX.icon(sp.icon || 'star') + '"><span>' + sp.title + '</span>');
    var x = el('button', 'x', '✕'); x.title = 'Cerrar (Esc)'; x.onclick = closeQuestion; head.appendChild(x);
    box.appendChild(head);
    box.appendChild(el('div', 'qm-flavor', sp.flavor));
    var Wi = sp.input && INPUTS[sp.input];
    if (q.tri && !(Wi && Wi.own)) {
      var fig = el('div', 'qm-tri');
      (Array.isArray(q.tri) ? q.tri : [q.tri]).forEach(function (svg, i) { fig.appendChild(el('figure', '', (Array.isArray(q.tri) ? '<figcaption>Par ' + 'ABC'[i] + '</figcaption>' : '') + svg)); });
      box.appendChild(fig);
    }
    if (q.given) { var g = el('div', 'qm-given'); q.given.forEach(function (t) { g.appendChild(el('span', '', rad(px(t)))); }); box.appendChild(g); }
    box.appendChild(el('div', 'qm-q', rad(q.q)));
    var ans = el('div', 'qm-ans'); box.appendChild(ans);
    var fb = el('div', 'qm-fb'); box.appendChild(fb);
    var btns = el('div', 'qm-btns'); box.appendChild(btns);
    QM.appendChild(box);

    var go = el('button', 'btn', 'RESPONDER'), man = el('button', 'btn ghost', 'MANUAL'), sol = el('button', 'btn ghost hidden', 'VER SOLUCIÓN');
    var cont = el('button', 'btn go hidden', 'CONTINUAR ▶');
    man.onclick = function () { openManual(); };
    btns.appendChild(go); btns.appendChild(man); btns.appendChild(sol); btns.appendChild(cont);

    function say2(cls, html) { fb.className = 'qm-fb ' + cls; fb.innerHTML = html; }
    function win() {
      qCtx.locked = true; SND.play('ok');
      say2('ok', '<b>' + rand(LV.RIGHT) + '</b><br>' + rad(q.expl || ''));
      go.classList.add('hidden'); sol.classList.add('hidden'); man.classList.add('hidden'); cont.classList.remove('hidden');
      cont.focus();
      cont.onclick = function () { solved(sp); };
    }
    function lose(extra) {
      qCtx.attempts++; SND.play('bad');
      var hint = q.hint ? '<br><b>Pista:</b> ' + rad(q.hint) : '';
      say2('bad', rand(LV.WRONG) + hint + (extra || ''));
      penalty();
      if (qCtx.attempts >= 3) sol.classList.remove('hidden');
      var mb = $('#btn-manual'); mb.classList.add('glow'); setTimeout(function () { mb.classList.remove('glow'); }, 4000);
    }

    /* ----- tipos ----- */
    var first = null, W = sp.input && INPUTS[sp.input];
    if (W && W.types.indexOf(q.type) >= 0) {
      go.classList.add('hidden');
      var whole = W.whole && q.type === 'multi', fl = q.type === 'multi' && !whole ? q.fields : [null], need = q.type === 'multi' ? q.fields.length : 1, done = 0, mounted = [];
      fl.forEach(function (f, i) {
        var host = ans;
        if (f) { host = el('div', 'fld f' + sp.input, '<span>' + rad(px(f.label)) + ' =</span>'); ans.appendChild(host); }
        var m = W.mount({
          q: q, field: f, fields: whole ? q.fields : null, ans: host, box: box, night: lv.n, confirm: !!sp.confirm, debug: SESSION.debug, px: px, rad: rad, done: Object.keys(S.solved).length, paused: function () { return !$('#manual').classList.contains('hidden'); },
          submit: function (v, k) {
            if (qCtx.locked) return false;
            if (!same(v, (k == null ? f || q : q.fields[k]).answer)) { lose(); return false; }
            if (k == null || done + 1 === need) m.lock();
            if (++done === need) win(); else { say2('ok', 'Bien. Sigue con el siguiente.'); if (k == null && mounted[i + 1]) mounted[i + 1].focus(); }
            return true;
          },
          win: win, lose: lose, say: say2, decoys: function (n, k) { return INPUTS_DECOYS(q, k == null ? f : q.fields[k], n); }
        });
        mounted.push(m);
      });
      if (SESSION.debug && new URLSearchParams(location.search).has('debug')) box._solve = function () { return mounted.reduce(function (p, m) { return p.then(function () { return m.solve(); }); }, Promise.resolve()); };
      sol.onclick = function () { mounted.forEach(function (m) { if (m.reveal) m.reveal(); }); mounted[0].focus(); say2('ok', (q.type === 'multi' ? 'Respuestas: ' + q.fields.map(function (f) { return rad(f.label) + ' = <b>' + fmt(f.answer) + '</b>'; }).join(' · ') : 'La respuesta es <b>' + fmt(q.answer) + '</b>.') + '<br>' + rad(q.expl || '')); sol.classList.add('hidden'); };
      setTimeout(function () { mounted[0].focus(); }, 60);
    } else if (q.type === 'choice') {
      go.classList.add('hidden');
      var o = el('div', 'opts'); ans.appendChild(o);
      shuffle(q.opts).forEach(function (v) {
        var b = el('button', 'opt', px(fmt(v))); b.dataset.v = String(v); b.setAttribute('aria-label', fmt(v));
        b.onclick = function () {
          if (qCtx.locked) return;
          if (same(v, q.answer)) { b.classList.add('ok'); win(); } else { b.classList.add('bad'); lose(); }
        };
        o.appendChild(b);
      });
      sol.onclick = function () { [].forEach.call(o.children, function (b) { if (b.dataset.v === String(q.answer)) b.classList.add('ok'); }); say2('ok', 'La respuesta es <b>' + fmt(q.answer) + '</b>.<br>' + rad(q.expl || '')); sol.classList.add('hidden'); };
    }
    if (first) setTimeout(function () { try { first.focus(); } catch (e) { /* sin foco */ } }, 60);
  }

  function closeQuestion(force) {
    // si ya acertó y cierra con Esc/✕, igual se registra la pista
    if (!force && qCtx && qCtx.locked && S.qOpen) { solved(qCtx.sp); return; }
    QM.classList.add('hidden'); QM.innerHTML = ''; S.qOpen = false; qCtx = null;
  }

  /* ---------- energía y susto ---------- */
  function penalty() {
    S.lErr++; S.tErr++; S.energy -= 15; shake(); updateHUD(); saveMid();
    if (S.energy <= 0) { setTimeout(scare, 450); }
    else if (stage() >= 2) SND.play('thud');
  }
  async function scare() {
    if (S.mode === 'jump') return;
    closeQuestion(true); closeManual(); S.busy = true; S.scares++;
    game.classList.add('scaring');
    S.mode = 'jump'; S.jumpT0 = nowS();
    SND.play('scare');
    $('#flash').classList.remove('on'); void $('#flash').offsetWidth; $('#flash').classList.add('on');
    await sleep(1000);
    $('#scare').classList.remove('hidden'); $('#scare').classList.add('on');
    await sleep(1500);
    $('#scare').classList.add('hidden'); $('#scare').classList.remove('on'); game.classList.remove('scaring');
    S.mode = 'play'; S.energy = 60; S.busy = false; poke(); updateHUD(); saveMid();
    if (curLv().explore) { WORLD.resetEnemy(); S.lastSolve = Date.now(); }
    await wipe(300);
  }

  /* ---------- objeto obtenido: se cierra con clic, E, Espacio o Enter ---------- */
  function showItem(g) {
    return new Promise(function (res) {
      var box = $('#gotitem');
      $('#gi-img').src = PX.icon(g[2]); $('#gi-name').textContent = g[1];
      box.classList.remove('hidden'); SND.play('ok');
      function close(e) {
        if (e && e.type === 'keydown') { if (e.code !== 'KeyE' && e.code !== 'Space' && e.code !== 'Enter') return; e.stopImmediatePropagation(); e.preventDefault(); }
        box.classList.add('hidden'); window.removeEventListener('keydown', close, true); $('#gi-go').onclick = null; res();
      }
      window.addEventListener('keydown', close, true); $('#gi-go').onclick = close;
    });
  }

  /* ---------- pista resuelta ---------- */
  async function solved(sp) {
    var lv = curLv();
    if (S.solved[sp.id]) return;
    S.solved[sp.id] = true; S.energy = Math.min(100, S.energy + 5); saveMid();
    closeQuestion(true); updateHUD(true); refreshHotspots();
    S.busy = true;
    SND.play('clue');
    // chip que vuela a la bandeja
    var r = lv.explore ? (WORLD.screenRect(sp.id) || [150, 80, 20, 20]) : sp.rect, chip = el('div', 'chip', rad(px(chipText(sp))));
    S.lastSolve = Date.now();
    chip.style.cssText = 'position:absolute;z-index:20;left:' + ((r[0] + r[2] / 2) / W * 100) + '%;top:' + ((r[1] + r[3] / 2) / H * 100) + '%;transform:translate(-50%,-50%)';
    game.appendChild(chip);
    await sleep(700);
    var tr = $('#chips').getBoundingClientRect(), gr = game.getBoundingClientRect(), cr = chip.getBoundingClientRect();
    var dx = (tr.left + 20 - gr.left) - (cr.left - gr.left), dy = (tr.top + tr.height / 2 - gr.top) - (cr.top - gr.top);
    var anim = chip.animate([{ transform: 'translate(-50%,-50%) scale(1.2)' }, { transform: 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px)) scale(.8)', opacity: .6 }], { duration: 650, easing: 'cubic-bezier(.5,0,.8,.4)', fill: 'forwards' });
    await anim.finished.catch(function () { });
    chip.remove(); rebuildTray();
    if (sp.gives) await showItem(sp.gives);
    S.busy = false; poke();
    if (lv.spots.every(function (s) { return S.solved[s.id]; })) endNight();
  }

  /* ---------- manual ---------- */
  function openManual() {
    $('#manual').classList.remove('hidden');
    var tabs = $('#man-tabs'); tabs.innerHTML = '';
    var want = Math.min(S.manualMax, S.mode === 'play' ? curLv().manual : 1);
    LV.MANUAL.forEach(function (p, i) {
      var locked = i + 1 > S.manualMax;
      var b = el('button', locked ? 'locked' : '', '<span>' + (i + 1) + '. ' + rad(px(p.t)) + '</span>' + (locked ? '<img alt="" src="' + PX.icon('lock') + '">' : ''));
      b.onclick = function () {
        if (locked) { toast('Se desbloquea más adelante', true); SND.play('bad'); return; }
        SND.play('click'); showPage(i);
      };
      tabs.appendChild(b);
    });
    showPage(want - 1);
    SND.play('click');
  }
  function showPage(i) {
    [].forEach.call($('#man-tabs').children, function (b, k) { b.classList.toggle('on', k === i); });
    var p = LV.MANUAL[i];
    $('#man-page').innerHTML = '<h3>' + (i + 1) + '. ' + rad(px(p.t)) + '</h3>' + rad(p.html);
  }
  function closeManual() { $('#manual').classList.add('hidden'); }
  function toggleManual() { if ($('#manual').classList.contains('hidden')) openManual(); else closeManual(); }
  $('#btn-manual').onclick = function () { if (S.mode === 'play' || S.mode === 'intro') toggleManual(); };
  $('#man-x').onclick = closeManual;
  $('#manual').addEventListener('click', function (e) { if (e.target === this) closeManual(); });
  $('#btn-mute').onclick = function () { SND.resume(); SND.setMuted(!SND.isMuted()); setIcons(); };

  /* ---------- flujo de noches ---------- */
  function card(lv) {
    return new Promise(function (resolve) {
      $('#card-n').textContent = 'NOCHE ' + lv.n; $('#card-t').textContent = '12:00 AM';
      $('#card-s').textContent = lv.sub; $('#card-k').innerHTML = rad(lv.topic);
      var c = $('#card'); c.classList.remove('hidden');
      var ci = c.querySelector('.card-in'); ci.style.animation = 'none'; void ci.offsetWidth; ci.style.animation = '';
      SND.play('levelup');
      var done = false;
      function end() { if (done) return; done = true; c.classList.add('hidden'); c.onclick = null; resolve(); }
      c.onclick = end; setTimeout(end, 2500);
    });
  }

  async function startLevel(i, fast, resume) {
    INPUTS_RESET();
    if (!(await checkSession())) return;
    var lv = LEVELS[i];
    S.lvl = i; S.solved = {}; S.energy = 100; S.lErr = 0; S.active = false; S.busy = true;
    S.manualMax = Math.max(S.manualMax, lv.manual);
    S.mode = 'play'; S.confetti = false; S.dawn = 0; S.lastSolve = Date.now();
    if (resume) { (resume.solved || []).forEach(function (id) { S.solved[id] = true; }); S.energy = resume.energy || 100; S.lErr = resume.lErr || 0; }
    keys.w = keys.a = keys.s = keys.d = false;
    $('#nightend').classList.add('hidden'); $('#title').classList.add('hidden'); $('#end').classList.add('hidden');
    $('#hud').classList.remove('hidden'); $('#tray').classList.remove('hidden');
    if (lv.explore) {
      WORLD.init(MAPS[lv.explore], lv.enemy, lv.n); cur.sc = null;
      xui.classList.remove('hidden'); $('#hot').classList.add('explore'); buildTasks(lv); setLampUI(true);
      promptEl.classList.add('hidden');
    } else {
      setScene(lv.scene); xui.classList.add('hidden'); $('#hot').classList.remove('explore');
    }
    buildHotspots(lv); updateHUD(); rebuildTray(); updateLit();
    SND.startHum();
    $('#hot').style.visibility = 'hidden';
    if (!fast) {
      await card(lv);
      await wipe(260);
      $('#hot').style.visibility = '';
      await say(lv.intro);
    } else { $('#hot').style.visibility = ''; }
    if (lv.n === 1 && !fast && !S.howtoShown) { S.howtoShown = true; await howto(lv); }
    S.lvStart = Date.now() - ((resume && resume.secs) || 0) * 1000; S.active = true; S.busy = false; poke(); S.lastSolve = Date.now();
    if (!lv.explore && !fast) toast('Haz clic en los objetos brillantes para buscar pistas');
  }
  var HOW_DEFAULT = [['eye', 'Haz <b>clic</b> en los objetos de la escena para buscar pistas.'], ['star', 'Elige el <b>criterio de congruencia</b> que aplica a los dos triángulos.'],
    ['bolt', 'Cada error gasta <b>energía</b>. ¡Si llega a 0, te atrapan!'], ['book', '¿Dudas? Abre el <b>manual</b> en cualquier momento.']];
  function howto(lv) {
    return new Promise(function (res) {
      var ol = $('#how-list'); ol.innerHTML = '';
      (lv.howto || HOW_DEFAULT).forEach(function (it) { ol.insertAdjacentHTML('beforeend', '<li><img alt="" src="' + PX.icon(it[0]) + '"><span>' + it[1] + '</span></li>'); });
      var h = $('#howto'); h.classList.remove('hidden');
      $('#how-go').onclick = function () { h.classList.add('hidden'); SND.play('click'); res(); };
    });
  }

  async function endNight() {
    var lv = curLv();
    S.active = false; S.busy = true;
    await sleep(500);
    var secs = Math.round((Date.now() - S.lvStart) / 1000);
    S.elapsed += secs;
    var stars = S.lErr <= 1 ? 3 : S.lErr <= 3 ? 2 : 1;
    S.stars[S.lvl] = stars;
    S.mode = 'dawn'; S.dawn = 0; setScene('dawn');
    $('#hot').innerHTML = ''; $('#hot').classList.remove('explore'); $('#hud').classList.add('hidden'); $('#tray').classList.add('hidden'); xui.classList.add('hidden');
    await wipe(300);
    SND.play('chime');
    var ne = $('#nightend'); ne.classList.remove('hidden');
    var last = S.lvl === LEVELS.length - 1;
    $('#ne-t').textContent = 'NOCHE ' + lv.n + ' SUPERADA';
    var st = $('#ne-stars'); st.innerHTML = '';
    for (var k = 0; k < 3; k++) { var im = el('img', k < stars ? 'pop' : ''); im.alt = ''; im.src = PX.icon(k < stars ? 'star' : 'starOff'); im.style.animationDelay = (0.9 + k * 0.25) + 's'; st.appendChild(im); }
    $('#ne-stats').innerHTML = 'ERRORES: ' + S.lErr + ' &nbsp;·&nbsp; TIEMPO: ' + mmss(secs);
    $('#ne-out').textContent = lv.outro;
    $('#ne-go').textContent = last ? 'VER MI CHEQUE ▶' : 'SIGUIENTE NOCHE ▶';
    // animación del amanecer
    var t0 = performance.now();
    (function anim() { var k2 = Math.min(1, (performance.now() - t0) / 3200); S.dawn = k2; if (k2 < 1 && S.mode === 'dawn') requestAnimationFrame(anim); })();
    if (!last) { if (!(await checkSession())) return; saveProgress(S.lvl + 1); }
    $('#ne-go').onclick = async function () {
      SND.play('click'); $('#ne-go').onclick = null;
      if (last) { $('#ne-go').textContent = 'ALGO SE ACERCA…'; await LOBBY.untilEvents(3); }       // nadie termina sin haber vivido 3 eventos
      await wipe(300);
      ne.classList.add('hidden');
      if (last) showEnd(); else startLevel(S.lvl + 1);
    };
  }
  function mmss(s) { return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }

  function showEnd() {
    clearProgress(); report(true);
    S.mode = 'end'; S.confetti = true; S.dawn = 1; setScene('dawn');
    SND.play('fanfare');
    $('#end').classList.remove('hidden');
    $('#ck-name').textContent = (S.name || 'GUARDIA').toUpperCase();
    var total = S.stars.reduce(function (a, b) { return a + (b || 0); }, 0);
    $('#ck-stats').innerHTML = '<div><b>' + mmss(S.elapsed) + '</b>TIEMPO</div><div><b>' + S.tErr + '</b>ERRORES</div><div><b>' + S.scares + '</b>SUSTOS</div><div><b>' + total + '/21</b>ESTRELLAS</div>';
    var ks = $('#ck-stars'); ks.innerHTML = '';
    LEVELS.forEach(function (_, i) { var n = S.stars[i] || 0; var im = el('img'); im.alt = ''; im.src = PX.icon(n >= 3 ? 'star' : 'starOff'); ks.appendChild(im); });
    SND.stopHum();
  }

  /* ---------- sesión: todo se borra cuando el servidor se reinicia ---------- */
  // El lanzador (iniciar.command) crea public/session.json con un id nuevo en cada encendido.
  // Si el navegador trae guardado otro id (o no hay sesión), se borra nombre, avance y estrellas.
  var SESSION = { ok: false, id: null, debug: false };
  function wipeAll() {
    try {
      Object.keys(localStorage).filter(function (k) { return k.indexOf('fnaf_fg_') === 0 && k !== 'fnaf_fg_mute'; }).forEach(function (k) { localStorage.removeItem(k); });
      sessionStorage.clear();
    } catch (e) { /* sin almacenamiento */ }
  }
  function loadSession() {
    return fetch('session.json?_=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; })
      .then(function (s) {
        if (s && s.id) { SESSION.ok = true; SESSION.id = String(s.id); SESSION.debug = !!s.debug; }
        try {
          if (!SESSION.ok || localStorage.getItem('fnaf_fg_session') !== SESSION.id) wipeAll();
          if (SESSION.ok) localStorage.setItem('fnaf_fg_session', SESSION.id);
        } catch (e) { /* sin almacenamiento */ }
      });
  }

  // Vuelve a pedir la sesión al servidor: si cambió (otro encendido) o se cerró, borra todo y recarga.
  // Evita que una pestaña que quedó abierta de otro grupo siga jugando con su avance.
  function checkSession() {
    return fetch('session.json?_=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (r.status === 404) return null; if (!r.ok) throw new Error('error pasajero'); return r.json(); })   // solo 404 = sesión cerrada
      .then(function (s) {
        var id = s && s.id ? String(s.id) : null;
        if (id !== SESSION.id) { wipeAll(); location.reload(); return false; }
        return true;
      }, function () { return true; });          // sin red: se vuelve a comprobar más tarde
  }

  /* ---------- guardado ---------- */
  function saveProgress(nextLvl, mid) {
    if (!SESSION.ok) return;          // sin sesión válida no se guarda nada
    try { localStorage.setItem('fnaf_fg_save', JSON.stringify({ name: S.name, lvl: nextLvl, tErr: S.tErr, scares: S.scares, elapsed: S.elapsed, stars: S.stars, manualMax: S.manualMax, mid: mid || null })); } catch (e) { /* sin almacenamiento */ }
  }
  /* avance de la noche en curso: al recargar o reabrir el navegador se reanuda aquí (la posición y el enemigo no se guardan) */
  function saveMid() {
    if (S.mode !== 'play' && S.mode !== 'jump') return;
    saveProgress(S.lvl, { solved: Object.keys(S.solved), energy: S.energy, lErr: S.lErr, secs: Math.round((Date.now() - S.lvStart) / 1000) });
  }
  function clearProgress() { try { localStorage.removeItem('fnaf_fg_save'); } catch (e) { /* sin almacenamiento */ } }
  function loadProgress() { try { return JSON.parse(localStorage.getItem('fnaf_fg_save') || 'null'); } catch (e) { return null; } }

  /* ---------- título e intro ---------- */
  async function intro() {
    S.mode = 'intro';
    $('#title').classList.add('hidden');
    for (var i = 0; i < LV.INTRO.length; i++) {
      setScene(LV.INTRO[i].scene);
      if (i > 0) await wipe(300);
      await say(LV.INTRO[i].lines);
    }
    await wipe(300);
    startLevel(0);
  }
  function resetRun() { S.tErr = 0; S.scares = 0; S.elapsed = 0; S.stars = []; S.manualMax = 1; S.howtoShown = false; }

  function initTitle() {
    S.mode = 'title'; setScene('title');
    $('#title').classList.remove('hidden'); $('#hud').classList.add('hidden'); $('#tray').classList.add('hidden'); xui.classList.add('hidden'); $('#hot').classList.remove('explore');
    $('#end').classList.add('hidden'); $('#nightend').classList.add('hidden');
    var save = loadProgress(), inp = $('#in-name');
    try { inp.value = (save && save.name) || localStorage.getItem('fnaf_fg_name') || ''; } catch (e) { /* sin almacenamiento */ }
    var cont = $('#btn-cont');
    if (save && save.lvl < LEVELS.length && (save.lvl > 0 || save.mid)) { cont.classList.remove('hidden'); cont.textContent = 'CONTINUAR · NOCHE ' + (save.lvl + 1); } else cont.classList.add('hidden');
  }
  function readName() {
    var n = $('#in-name').value.trim() || 'Guardia';
    if (SESSION.ok) { try { localStorage.setItem('fnaf_fg_name', n); } catch (e) { /* sin almacenamiento */ } }
    return n;
  }
  /* ----- eventos: el animatrónico se acerca y toda la clase debe contestar en 5 s (el servidor decide cuándo) ----- */
  var EV = { id: 0, answered: false, done: 0, raf: 0, head: null, kind: '' };
  var ENEMY_NAME = { freddy: 'FREDDY', bonnie: 'BONNIE', chica: 'CHICA', foxy: 'FOXY', golden: 'GOLDEN FREDDY' }, CRIT = ['', 'LLL', 'LAL', 'ALA', 'AAL', 'HC'];
  function evHead(kind) {
    if (EV.kind !== kind) { var t = PX.mk(48, 50); SPR.head(kind, t.pen, {}); EV.head = t.cv; EV.kind = kind; }
    return EV.head;
  }
  function evDraw(ev) {
    var cv = $('#evt-cv'), c = cv.getContext('2d'); c.imageSmoothingEnabled = false;
    (function frame() {
      if (EV.id !== ev.id || $('#evt').classList.contains('hidden')) return;
      var now = LOBBY.now(), k = Math.max(0, Math.min(1, (now - ev.startAt) / (ev.endAt - ev.startAt))), z = 0.5 + Math.pow(k, 2.2) * 5.2, h = evHead(ev.enemy);
      c.fillStyle = Math.sin(now / 40) > 0.4 ? '#1a0508' : '#05030a'; c.fillRect(0, 0, 320, 180);
      for (var i = 0; i < 90; i++) { c.fillStyle = 'rgba(255,60,70,' + Math.random() * 0.22 + ')'; c.fillRect((Math.random() * 320) | 0, (Math.random() * 180) | 0, 2 + (Math.random() * 20) | 0, 1); }
      var w = 48 * z, hh = 50 * z, sh = k * 4;
      c.globalAlpha = 0.35 + k * 0.65; c.drawImage(h, 160 - w / 2 + (Math.random() - 0.5) * sh, 90 - hh / 2 + (Math.random() - 0.5) * sh, w, hh); c.globalAlpha = 1;
      EV.raf = requestAnimationFrame(frame);
    })();
  }
  function evButtons(ev) {
    var box = $('#evt-btns'); box.innerHTML = '';
    [1, 2, 3, 4, 5].forEach(function (cd) {
      var b = el('button', 'opt', '<span class="k">' + cd + '</span>' + px(CRIT[cd])); b.type = 'button'; b.dataset.v = String(cd);
      b.onclick = function () { evAnswer(ev, cd, b); }; box.appendChild(b);
    });
  }
  function evAnswer(ev, cd, b) {
    if (EV.answered || LOBBY.now() > ev.endAt) return;
    EV.answered = true; SND.play('click'); b.classList.add('sel'); $('#evt-msg').textContent = 'Respuesta enviada… ¡esperen al resto!';
    [].forEach.call($('#evt-btns').children, function (x) { x.disabled = true; }); LOBBY.answer(ev.id, cd);
  }
  document.addEventListener('keydown', function (e) {
    if ($('#evt').classList.contains('hidden') || EV.answered) return;
    var n = '12345'.indexOf(e.key); if (n < 0) return; var b = $('#evt-btns').children[n]; if (b) { b.click(); e.preventDefault(); e.stopPropagation(); }
  }, true);
  function evClose() { $('#evt').classList.add('hidden'); $('#evt-res').classList.add('hidden'); S.evt = false; cancelAnimationFrame(EV.raf); }
  LOBBY.onEvent = function (ev) {
    if (!ev || !ev.mine) { if (!ev && S.evt && EV.id && !EV.pendingRes) evClose(); return; }
    var now = LOBBY.now();
    if (EV.id !== ev.id) {                                                    // evento nuevo: interrumpe lo que hagas
      EV.id = ev.id; EV.answered = false; EV.pendingRes = false; S.evt = true; keys.w = keys.a = keys.s = keys.d = false;
      closeQuestion(true); closeManual();
      $('#evt-title').textContent = '¡' + ENEMY_NAME[ev.enemy] + ' SE ACERCA!'; $('#evt-fig').innerHTML = TRI.pair(ev.kind, { seed: ev.seed, names: ['ABC', 'DEF'] });
      $('#evt-msg').textContent = '¿Qué criterio muestra que son congruentes?'; $('#evt-res').classList.add('hidden'); $('#evt-c').style.width = '0%'; $('#evt-cp').textContent = 'CLASE 0%';
      evButtons(ev); $('#evt').classList.remove('hidden'); SND.play('static'); SND.play('thud'); evDraw(ev);
    }
    var left = Math.max(0, (ev.endAt - now) / 1000), tot = (ev.endAt - ev.startAt) / 1000;
    $('#evt-time').textContent = now < ev.startAt ? '!' : Math.ceil(left); $('#evt-t').style.transform = 'scaleX(' + Math.max(0, Math.min(1, left / tot)) + ')';
    var pc = ev.total ? Math.round(ev.answered / ev.total * 100) : 0; $('#evt-c').style.width = pc + '%'; $('#evt-cp').textContent = 'CLASE ' + pc + '%';
    if (left > 0 && Math.floor(left * 2) !== EV.beat) { EV.beat = Math.floor(left * 2); SND.play('thud'); }
    if (ev.result && !EV.pendingRes) {
      EV.pendingRes = true; var mine = ev.result.failed.some(function (f) { return f.id === pidNow(); }), res = $('#evt-res'), names = ev.result.failed.map(function (f) { return f.name; });
      res.className = mine ? 'bad' : 'ok';
      res.innerHTML = mine ? '<b>¡TE ATRAPÓ!</b><p>No contestaste bien a tiempo.</p>' + (names.length > 1 ? '<p>También cayeron: ' + esc2(names.filter(function (n) { return n !== S.name; }).join(', ')) + '</p>' : '')
        : (names.length ? '<b>¡SOBREVIVISTE!</b><p>Pero cayeron: ' + esc2(names.join(', ')) + '</p>' : '<b>¡TODOS SOBREVIVIERON!</b>');
      SND.play(mine ? 'scare' : names.length ? 'chime' : 'fanfare');
      setTimeout(function () { evClose(); EV.pendingRes = false; if (mine && S.mode === 'play') { S.energy = Math.min(S.energy, 60); scare(); } }, mine ? 2600 : 4200);
    }
  };
  function pidNow() { try { return localStorage.getItem('fnaf_fg_pid'); } catch (e) { return null; } }
  function esc2(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* sala de espera: el profesor acepta el nombre del equipo e inicia con cuenta regresiva (lobby.js); sin servidor de sala pasa directo */
  LOBBY.onReject = function () { toast('El profesor rechazó ese nombre. Escribe otro.', true); $('#in-name').focus(); $('#in-name').select(); };
  LOBBY.onNoServer = function () { toast('No hay sala del profesor. Avísale: el juego solo se abre con su servidor.', true); };
  function enter(name, go) {
    $('#btn-start').disabled = $('#btn-cont').disabled = true;
    SND.resume(); SND.play('click');
    LOBBY.gate(name, SESSION.debug).then(function (ok) { if (ok) go(); }).then(function () { $('#btn-start').disabled = $('#btn-cont').disabled = false; });
  }
  $('#btn-start').onclick = function () {
    checkSession().then(function (ok) {
      if (!ok) return;
      var n = readName();
      enter(n, function () { S.name = n; resetRun(); clearProgress(); intro(); });
    });
  };
  $('#btn-cont').onclick = function () {
    checkSession().then(function (ok) { if (ok) { var sv = loadProgress(); enter((sv && sv.name) || readName(), continuar); } });
  };
  function continuar() {
    SND.resume(); SND.play('click');
    var save = loadProgress(); if (!save) return;
    S.name = save.name || readName(); resetRun();
    S.tErr = save.tErr || 0; S.scares = save.scares || 0; S.elapsed = save.elapsed || 0; S.stars = save.stars || []; S.manualMax = save.manualMax || 1; S.howtoShown = true;
    var lvS = LEVELS[save.lvl];
    if (save.mid && lvS && save.mid.solved.length >= lvS.spots.length) { save.mid = null; save.lvl++; }      // cerró justo al terminar la noche
    if (save.lvl >= LEVELS.length) { wipe(300).then(showEnd); return; }
    wipe(300).then(function () { startLevel(save.lvl, !!save.mid, save.mid); });
  }
  /* al recargar o reabrir el navegador: si el profesor ya aceptó a este equipo, vuelve a la sala y reanuda su partida solo */
  function autoResume() {
    LOBBY.peek().then(function (me) {
      if (!me || me.status === 'rejected' || me.finished || S.mode !== 'title') return;
      var sv = loadProgress();
      $('#in-name').value = me.name;
      if (sv && sv.lvl < LEVELS.length && (sv.lvl > 0 || sv.mid)) enter(me.name, continuar);
      else enter(me.name, function () { S.name = me.name; resetRun(); clearProgress(); intro(); });
    });
  }
  $('#in-name').addEventListener('keydown', function (e) { if (e.key === 'Enter') $('#btn-start').click(); });
  $('#btn-again').onclick = function () { SND.play('click'); try { localStorage.removeItem('fnaf_fg_name'); } catch (e) { /* sin almacenamiento */ } wipe(300).then(initTitle); };

  /* ---------- arranque ---------- */
  setIcons();
  requestAnimationFrame(loop);
  $('#btn-start').disabled = true; $('#btn-cont').disabled = true;     // hasta saber en qué sesión estamos
  loadSession().then(function () {
    initTitle();
    $('#btn-start').disabled = false; $('#btn-cont').disabled = false;
    autoResume();
    setInterval(checkSession, 15000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) checkSession(); });
    window.addEventListener('focus', checkSession);
    window.addEventListener('pageshow', function (e) { if (e.persisted) checkSession(); });
    // Atajos de prueba (?n=3, ?debug): solo si el lanzador se abrió con --pruebas
    var jump = SESSION.debug ? parseInt(qs.get('n'), 10) : NaN;
    if (jump >= 1 && jump <= LEVELS.length) {
      S.name = qs.get('name') || 'Guardia'; resetRun(); S.manualMax = LEVELS[jump - 1].manual; S.howtoShown = true;
      SND.resume();
      startLevel(jump - 1, qs.has('fast'));
    }
    if (SESSION.debug && qs.has('debug')) window.__G = { WORLD: WORLD, S: S, LEVELS: LEVELS, startLevel: startLevel, solved: solved, endNight: endNight, scare: scare, showEnd: showEnd };
  });
})();
