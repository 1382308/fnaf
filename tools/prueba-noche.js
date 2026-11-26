#!/usr/bin/env node
/* prueba-noche.js — prueba automática de una noche (o de todas).
 *
 *   node tools/prueba-noche.js 2                 # prueba la noche 2
 *   node tools/prueba-noche.js 2 --shots /ruta   # además guarda capturas del mapa y de cada cuarto
 *   node tools/prueba-noche.js all               # regresión: las 7 noches
 *
 * Requiere Playwright. Variables: PW_DIR (carpeta con node_modules/playwright) y PLAYWRIGHT_BROWSERS_PATH.
 * Sirve public/ en un puerto libre y entrega un session.json VIRTUAL con debug=true (no escribe nada en public/).
 *
 * Qué comprueba (noches en modo exploración):
 *   - la noche tiene mapa (explore) y cada tarea tiene su objeto con act.id
 *   - cada objeto se puede alcanzar CAMINANDO desde el inicio (búsqueda en el mapa de colisiones)
 *   - la tarea final está bloqueada hasta terminar las demás
 *   - se responde cada pregunta con la tecla E y se llega al amanecer
 *   - lámpara: batería, se agota, el enemigo se apresura con ella prendida, destello (Q); las tareas oscuras (dark) solo abren con la lámpara prendida
 *   - sin errores en consola, rendimiento con CPU 6x más lenta <= 20 ms por fotograma
 * Noches que aún usan escenas con clic se prueban haciendo clic en cada objeto.
 */
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', 'public');
const PW_DIR = process.env.PW_DIR || '/tmp/claude-1000/-home-escolopendro-Documents-FNAF/21b76202-3252-406a-9714-d3ccaa9de789/scratchpad/pw';
let chromium;
try { chromium = require(path.join(PW_DIR, 'node_modules', 'playwright')).chromium; } catch (e) { console.error('No encuentro Playwright en PW_DIR=' + PW_DIR); process.exit(2); }

const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.json': 'application/json', '.png': 'image/png' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rs) => {
      const url = req.url.split('?')[0];
      if (url.startsWith('/api/')) { rs.writeHead(200, { 'Content-Type': 'application/json' }); return rs.end('{}'); }   // sin sala: el juego corre en modo pruebas
      if (url === '/session.json') { rs.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); return rs.end('{"id":"prueba","debug":true}'); }
      let f = path.join(ROOT, url === '/' ? 'index.html' : url);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.writeHead(404); return rs.end('no'); }
      rs.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      fs.createReadStream(f).pipe(rs);
    }).listen(0, '127.0.0.1', () => res(srv));
  });
}

async function answer(pg, id) {
  const q = await pg.evaluate(id => { const lv = window.__G.LEVELS[window.__G.S.lvl]; return JSON.parse(JSON.stringify(lv.spots.find(s => s.id === id).q)); }, id);
  const f = n => String(n);
  const solve = await pg.evaluate(() => !!document.querySelector('.qm-box')._solve);
  if (solve) {
    const txt = await pg.evaluate(() => document.querySelectorAll('.qm-box input, .qm-box textarea, .keypad').length);
    await pg.evaluate(() => document.querySelector('.qm-box')._solve());
    const rb = await pg.evaluate(() => [...document.querySelectorAll('.qm-btns .btn')].some(b => b.textContent === 'RESPONDER' && b.offsetParent));
    if (txt || rb) { await pg.waitForTimeout(300); await pg.click('.btn.go'); await pg.waitForTimeout(1500); return `"${id}": el cuadro con widget tiene campo de texto, teclado o botón RESPONDER`; }
  }
  else if (q.type === 'choice') await pg.click(`.opt[data-v="${f(q.answer)}"]`);
  await pg.waitForTimeout(300); await pg.click('.btn.go'); await pg.waitForTimeout(1500);
}

async function testNight(browser, base, n, shots) {
  const fails = [], notes = [], errors = [];
  const pg = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  pg.on('console', m => { if (m.type() === 'error' && !/favicon\.ico/.test(m.location().url)) errors.push(m.text()); });
  pg.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  await pg.goto(`${base}/?n=${n}&fast=1&debug=1`);
  try { await pg.waitForFunction(() => window.__G && window.__G.S.active && !window.__G.S.busy, null, { timeout: 15000 }); }
  catch (e) { fails.push('la noche no arrancó (¿falta explore/mapa o hay un error?)'); errors.forEach(x => console.log('   error:', x)); await pg.close(); return { n, fails, notes, errors }; }
  const lv = await pg.evaluate(() => { const l = window.__G.LEVELS[window.__G.S.lvl]; return { explore: l.explore || null, enemy: l.enemy, spots: l.spots.map(s => ({ id: s.id, final: !!s.final, task: s.task, room: s.room, needs: s.needs || null, gives: s.gives ? s.gives[0] : null, dark: !!s.dark })) }; });
  // orden resoluble: cada tarea después de la que da el objeto que pide
  const ids = [], got = new Set(); let rest = lv.spots.slice();
  while (rest.length) {
    const nx = rest.find(s => !s.needs || got.has(s.needs));
    if (!nx) { console.error('objetos: ciclo o objeto que nadie da'); process.exit(1); }
    ids.push(nx.id); if (nx.gives) got.add(nx.gives); rest = rest.filter(s => s !== nx);
  }
  if (!lv.explore) {
    notes.push('modo escena (clic)');
    for (const id of ids) { await pg.click(`.hs[data-id="${id}"]`); await pg.waitForTimeout(400); const w = await answer(pg, id); if (w) fails.push(w); }
  } else {
    notes.push('modo exploración: ' + lv.explore);
    const info = await pg.evaluate(() => { const W = window.__G.WORLD, M = W.map; return { start: [W.player.x, W.player.y], rooms: M.rooms.map(r => ({ id: r.id, name: r.name, x0: r.x0, y0: r.y0, x1: r.x1, y1: r.y1 })), enemy: W.enemy.kind, props: W.props().length, spawns: M.spawns.length }; });
    if (info.rooms.length < 5) fails.push(`el mapa tiene ${info.rooms.length} zonas (mínimo 5)`);
    if (info.spawns < 2) fails.push(`el mapa tiene ${info.spawns} punto(s) de aparición del enemigo (mínimo 2)`);
    notes.push(`${info.rooms.length} zonas, ${info.props} objetos`);
    if (info.enemy !== lv.enemy) fails.push(`el enemigo del mapa es "${info.enemy}" y el de la noche es "${lv.enemy}"`);
    // tareas bloqueadas al inicio: la final y las que piden objeto
    const lockedAtStart = lv.spots.filter(s => s.final || s.needs);
    for (const s of lockedAtStart) {
      const st = await pg.evaluate(id => window.__G.WORLD.hooks.taskState(id), s.id);
      if (st !== 'locked') fails.push(`la tarea "${s.id}" debería empezar bloqueada y está "${st}"`);
    }
    const roomNames = info.rooms.map(r => r.name);
    // alcanzabilidad de todas las tareas ANTES de resolver nada
    const stand = {};
    for (const s of lv.spots) {
      const pt = await pg.evaluate(([id, sx, sy]) => { const W = window.__G.WORLD, pr = W.props().find(p => p.act && p.act.id === id); return pr ? W.standPoint(pr, sx, sy) : 'sin-objeto'; }, [s.id, info.start[0], info.start[1]]);
      if (pt === 'sin-objeto') fails.push(`la tarea "${s.id}" no tiene objeto con act.id en el mapa`);
      else if (!pt) fails.push(`la tarea "${s.id}" es INALCANZABLE caminando desde el inicio`);
      else {
        stand[s.id] = pt;
        // el nombre de cuarto de la tarea debe existir y ser donde realmente se hace
        const rn = await pg.evaluate(([x, y]) => { const r = window.__G.WORLD.roomAt(x, y - 2); return r && r.name; }, pt);
        if (!roomNames.includes(s.room)) fails.push(`la tarea "${s.id}" dice room "${s.room}" y no existe en el mapa (${roomNames.join(', ')})`);
        else if (rn !== s.room) fails.push(`la tarea "${s.id}" dice room "${s.room}" pero se hace desde "${rn}"`);
      }
      if (!s.task || !s.room) fails.push(`la tarea "${s.id}" no tiene texto task/room`);
    }
    // capturas (antes de terminar la noche)
    if (shots) {
      fs.mkdirSync(shots, { recursive: true });
      const dataUrl = await pg.evaluate(() => window.__G.WORLD.renderAll().toDataURL('image/png'));
      fs.writeFileSync(path.join(shots, `n${n}_mapa.png`), Buffer.from(dataUrl.split(',')[1], 'base64'));
      for (const r of info.rooms) {
        await pg.evaluate(([x, y]) => window.__G.WORLD.teleport(x, y), [((r.x0 + r.x1 + 1) / 2) * 16, ((r.y0 + r.y1 + 1) / 2) * 16]); await pg.waitForTimeout(700);
        await pg.screenshot({ path: path.join(shots, `n${n}_${r.id}.png`) });
      }
    }
    // rendimiento con CPU 6x más lenta
    const cdp = await pg.context().newCDPSession(pg);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
    const perf = await pg.evaluate(() => {
      // peor caso: todas las zonas, enemigo activo (campo de búsqueda + sprite), lámpara encendida y minimapa
      const W = window.__G.WORLD, c = document.getElementById('view').getContext('2d'), M = W.map, out = [];
      const mc = document.createElement('canvas'); mc.width = 128; mc.height = 72; const mctx = mc.getContext('2d');
      W.setLamp(true); W.setStage(3);
      const catchBak = W.hooks.onCatch; W.hooks.onCatch = null;      // el teletransporte no debe disparar sustos
      M.rooms.forEach(r => {
        W.teleport(((r.x0 + r.x1 + 1) / 2) * 16, ((r.y0 + r.y1 + 1) / 2) * 16); const t0 = performance.now();
        for (let i = 0; i < 30; i++) { W.update(0.033, { w: false, a: false, s: false, d: false }); W.draw(c, i / 30, 0.033); if (i % 3 === 0) W.drawMini(mctx, 128, 72); }
        out.push((performance.now() - t0) / 30);
      });
      W.setStage(0); W.hooks.onCatch = catchBak;
      return Math.max.apply(null, out);
    });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    notes.push(`peor fotograma con CPU 6x: ${perf.toFixed(1)} ms`);
    if (perf > 20) fails.push(`rendimiento: ${perf.toFixed(1)} ms por fotograma con CPU 6x (máximo 20)`);
    // el enemigo aparece con 2 errores
    await pg.evaluate(() => { window.__G.S.energy = 40; }); await pg.waitForTimeout(600);
    const en = await pg.evaluate(() => window.__G.WORLD.enemy.on);
    if (!en) fails.push('el enemigo no aparece al bajar la energía');
    // lámpara con batería: se gasta prendida, se agota y no vuelve al instante; el enemigo se apresura con la lámpara prendida; el destello (Q) lo hace retroceder
    const lamp = await pg.evaluate(() => {
      const W = window.__G.WORLD, P = W.player, E = W.enemy, none = { w: false, a: false, s: false, d: false }, r = {};
      const catchBak = W.hooks.onCatch, lampBak = W.hooks.onLamp; W.hooks.onCatch = null; W.hooks.onLamp = null;
      W.setLamp(true); P.bat = 1;
      for (let i = 0; i < 80; i++) W.update(0.1, none);
      r.drained = P.bat < 1; r.rushOn = W.lampState().rush;
      W.toggleLamp(); r.rushOff = W.lampState().rush; W.update(1, none); r.recharges = W.lampState().bat > 0;
      W.setLamp(true); P.bat = 0.0001; W.update(0.1, none); r.deadOff = !P.lamp; r.cantRelight = W.toggleLamp() === false;
      W.setLamp(true); P.bat = 1; P.cd = 0; P.faceAng = 0; E.on = true; E.x = P.x + 40; E.y = P.y; E.stun = 0;
      r.flash = W.flash(); r.stun = E.stun > 0; r.again = W.flash();
      E.stun = 0; P.cd = 0; W.hooks.onCatch = catchBak; W.hooks.onLamp = lampBak; W.setLamp(true); P.bat = 1;
      return r;
    });
    if (!lamp.drained) fails.push('la batería no se gasta con la lámpara prendida');
    if (!(lamp.rushOn > 1) || lamp.rushOff !== 1) fails.push(`el enemigo no se apresura con la lámpara prendida (prendida ×${lamp.rushOn}, apagada ×${lamp.rushOff})`);
    if (!lamp.recharges) fails.push('la batería no se recarga con la lámpara apagada');
    if (!lamp.deadOff || !lamp.cantRelight) fails.push('con la batería en 0 la lámpara no se apaga sola o se puede prender de inmediato');
    if (lamp.flash !== 'hit' || !lamp.stun || lamp.again !== 'cool') fails.push(`destello: ${lamp.flash}, retrocede ${lamp.stun}, segundo destello ${lamp.again}`);
    notes.push(`lámpara: ×${lamp.rushOn.toFixed(2)} tras 8 s prendida`);
    await pg.evaluate(() => { window.__G.S.energy = 100; });
    // ahora sí: resolver todas las tareas caminando hasta ellas
    const distinct = new Set(lv.spots.map(s => s.room)).size;
    if (distinct < 4) fails.push(`las tareas están en ${distinct} zona(s) distintas (mínimo 4)`);
    if (fails.length === 0) {
      for (const id of ids) {
        await pg.evaluate(([x, y]) => window.__G.WORLD.teleport(x, y), stand[id]); await pg.waitForTimeout(450);
        const tg = await pg.evaluate(() => window.__G.WORLD.target && window.__G.WORLD.target.act.id);
        if (tg !== id) { fails.push(`parado en el punto de "${id}" el objetivo es "${tg}"`); break; }
        await pg.evaluate(() => { window.__G.WORLD.setLamp(true); window.__G.WORLD.player.bat = 1; });
        if (lv.spots.find(x => x.id === id).dark) {   // tarea oscura: con la lámpara apagada E no la abre; con la lámpara prendida sí
          await pg.evaluate(() => window.__G.WORLD.setLamp(false));
          await pg.keyboard.press('KeyE'); await pg.waitForTimeout(300);
          if (await pg.evaluate(() => window.__G.S.qOpen)) { fails.push(`la tarea oscura "${id}" se abre con la lámpara apagada`); await pg.keyboard.press('Escape'); await pg.waitForTimeout(300); }
          await pg.evaluate(() => window.__G.WORLD.setLamp(true));
        }
        await pg.keyboard.press('KeyE'); await pg.waitForTimeout(450);
        if (process.env.SHOTQ) await pg.screenshot({ path: path.join(process.env.SHOTQ, `n${n}_${id}.png`) }).catch(() => {});   // captura de cada pregunta
        const w = await answer(pg, id); if (w) fails.push(w);
        if (lv.spots.find(x => x.id === id).gives) { await pg.waitForSelector('#gotitem:not(.hidden)', { timeout: 5000 }).catch(() => fails.push(`al resolver "${id}" no sale el objeto obtenido`)); await pg.click('#gi-go').catch(() => { }); await pg.waitForTimeout(300); }
      }
    }
  }
  try { await pg.waitForSelector('#nightend:not(.hidden)', { timeout: 12000 }); notes.push('llegó al amanecer'); }
  catch (e) { fails.push('no se llegó a la pantalla de fin de noche tras completar las tareas'); }
  errors.filter(x => !/AudioContext|favicon/i.test(x)).forEach(x => fails.push('error en consola: ' + x));
  await pg.close();
  return { n, fails, notes };
}

(async () => {
  const arg = process.argv[2] || '1', si = process.argv.indexOf('--shots'), shots = si > 0 ? process.argv[si + 1] : null;
  const nights = arg === 'all' ? [1, 2, 3, 4, 5, 6, 7] : [parseInt(arg, 10)];
  const srv = await serve(), base = 'http://127.0.0.1:' + srv.address().port;
  const browser = await chromium.launch({ channel: 'chrome' });
  let bad = 0;
  for (const n of nights) {
    const r = await testNight(browser, base, n, shots);
    console.log(`${r.fails.length ? '✖' : '✔'} Noche ${n}: ${r.notes.join(' · ')}`);
    r.fails.forEach(f => console.log('    - ' + f));
    if (r.fails.length) bad++;
  }
  await browser.close(); srv.close();
  console.log(bad ? `\n${bad} noche(s) con problemas` : '\nTodo en orden');
  process.exit(bad ? 1 : 0);
})();
