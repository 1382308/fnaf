/* maps-n7.js — Noche 7, «Golden Freddy»: la oficina de seguridad de la Noche 1, rota y casi a oscuras.
   Un anillo de pasillos (oeste, sur y este) rodea el complejo. La Oficina queda al noroeste; al este de ella está el
   Cuarto de Golden. Debajo de ambos: la Ventilación y la Sala de peluches, unidas por tres túneles.
   Coordenadas en baldosas de 16 px (ver maps.js). Las tareas se desbloquean con objetos (needs/gives). */
(function (G) {
  'use strict';
  var MAPS = G.MAPS = G.MAPS || {};

  MAPS.noche7 = {
    cols: 68, rows: 42,
    build: function (B) {
      var T = 16;
      // ---- zonas ----
      var HW = B.room('pasilloO', 'Pasillo Oeste', 4, 4, 8, 37, 'g', { ambient: 0.9, color: '#8a2a3a', hall: true });
      var HS = B.room('pasilloS', 'Pasillo Sur', 9, 34, 58, 37, 'g', { ambient: 0.9, color: '#8a2a3a', hall: true });
      var HE = B.room('pasilloE', 'Pasillo Este', 59, 4, 63, 37, 'g', { ambient: 0.9, color: '#8a2a3a', hall: true });
      var OFI = B.room('oficina', 'Oficina', 12, 5, 31, 17, 'S', { ambient: 0.55, color: '#4a6a8a', alwaysVisible: true });
      var GOL = B.room('golden', 'Cuarto de Golden', 35, 5, 55, 17, 'r', { ambient: 0.93, color: '#d8a410' });
      var VEN = B.room('ventilacion', 'Ventilación', 12, 21, 31, 30, 'n', { ambient: 0.92, color: '#6a8ac0' });
      var PEL = B.room('peluches', 'Sala de peluches', 35, 21, 55, 30, 'F', { ambient: 0.9, color: '#c4407e' });
      // ---- puertas ----
      B.door(9, 10, 11, 11); B.door(32, 10, 34, 11); B.door(56, 10, 58, 11);              // oeste -> oficina -> golden -> este
      B.door(21, 18, 22, 20); B.door(45, 18, 46, 20);                                      // oficina -> ventilación, golden -> peluches
      B.door(9, 25, 11, 26); B.door(32, 25, 34, 26); B.door(56, 25, 58, 26);               // pasillos y salas del sur
      B.door(21, 31, 22, 33); B.door(45, 31, 46, 33);                                      // ventilación y peluches -> pasillo sur
      B.start = [16 * T + 8, 13 * T + 14];
      B.spawn(61 * T + 8, 7 * T + 12); B.spawn(53 * T + 8, 36 * T + 12); B.spawn(53 * T + 8, 28 * T + 12); B.spawn(40 * T + 8, 9 * T + 12);

      /* baliza roja que pulsa: cada una ilumina solo su zona */
      function lamp(tx, ty, room, ox) {
        B.prop('alarmLamp', tx, ty, { ox: ox || 0, light: { dx: 6, dy: 8, r: 36, col: '#ff2a3a', glow: '#ff2a3a', flick: 0.45, clip: room } });
      }

      // ======================= PASILLO OESTE =======================
      B.wall('itsMeWall', 4, 2, { ox: 0, oy: 1 }); B.wall('plate', 7, 2, { ox: 4, oy: 6, text: 'OESTE' });
      lamp(6, 4, HW, 4);
      B.prop('bench', 4, 8, {}); B.prop('trashC', 8, 6, {});
      B.prop('lampBroken', 4, 14, { light: { dx: 10, dy: 10, r: 36, col: '#ffd0a0', flick: 1.6, clip: HW } }); B.prop('plant', 8, 15, { ox: -2 });
      B.prop('meStandee', 4, 19, { act: { id: 'poster', name: 'Póster «IT’S ME»', zone: [-8, 38, 48, 28] } });
      B.prop('cabinet', 8, 21, {}); B.prop('plushPile', 4, 23, {});
      B.prop('trashC', 4, 29, {}); B.prop('barrel', 8, 30, { ox: -4 }); B.prop('tippedChair', 5, 32, {});
      B.decorPx('doormat', 6 * T, 10 * T + 2, { text: 'OFICINA' }); B.decorPx('doormat', 6 * T, 25 * T + 2, { text: 'DUCTOS' });
      B.decorPx('glowRed', 5 * T, 5 * T, {}); B.decorPx('plushFloor', 6 * T, 22 * T + 4, {}); B.decorPx('glassShards', 6 * T, 11 * T + 6, {});
      B.decorPx('paperScatter', 6 * T, 17 * T, {}); B.decorPx('burnMark', 5 * T + 6, 27 * T, {}); B.decorPx('stain', 7 * T, 20 * T + 8, {});
      B.decorPx('floorCrack', 5 * T, 31 * T, {}); B.decorPx('stain', 6 * T, 34 * T, {}); B.decorPx('hazard', 5 * T, 8 * T + 8, {});
      B.decorPx('floorText', 5 * T + 4, 13 * T, { text: 'NO CORRAS' });
      B.light(6 * T, 7 * T, 52, '#8a5a6a', { clip: HW, flick: 0.6 }); B.light(6 * T, 20 * T, 48, '#ff3b4a', { clip: HW, flick: 0.5 });
      B.light(6 * T, 31 * T, 46, '#7a6a8a', { clip: HW, flick: 0.9 });

      // ======================= PASILLO SUR =======================
      B.wall('plate', 17, 32, { ox: 0, oy: 6, text: 'DUCTOS' }); B.wall('plate', 49, 32, { ox: 0, oy: 6, text: 'PELUCHES' });
      B.wall('itsMeWall', 13, 32, { ox: 0, oy: 1 }); B.wall('itsMeTorn', 26, 32, { ox: 4, oy: 3 }); B.wall('helpScrawl', 29, 32, { ox: 0, oy: 8 });
      B.wall('shadowFigure', 35, 32, { ox: 0, oy: 3 }); B.wall('scratchWall', 38, 32, { ox: 0, oy: 3 }); B.wall('ceilLeak', 42, 32, { ox: 0, oy: 2 });
      B.wall('cableDrape', 52, 32, { ox: 0, oy: 2 }); B.wall('posterA', 55, 32, { ox: 0, oy: 3 });
      lamp(16, 34, HS, 2); lamp(41, 34, HS, 4); lamp(33, 34, HS, 0);
      B.prop('secCam', 24, 34, {}); B.prop('sparkBox', 52, 34, {}); B.prop('secCam', 57, 34, {});
      B.prop('cabinet', 10, 35, {}); B.prop('locker', 11, 35, {}); B.prop('locker', 12, 35, { v: 'b' });
      B.prop('lampBroken', 40, 35, { light: { dx: 10, dy: 10, r: 36, col: '#ffd0a0', flick: 1.6, clip: HS } });
      B.prop('wheelieBin', 53, 35, {}); B.wall('fireExt', 31, 32, { ox: 6, oy: 8 });
      B.prop('bench', 14, 38, {}); B.prop('barrel', 25, 38, {}); B.prop('boxStack', 31, 38, {}); B.prop('mopBucket', 36, 38, {});
      B.prop('tippedChair', 35, 38, {}); B.prop('trashC', 49, 38, {}); B.prop('tapePost', 56, 38, {});
      B.decorPx('doormat', 21 * T - 2, 34 * T + 2, { text: 'DUCTOS' }); B.decorPx('doormat', 45 * T - 2, 34 * T + 2, { text: 'PELUCHES' });
      B.decorPx('glowRed', 14 * T, 34 * T + 8, {}); B.decorPx('glowRed', 38 * T, 34 * T + 8, {}); B.decorPx('plushFloor', 18 * T, 36 * T, {});
      B.decorPx('glassShards', 29 * T, 36 * T + 2, {}); B.decorPx('paperScatter', 34 * T, 35 * T, {}); B.decorPx('burnMark', 42 * T, 36 * T, {});
      B.decorPx('stain', 22 * T, 36 * T + 4, {}); B.decorPx('floorCrack', 12 * T, 36 * T, {}); B.decorPx('floorCrack', 48 * T, 36 * T + 2, {});
      B.decorPx('hazard', 21 * T, 33 * T + 10, {}); B.decorPx('hazard', 45 * T, 33 * T + 10, {}); B.decorPx('puddle', 32 * T, 35 * T + 4, {});
      B.decorPx('plushFloor', 56 * T, 35 * T + 8, {}); B.decorPx('cables', 19 * T, 35 * T + 6, {});
      B.light(12 * T, 35 * T, 50, '#8a5a6a', { clip: HS, flick: 0.7 }); B.light(24 * T, 36 * T, 48, '#ff3b4a', { clip: HS, flick: 0.5 });
      B.light(38 * T, 36 * T, 46, '#7a6a8a', { clip: HS, flick: 0.9 }); B.light(52 * T, 36 * T, 44, '#ff6a5a', { clip: HS, flick: 0.6 });

      // ======================= PASILLO ESTE =======================
      B.wall('itsMeTorn', 61, 2, { ox: 0, oy: 3 }); B.wall('plate', 59, 2, { ox: 0, oy: 12, text: 'ESTE' });
      lamp(60, 4, HE, 6);
      B.prop('locker', 63, 6, {}); B.prop('locker', 62, 6, { v: 'b' }); B.prop('fountain', 63, 14, { ox: -2 }); B.prop('sparkBox', 62, 4, { ox: 8 });
      B.prop('lampBroken', 59, 17, { light: { dx: 10, dy: 10, r: 36, col: '#ffd0a0', flick: 1.6, clip: HE } }); B.prop('trashC', 63, 18, {});
      B.prop('tippedChair', 62, 21, {}); B.prop('bench', 62, 29, {}); B.prop('plant', 59, 22, {}); B.prop('wheelieBin', 62, 33, {});
      B.decorPx('doormat', 59 * T - 2, 10 * T + 2, { text: 'GOLDEN' }); B.decorPx('doormat', 59 * T - 2, 25 * T + 2, { text: 'PELUCHES' });
      B.decorPx('glowRed', 60 * T, 6 * T, {}); B.decorPx('plushFloor', 60 * T, 15 * T, {}); B.decorPx('glassShards', 61 * T, 12 * T + 4, {});
      B.decorPx('paperScatter', 60 * T, 19 * T, {}); B.decorPx('burnMark', 61 * T, 23 * T, {}); B.decorPx('stain', 61 * T, 27 * T, {});
      B.decorPx('floorCrack', 60 * T, 30 * T, {}); B.decorPx('hazard', 60 * T, 9 * T + 8, {}); B.decorPx('puddle', 61 * T, 16 * T + 4, {});
      B.light(61 * T, 8 * T, 50, '#8a5a6a', { clip: HE, flick: 0.6 }); B.light(61 * T, 20 * T, 46, '#ff3b4a', { clip: HE, flick: 0.5 });
      B.light(61 * T, 31 * T, 46, '#7a6a8a', { clip: HE, flick: 0.9 });

      // ======================= OFICINA =======================
      B.decorPx('rugO', 14 * T, 12 * T + 8, {}); B.decorPx('cables', 19 * T, 12 * T + 4, {}); B.decorPx('glassShards', 17 * T, 10 * T, {});
      B.decorPx('paperScatter', 25 * T, 13 * T, {}); B.decorPx('burnMark', 28 * T, 7 * T, {}); B.decorPx('glowRed', 26 * T, 6 * T, {});
      B.decorPx('stain', 15 * T, 16 * T, {}); B.decorPx('floorCrack', 24 * T, 15 * T, {}); B.decorPx('plushFloor', 29 * T, 12 * T, {});
      B.decorPx('hazard', 21 * T, 17 * T + 10, {}); B.decorPx('doormat', 21 * T - 2, 16 * T + 2, { text: 'DUCTOS' });
      B.decorPx('floorText', 13 * T + 4, 11 * T + 2, { text: 'OFICINA' });
      B.wall('ceilLeak', 16, 3, { ox: 0, oy: 2 }); B.wall('itsMeWall', 20, 3, { ox: 0, oy: 1 }); B.wall('clock', 25, 3, { ox: 0, oy: 6 });
      B.wall('cableDrape', 29, 3, { ox: 0, oy: 2 }); B.wall('helpScrawl', 22, 3, { ox: 8, oy: 4 });
      lamp(24, 5, OFI, 2);
      B.prop('tvWall', 13, 6, {}); B.prop('leakBucket', 16, 6, {}); B.prop('secCam', 18, 5, {});
      B.prop('finalPanel', 27, 5, { act: { id: 'panel', name: 'Panel final', zone: [-8, 20, 48, 40] } });
      B.prop('sparkBox', 31, 5, { ox: -2 });
      B.prop('deskL', 20, 10, {});
      B.prop('phone', 20, 9, { ox: 4, oy: -3, sb: 160.5, act: { id: 'phone', name: 'Teléfono', zone: [-4, 8, 28, 46] } });
      B.prop('crt', 21, 9, { ox: 8, oy: -5, sb: 160.5 });
      B.prop('staticCrt', 23, 9, { ox: -2, oy: -5, sb: 160.5, act: { id: 'monitor', name: 'Monitor', zone: [-10, 8, 38, 52] } });
      B.prop('fan', 24, 9, { ox: 0, oy: -2, sb: 160.5 });
      B.prop('chairO', 22, 12, { ox: -1 }); B.prop('tippedChair', 26, 12, {});
      B.prop('locker', 12, 16, {}); B.prop('locker', 13, 16, { v: 'b' }); B.prop('plant', 15, 17, {}); B.prop('trashC', 31, 17, {});
      B.prop('lampBroken', 30, 13, { light: { dx: 10, dy: 10, r: 36, col: '#ffd0a0', flick: 1.6, clip: OFI } }); B.prop('plushPile', 26, 17, {});
      B.light(21 * T, 12 * T, 84, '#cfe0ee', { clip: OFI }); B.light(15 * T, 13 * T, 56, '#9ab0c8', { clip: OFI, flick: 0.3 });
      B.light(28 * T, 9 * T, 50, '#ff3b4a', { clip: OFI, flick: 0.5 });

      // ======================= CUARTO DE GOLDEN =======================
      B.decorPx('rugO', 41 * T + 4, 7 * T + 4, {}); B.decorPx('glowRed', 38 * T, 12 * T, {}); B.decorPx('glowRed', 50 * T, 9 * T, {});
      B.decorPx('burnMark', 43 * T, 12 * T, {}); B.decorPx('glassShards', 37 * T, 9 * T + 4, {}); B.decorPx('glassShards', 52 * T, 12 * T, {});
      B.decorPx('paperScatter', 41 * T, 9 * T + 8, {}); B.decorPx('paperScatter', 49 * T, 16 * T, {}); B.decorPx('plushFloor', 39 * T, 7 * T + 8, {});
      B.decorPx('plushFloor', 53 * T, 8 * T, {}); B.decorPx('stain', 48 * T, 7 * T + 8, {}); B.decorPx('floorCrack', 44 * T, 14 * T, {});
      B.decorPx('confetti', 46 * T, 10 * T, {}); B.decorPx('wireTangle', 36 * T, 14 * T + 4, {});
      B.decorPx('floorText', 42 * T, 11 * T + 2, { text: 'GOLDEN' });
      B.decorPx('doormat', 45 * T - 2, 16 * T + 2, { text: 'PELUCHES' }); B.decorPx('doormat', 36 * T, 10 * T + 2, { text: 'OFICINA' });
      B.decorPx('doormat', 51 * T, 10 * T + 2, { text: 'PASILLO' });
      B.wall('ceilLeak', 35, 3, { ox: 0, oy: 2 }); B.wall('itsMeWall', 38, 3, { ox: 0, oy: 1 });
      B.wall('itsMeTorn', 51, 3, { ox: 10, oy: 3 }); B.wall('shadowFigure', 49, 3, { ox: 0, oy: 3 });
      lamp(40, 5, GOL, 4);
      B.prop('springSuit', 36, 6, {}); B.prop('springSuit', 53, 6, {});
      B.prop('candelabra', 42, 6, { light: { dx: 9, dy: 8, r: 34, col: '#ffb050', flick: 1.3, clip: GOL } });
      B.prop('candelabra', 47, 6, { light: { dx: 9, dy: 8, r: 34, col: '#ffb050', flick: 1.1, clip: GOL } });
      B.prop('goldenSlump', 44, 6, { light: { dx: 16, dy: 14, r: 40, col: '#ffe9a0', flick: 0.4, clip: GOL }, act: { id: 'golden', name: 'Golden Freddy', zone: [-8, 30, 48, 30] } });
      B.prop('wreckTable', 39, 15, {}); B.prop('wreckTable', 50, 15, {}); B.prop('chairD', 38, 14, { ox: 4 }); B.prop('chairD', 43, 15, {});
      B.prop('kidChair', 48, 14, { v: 'y' }); B.prop('kidChair', 54, 13, { v: 'p' });
      B.prop('tvWall', 36, 17, {}); B.prop('plushShelf', 52, 17, {}); B.prop('speaker', 55, 8, { ox: -2 }); B.prop('balloons', 35, 8, { ox: 4 });
      B.prop('sparkBox', 55, 5, {});
      B.light(41 * T, 10 * T, 60, '#6a2a3a', { clip: GOL, flick: 0.5 }); B.light(51 * T, 12 * T, 54, '#ff3b4a', { clip: GOL, flick: 0.6 });

      // ======================= VENTILACIÓN =======================
      B.wall('plate', 17, 19, { ox: 0, oy: 6, text: 'VENTILACION' });
      lamp(23, 21, VEN, 2); lamp(31, 21, VEN, 2);
      B.prop('ventFan', 13, 22, { act: { id: 'fan', name: 'Ventilador', zone: [-8, 22, 64, 44] } });
      B.prop('pipeRiser', 12, 22, {}); B.prop('steamVent', 17, 24, {});
      B.prop('ductRun', 24, 22, {}); B.prop('blowerUnit', 29, 22, {});
      B.prop('secCam', 19, 21, {});
      B.prop('genSet', 13, 29, {}); B.prop('cableReel', 18, 29, {}); B.prop('boxStack', 12, 31, {}); B.prop('barrel', 19, 31, {});
      B.prop('wheelieBin', 24, 29, {}); B.prop('tapePost', 28, 29, {}); B.prop('barrel', 30, 31, {}); B.prop('pumpMotor', 26, 31, {});
      B.decorPx('hazard', 21 * T, 25 * T, {}); B.decorPx('hazard', 21 * T, 27 * T + 8, {}); B.decorPx('floorGrate', 13 * T, 26 * T, {});
      B.decorPx('glowRed', 18 * T, 27 * T, {}); B.decorPx('glowRed', 26 * T, 22 * T + 8, {}); B.decorPx('puddle', 16 * T, 25 * T + 4, {});
      B.decorPx('cables', 25 * T, 26 * T + 6, {}); B.decorPx('wireTangle', 15 * T, 28 * T, {}); B.decorPx('burnMark', 23 * T, 28 * T + 4, {});
      B.decorPx('stain', 27 * T, 25 * T, {}); B.decorPx('stain', 12 * T, 28 * T + 8, {}); B.decorPx('doormat', 21 * T - 2, 21 * T + 2, { text: 'OFICINA' });
      B.decorPx('doormat', 21 * T - 2, 29 * T + 2, { text: 'PASILLO' }); B.decorPx('floorText', 24 * T, 24 * T + 4, { text: 'DUCTOS' });
      B.light(16 * T, 24 * T, 60, '#6a8ac0', { clip: VEN, flick: 0.8 }); B.light(27 * T, 25 * T, 52, '#ff3b4a', { clip: VEN, flick: 0.5 });
      B.light(18 * T, 28 * T, 46, '#9ac0ff', { clip: VEN, flick: 1.1 });

      // ======================= SALA DE PELUCHES =======================
      B.wall('plate', 42, 19, { ox: 8, oy: 6, text: 'PELUCHES' }); B.wall('itsMeWall', 47, 19, { ox: 0, oy: 1 });
      lamp(53, 21, PEL, 0); lamp(35, 21, PEL, 0);
      B.prop('plushShelf', 38, 22, {}); B.prop('plushShelf', 50, 22, {}); B.prop('giftPile', 41, 22, {}); B.prop('secCam', 54, 21, {});
      B.prop('balloons', 35, 29, {}); B.prop('plushPile', 36, 24, {});
      B.prop('partyTable', 38, 30, { v: 'a' }); B.prop('wreckTable', 51, 30, {}); B.prop('kidChair', 37, 28, { v: 'p' }); B.prop('kidChair', 42, 29, { v: 'b' });
      B.prop('kidChair', 49, 29, { v: 'y' }); B.prop('discoStand', 43, 30, {}); B.prop('beanBag', 42, 27, { v: 'g' }); B.prop('beanBag', 53, 28, {});
      B.prop('tippedChair', 48, 28, {}); B.prop('tvWall', 53, 24, {});
      B.decorPx('rugParty', 37 * T, 25 * T + 8, {}); B.decorPx('confetti', 41 * T, 24 * T, {}); B.decorPx('confetti', 50 * T, 27 * T, {});
      B.decorPx('spill', 44 * T, 28 * T, {}); B.decorPx('glassShards', 47 * T, 23 * T, {}); B.decorPx('paperScatter', 39 * T, 27 * T + 4, {});
      B.decorPx('plushFloor', 43 * T, 24 * T + 6, {}); B.decorPx('plushFloor', 52 * T, 26 * T, {}); B.decorPx('burnMark', 49 * T, 25 * T + 4, {});
      B.decorPx('glowRed', 40 * T, 21 * T + 8, {}); B.decorPx('glowRed', 50 * T, 28 * T, {}); B.decorPx('serpFloor', 47 * T, 26 * T + 6, {});
      B.decorPx('doormat', 45 * T - 2, 21 * T + 2, { text: 'GOLDEN' }); B.decorPx('doormat', 45 * T - 2, 29 * T + 2, { text: 'PASILLO' });
      B.decorPx('floorText', 48 * T, 23 * T + 4, { text: 'FIESTA' });
      B.light(41 * T, 25 * T, 58, '#c4407e', { clip: PEL, glow: '#c4407e', flick: 0.7 }); B.light(51 * T, 25 * T, 52, '#ff3b4a', { clip: PEL, flick: 0.5 });
      B.light(45 * T, 29 * T, 46, '#9a90ff', { clip: PEL, flick: 1.1 });
    }
  };
})(window);
