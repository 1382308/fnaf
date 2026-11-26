/* lobby.js — sala de espera del equipo (cliente). Habla con server.js:
 *   LOBBY.peek()        → Promise<{status,name,finished}|null>: estado de este equipo en la sala (para reanudar al recargar).
 *   LOBBY.gate(nombre)  → Promise<boolean>: pide entrar, espera la aprobación del profesor y la cuenta regresiva de 5 s.
 *                         true = ya se puede jugar · false = rechazado o canceló (se vuelve al título).
 *   LOBBY.onEvent(ev)   → callback (lo define game.js): se llama cada sondeo con el evento en curso (o null).
 *   LOBBY.answer(evId, choice) · LOBBY.now() (hora del servidor) · LOBBY.untilEvents(n) (espera a que haya pasado n eventos).
 *   LOBBY.report(datos) → envía el avance al dashboard (con límite de frecuencia y latido cada 6 s).
 * Sin la API del servidor (server.js) gate() devuelve false: el juego no se puede jugar (solo en modo pruebas: gate(nombre, true)).
 */
(function (G) {
  'use strict';
  var KEY = 'fnaf_fg_pid', offset = 0, joined = false, latest = null, lastSent = 0, timer = null, beat = null, polling = null, lastState = null;

  function pid() {
    var id = null;
    try { id = localStorage.getItem(KEY); } catch (e) { /* sin almacenamiento */ }
    if (!id) {
      id = 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      try { localStorage.setItem(KEY, id); } catch (e) { /* sin almacenamiento */ }
    }
    return id;
  }
  function api(path, data) {
    var o = data ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ id: pid() }, data)) } : { cache: 'no-store' };
    return fetch('/api/' + path + (data ? '' : (path.indexOf('?') < 0 ? '?' : '&') + 'id=' + encodeURIComponent(pid())), o)
      .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
      .then(function (s) { if (s && s.api) offset = s.now - Date.now(); return s && s.api ? s : null; });
  }
  function $(s) { return document.querySelector(s); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* Pide entrar y espera. Devuelve true cuando el juego puede empezar. */
  async function gate(name, offlineOk) {
    var st = await api('state');
    if (!st) { if (!offlineOk && G.LOBBY.onNoServer) G.LOBBY.onNoServer(); return !!offlineOk; }      // sin servidor de sala no se juega (solo el modo pruebas)
    var box = $('#lobby'), msg = $('#lb-msg'), cnt = $('#lb-count'), who = $('#lb-name'), cancel = $('#lb-cancel'), cancelled = false;
    box.classList.remove('hidden'); who.textContent = name; cnt.textContent = ''; cnt.classList.add('hidden');
    cancel.onclick = function () { cancelled = true; };
    st = await api('join', { name: name });
    var result = false, shown = '';
    while (st && !cancelled) {
      var me = st.me;
      if (!me) { st = await api('join', { name: name }); continue; }               // el servidor se reinició: volver a pedir
      if (me.status === 'rejected') { msg.textContent = ''; box.classList.add('hidden'); if (G.LOBBY.onReject) G.LOBBY.onReject(me.name); return false; }
      if (me.status === 'pending') { msg.textContent = 'Esperando que el profesor acepte tu equipo…'; cnt.classList.add('hidden'); }
      else if (st.phase === 'lobby') { msg.textContent = '¡Equipo aceptado! Esperando que el profesor inicie…'; cnt.classList.add('hidden'); }
      else {
        var left = Math.ceil((st.startAt - (Date.now() + offset)) / 1000);
        if (left > 0) { msg.textContent = 'La noche empieza en…'; cnt.classList.remove('hidden'); if (shown !== String(left)) { shown = String(left); cnt.textContent = shown; cnt.classList.remove('pop'); void cnt.offsetWidth; cnt.classList.add('pop'); if (G.SND) G.SND.play('click'); } }
        else { cnt.classList.remove('hidden'); cnt.textContent = '¡YA!'; msg.textContent = ''; await wait(600); result = true; break; }
      }
      await wait(st.phase === 'countdown' ? 150 : 800);
      st = await api('state');
    }
    box.classList.add('hidden');
    if (!result && cancelled) api('leave', {});
    if (result) { joined = true; startBeat(); }
    return result;
  }

  /* Avance → dashboard. data: { night, tasks, errors, scares, energy, elapsed, finished } */
  function send() {
    if (!joined) return;
    if (!latest) { api('state'); return; }                  // aún sin avance (introducción): solo latido
    lastSent = Date.now(); clearTimeout(timer); timer = null;
    api('progress', latest).then(function (s) {
      if (s && s.me && s.me.status === 'rejected') {
        var b = $('#lobby'); $('#lb-msg').textContent = 'El profesor te sacó de la sala.'; $('#lb-count').classList.add('hidden'); $('#lb-cancel').classList.add('hidden'); b.classList.remove('hidden');
        setTimeout(function () { location.reload(); }, 2500);
      }
    });
  }
  function report(data) {
    latest = data;
    if (!joined) return;
    var wait2 = 1500 - (Date.now() - lastSent);
    if (wait2 <= 0) send(); else if (!timer) timer = setTimeout(send, wait2);
  }
  function startBeat() { if (!beat) beat = setInterval(send, 6000); startPoll(); }

  /* sondeo de eventos: cada segundo (cada 0,35 s mientras hay uno en curso) */
  function startPoll() {
    if (polling) return; polling = true;
    (function loop() {
      api('state').then(function (s) {
        lastState = s;
        if (s && G.LOBBY.onEvent) G.LOBBY.onEvent(s.ev || null);
        setTimeout(loop, s && s.ev ? 350 : 1000);
      });
    })();
  }
  function answer(evId, choice) { return api('event/answer', { ev: evId, choice: choice }); }
  function untilEvents(n) {
    return new Promise(function (res) {
      var t0 = Date.now();
      (function chk() { if (!lastState || lastState.evDone >= n || Date.now() - t0 > 60000) return res(); setTimeout(chk, 500); })();
    });
  }

  function peek() { return api('state').then(function (s) { return s && s.me; }); }

  G.LOBBY = { gate: gate, report: report, peek: peek, answer: answer, untilEvents: untilEvents, now: function () { return Date.now() + offset; }, onEvent: null, onReject: null, onNoServer: null };
})(window);
