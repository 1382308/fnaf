#!/usr/bin/env node
/* prueba-lobby.js — prueba de la sala de espera: dashboard (aceptar/rechazar/iniciar), cuenta regresiva de 5 s y avance en vivo.
 *   PW_DIR=... PLAYWRIGHT_BROWSERS_PATH=... node tools/prueba-lobby.js
 * Levanta server.js en un puerto libre y lo apaga solo. */
const { spawn } = require('child_process'), path = require('path'), fs = require('fs'), net = require('net');
const PW_DIR = process.env.PW_DIR;
const { chromium } = require(path.join(PW_DIR, 'node_modules', 'playwright'));
const free = () => new Promise(r => { const s = net.createServer().listen(0, () => { const p = s.address().port; s.close(() => r(p)); }); });
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const port = await free(), fails = [];
  const sess = path.join(__dirname, '..', 'public', 'session.json'), had = fs.existsSync(sess);
  if (!had) fs.writeFileSync(sess, '{"id":"prueba-lobby","debug":true}');
  const srv = spawn('node', [path.join(__dirname, '..', 'server.js')], { env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
  await wait(600);
  const base = `http://127.0.0.1:${port}`, b = await chromium.launch(), ck = (c, m) => { if (!c) fails.push(m); };
  try {
    const dash = await b.newPage(), pa = await b.newPage(), pb = await b.newPage();
    const errs = []; [dash, pa, pb].forEach(p => p.on('pageerror', e => errs.push(e.message)));
    await dash.goto(base + '/dashboard.html');
    for (const [pg, n] of [[pa, 'Los Tigres'], [pb, 'Equipo <b>X</b>']]) {
      await pg.goto(base + '/'); await pg.waitForSelector('#btn-start:not([disabled])');
      await pg.fill('#in-name', n); await pg.click('#btn-start');
    }
    await dash.waitForSelector('#pending li:nth-child(2)', { timeout: 5000 });
    ck(await dash.textContent('#n-pend') === '2', 'deben verse 2 solicitudes pendientes');
    ck((await dash.innerHTML('#pending')).indexOf('<b>X') < 0, 'el nombre del equipo no se escapa como HTML');
    ck(await dash.isDisabled('#start'), 'INICIAR debe estar desactivado sin equipos aceptados');
    // rechazar a B, aceptar a A
    await dash.click('#pending li:has-text("Equipo") .btn.bad');
    await wait(1500);
    await pb.waitForSelector('#lobby.hidden', { state: 'attached', timeout: 10000 });
    ck(await pb.isVisible('#btn-start'), 'el equipo rechazado vuelve al título');
    await dash.click('#pending li:has-text("Tigres") .btn.go');
    await pa.waitForFunction(() => /aceptado/i.test(document.querySelector('#lb-msg').textContent), null, { timeout: 5000 });
    await dash.waitForFunction(() => !document.querySelector('#start').disabled, null, { timeout: 4000 }).catch(() => fails.push('INICIAR se activa con un equipo aceptado'));
    // el equipo rechazado reintenta con otro nombre
    await pb.fill('#in-name', 'Los Pumas'); await pb.click('#btn-start');
    await dash.waitForSelector('#pending li', { timeout: 5000 }); await dash.click('#pending li .btn.go');
    // iniciar → cuenta regresiva de 5 s en alumnos y en el dashboard
    const t0 = Date.now(); await dash.click('#start', { force: true });   // el botón pulsa (animación): Playwright lo ve inestable
    const seen = new Set();
    await pa.waitForFunction(() => !document.querySelector('#lb-count').classList.contains('hidden'), null, { timeout: 4000 });
    while (Date.now() - t0 < 7000 && !(await pa.isHidden('#lobby'))) { seen.add(await pa.textContent('#lb-count')); await wait(100); }
    const dt = Date.now() - t0;
    ck(['5', '4', '3', '2', '1'].every(n => seen.has(n)), `la cuenta regresiva debe mostrar 5,4,3,2,1 (vio: ${[...seen]})`);
    ck(dt > 4800 && dt < 6800, `la cuenta debe durar ~5 s (duró ${dt} ms)`);
    // el juego arranca y reporta avance
    await pa.waitForSelector('#title.hidden', { state: 'attached', timeout: 15000 });
    await pa.waitForFunction(() => document.querySelector('#hud') && !document.querySelector('#hud').classList.contains('hidden'), null, { timeout: 60000 }).catch(() => {});
    await wait(3000);
    const st = await (await fetch(base + '/api/admin/state')).json();
    const a = st.players.find(p => p.name === 'Los Tigres');
    // evento (lanzado por el profesor): un equipo contesta bien, el otro no contesta
    const adm = async () => (await fetch(base + '/api/admin/state')).json(), CODE = { LLL: 1, LAL: 2, ALA: 3, AAL: 4, HC: 5 };
    const ids = (await adm()).players.reduce((m, p) => (m[p.name] = p.id, m), {});
    await fetch(base + '/api/admin/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    let ev = null; for (let i = 0; i < 40 && !ev; i++) { await wait(250); ev = (await adm()).ev; }
    ck(!!ev, 'el botón de evento debe lanzar un evento');
    if (ev) {
      await pa.waitForSelector('#evt:not(.hidden)', { timeout: 4000 }).catch(() => fails.push('el equipo debe ver el evento a pantalla completa'));
      await dash.waitForSelector('#evh:not(.hidden)', { timeout: 4000 }).catch(() => fails.push('el dashboard debe mostrar el evento'));
      await pa.waitForFunction(e => LOBBY.now() >= e.startAt + 50, ev, { timeout: 6000 }).catch(() => {});
      if (process.env.SHOTE) await pa.screenshot({ path: process.env.SHOTE });
      await pa.evaluate(c => { const b = document.querySelector(`#evt-btns .opt[data-v="${c}"]`); if (b) b.click(); }, CODE[ev.kind]);   // contesta bien (por JS: con 3 páginas y WebGL por software todo va lento)
      await wait(700); ck((await adm()).ev.answered === 1, 'el servidor debe contar 1 respuesta');
      ck(/CONTESTARON \d+%/.test(await dash.textContent('#evh-pct')), 'el dashboard muestra la barra de quienes contestaron');
      await wait(5800);
      const r = (await adm()).ev; ck(r && r.result && r.result.failed.length === 1 && r.result.failed[0].name === 'Los Pumas', 'debe fallar solo quien no contestó (' + JSON.stringify(r && r.result) + ')');
      await dash.waitForFunction(() => /LOS PUMAS|Los Pumas/i.test(document.querySelector('#evh-res').textContent), null, { timeout: 4000 }).catch(() => fails.push('el dashboard debe mostrar el nombre de quien falló'));
      ck((await adm()).evDone >= 1, 'el evento debe contarse como realizado');
    }
    await pa.evaluate(() => LOBBY.report({ night: 3, tasks: 4, total: 37, errors: 2, scares: 1, energy: 60, elapsed: 125, finished: false }));
    await wait(2500);
    const a2 = (await (await fetch(base + '/api/admin/state')).json()).players.find(p => p.name === 'Los Tigres');
    ck(a2 && a2.night === 3 && a2.tasks === 4 && a2.errors === 2, 'el avance reportado debe llegar al dashboard');
    if (process.env.SHOT) await dash.screenshot({ path: process.env.SHOT, fullPage: true });
    ck(st.phase === 'playing', 'la fase debe ser "playing"');
    ck(a && a.online, 'el equipo aceptado debe verse en línea');
    ck(st.players.filter(p => p.status === 'approved').length === 2, 'deben estar aceptados 2 equipos');
    // reanudar: recargar el navegador del equipo aceptado lo devuelve a su partida sin pasar por el título
    await pa.reload();
    await pa.waitForFunction(() => document.querySelector('#title').classList.contains('hidden'), null, { timeout: 15000 }).catch(() => fails.push('al recargar, el equipo aceptado debe reanudar solo'));
    ck(!(await pa.isVisible('#btn-start')), 'tras recargar no debe verse el título');
    // avance a mitad de noche: pistas resueltas y energía vuelven tras recargar
    await pa.evaluate(() => { const s = JSON.parse(localStorage.getItem('fnaf_fg_save') || '{"name":"Los Tigres","lvl":0,"tErr":0,"scares":0,"elapsed":0,"stars":[],"manualMax":6}'); s.lvl = 0; s.mid = { solved: ['phone'], energy: 70, lErr: 1, secs: 30 }; localStorage.setItem('fnaf_fg_save', JSON.stringify(s)); });
    await pa.reload();
    await pa.waitForFunction(() => !document.querySelector('#hud').classList.contains('hidden'), null, { timeout: 20000 }).catch(() => fails.push('no reanudó a mitad de noche'));
    await wait(1500);
    ck(await pa.textContent('#pwr-n') === '70%', 'la energía guardada debe volver (70%)');
    ck(await pa.locator('#tk-list li.done').count() === 1, 'la pista resuelta debe seguir marcada');
    // sin servidor de sala no se juega
    const http = require('http'), st2 = http.createServer((q, r) => { const f = path.join(__dirname, '..', 'public', q.url === '/' ? 'index.html' : q.url.split('?')[0]); if (q.url.startsWith('/api')) { r.writeHead(404); return r.end(); } if (q.url.startsWith('/session.json')) return r.end('{"id":"sin-sala","debug":false}'); fs.existsSync(f) ? (r.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'application/javascript' : f.endsWith('.css') ? 'text/css' : 'text/html' }), fs.createReadStream(f).pipe(r)) : (r.writeHead(404), r.end()); }).listen(0);
    const pc = await b.newPage(); await pc.goto('http://127.0.0.1:' + st2.address().port + '/'); await pc.waitForSelector('#btn-start:not([disabled])');
    await pc.fill('#in-name', 'Intruso'); await pc.click('#btn-start'); await wait(1500);
    ck(await pc.isVisible('#btn-start') && await pc.isHidden('#hud'), 'sin servidor de sala el juego no debe empezar'); st2.close();
    // umbrales: el líder cruza 70 % → se lanzan eventos solos
    const adm2 = async () => (await fetch(base + '/api/admin/state')).json();
    const ids2 = (await adm2()).players.reduce((m, p) => (m[p.name] = p.id, m), {});
    await fetch(base + '/api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: ids2['Los Pumas'], night: 5, tasks: 30, total: 37, errors: 0, scares: 0, energy: 100, elapsed: 10, finished: false }) });
    let ev2 = null; for (let i = 0; i < 40 && !ev2; i++) { await wait(250); ev2 = (await adm2()).ev; }
    ck(!!ev2, 'al cruzar el avance debe lanzarse un evento automático');
    ck(errs.length === 0, 'errores de página: ' + errs.join(' | '));
  } catch (e) { fails.push('excepción: ' + e.message + ' ' + JSON.stringify((await (await fetch(base + '/api/admin/state')).json()).players.map(p => [p.name, p.status]))); }
  await b.close(); srv.kill();
  if (!had) fs.unlinkSync(sess);
  console.log(fails.length ? '✘ ' + fails.join('\n✘ ') : '✔ Sala de espera: solicitudes, aceptar/rechazar, iniciar y cuenta regresiva de 5 s');
  process.exit(fails.length ? 1 : 0);
})();
