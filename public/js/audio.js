/* audio.js — efectos de sonido sintetizados con WebAudio (no hay archivos de audio). */
(function (G) {
  'use strict';

  var ctx = null, master = null, muted = false, hum = null;

  function init() {
    if (ctx) return;
    var AC = G.AudioContext || G.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.5;
    master.connect(ctx.destination);
  }
  function resume() { init(); if (ctx && ctx.state === 'suspended') ctx.resume(); }

  function tone(freq, dur, type, vol, delay, slide) {
    if (!ctx || muted) return;
    var t0 = ctx.currentTime + (delay || 0);
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, slide), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.15, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }

  function noise(dur, vol, delay, hp) {
    if (!ctx || muted) return;
    var t0 = ctx.currentTime + (delay || 0);
    var n = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var s = ctx.createBufferSource(); s.buffer = buf;
    var g = ctx.createGain(); g.gain.value = vol || 0.2;
    var f = ctx.createBiquadFilter(); f.type = hp ? 'highpass' : 'lowpass'; f.frequency.value = hp || 1800;
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t0);
  }

  var SFX = {
    click: function () { tone(660, 0.05, 'square', 0.08); },
    step: function () { noise(0.05, 0.03, 0, 1300); tone(70 + Math.random() * 20, 0.05, 'sine', 0.05); },
    hover: function () { tone(880, 0.03, 'square', 0.03); },
    type: function () { tone(520 + Math.random() * 80, 0.02, 'square', 0.025); },
    pick: function () { tone(440, 0.05, 'square', 0.07); tone(660, 0.06, 'square', 0.07, 0.05); },
    ok: function () { tone(523, 0.1, 'square', 0.1); tone(659, 0.1, 'square', 0.1, 0.1); tone(784, 0.1, 'square', 0.1, 0.2); tone(1047, 0.25, 'square', 0.1, 0.3); },
    bad: function () { tone(180, 0.28, 'sawtooth', 0.14, 0, 70); noise(0.2, 0.1, 0, 600); },
    clue: function () { [880, 1175, 1568, 1760].forEach(function (f, i) { tone(f, 0.08, 'triangle', 0.1, i * 0.06); }); },
    phone: function () { for (var i = 0; i < 4; i++) { tone(1400, 0.06, 'square', 0.08, i * 0.12); tone(1100, 0.06, 'square', 0.08, i * 0.12 + 0.06); } },
    thud: function () { tone(70, 0.22, 'sine', 0.35, 0, 35); noise(0.12, 0.08, 0, 400); },
    scare: function () {
      noise(0.9, 0.5, 0, 300);
      tone(220, 0.9, 'sawtooth', 0.2, 0, 900); tone(233, 0.9, 'sawtooth', 0.2, 0, 1000);
      tone(60, 0.9, 'square', 0.25, 0, 40);
    },
    chime: function () {
      [0, 0.45, 0.9].forEach(function (d, i) { tone(i === 2 ? 1047 : 784, 0.7, 'sine', 0.16, d); tone(i === 2 ? 2094 : 1568, 0.5, 'sine', 0.05, d); });
      tone(523, 1.2, 'triangle', 0.08, 1.3); tone(659, 1.2, 'triangle', 0.08, 1.3); tone(784, 1.2, 'triangle', 0.08, 1.3);
    },
    whoosh: function () { noise(0.35, 0.08, 0, 1200); },
    static: function () { noise(0.4, 0.06, 0, 2500); },
    levelup: function () { [392, 523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.12, 'square', 0.09, i * 0.09); }); },
    fanfare: function () {
      var seq = [523, 523, 523, 659, 784, 659, 784, 1047];
      seq.forEach(function (f, i) { tone(f, 0.16, 'square', 0.1, i * 0.14); tone(f / 2, 0.16, 'triangle', 0.1, i * 0.14); });
    }
  };

  function startHum() {
    if (!ctx || hum) return;
    var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
    o.type = 'sawtooth'; o.frequency.value = 55;
    o2.type = 'sine'; o2.frequency.value = 110.5;
    g.gain.value = 0.025;
    lfo.frequency.value = 0.2; lg.gain.value = 0.012;
    lfo.connect(lg); lg.connect(g.gain);
    o.connect(g); o2.connect(g); g.connect(master);
    o.start(); o2.start(); lfo.start();
    hum = { stop: function () { try { o.stop(); o2.stop(); lfo.stop(); } catch (e) { /* ya detenido */ } hum = null; } };
  }
  function stopHum() { if (hum) hum.stop(); }

  function play(name) {
    if (!ctx) init();
    if (ctx && ctx.state === 'suspended') ctx.resume();
    if (SFX[name]) SFX[name]();
  }

  function setMuted(m) {
    muted = !!m;
    if (master) master.gain.value = muted ? 0 : 0.5;
    try { localStorage.setItem('fnaf_fg_mute', muted ? '1' : '0'); } catch (e) { /* sin almacenamiento */ }
  }
  try { muted = localStorage.getItem('fnaf_fg_mute') === '1'; } catch (e) { /* sin almacenamiento */ }

  G.SND = { play: play, resume: resume, startHum: startHum, stopHum: stopHum, setMuted: setMuted, isMuted: function () { return muted; } };
})(window);
