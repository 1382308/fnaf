#!/usr/bin/env node
/* server.js — servidor del juego + sala de espera para el dashboard del profesor. Sin dependencias.
 *
 *   PORT=5000 node server.js
 *
 * Sirve public/ y guarda en memoria el estado de la sala (se borra al apagarlo):
 *   - Los equipos piden entrar con su nombre (pendiente) y el profesor los acepta o rechaza en /dashboard.html.
 *   - Con "INICIAR" la sala pasa a cuenta regresiva (5 s) y luego a juego; los equipos reportan su avance.
 * API de equipos:   GET /api/state?id=  ·  POST /api/join  ·  POST /api/progress  ·  POST /api/leave
 * API del profesor: /api/admin/*  → solo desde esta misma computadora (localhost); desde la red devuelve 403.
 */
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, 'public');
const PORT = parseInt(process.env.PORT, 10) || 5000;
const COUNTDOWN_MS = 5000, OFFLINE_MS = 15000;
const EV_LEAD = 1500, EV_ANSWER = 5000, EV_RESULT = 7000, EV_GAP = 6000, EV_MIN = 3;      // evento: aviso, 5 s para contestar, resultado visible, pausa entre eventos, mínimo antes de que alguien termine
const EV_THRESHOLDS = [0.12, 0.3, 0.5, 0.7];                                                 // se lanza un evento cuando el líder cruza cada avance
const KINDS = ['LLL', 'LAL', 'ALA', 'AAL', 'HC'], CODE = { LLL: 1, LAL: 2, ALA: 3, AAL: 4, HC: 5 }, ENEMIES = ['freddy', 'bonnie', 'chica', 'foxy', 'golden'];
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

/* ---------- estado de la sala ---------- */
const room = { phase: 'lobby', startAt: 0, players: new Map(), ev: { cur: null, done: 0, fired: 0, queue: 0, cool: 0, seq: 0 } };      // phase: 'lobby' | 'countdown'; "playing" se calcula con la hora
const now = () => Date.now();
function phase() { return room.phase === 'countdown' && now() >= room.startAt ? 'playing' : room.phase; }
function clean(s, n) { return String(s == null ? '' : s).replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, n); }
function num(v, max) { v = Number(v); return isFinite(v) ? Math.max(0, Math.min(max, Math.round(v))) : 0; }
function pub(p) { return p ? { status: p.status, name: p.name, finished: p.finished } : null; }
function evPub(id) {
  const e = room.ev.cur; if (!e) return null;
  return { id: e.id, kind: e.kind, seed: e.seed, enemy: e.enemy, startAt: e.startAt, endAt: e.endAt, resultUntil: e.resultUntil, answered: e.answers.size, total: e.parts.size, mine: id ? e.parts.has(id) : false, result: e.result };
}
function snapshot(id) { return { api: true, now: now(), phase: phase(), startAt: room.startAt, me: pub(room.players.get(id)), ev: evPub(id), evDone: room.ev.done }; }

/* ---------- eventos: el animatrónico se acerca y todos deben contestar en 5 s ---------- */
function online(p) { return p.status === 'approved' && !p.finished && now() - p.seen < OFFLINE_MS; }
function startEvent() {
  const parts = new Set([...room.players.values()].filter(online).map(p => p.id));
  if (!parts.size) return;                                                       // nadie jugando: no cuenta
  const t = now(), seed = 1 + Math.floor(Math.random() * 9000);
  room.ev.cur = { id: ++room.ev.seq, kind: KINDS[Math.floor(Math.random() * 5)], seed, enemy: ENEMIES[Math.floor(Math.random() * 5)], startAt: t + EV_LEAD, endAt: t + EV_LEAD + EV_ANSWER, resultUntil: t + EV_LEAD + EV_ANSWER + EV_RESULT, parts, answers: new Map(), result: null };
}
function tickEvents() {
  const t = now(), e = room.ev.cur;
  if (e) {
    if (!e.result && t >= e.endAt) {
      const failed = [...e.parts].filter(id => { const a = e.answers.get(id); return !a || a !== CODE[e.kind]; }).map(id => ({ id, name: room.players.get(id) ? room.players.get(id).name : '' }));
      e.result = { failed, total: e.parts.size }; room.ev.done++;
    }
    if (e.result && t >= e.resultUntil) { room.ev.cur = null; room.ev.cool = t + EV_GAP; }
  } else if (room.ev.queue > 0 && phase() === 'playing' && t >= room.ev.cool) { room.ev.queue--; startEvent(); }
}
setInterval(tickEvents, 250);
/* reglas de aparición: el líder cruza 12/30/50/70 %; y si alguien está por terminar sin haber vivido 3 eventos, se fuerzan los que falten */
function planEvents() {
  const ap = [...room.players.values()].filter(p => p.status === 'approved' && p.total > 0);
  const lead = ap.reduce((m, p) => Math.max(m, p.tasks / p.total), 0);
  while (room.ev.fired < EV_THRESHOLDS.length && lead >= EV_THRESHOLDS[room.ev.fired]) { room.ev.fired++; room.ev.queue++; }
  if (ap.some(p => p.tasks >= p.total - 1)) { const pending = room.ev.done + room.ev.queue + (room.ev.cur && !room.ev.cur.result ? 1 : 0); if (pending < EV_MIN) room.ev.queue += EV_MIN - pending; }
}

/* ---------- utilidades HTTP ---------- */
function json(res, code, obj) { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); }
function body(req) {
  return new Promise(ok => {
    let d = '';
    req.on('data', c => { d += c; if (d.length > 20000) req.destroy(); });
    req.on('end', () => { try { ok(JSON.parse(d || '{}')); } catch (e) { ok({}); } });
    req.on('error', () => ok({}));
  });
}
function isLocal(req) { return ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress); }

/* ---------- API de equipos ---------- */
async function playerApi(req, res, url) {
  if (req.method === 'GET' && url.pathname === '/api/state') {
    const id = url.searchParams.get('id'), q = room.players.get(id);
    if (q) q.seen = now();                                                           // consultar el estado también cuenta como «en línea»
    return json(res, 200, snapshot(id));
  }
  if (req.method !== 'POST') return json(res, 405, { error: 'método' });
  const b = await body(req), id = clean(b.id, 40);
  if (!id) return json(res, 400, { error: 'falta id' });
  let p = room.players.get(id);
  if (url.pathname === '/api/join') {
    const name = clean(b.name, 20) || 'Guardia';
    if (!p) { p = { id, name, status: 'pending', joined: now(), seen: now(), night: 1, tasks: 0, total: 37, errors: 0, scares: 0, energy: 100, elapsed: 0, finished: false }; room.players.set(id, p); }
    else if (p.status !== 'approved') { p.name = name; p.status = 'pending'; }          // un nombre rechazado vuelve a pedirse con otro nombre
    p.seen = now();
  } else if (url.pathname === '/api/leave') {
    if (p && p.status !== 'approved') room.players.delete(id);
  } else if (url.pathname === '/api/event/answer') {
    const e = room.ev.cur, t = now();
    if (e && Number(b.ev) === e.id && e.parts.has(id) && t >= e.startAt && t <= e.endAt + 300 && !e.answers.has(id)) e.answers.set(id, num(b.choice, 5));
  } else if (url.pathname === '/api/progress') {
    if (p && p.status === 'approved') {
      p.seen = now(); p.night = num(b.night, 7) || 1; p.tasks = num(b.tasks, 99); p.total = num(b.total, 99) || 37; p.errors = num(b.errors, 9999); p.scares = num(b.scares, 9999);
      p.energy = num(b.energy, 100); p.elapsed = num(b.elapsed, 99999); p.finished = !!b.finished; planEvents();
    }
  } else return json(res, 404, { error: 'no existe' });
  json(res, 200, snapshot(id));
}

/* ---------- API del profesor (solo localhost) ---------- */
async function adminApi(req, res, url) {
  if (!isLocal(req)) return json(res, 403, { error: 'solo desde la computadora del profesor (localhost)' });
  if (req.method === 'GET' && url.pathname === '/api/admin/state') {
    const t = now();
    const players = [...room.players.values()].map(p => ({ id: p.id, name: p.name, status: p.status, joined: p.joined, online: t - p.seen < OFFLINE_MS, night: p.night, tasks: p.tasks, total: p.total, errors: p.errors, scares: p.scares, energy: p.energy, elapsed: p.elapsed, finished: p.finished }));
    return json(res, 200, { now: t, phase: phase(), startAt: room.startAt, players, ev: evPub(null), evDone: room.ev.done, evQueue: room.ev.queue });
  }
  if (req.method !== 'POST') return json(res, 405, { error: 'método' });
  const b = await body(req), p = room.players.get(clean(b.id, 40)), a = url.pathname.replace('/api/admin/', '');
  if (a === 'approve' && p) p.status = 'approved';
  else if (a === 'reject' && p) p.status = 'rejected';
  else if (a === 'kick' && p) room.players.delete(p.id);
  else if (a === 'approveAll') room.players.forEach(x => { if (x.status === 'pending') x.status = 'approved'; });
  else if (a === 'start') {
    if (room.phase !== 'lobby' || ![...room.players.values()].some(x => x.status === 'approved')) return json(res, 409, { error: 'hace falta al menos un equipo aprobado y la sala en espera' });
    room.phase = 'countdown'; room.startAt = now() + COUNTDOWN_MS;
  } else if (a === 'event') { if (phase() !== 'playing') return json(res, 409, { error: 'la noche no ha empezado' }); room.ev.queue++; }
  else if (!['approve', 'reject', 'kick'].includes(a)) return json(res, 404, { error: 'no existe' });
  json(res, 200, { ok: true });
}

/* ---------- archivos estáticos ---------- */
function serveFile(req, res, url) {
  let f = path.join(ROOT, decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
  if (!f.startsWith(ROOT + path.sep) && f !== ROOT) { res.writeHead(403); return res.end('no'); }
  fs.stat(f, (e, st) => {
    if (e || st.isDirectory()) { res.writeHead(404); return res.end('no'); }
    const ext = path.extname(f);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': ext === '.woff2' ? 'public, max-age=86400' : 'no-cache' });
    fs.createReadStream(f).pipe(res);
  });
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const h = url.pathname.startsWith('/api/admin/') ? adminApi : url.pathname.startsWith('/api/') ? playerApi : null;
  if (h) h(req, res, url).catch(() => json(res, 500, { error: 'error interno' }));
  else serveFile(req, res, url);
}).listen(PORT, '0.0.0.0', () => console.log('Servidor listo en el puerto ' + PORT));
