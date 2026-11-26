/* dashboard.js — panel del profesor: acepta/rechaza equipos, inicia la noche y muestra la carrera hacia el amanecer.
 * Habla con server.js (/api/admin/*). La escena 3D vive en dash3d.js. No se muestra el número de pistas: solo porcentaje y noche,
 * con una curva que premia el arranque (el primer avance se ve grande) y animaciones en cada logro. */
import { createScene, hueDeg } from './dash3d.js';

const $ = s => document.querySelector(s);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const scene = createScene($('#gl'));
if (!scene) document.body.classList.add('no-gl');

const ROW = 60;
const changed = new Map();
let offset = 0, last = null, sig = '', firstLoad = true, prev = new Map(), rows = new Map(), lastPhase = 'lobby', lastPend = 0, drawerTouched = false, prevLeader = null;

/* curva de avance: el arranque rinde más (25 % real → 37 % mostrado; 50 % → 67 %); 100 % es 100 % */
const shown = (tasks, total) => { const p = total ? Math.min(1, tasks / total) : 0; return p >= 1 ? 1 : 1 - Math.pow(1 - p, 1.6); };
const colorOf = id => `hsl(${hueDeg(id)} 100% 60%)`;

function call(action, id) {
  return fetch('/api/admin/' + action, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    .then(r => r.json().then(j => { if (!r.ok) alert(j.error || 'Error'); return j; })).then(poll);
}
const btn = (label, cls, fn) => { const b = el('button', 'btn small ' + cls, label); b.onclick = fn; return b; };

/* número que sube contando (recompensa visual) */
function countTo(node, to, suffix = '%') {
  const from = parseInt(node.dataset.v || '0', 10); node.dataset.v = to; if (from === to) { node.textContent = to + suffix; return; }
  const t0 = performance.now(), dur = 900;
  (function tick(now) { const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); node.textContent = Math.round(from + (to - from) * e) + suffix; if (k < 1) requestAnimationFrame(tick); })(t0);
}

/* ----- ambiente de cámara de seguridad: reloj del turno (12 AM → 6 AM según el avance de la clase), hora de la cámara y estática ----- */
let clkTxt = '';
function setClock(avg) {
  const h = avg >= 1 ? '6 AM' : ['12', '1', '2', '3', '4', '5'][Math.min(5, Math.floor(avg * 6))] + ' AM', c = $('#clk');
  if (h !== clkTxt) { if (clkTxt) { c.classList.remove('flip'); void c.offsetWidth; c.classList.add('flip'); } clkTxt = h; c.textContent = h; }
}
setInterval(() => { const d = new Date(); $('#cam-time').textContent = [d.getHours(), d.getMinutes(), d.getSeconds()].map(n => String(n).padStart(2, '0')).join(':'); }, 1000);
(function noise() {
  const cv = $('#noise'), g = cv.getContext('2d'), im = g.createImageData(cv.width, cv.height);
  setInterval(() => { for (let i = 0; i < im.data.length; i += 4) { const v = Math.random() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } g.putImageData(im, 0, 0); }, 90);
})();

/* ----- banners, avisos, cuenta regresiva ----- */
function banner(text, sub, color) {
  const w = $('#banner'), d = el('div'); d.style.setProperty('--c', color); d.textContent = text;
  if (sub) d.appendChild(el('small', '', sub)); w.appendChild(d); setTimeout(() => d.remove(), 2800);
}
function tip(html, color) {
  const t = el('div', 'tk'); t.style.setProperty('--c', color); t.innerHTML = html; $('#ticker').appendChild(t); setTimeout(() => t.remove(), 5200);
}
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let cdShown = '';
function countdown(left) {
  const cd = $('#cd');
  if (left <= 0) { cd.classList.add('hidden'); cdShown = ''; return; }
  cd.classList.remove('hidden', 'go');
  if (cdShown !== String(left)) { cdShown = String(left); cd.innerHTML = ''; cd.appendChild(el('span', '', cdShown)); }
  scene && scene.setCountdown(left);
}

/* ----- dibujo ----- */
function render(st) {
  last = st; offset = st.now - Date.now();
  const s2 = JSON.stringify([st.phase, st.startAt, st.players, st.ev]);          // no redibujar si nada cambió (evita perder clics)
  if (s2 === sig) return tickCd(); sig = s2;
  const P = st.players, nowMs = Date.now();
  const pend = P.filter(p => p.status === 'pending'), ok = P.filter(p => p.status === 'approved'), rej = P.filter(p => p.status === 'rejected');
  const dupN = {}; P.forEach(p => { if (p.status !== 'rejected') dupN[p.name.toLowerCase()] = (dupN[p.name.toLowerCase()] || 0) + 1; });

  /* eventos (no en la primera carga) */
  ok.forEach(p => {
    const a = prev.get(p.id), c = colorOf(p.id);
    if (!firstLoad) {
      if (!a || a.status !== 'approved') { scene && scene.burst(p.id, 'join'); tip(`<b>${esc(p.name)}</b> está listo`, c); }
      else if (p.finished && !a.finished) { scene && scene.burst(p.id, 'finish'); banner('¡6 AM!', p.name, c); tip(`¡<b>${esc(p.name)}</b> sobrevivió hasta las 6 AM!`, c); }
      else if (p.night > a.night) { scene && scene.burst(p.id, 'night'); banner(`NOCHE ${p.night}`, p.name, c); tip(`<b>${esc(p.name)}</b> sobrevivió la Noche ${p.night - 1}`, c); }
      else if (p.tasks > a.tasks) scene && scene.burst(p.id, 'step');
    }
    if (!a || p.tasks !== a.tasks || !changed.has(p.id)) changed.set(p.id, nowMs);        // para detectar equipos sin avance
  });
  prev = new Map(P.map(p => [p.id, { status: p.status, tasks: p.tasks, night: p.night, finished: p.finished }]));

  /* escena 3D */
  scene && scene.sync(P.filter(p => p.status !== 'rejected').map(p => ({ id: p.id, name: p.name, status: p.status, pct: p.status === 'approved' ? shown(p.tasks, p.total) : 0, online: p.online, finished: p.finished })), st.phase);

  /* marcador */
  const board = ok.map(p => ({ p, v: p.finished ? 1 : shown(p.tasks, p.total) })).sort((a, b) => b.v - a.v || b.p.night - a.p.night || a.p.name.localeCompare(b.p.name));
  const rowsEl = $('#rows'); rowsEl.style.height = board.length * ROW + 'px';
  const alive = new Set();
  board.forEach(({ p, v }, i) => {
    alive.add(p.id); let r = rows.get(p.id);
    if (!r) {
      const node = el('div', 'row'); node.style.setProperty('--c', colorOf(p.id));
      node.innerHTML = '<div class="rk"></div><div><div class="nm"><span class="dot"></span><span class="n"></span><span class="help hidden">¿AYUDA?</span><span class="night"></span></div><div class="bar"><i></i><em></em></div></div><div class="pc" data-v="0">0%</div>';
      rowsEl.appendChild(node); r = { node, v: 0 }; rows.set(p.id, r);
      node.style.transform = `translateY(${board.length * ROW}px)`;
    }
    const n = r.node, y = i * ROW, pct = Math.round(v * 100);
    n.style.setProperty('--t', `translateY(${y}px)`); requestAnimationFrame(() => { n.style.transform = `translateY(${y}px)`; });
    n.querySelector('.rk').textContent = i + 1; n.querySelector('.n').textContent = p.name;
    n.querySelector('.dot').classList.toggle('on', p.online);
    n.querySelector('.night').textContent = p.finished ? '6 AM ✔' : st.phase === 'lobby' ? 'LISTO' : 'NOCHE ' + p.night;
    n.querySelector('.bar i').style.width = pct + '%';
    countTo(n.querySelector('.pc'), pct);
    if (pct > r.v) { n.classList.remove('hot'); void n.offsetWidth; n.classList.add('hot'); }
    r.v = pct;
    n.querySelector('.help').classList.toggle('hidden', !(st.phase === 'playing' && p.online && !p.finished && nowMs - (changed.get(p.id) || nowMs) > 180000));   // sin avance 3 min: aviso discreto al profesor
  });
  rows.forEach((r, id) => { if (!alive.has(id)) { r.node.remove(); rows.delete(id); } });
  $('#rows-empty').classList.toggle('hidden', board.length > 0);
  const lead = board[0] && board[0].v > 0 ? board[0].p : null;
  if (!firstLoad && lead && prevLeader && lead.id !== prevLeader) tip(`<b>${esc(lead.name)}</b> toma la delantera`, colorOf(lead.id));
  prevLeader = lead ? lead.id : null;

  const avg = board.length ? board.reduce((a, b) => a + b.v, 0) / board.length : 0, gp = Math.round(avg * 100);
  $('#g-fill').style.width = gp + '%'; countTo($('#g-pct'), gp);
  setClock(avg);
  const mo = $('#g-moons'); if (!mo.children.length) for (let i = 0; i < 7; i++) mo.appendChild(el('span', 'moon'));
  [...mo.children].forEach((m, i) => m.classList.toggle('on', avg >= (i + 1) / 7 - 0.001));

  /* cabecera y panel */
  const ph = $('#phase'); ph.className = 'badge ' + st.phase;
  ph.textContent = st.phase === 'lobby' ? 'SALA DE ESPERA' : st.phase === 'countdown' ? 'CUENTA REGRESIVA' : 'EN CARRERA';
  $('#start').disabled = !(st.phase === 'lobby' && ok.length); $('#boo').disabled = st.phase !== 'playing' || !!st.ev;
  $('#start').textContent = st.phase === 'lobby' ? '▶ INICIAR' : st.phase === 'countdown' ? 'INICIANDO…' : 'EN CARRERA';
  $('#all').disabled = !pend.length;
  $('#n-pend').textContent = pend.length; $('#n-ok').textContent = ok.length; $('#n-on').textContent = ok.filter(p => p.online).length; $('#n-fin').textContent = ok.filter(p => p.finished).length;
  const pb = $('#n-pend-badge'); pb.textContent = pend.length; pb.classList.toggle('hidden', !pend.length);
  if (pend.length > lastPend && !drawerTouched) $('#drawer').classList.add('open');      // llegó una solicitud: abre el panel para no perderla
  if (!pend.length && lastPend && !drawerTouched && st.phase !== 'lobby') $('#drawer').classList.remove('open');
  lastPend = pend.length;

  const ul = $('#pending'); ul.innerHTML = '';
  pend.forEach(p => {
    const li = el('li'); li.appendChild(el('div', 'nm', p.name));
    if (dupN[p.name.toLowerCase()] > 1) li.appendChild(el('div', 'dup', '⚠ Nombre repetido'));
    const row = el('div', 'row2'); row.appendChild(btn('ACEPTAR', 'go', () => call('approve', p.id))); row.appendChild(btn('RECHAZAR', 'bad', () => call('reject', p.id)));
    li.appendChild(row); ul.appendChild(li);
  });
  $('#pending-empty').classList.toggle('hidden', pend.length > 0);
  const tm = $('#teams'); tm.innerHTML = '';
  ok.forEach(p => { const li = el('li'), nm = el('span', 'nm2'); nm.appendChild(el('span', 'dot' + (p.online ? ' on' : ''))); nm.appendChild(document.createTextNode(p.name)); li.appendChild(nm); li.appendChild(btn('SACAR', 'ghost', () => { if (confirm('¿Sacar a «' + p.name + '» de la sala?')) call('reject', p.id); })); tm.appendChild(li); });
  $('#rej-sec').classList.toggle('hidden', !rej.length);
  const rl = $('#rejected'); rl.innerHTML = '';
  rej.forEach(p => { const li = el('li'); li.appendChild(el('div', 'nm', p.name)); const row = el('div', 'row2'); row.appendChild(btn('ACEPTAR', 'go', () => call('approve', p.id))); row.appendChild(btn('QUITAR', 'ghost', () => call('kick', p.id))); li.appendChild(row); rl.appendChild(li); });

  /* salida: ¡YA! con destello */
  if (lastPhase === 'countdown' && st.phase === 'playing') goNow();
  lastPhase = st.phase; firstLoad = false; tickCd();
}
function goNow() {
  const cd = $('#cd'); cd.classList.remove('hidden'); cd.classList.add('go'); cd.innerHTML = ''; cd.appendChild(el('span', '', '¡YA!'));
  const f = $('#flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
  scene && scene.go(); setTimeout(() => { cd.classList.add('hidden'); cd.classList.remove('go'); }, 1100);
}
function tickCd() { if (!last) return; if (last.phase === 'countdown') countdown(Math.ceil((last.startAt - (Date.now() + offset)) / 1000)); else if (!$('#cd').classList.contains('go')) countdown(0); }

/* ----- evento: HUD + cámara del animatrónico ----- */
let evShownResult = 0, evNow = null;
const ENEMY = { freddy: 'FREDDY', bonnie: 'BONNIE', chica: 'CHICA', foxy: 'FOXY', golden: 'GOLDEN FREDDY' };
function evFrame() {
  const ev = last && last.ev, h = $('#evh');
  if (!ev) { if (evNow) { evNow = null; document.body.classList.remove('evt'); h.classList.add('hidden'); scene && scene.setEvent(-1); } return; }
  const now = Date.now() + offset, k = Math.max(0, Math.min(1, (now - ev.startAt) / (ev.endAt - ev.startAt)));
  if (!evNow || evNow.id !== ev.id) { evNow = ev; document.body.classList.add('evt'); h.classList.remove('hidden'); $('#evh-res').classList.add('hidden'); $('#evh-title').textContent = '¡' + (ENEMY[ev.enemy] || '') + ' SE ACERCA!'; }
  const pc = ev.total ? Math.round(ev.answered / ev.total * 100) : 0;
  $('#evh-fill').style.width = pc + '%'; $('#evh-pct').textContent = 'CONTESTARON ' + pc + '%';
  if (!ev.result) { $('#evh-time').textContent = now < ev.startAt ? '!' : Math.ceil((ev.endAt - now) / 1000); scene && scene.setEvent(now < ev.startAt ? 0 : k); }
  else {
    $('#evh-time').textContent = ''; scene && scene.setEvent(-1);
    if (evShownResult !== ev.id) {
      evShownResult = ev.id; const names = ev.result.failed.map(f => f.name), r = $('#evh-res');
      r.className = 'evh-res ' + (names.length ? '' : 'ok'); r.innerHTML = names.length ? '<b>¡NO SOBREVIVIERON!</b><small></small>' : '<b>¡TODOS SOBREVIVIERON!</b>';
      if (names.length) r.querySelector('small').textContent = names.join(' · ');
      scene && scene.failed(ev.result.failed.map(f => f.id), true);
      if (names.length) names.forEach(n => tip(`<b>${esc(n)}</b> no contestó a tiempo`, 'hsl(0 100% 60%)'));
    }
  }
}
setInterval(evFrame, 50);

function poll() {
  return fetch('/api/admin/state', { cache: 'no-store' }).then(r => {
    if (r.status === 403) { $('#denied').classList.remove('hidden'); $('#local-url').textContent = 'http://localhost:' + (location.port || 80) + '/dashboard.html'; $('#start').disabled = true; return null; }
    $('#denied').classList.add('hidden'); return r.json();
  }).then(st => { if (st) render(st); }).catch(() => { });
}

$('#start').onclick = () => call('start');
$('#boo').onclick = () => call('event');
$('#all').onclick = () => call('approveAll');
$('#toggle').onclick = () => { drawerTouched = true; $('#drawer').classList.toggle('open'); };
poll(); setInterval(poll, 1000); setInterval(tickCd, 100);
