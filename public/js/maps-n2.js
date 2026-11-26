/* maps-n2.js — Noche 2, «El Escenario»: un gran comedor con el escenario al norte, dos cabinas a los lados,
   un pasillo de servicio al sur y, más abajo, la bodega de instrumentos y el camerino.
   Coordenadas en baldosas de 16 px (ver maps.js). */
(function (G) {
  'use strict';
  var MAPS = G.MAPS = G.MAPS || {};

  MAPS.noche2 = {
    cols: 54, rows: 46,
    build: function (B) {
      var T = 16, i;
      // ---- zonas (el comedor va primero: el escenario manda en las dos filas que comparten) ----
      var COM = B.room('comedor', 'Comedor', 3, 13, 50, 25, 'Q', { ambient: 0.68, color: '#c4407e', alwaysVisible: true });
      var ESC = B.room('escenario', 'Escenario', 15, 3, 38, 12, 'E', { ambient: 0.74, color: '#8a4ad0', alwaysVisible: true });
      var LUC = B.room('luces', 'Cabina de luces', 3, 3, 11, 9, 'B', { ambient: 0.9, color: '#e0a030' });
      var CTL = B.room('control', 'Cabina de control', 42, 3, 50, 9, 'B', { ambient: 0.78, color: '#3fd479' });
      var SRV = B.room('servicio', 'Pasillo de servicio', 3, 29, 50, 32, 'V', { ambient: 0.88, color: '#4a7a6a', hall: true });
      var BOD = B.room('bodega', 'Bodega de instrumentos', 3, 36, 22, 43, 'G', { ambient: 0.86, color: '#9a7a4a' });
      var CAM = B.room('camerino', 'Camerino', 31, 36, 50, 43, 'M', { ambient: 0.82, color: '#a05cff' });
      // ---- puertas ----
      B.door(7, 10, 8, 12); B.door(45, 10, 46, 12);                               // cabinas -> comedor
      B.door(11, 26, 12, 28); B.door(26, 26, 27, 28); B.door(41, 26, 42, 28);       // comedor -> servicio
      B.door(12, 33, 13, 35); B.door(40, 33, 41, 35);                               // servicio -> bodega y camerino
      B.start = [27 * T, 16 * T + 12];
      B.spawn(21 * T + 8, 10 * T + 12); B.spawn(20 * T + 8, 40 * T + 12); B.spawn(48 * T + 8, 40 * T + 12); B.spawn(49 * T + 8, 31 * T + 12);

      /* silla a cada lado de una mesa larga: n = norte, s = sur */
      function table(tx, ty, v, ca, cb) {
        B.prop('longTable', tx, ty, { v: v });
        for (var k = 0; k < 4; k++) {
          B.prop('chairD', tx, ty - 2, { ox: 7 + k * 20, v: (k + ca) % 2 ? 'nt' : 'n' });
          B.prop('chairD', tx, ty, { ox: 7 + k * 20, oy: 6, v: (k + cb) % 2 ? 'st' : 's' });
        }
      }

      // ======================= ESCENARIO =======================
      B.wall('backdrop', 19, 1, {});
      B.prop('telon', 15, 4, { v: 'l' }); B.prop('telon', 35, 4, { v: 'r' });
      B.prop('marquee', 23, 3, { ox: 4, oy: -2, light: { dx: 60, dy: 15, r: 50, col: '#ffd070', glow: '#a05cff', clip: ESC } });
      B.prop('pedestal', 21, 8, { v: 'b' }); B.prop('pedestal', 26, 8, { v: 'f' }); B.prop('pedestal', 31, 8, { v: 'c' });
      B.prop('guitarStand', 19, 8, { ox: -2, v: 'bonnie', act: { id: 'guitar', name: 'Guitarra de Bonnie' } });
      for (i = 0; i < 5; i++) B.prop('stageLip', 17 + i * 4, 13, {});
      B.decorPx('stageSteps', 15 * T, 12 * T, {}); B.decorPx('stageSteps', 37 * T, 12 * T, {});
      B.prop('spotStand', 22, 11, { ox: -2, v: 'p' }); B.prop('spotStand', 27, 11, { ox: -2, v: 'b' }); B.prop('spotStand', 32, 11, { ox: -2, v: 'a' });
      B.prop('wedge', 18, 11, {}); B.prop('wedge', 24, 11, {}); B.prop('wedge', 29, 11, {}); B.prop('wedge', 34, 11, {});
      B.prop('micStand', 28, 11, { ox: 5, act: { id: 'mic', name: 'Micrófono de Freddy' } });
      B.prop('drumKit', 35, 7, { ox: -4 });
      B.prop('ampL', 16, 8, {}); B.prop('ampS', 36, 10, {}); B.prop('ampS', 15, 10, {});
      B.decorPx('stageStar', 396, 8 * T + 4, {});
      [[18, 6], [24, 10], [30, 9], [36, 6]].forEach(function (m) { B.decorPx('tapeMark', m[0] * T + 3, m[1] * T + 3, { col: '#ffe45c' }); });
      B.decorPx('tapeMark', 25 * T + 4, 10 * T + 6, { col: '#e8e0f0' }); B.decorPx('tapeMark', 33 * T + 4, 10 * T + 6, { col: '#4de0ff' });
      B.decorPx('cablesB', 18 * T, 9 * T, {}); B.decorPx('cablesB', 31 * T, 5 * T + 4, {});
      B.decorPx('pawPrints', 19 * T, 10 * T + 2, { dir: 'd' }); B.decorPx('pawPrints', 17 * T, 11 * T + 2, { dir: 'd' }); B.decorPx('pawPrints', 15 * T + 4, 11 * T + 10, { dir: 'd' });
      B.light(21 * T + 8, 6 * T + 8, 56, '#d49aff', { clip: ESC, glow: '#a05cff', flick: 0.8 });
      B.light(26 * T + 8, 6 * T + 8, 58, '#9ac4ff', { clip: ESC, glow: '#4a8ae0' });
      B.light(31 * T + 8, 6 * T + 8, 56, '#ffe9a0', { clip: ESC, glow: '#ffd060' });
      B.light(36 * T, 9 * T, 54, '#ff9ac4', { clip: ESC, flick: 0.5 });

      // ======================= COMEDOR =======================
      table(4, 19, 'a', 0, 1); table(13, 19, 'b', 1, 0); table(35, 19, 'b', 0, 1); table(44, 19, 'a', 1, 0);
      table(4, 24, 'b', 1, 0); table(13, 24, 'a', 0, 1); table(35, 24, 'a', 1, 0); table(44, 24, 'b', 0, 1);
      B.decorPx('danceRug', 368, 14 * T + 8, {});
      B.decorPx('welcomeMat', 27 * T - 32, 13 * T + 4, {});
      B.prop('cakeBig', 26, 21, { act: { id: 'cake', name: 'Pastel de Chica' } });
      B.prop('sodaMachine', 3, 14, {}); B.prop('plant', 10, 14, {}); B.prop('jukebox', 12, 14, {});
      B.prop('jukebox', 40, 14, {}); B.prop('plant', 44, 14, { ox: -1 }); B.prop('sodaMachine', 49, 14, {});
      B.prop('hostStand', 24, 24, { ox: -3 }); B.prop('balloons', 19, 16, {}); B.prop('balloons', 33, 16, { ox: 2 }); B.prop('balloons', 31, 24, { ox: -2 });
      B.prop('giftPile', 19, 22, { ox: 2 }); B.prop('chairStack', 3, 25, { ox: -2 }); B.prop('chairStack', 4, 25, { ox: 2, v: 't' }); B.prop('chairStack', 50, 25, { ox: -2, v: 't' });
      B.prop('trashC', 21, 25, { ox: 1 }); B.prop('trashC', 46, 25, {}); B.prop('wetsign', 29, 23, {}); B.prop('mopBucket', 33, 25, {});
      B.decorPx('hazard', 7 * T, 12 * T + 12, {}); B.decorPx('hazard', 45 * T, 12 * T + 12, {});
      B.decorPx('doormat', 7 * T - 2, 13 * T + 3, { text: 'LUCES' }); B.decorPx('doormat', 45 * T - 2, 13 * T + 3, { text: 'CONTROL' });
      B.decorPx('doormat', 11 * T - 2, 25 * T + 3, { text: 'SERVICIO' }); B.decorPx('doormat', 26 * T - 2, 25 * T + 3, { text: 'SERVICIO' }); B.decorPx('doormat', 41 * T - 2, 25 * T + 3, { text: 'SERVICIO' });
      B.decorPx('confetti', 20 * T, 14 * T, {}); B.decorPx('confetti', 31 * T, 15 * T, {}); B.decorPx('confetti', 21 * T, 21 * T, {}); B.decorPx('confetti', 12 * T, 15 * T, {}); B.decorPx('confetti', 38 * T, 21 * T, {});
      B.decorPx('serpFloor', 22 * T, 18 * T, {}); B.decorPx('serpFloor', 29 * T, 17 * T + 8, {}); B.decorPx('serpFloor', 9 * T, 21 * T, {});
      B.decorPx('spill', 33 * T, 20 * T, {}); B.decorPx('stain', 24 * T, 22 * T, {}); B.decorPx('stain', 17 * T, 24 * T, {}); B.decorPx('puddle', 34 * T, 23 * T, {});
      B.decorPx('pawPrints', 16 * T, 13 * T + 6, { dir: 'd' }); B.decorPx('pawPrints', 17 * T, 15 * T + 4, { dir: 'd' }); B.decorPx('pawPrints', 19 * T, 17 * T, { dir: 'r' });
      B.decorPx('pawPrints', 22 * T, 19 * T + 4, { dir: 'r' }); B.decorPx('pawPrints', 25 * T, 23 * T, { dir: 'd' }); B.decorPx('pawPrints', 26 * T, 25 * T - 4, { dir: 'd' });
      // paredes del norte (frentes de las cabinas)
      B.wall('posterShow', 5, 11, { ox: 1, oy: 1 }); B.wall('plate', 9, 11, { ox: 2, oy: 4, text: 'LUCES' }); B.wall('clock', 10, 11, { ox: 12, oy: 0 }); B.wall('streamer', 14, 11, { ox: -24, oy: 1 });
      B.wall('plate', 42, 11, { ox: 8, oy: 4, text: 'CONTROL' }); B.wall('posterShow', 47, 11, { ox: 0, oy: 1 }); B.wall('clock', 39, 11, { ox: 0, oy: 0 }); B.wall('streamer', 39, 11, { ox: 16, oy: 1 });
      [[4, 22], [8, 22], [12, 22], [37, 17], [41, 17], [46, 17], [37, 22], [41, 22], [46, 22], [12, 17]].forEach(function (l, k) { B.light(l[0] * T + 8, l[1] * T, 52, '#ffd890', { clip: COM, flick: k % 3 ? 0 : 0.4 }); });
      B.light(21 * T, 15 * T, 56, '#ff5fd2', { clip: COM, glow: '#ff5fd2', flick: 0.5 });
      B.light(32 * T, 15 * T, 56, '#4de0ff', { clip: COM, glow: '#4de0ff', flick: 0.7 });
      B.light(27 * T, 17 * T, 62, '#ffe9a0', { clip: COM });
      B.light(27 * T, 23 * T, 58, '#ffd890', { clip: COM, flick: 0.5 });

      // ======================= CABINA DE LUCES =======================
      B.wall('setlist', 8, 1, { ox: 8, oy: 4 }); B.wall('clock', 3, 1, { ox: 2, oy: 6 }); B.wall('notice', 11, 1, { ox: 0, oy: 6 });
      B.prop('camBank', 5, 3, { ox: 0 });
      B.prop('lampShelf', 3, 4, {}); B.prop('rack', 10, 4, {});
      B.prop('lightPanel', 5, 7, { act: { id: 'lights', name: 'Luces del escenario' }, light: { dx: 32, dy: 12, r: 40, col: '#ffd070', glow: '#ff9a2e', clip: LUC } });
      B.prop('chairO', 5, 9, { ox: 0, v: 'g' });
      B.prop('caseF', 3, 9, {}); B.prop('trussPiece', 9, 9, {}); B.prop('reelC', 11, 7, { ox: -2 });
      B.prop('spotStand', 3, 7, { ox: -2, v: 'g' }); B.prop('trash', 3, 5, { ox: 2 }); B.prop('trashC', 10, 7, { ox: 1 });
      B.decorPx('cablesB', 5 * T, 8 * T + 4, {}); B.decorPx('cablesB', 8 * T + 8, 5 * T + 8, {}); B.decorPx('tapeMark', 7 * T + 2, 7 * T + 4, { col: '#4de0ff' }); B.decorPx('stain', 9 * T, 6 * T + 4, {});
      B.light(7 * T, 6 * T, 60, '#cfeedd', { clip: LUC }); B.light(4 * T, 4 * T, 40, '#ffb060', { clip: LUC, glow: '#ff9a2e', flick: 0.6 });

      // ======================= CABINA DE CONTROL =======================
      B.wall('clock', 50, 1, { ox: 0, oy: 6 });
      B.prop('onAir', 47, 3, { ox: 6, oy: -14 });
      B.prop('tapeShelf', 42, 4, {}); B.prop('camBank', 44, 3, { ox: 0 }); B.prop('rack', 49, 6, {});
      B.prop('mixer', 43, 7, { act: { id: 'control', name: 'Consola de control', zone: [-8, -4, 96, 70] }, light: { dx: 40, dy: 12, r: 46, col: '#9affc4', glow: '#3fd479', clip: CTL } });
      B.prop('chairO', 44, 9, { ox: 4, v: 'g' });
      B.prop('speaker', 49, 8, { ox: -2 }); B.prop('speaker', 42, 8, { ox: -1 }); B.prop('reelC', 47, 9, { ox: 4 }); B.prop('coffee', 50, 9, {});
      B.decorPx('cablesB', 43 * T, 8 * T + 4, {}); B.decorPx('cablesB', 47 * T, 6 * T + 8, {}); B.decorPx('tapeMark', 48 * T + 4, 8 * T, { col: '#ff9a2e' }); B.decorPx('stain', 42 * T, 5 * T + 8, {});
      B.light(46 * T, 6 * T, 60, '#cfeedd', { clip: CTL }); B.light(49 * T, 4 * T, 40, '#7affb0', { clip: CTL, glow: '#3fd479', flick: 0.5 });

      // ======================= PASILLO DE SERVICIO =======================
      [5, 15, 22, 31, 37, 46].forEach(function (sx, k) {
        B.wall('sconce', sx, 27, { ox: 2, oy: 6 });
        B.light(sx * T + 8, 30 * T, 50, '#d8ffe8', { flick: 0.5 + k * 0.17, clip: SRV });
      });
      B.wall('plate', 13, 27, { ox: 2, oy: 8, text: 'COMEDOR' }); B.wall('plate', 28, 27, { ox: 2, oy: 8, text: 'COMEDOR' }); B.wall('plate', 43, 27, { ox: 2, oy: 8, text: 'COMEDOR' });
      B.wall('plate', 3, 27, { ox: 0, oy: 8, text: 'SOLO PERSONAL' }); B.wall('fireExt', 8, 27, { ox: 2, oy: 8 }); B.wall('posterShow', 17, 27, { ox: 0, oy: 1 }); B.wall('vent', 20, 27, { ox: 0, oy: 12 });
      B.wall('clock', 24, 27, { ox: 2, oy: 6 }); B.wall('setlist', 33, 27, { ox: 0, oy: 4 }); B.wall('notice', 35, 27, { ox: 2, oy: 6 }); B.wall('vent', 39, 27, { ox: 0, oy: 12 });
      B.wall('exitSign', 48, 27, { ox: 0, oy: 0 }); B.wall('fireExt', 49, 27, { ox: 2, oy: 8 });
      B.decorPx('hazard', 11 * T, 28 * T + 12, {}); B.decorPx('hazard', 26 * T, 28 * T + 12, {}); B.decorPx('hazard', 41 * T, 28 * T + 12, {});
      B.decorPx('doormat', 12 * T - 2, 32 * T + 3, { text: 'BODEGA' }); B.decorPx('doormat', 40 * T - 2, 32 * T + 3, { text: 'CAMERINO' });
      B.decorPx('arrowFloor', 16 * T, 31 * T - 2, {}); B.decorPx('arrowFloor', 33 * T, 30 * T + 6, {}); B.decorPx('stain', 20 * T, 31 * T, {}); B.decorPx('puddle', 36 * T, 31 * T + 4, {});
      B.decorPx('cablesB', 28 * T, 30 * T, {}); B.decorPx('pawPrints', 12 * T, 29 * T + 4, { dir: 'd' }); B.decorPx('pawPrints', 12 * T + 4, 31 * T + 6, { dir: 'd' });
      B.decorPx('pawPrints', 41 * T, 30 * T + 6, { dir: 'r' }); B.decorPx('pawPrints', 38 * T, 31 * T + 2, { dir: 'r' });
      B.prop('caseF', 4, 30, {}); B.prop('caseF', 6, 30, { v: 'a' }); B.prop('reelC', 8, 30, { ox: -2 });
      B.prop('trussPiece', 15, 33, {}); B.prop('bench', 18, 30, {}); B.prop('trashC', 22, 30, { ox: 1 });
      B.prop('wetsign', 24, 31, {}); B.prop('mopBucket', 29, 30, {}); B.prop('reelC', 33, 33, { ox: -2 }); B.prop('caseF', 44, 33, { v: 'a' }); B.prop('plant', 49, 30, {});
      B.prop('ampS', 47, 33, {}); B.prop('wedge', 36, 33, {}); B.prop('beacon', 19, 28, { ox: 2 });

      // ======================= BODEGA DE INSTRUMENTOS =======================
      B.wall('guitarWall', 4, 34, { ox: 2, oy: 0 }); B.wall('guitarWall', 8, 34, { ox: 2, oy: 0 }); B.wall('setlist', 10, 34, { ox: 6, oy: 4 });
      B.wall('cobweb', 14, 34, { ox: 0, oy: 4 }); B.wall('posterShow', 16, 34, { ox: 2, oy: 1 }); B.wall('notice', 19, 34, { ox: 2, oy: 6 }); B.wall('clock', 21, 34, { ox: 0, oy: 6 });
      B.prop('ampL', 3, 37, {}); B.prop('ampL', 5, 37, {}); B.prop('ampS', 7, 37, {}); B.prop('keyStand', 9, 37, {});
      B.prop('shelfBoxes', 15, 37, { ox: -1 }); B.prop('caseG', 17, 37, { ox: -1 }); B.prop('caseG', 19, 37, { ox: -1, v: 'b' }); B.prop('caseV', 21, 37, {}); B.prop('caseV', 22, 37, {});
      B.prop('drumKit', 4, 42, { ox: -4 });
      [[10, 'b'], [12, 'y'], [14, 'k'], [16, 'r']].forEach(function (g) { B.prop('guitarStand', g[0], 41, { ox: -2, v: g[1] }); });
      B.prop('tuneBench', 18, 44, { ox: -2 }); B.prop('chairStack', 3, 44, { ox: -2 }); B.prop('caseF', 9, 44, {}); B.prop('caseF', 11, 44, { v: 'a' }); B.prop('boxStack', 14, 44, {});
      B.prop('wedge', 7, 44, {}); B.prop('barrel', 22, 44, { ox: 0 }); B.prop('trash', 21, 43, { ox: 2 });
      B.decorPx('partsFloor', 8 * T, 39 * T, {}); B.decorPx('partsFloor', 17 * T, 41 * T + 6, {}); B.decorPx('stain', 12 * T, 38 * T + 8, {}); B.decorPx('stain', 5 * T, 40 * T, {});
      B.decorPx('cablesB', 6 * T, 41 * T + 4, {}); B.decorPx('pawPrints', 12 * T, 36 * T + 2, { dir: 'd' }); B.decorPx('pawPrints', 14 * T, 38 * T, { dir: 'r' }); B.decorPx('pawPrints', 17 * T, 39 * T + 6, { dir: 'r' });
      B.light(12 * T, 39 * T, 70, '#ffe0a0', { clip: BOD, flick: 0.9 }); B.light(18 * T, 40 * T, 54, '#e8e0c0', { clip: BOD, flick: 0.4 });

      // ======================= CAMERINO =======================
      B.wall('mirrorFull', 38, 34, { ox: 0, oy: 0 }); B.wall('clock', 42, 34, { ox: 4, oy: 6 }); B.wall('mirrorFull', 49, 34, { ox: 0, oy: 0 }); B.wall('bunting', 31, 34, { ox: 0, oy: 0 });
      B.prop('vanity', 32, 38, {}); B.prop('vanity', 35, 38, {}); B.prop('vanity', 43, 38, {});
      B.prop('dressScreen', 46, 38, { ox: 0 }); B.prop('costumeRack', 33, 43, { ox: -2 }); B.prop('costumeRack', 36, 43, { ox: -2 });
      B.prop('sofa', 40, 43, {}); B.prop('coffeeTbl', 45, 43, { ox: -1 }); B.prop('plant', 49, 43, {}); B.prop('trashC', 31, 43, { ox: 1 });
      [32, 35, 43].forEach(function (vx) { B.prop('chairD', vx, 39, { ox: 17, oy: 6, v: 's' }); });
      B.decorPx('rugO', 37 * T, 40 * T + 4, {}); B.decorPx('stain', 47 * T, 41 * T, {}); B.decorPx('confetti', 41 * T, 40 * T, {});
      B.decorPx('pawPrints', 40 * T, 36 * T + 2, { dir: 'd' }); B.decorPx('pawPrints', 42 * T, 39 * T + 4, { dir: 'r' }); B.decorPx('pawPrints', 45 * T, 41 * T + 4, { dir: 'r' });
      B.light(41 * T, 40 * T, 66, '#ffd8a0', { clip: CAM, flick: 0.3 }); B.light(35 * T, 38 * T, 40, '#ffb060', { clip: CAM, flick: 0.6 }); B.light(45 * T, 38 * T, 40, '#ffb060', { clip: CAM, flick: 0.5 });
    }
  };
})(window);
