/* dash3d.js — escena Three.js del dashboard: el salón de Freddy Fazbear's Pizza de noche, visto por la cámara de seguridad.
 * Cada equipo es un animatrónico (Freddy, Bonnie, Chica o Foxy según su nombre) que corre hacia la puerta de salida: el amanecer (6 AM).
 *
 *   const sc = createScene(canvas)            // null si el navegador no tiene WebGL
 *   sc.sync(players, phase)                   // players: [{ id, name, status, pct (0–1, ya con curva), online, finished }]
 *   sc.burst(id, 'step' | 'night' | 'finish' | 'join')   // chispas de fiesta en ese equipo
 *   sc.setCountdown(n)  ·  sc.go()           // cuenta regresiva (vibración, luces que parpadean) y salida
 *
 * Todo el movimiento usa resortes (pasan de largo y regresan) y partículas aditivas para que cada avance se sienta como una recompensa.
 */
import * as THREE from '../vendor/three.module.min.js';

const X0 = -10, X1 = 10;                       // escenario (salida) y puerta de la oficina (meta)
const rnd = (a, b) => a + Math.random() * (b - a);
/* tono de cada equipo (FNV-1a: ids parecidos dan colores muy distintos) */
export const hueDeg = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; return h % 360; };
const hue = s => hueDeg(s) / 360;

function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
function glowTexture(stops) {
  return canvasTex(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); stops.forEach(([o, col]) => gr.addColorStop(o, col)); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
}

export function createScene(canvas) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); } catch (e) { return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene(), dark = new THREE.Color(0x05030a), warm = new THREE.Color(0x2a1608);
  scene.background = new THREE.Color().copy(dark); scene.fog = new THREE.FogExp2(0x05030a, 0.02);
  const cam = new THREE.PerspectiveCamera(46, 1, 0.1, 200), camPos = new THREE.Vector3(0, 9, 17), camLook = new THREE.Vector3(0, 1.5, 0);
  const amb = new THREE.AmbientLight(0x6a5aa0, 0.9); scene.add(amb);
  const key = new THREE.DirectionalLight(0xfff1c8, 0.9); key.position.set(-4, 14, 14); scene.add(key);
  const doorLight = new THREE.PointLight(0xffa850, 0, 50, 1.3); doorLight.position.set(X1 + 1.5, 3.5, -1); scene.add(doorLight);
  const stageLight = new THREE.PointLight(0xb070ff, 30, 30, 1.6); stageLight.position.set(X0 - 1, 5, 0); scene.add(stageLight);

  /* ----- piso a cuadros blanco y negro (como la pizzería) ----- */
  const floorTex = canvasTex(128, 128, (g) => { g.fillStyle = '#d8d2c4'; g.fillRect(0, 0, 128, 128); g.fillStyle = '#16121c'; g.fillRect(0, 0, 64, 64); g.fillRect(64, 64, 64, 64); g.strokeStyle = 'rgba(0,0,0,.35)'; g.strokeRect(0, 0, 128, 128); });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(30, 14);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 28), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.55, metalness: 0.1, color: 0x6a6478 }));
  floor.rotation.x = -Math.PI / 2; scene.add(floor);

  /* ----- pared del fondo con carteles, cortina del escenario y puerta de la oficina ----- */
  const wallZ = -8.5;
  const wallTex = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#2a2145'; g.fillRect(0, 0, w, h); for (let i = 0; i < w; i += 32) { g.fillStyle = i % 64 ? '#31264f' : '#241b3c'; g.fillRect(i, 0, 32, h); } g.fillStyle = '#4a3a2a'; g.fillRect(0, h - 40, w, 40); });
  wallTex.wrapS = THREE.RepeatWrapping; wallTex.repeat.set(8, 1);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(60, 14), new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.9 }));
  wall.position.set(0, 7, wallZ); scene.add(wall);
  const poster = (txt, sub, x, w, col) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 1.3), new THREE.MeshStandardMaterial({ roughness: 0.8, emissive: 0x221018, emissiveIntensity: 0.5, map: canvasTex(256, 330, (g, W, H) => {
      g.fillStyle = col; g.fillRect(0, 0, W, H); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(10, 10, W - 20, H - 20); g.fillStyle = '#fff'; g.textAlign = 'center';
      g.font = "bold 28px 'Press Start 2P', monospace"; txt.split('\n').forEach((l, i) => g.fillText(l, W / 2, 70 + i * 40));
      g.font = "bold 16px 'Press Start 2P', monospace"; g.fillStyle = '#ffe45c'; g.fillText(sub, W / 2, H - 50);
      g.fillStyle = '#ffd9a0'; g.beginPath(); g.arc(W / 2, 200, 38, 0, 7); g.fill(); g.fillStyle = '#1a1020'; g.fillRect(W / 2 - 22, 190, 10, 10); g.fillRect(W / 2 + 12, 190, 10, 10); g.fillRect(W / 2 - 14, 214, 28, 6);
    }) }));
    m.position.set(x, 5.2, wallZ + 0.05); scene.add(m);
  };
  poster('¡CELEBRA!', 'CUMPLEAÑOS', -5.2, 2.3, '#8a2a3a'); poster('FREDDY\nFAZBEAR', 'PIZZA', -1.2, 2.3, '#3a4a8a'); poster('SOLO\nPERSONAL', 'AUTORIZADO', 3, 2.3, '#4a6a2a');
  const curtain = new THREE.Group(); curtain.position.set(X0 - 2.5, 0, wallZ + 0.3); scene.add(curtain);
  for (let i = 0; i < 9; i++) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.8, 9, 0.5), new THREE.MeshStandardMaterial({ color: i % 2 ? 0x7a1c3c : 0x9a2a50, roughness: 0.9 })); f.position.set((i - 4) * 0.78, 4.5, Math.sin(i) * 0.15); curtain.add(f); }
  const door = new THREE.Group(); door.position.set(X1 + 1.5, 0, wallZ + 0.2); scene.add(door);
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(5, 7.2, 0.4), new THREE.MeshStandardMaterial({ color: 0x1a1420, roughness: 0.8 })); doorFrame.position.y = 3.6; door.add(doorFrame);
  const doorGlow = new THREE.Mesh(new THREE.PlaneGeometry(4, 6.4), new THREE.MeshBasicMaterial({ color: 0xffb060, transparent: true, opacity: 0.1 })); doorGlow.position.set(0, 3.5, 0.25); door.add(doorGlow);
  const clock = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, fog: false, map: canvasTex(256, 96, (g) => { g.fillStyle = '#100608'; g.fillRect(0, 0, 256, 96); g.strokeStyle = '#ff2a2a'; g.lineWidth = 6; g.strokeRect(3, 3, 250, 90); g.fillStyle = '#ff3030'; g.shadowColor = '#ff2020'; g.shadowBlur = 18; g.font = "bold 40px 'Press Start 2P', monospace"; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('6 AM', 128, 52); }) }));
  clock.scale.set(3.6, 1.35, 1); clock.position.set(0, 8.2, 0.4); door.add(clock);
  const spill = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), new THREE.MeshBasicMaterial({ map: glowTexture([[0, 'rgba(255,190,100,.9)'], [1, 'rgba(255,120,40,0)']]), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  spill.rotation.x = -Math.PI / 2; spill.position.set(X1 - 0.5, 0.04, -2); scene.add(spill);

  /* luces fluorescentes colgadas (parpadean) y globos de fiesta */
  const tubes = [];
  for (let i = 0; i < 5; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.14, 0.5), new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xd8f0ff, emissiveIntensity: 1.2 })); m.position.set(-12 + i * 6, 9.2, -3); scene.add(m); tubes.push(m); }
  const balloons = [];
  [0xff4a6a, 0x4ae0ff, 0xffe45c, 0x7aff7a, 0xc070ff].forEach((c, i) => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.25, roughness: 0.3 })); b.scale.y = 1.2; b.position.set(-8 + i * 4.3, 8 + Math.sin(i) * 0.4, -6); b.userData.p = i; scene.add(b); balloons.push(b); });
  /* ojos que miran desde la oscuridad (susto ligero de vez en cuando) */
  const eyes = new THREE.Group(), eg = new THREE.SphereGeometry(0.13, 8, 8), em = new THREE.MeshBasicMaterial({ color: 0xffffff });
  [-0.45, 0.45].forEach(x => { const e = new THREE.Mesh(eg, em); e.position.x = x; eyes.add(e); }); eyes.visible = false; scene.add(eyes);
  let eyeT = rnd(6, 14), eyeOn = 0;

  /* ----- partículas de fiesta: chispas, estela, confeti ----- */
  const CAP = 5000, pPos = new Float32Array(CAP * 3), pCol = new Float32Array(CAP * 3), pSize = new Float32Array(CAP), pAlpha = new Float32Array(CAP);
  const pVel = new Float32Array(CAP * 3), pLife = new Float32Array(CAP), pMax = new Float32Array(CAP), pGrav = new Float32Array(CAP); let pHead = 0;
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pPos, 3)); pg.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  pg.setAttribute('size', new THREE.BufferAttribute(pSize, 1)); pg.setAttribute('alpha', new THREE.BufferAttribute(pAlpha, 1));
  const parts = new THREE.Points(pg, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'attribute float size; attribute float alpha; attribute vec3 color; varying float a; varying vec3 c; void main(){ a = alpha; c = color; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = size * (320.0 / -mv.z); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'varying float a; varying vec3 c; void main(){ float d = length(gl_PointCoord - 0.5) * 2.0; float k = smoothstep(1.0, 0.0, d); gl_FragColor = vec4(c * (0.6 + k), a * k * k); }'
  }));
  parts.frustumCulled = false; scene.add(parts);
  function emit(x, y, z, vx, vy, vz, col, size, life, grav = 0) {
    const i = pHead; pHead = (pHead + 1) % CAP;
    pPos.set([x, y, z], i * 3); pVel.set([vx, vy, vz], i * 3); pCol.set([col.r, col.g, col.b], i * 3); pSize[i] = size; pLife[i] = pMax[i] = life; pGrav[i] = grav;
  }
  function stepParts(dt) {
    for (let i = 0; i < CAP; i++) {
      if (pLife[i] <= 0) { pAlpha[i] = 0; continue; }
      pLife[i] -= dt; const k = Math.max(0, pLife[i] / pMax[i]), j = i * 3;
      pVel[j + 1] -= pGrav[i] * dt; pPos[j] += pVel[j] * dt; pPos[j + 1] += pVel[j + 1] * dt; pPos[j + 2] += pVel[j + 2] * dt; pAlpha[i] = k;
    }
    pg.attributes.position.needsUpdate = pg.attributes.alpha.needsUpdate = pg.attributes.color.needsUpdate = pg.attributes.size.needsUpdate = true;
  }
  const waves = [];
  function wave(x, z, color, max = 7) {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.85, 1, 64), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
    m.rotation.x = -Math.PI / 2; m.position.set(x, 0.06, z); scene.add(m); waves.push({ m, t: 0, max });
  }

  /* ----- animatrónicos: cuatro modelos con figuras simples; el color del equipo va en moño/babero y en el aro del piso ----- */
  const M = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.6, metalness: 0.05, emissive: color, emissiveIntensity: 0.12 }, o));
  const part = (geo, mat, x, y, z, sx = 1, sy = 1, sz = 1, rz = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.rotation.z = rz; return m; };
  const sph = new THREE.SphereGeometry(1, 20, 16), cyl = new THREE.CylinderGeometry(1, 1, 1, 18), cone = new THREE.ConeGeometry(1, 1, 14), box = new THREE.BoxGeometry(1, 1, 1);
  const WHITE = new THREE.MeshBasicMaterial({ color: 0xffffff });
  function eyesFor(g, col, y = 0.18, z = 0.62, x = 0.3) {
    [-x, x].forEach(ex => { g.add(part(sph, WHITE, ex, y, z, 0.17, 0.2, 0.1)); g.add(part(sph, new THREE.MeshBasicMaterial({ color: col }), ex, y, z + 0.1, 0.09, 0.1, 0.05)); });
  }
  function bowtie(g, c, y = -0.95) { const m = M(c, { emissiveIntensity: 0.5 }); g.add(part(cone, m, -0.26, y, 0.5, 0.22, 0.34, 0.22, Math.PI / 2)); g.add(part(cone, m, 0.26, y, 0.5, 0.22, 0.34, 0.22, -Math.PI / 2)); g.add(part(sph, m, 0, y, 0.52, 0.12, 0.12, 0.12)); }
  const BUILD = [
    (g, tc) => {                                                     // Freddy
      const br = M(0x8a5a2b), tan = M(0xd9a766);
      g.add(part(sph, br, 0, 0, 0, 0.82, 0.78, 0.74)); g.add(part(sph, tan, 0, -0.22, 0.52, 0.42, 0.3, 0.3)); g.add(part(sph, M(0x111111), 0, -0.05, 0.78, 0.1, 0.07, 0.06));
      [-0.62, 0.62].forEach(x => { g.add(part(sph, br, x, 0.62, -0.05, 0.28, 0.28, 0.14)); g.add(part(sph, tan, x, 0.62, 0.05, 0.17, 0.17, 0.08)); });
      eyesFor(g, 0x3a9aff); g.add(part(cyl, M(0x111111), 0, 0.98, 0, 0.36, 0.34, 0.36)); g.add(part(cyl, M(0x111111), 0, 0.68, 0, 0.55, 0.04, 0.55)); g.add(part(cyl, M(tc, { emissiveIntensity: 0.4 }), 0, 0.78, 0, 0.375, 0.07, 0.375)); bowtie(g, tc);
    },
    (g, tc) => {                                                     // Bonnie
      const pu = M(0x7a4fc8), lil = M(0xb89aff);
      g.add(part(sph, pu, 0, 0, 0, 0.8, 0.76, 0.72)); g.add(part(sph, lil, 0, -0.22, 0.5, 0.42, 0.3, 0.28)); g.add(part(sph, M(0x111111), 0, -0.05, 0.76, 0.1, 0.07, 0.06));
      [-0.4, 0.4].forEach((x, i) => { g.add(part(cyl, pu, x, 1.35, 0, 0.17, 0.85, 0.12, (i ? -1 : 1) * 0.18)); g.add(part(cyl, lil, x, 1.35, 0.08, 0.09, 0.7, 0.05, (i ? -1 : 1) * 0.18)); });
      eyesFor(g, 0xff4ad0); bowtie(g, tc);
    },
    (g, tc) => {                                                     // Chica
      const ye = M(0xf2c230), or = M(0xff8a20);
      g.add(part(sph, ye, 0, 0, 0, 0.8, 0.76, 0.72)); const bk = part(cone, or, 0, -0.18, 0.72, 0.2, 0.55, 0.2); bk.rotation.x = Math.PI / 2; g.add(bk);
      [-0.15, 0, 0.15].forEach((x, i) => g.add(part(cone, ye, x, 0.82 + (i === 1 ? 0.12 : 0), 0, 0.08, 0.34, 0.08)));
      eyesFor(g, 0xff4ad0); g.add(part(box, M(tc, { emissiveIntensity: 0.5 }), 0, -0.98, 0.4, 0.7, 0.55, 0.06));
    },
    (g, tc) => {                                                     // Foxy
      const re = M(0xb23a2a), lt = M(0xe8a070);
      g.add(part(sph, re, 0, 0, 0, 0.78, 0.74, 0.7)); const sn = part(cone, lt, 0, -0.18, 0.7, 0.3, 0.8, 0.26); sn.rotation.x = Math.PI / 2; g.add(sn);
      [-0.5, 0.5].forEach((x, i) => g.add(part(cone, re, x, 0.82, -0.05, 0.2, 0.55, 0.12, (i ? -1 : 1) * 0.25)));
      eyesFor(g, 0xffd23f); g.add(part(sph, M(0x111111), -0.3, 0.2, 0.7, 0.26, 0.26, 0.08)); bowtie(g, tc);
      const hook = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 8, 14, 4.2), M(0xd8d8e8, { metalness: 0.8 })); hook.position.set(0.85, -0.9, 0.2); g.add(hook);
    }
  ];
  const kindOf = s => { let h = 7; for (const c of s) h = (h * 33 + c.charCodeAt(0)) >>> 0; return h % 4; };
  const glowTex = glowTexture([[0, 'rgba(255,255,255,.9)'], [0.4, 'rgba(255,255,255,.2)'], [1, 'rgba(255,255,255,0)']]);
  const partyHat = new THREE.ConeGeometry(0.34, 0.7, 12);

  const T = new Map();
  let evK = -1, phase = 'lobby', cdN = 0, goT = 0, shake = 0, avg = 0, time = 0, order = [], blackout = 0;

  function drawName(o) {
    const c = o.cv, g = c.getContext('2d'); g.clearRect(0, 0, c.width, c.height);
    g.font = "bold 44px 'Press Start 2P', monospace"; g.textAlign = 'center'; g.textBaseline = 'middle';
    let s = o.name; while (g.measureText(s).width > 740 && s.length > 3) s = s.slice(0, -2);
    if (s !== o.name) s = s.trimEnd() + '…';
    g.lineWidth = 10; g.strokeStyle = 'rgba(5,3,10,.95)'; g.strokeText(s, 384, 48); g.fillStyle = '#fff6d8'; g.fillText(s, 384, 48);
    g.fillStyle = '#' + o.color.getHexString(); const t = Math.round(o.pct * 100) + '%'; g.strokeText(t, 384, 118); g.fillText(t, 384, 118); o.tex.needsUpdate = true;
  }
  function make(p) {
    const color = new THREE.Color().setHSL(hue(p.id), 1, 0.55), g = new THREE.Group(), body = new THREE.Group(); g.add(body);
    BUILD[kindOf(p.name + p.id)](body, color);
    const matList = []; body.traverse(m => { if (m.material && m.material.isMeshStandardMaterial && matList.indexOf(m.material) < 0) { m.material.transparent = true; m.material.userData.e = m.material.emissiveIntensity; matList.push(m.material); } });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.15, 40), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })); ring.rotation.x = -Math.PI / 2; ring.position.y = -1.34; g.add(ring);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); glow.scale.set(3.4, 3.4, 1); g.add(glow);
    const cv = document.createElement('canvas'); cv.width = 768; cv.height = 168; const tex = new THREE.CanvasTexture(cv);
    const lab = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false })); lab.scale.set(5.2, 1.14, 1); lab.position.y = 2.2; lab.renderOrder = 10; g.add(lab);
    const crown = new THREE.Mesh(partyHat, new THREE.MeshStandardMaterial({ color: 0xffd23f, emissive: 0xffb000, emissiveIntensity: 1.1 })); crown.position.y = 1.75; crown.visible = false; g.add(crown);
    scene.add(g);
    return { id: p.id, g, body, matList, ring, glow, lab, crown, cv, tex, color, name: p.name, pct: -1, x: X0 - 4, vx: 0, tx: X0, z: 0, tz: 0, pop: 0, fail: 0, phase: rnd(0, 6.28), status: p.status, finished: false, fade: 0 };
  }
  function layout() {
    const act = order.filter(o => o.status !== 'rejected'), n = act.length, sp = Math.min(1.9, 11 / Math.max(1, n));
    act.forEach((o, i) => { o.tz = (i - (n - 1) / 2) * sp; });
    const ext = (n - 1) * sp; camPos.lerp(new THREE.Vector3(0, 10 + ext * 0.35, 21 + ext * 0.5), 0.05);
  }
  function sync(players, ph) {
    phase = ph; const seen = new Set(); let sum = 0, cnt = 0;
    players.forEach(p => {
      seen.add(p.id); let o = T.get(p.id);
      if (!o) { o = make(p); T.set(p.id, o); }
      o.status = p.status; if (o.name !== p.name) { o.name = p.name; o.pct = -1; }
      const pct = Math.max(0, Math.min(1, p.pct || 0));
      if (Math.round(pct * 100) !== Math.round(o.pct * 100)) { o.pct = pct; drawName(o); }
      o.pct = pct; o.online = p.online; o.tx = X0 + (X1 - X0 - 1.5) * pct;
      if (p.finished && !o.finished) o.finished = true;
      if (p.status === 'approved') { sum += pct; cnt++; }
    });
    T.forEach((o, id) => { if (!seen.has(id)) { scene.remove(o.g); T.delete(id); } });
    order = [...T.values()].sort((a, b) => (a.id < b.id ? -1 : 1)); avg = cnt ? sum / cnt : 0; layout();
  }

  const party = () => new THREE.Color().setHSL(rnd(0, 1), 0.95, 0.6);
  function burst(id, kind) {
    const o = T.get(id); if (!o) return;
    const x = o.g.position.x, y = o.g.position.y + 0.6, z = o.g.position.z, c = o.color;
    if (kind === 'step') { o.pop = 1; for (let i = 0; i < 30; i++) { const a = rnd(0, 6.28), s = rnd(2, 6); emit(x, y, z, Math.cos(a) * s, rnd(1, 5), Math.sin(a) * s * 0.6, i % 3 ? c : party(), rnd(0.5, 1.1), rnd(0.5, 1), 6); } wave(x, z, c, 3.5); }
    if (kind === 'join') { o.pop = 1.4; for (let i = 0; i < 60; i++) { const a = rnd(0, 6.28), s = rnd(3, 9); emit(x, y, z, Math.cos(a) * s, rnd(0, 7), Math.sin(a) * s, party(), rnd(0.6, 1.3), rnd(0.7, 1.4), 7); } wave(x, z, c, 6); }
    if (kind === 'night') {
      o.pop = 2; wave(x, z, c, 10); wave(x, z, new THREE.Color(0xffd878), 6); shake = Math.max(shake, 0.4); blackout = 0.25;
      for (let i = 0; i < 170; i++) { const a = rnd(0, 6.28), e = rnd(-0.2, 1.4), s = rnd(4, 11); emit(x, y, z, Math.cos(a) * Math.cos(e) * s, Math.sin(e) * s + 3, Math.sin(a) * Math.cos(e) * s * 0.7, party(), rnd(0.7, 1.6), rnd(0.9, 1.8), 6); }
    }
    if (kind === 'finish') {
      o.pop = 3; o.crown.visible = true; shake = 1; wave(x, z, new THREE.Color(0xffd23f), 14); wave(x, z, new THREE.Color(0xffffff), 9);
      for (let i = 0; i < 480; i++) emit(rnd(x - 9, x + 9), rnd(9, 15), rnd(z - 6, z + 6), rnd(-1, 1), rnd(-6, -1), rnd(-1, 1), party(), rnd(0.5, 1.3), rnd(2, 4), -1);
    }
  }
  /* evento: k = 0…1 mientras el animatrónico se acerca (la cámara ES el animatrónico); -1 = sin evento */
  function setEvent(k) { evK = k; }
  function failed(ids, okAll) {                                                  // resultado: los que cayeron se desploman; el resto celebra
    T.forEach(o => {
      if (o.status !== 'approved') return;
      if (ids.indexOf(o.id) >= 0) { o.fail = 4; shake = Math.max(shake, 0.6); for (let i = 0; i < 40; i++) emit(o.g.position.x, 1, o.g.position.z, rnd(-4, 4), rnd(1, 6), rnd(-3, 3), new THREE.Color(0xff2a2a), rnd(0.5, 1.1), rnd(0.6, 1.2), 7); wave(o.g.position.x, o.g.position.z, new THREE.Color(0xff2a2a), 6); }
      else if (okAll || ids.length) { o.pop = 1.2; for (let i = 0; i < 24; i++) emit(o.g.position.x, 1.2, o.g.position.z, rnd(-3, 3), rnd(2, 6), rnd(-2, 2), party(), rnd(0.5, 1), rnd(0.6, 1.1), 6); }
    });
  }
  function setCountdown(n) { cdN = n; }
  function go() {
    goT = 1.2; shake = 1; blackout = 0;
    T.forEach(o => { if (o.status === 'approved') { o.pop = 1.8; for (let i = 0; i < 70; i++) emit(o.g.position.x, 0.8, o.g.position.z, rnd(-12, -2), rnd(-1, 4), rnd(-3, 3), party(), rnd(0.6, 1.4), rnd(0.5, 1.2), 2); wave(o.g.position.x, o.g.position.z, o.color, 8); } });
  }

  /* ----- bucle ----- */
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt;
    /* luces: parpadeo de fluorescentes; corte al pasar de noche y en la cuenta regresiva */
    blackout = Math.max(0, blackout - dt);
    const flick = (phase === 'countdown' || evK >= 0 ? Math.random() < 0.3 + Math.max(0, evK) * 0.3 : Math.random() < 0.012) || blackout > 0 ? 0.1 : 1;
    tubes.forEach((t, i) => { t.material.emissiveIntensity = (Math.sin(time * 40 + i) > 0.98 ? 0.2 : 1.2) * flick; });
    amb.intensity = 0.5 + 0.4 * flick + avg * 0.4; key.intensity = 0.3 + 0.6 * flick;
    scene.background.lerpColors(dark, warm, avg); scene.fog.color.copy(scene.background);
    doorLight.intensity = 6 + avg * 110 + (phase === 'countdown' ? Math.sin(time * 30) * 10 : 0); doorGlow.material.opacity = 0.1 + avg * 0.7; spill.material.opacity = avg * 0.9;
    clock.material.opacity = avg >= 1 ? 1 : 0.65 + Math.sin(time * 4) * 0.35;
    stageLight.intensity = 20 + Math.sin(time * 1.5) * 8; balloons.forEach(b => { b.position.y += Math.sin(time * 1.2 + b.userData.p) * 0.003; });
    eyeT -= dt; if (eyeT <= 0) { eyeOn = 0.35; eyeT = rnd(7, 16); eyes.position.set(rnd(-12, 12), rnd(2, 4), wallZ + 0.4); }
    eyeOn = Math.max(0, eyeOn - dt); eyes.visible = eyeOn > 0 && Math.sin(time * 60) > -0.6;
    T.forEach(o => {
      const waiting = o.status !== 'approved', playing = phase !== 'lobby' && !waiting;
      const tx = waiting ? X0 - 4 - (order.indexOf(o) % 3) * 1.2 : o.tx, k = playing ? 16 : 40, c = playing ? 4.2 : 10;
      o.vx += ((tx - o.x) * k - o.vx * c) * dt; o.x += o.vx * dt; o.z += (o.tz - o.z) * Math.min(1, dt * 6);
      o.pop = Math.max(0, o.pop - dt * 1.6); o.fade += ((waiting ? 0.4 : 1) - o.fade) * Math.min(1, dt * 5);
      let jx = 0, jz = 0;
      if (phase === 'countdown' && !waiting) { const f = 0.07 + (5 - cdN) * 0.05; jx = rnd(-f, f); jz = rnd(-f, f); if (Math.random() < 0.4) emit(o.x - 0.6, 0.3, o.z, rnd(-3, -1), rnd(0, 1.5), rnd(-1, 1), o.color, 0.5, 0.5, 0); }
      const hop = playing && !o.finished ? Math.abs(Math.sin(time * 6 + o.phase)) * 0.35 : Math.sin(time * 2 + o.phase) * 0.06;
      o.g.position.set(o.x + jx, (o.fail > 0 ? 0.55 : 1.4) + hop + (o.pop > 0 ? Math.sin(o.pop * 12) * 0.12 * o.pop : 0), o.z + jz);
      o.fail = Math.max(0, o.fail - dt); const scared = evK >= 0 && !waiting, down = o.fail > 0;
      if (scared) { jx += rnd(-1, 1) * 0.04 * (1 + evK * 4); jz += rnd(-1, 1) * 0.04 * (1 + evK * 4); }
      o.body.rotation.y = scared ? Math.sin(time * 20 + o.phase) * 0.15 * evK : 0.55 + Math.sin(time * 1.3 + o.phase) * 0.3; o.body.rotation.z = down ? 1.45 : -o.vx * 0.03 + Math.sin(time * 6 + o.phase) * (playing ? 0.07 : 0.02); o.body.rotation.x = Math.sin(time * 1.7 + o.phase) * 0.06;
      o.body.scale.setScalar((scared ? 1 - evK * 0.18 : 1) + o.pop * 0.4); o.glow.scale.setScalar(3.2 + o.pop * 3);
      o.matList.forEach(m => { m.opacity = o.fade; m.emissiveIntensity = m.userData.e + o.pop * 0.5; });
      o.ring.material.color.set(down ? 0xff2a2a : o.color); o.ring.material.opacity = 0.25 + o.fade * 0.6 + Math.sin(time * 5 + o.phase) * 0.1; o.ring.scale.setScalar(1 + o.pop * 0.6); o.ring.rotation.z += dt * 0.8;
      o.glow.material.opacity = 0.1 + o.fade * 0.35; o.lab.material.opacity = 0.35 + o.fade * 0.65;
      o.crown.rotation.y += dt * 2; o.crown.position.y = 1.75 + Math.sin(time * 3) * 0.08;
      if (playing && !o.finished && Math.random() < 0.6) emit(o.x - 0.6, 0.35, o.z + rnd(-0.2, 0.2), rnd(-3, -1) - Math.abs(o.vx) * 0.4, rnd(0, 0.8), rnd(-0.5, 0.5), o.color, rnd(0.35, 0.8), rnd(0.5, 0.9), 0);
      if (o.finished && Math.random() < 0.3) emit(o.x, 2.6, o.z, rnd(-1.5, 1.5), rnd(1, 3), rnd(-1, 1), party(), 0.6, 0.9, 3);
    });
    for (let i = waves.length - 1; i >= 0; i--) {
      const w = waves[i]; w.t += dt * 1.4; const s = 0.4 + w.t * w.max; w.m.scale.set(s, s, 1); w.m.material.opacity = Math.max(0, 0.9 - w.t);
      if (w.t >= 1) { scene.remove(w.m); w.m.geometry.dispose(); w.m.material.dispose(); waves.splice(i, 1); }
    }
    goT = Math.max(0, goT - dt); shake = Math.max(0, shake - dt * 1.5); stepParts(dt);
    /* cámara de seguridad: barrido lento de lado a lado, resorte hacia el encuadre, temblor y empujón en la cuenta regresiva */
    if (evK >= 0) {                                                          // POV del animatrónico: avanza hacia los equipos acelerando, a la altura de sus ojos
      const e = Math.pow(evK, 2.2), P = new THREE.Vector3(Math.sin(time * 9) * 0.15 * evK, 10 - e * 7.6 + Math.sin(time * 14) * 0.08, camPos.z - e * (camPos.z - 9.5));
      cam.position.lerp(P, 0.25); cam.position.x += rnd(-1, 1) * (0.05 + evK * 0.3); cam.position.y += rnd(-1, 1) * (0.05 + evK * 0.25);
      camLook.lerp(new THREE.Vector3(0, 1.4, 0), 0.2); cam.lookAt(camLook); cam.fov += ((46 + evK * 34) - cam.fov) * 0.2; cam.updateProjectionMatrix();
      renderer.render(scene, cam); requestAnimationFrame(frame); return;
    }
    const want = camPos.clone(); want.z -= phase === 'countdown' ? (5 - cdN) * 0.5 : 0; want.x += Math.sin(time * 0.25) * 1.3;
    cam.position.lerp(want, 0.06); cam.position.x += rnd(-1, 1) * shake * 0.25; cam.position.y += rnd(-1, 1) * shake * 0.25;
    camLook.lerp(new THREE.Vector3(Math.sin(time * 0.25) * -0.8, 1.2, -1), 0.08); cam.lookAt(camLook);
    cam.fov += ((goT > 0 ? 58 : 46) - cam.fov) * 0.12; cam.updateProjectionMatrix();
    renderer.render(scene, cam); requestAnimationFrame(frame);
  }
  function resize() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false); cam.aspect = w / h;
    if (w > 1000) cam.setViewOffset(w, h, -w * 0.07, h * 0.02, w, h); else cam.clearViewOffset();   // el marcador ocupa la izquierda
    cam.updateProjectionMatrix();
  }
  addEventListener('resize', resize); resize(); requestAnimationFrame(frame);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => T.forEach(drawName));
  return { sync, burst, setCountdown, go, resize, setEvent, failed };
}
