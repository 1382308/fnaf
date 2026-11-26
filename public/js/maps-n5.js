/* maps-n5.js — Noche 5, «Pasillo Oeste»: un pasillo largo en forma de C (norte, oeste y sur).
   Al norte: almacén, baños y cuarto de limpieza. En el centro: la sala de máquinas, con puerta a ambos tramos.
   Al sur: objetos perdidos y la sala de guardia. Focos que parpadean y zonas apagadas.
   Coordenadas en baldosas de 16 px (ver maps.js). */
(function (G) {
  'use strict';
  var MAPS = G.MAPS = G.MAPS || {};

  MAPS.noche5 = {
    cols: 58, rows: 54,
    build: function (B) {
      var T = 16, i;
      // ---- zonas ----
      var ALM = B.room('almacen', 'Almacén', 4, 3, 21, 11, 'a', { ambient: 0.82, color: '#c8a84a' });
      var BAN = B.room('banos', 'Baños', 25, 3, 41, 11, 'b', { ambient: 0.86, color: '#6ac8e8' });
      var LIM = B.room('limpieza', 'Cuarto de limpieza', 45, 3, 53, 11, 'a', { ambient: 0.9, color: '#5ad08a' });
      var HA = B.room('pasillo', 'Pasillo Oeste', 4, 15, 53, 18, 'e', { ambient: 0.55, color: '#9ac8a0', hall: true });
      var HS = B.room('pasilloO', 'Pasillo Oeste', 4, 19, 8, 33, 'e', { ambient: 0.74, color: '#9ac8a0', hall: true });
      var MAQ = B.room('maquinas', 'Sala de máquinas', 13, 22, 53, 30, 'm', { ambient: 0.8, color: '#ff8a30' });
      var HB = B.room('pasilloS', 'Pasillo Sur', 4, 34, 53, 37, 'e', { ambient: 0.78, color: '#9ac8a0', hall: true });
      var OBJ = B.room('perdidos', 'Objetos perdidos', 4, 41, 27, 50, 'o', { ambient: 0.86, color: '#a888e8' });
      var GUA = B.room('guardia', 'Sala de guardia', 32, 41, 53, 50, 'o', { ambient: 0.88, color: '#e8c060' });
      // ---- puertas ----
      B.door(12, 12, 13, 14); B.door(32, 12, 33, 14); B.door(48, 12, 49, 14);            // pasillo -> almacén, baños, limpieza
      B.door(24, 19, 25, 21); B.door(46, 19, 47, 21);                                    // pasillo -> sala de máquinas
      B.door(20, 31, 21, 33); B.door(44, 31, 45, 33);                                    // sala de máquinas -> pasillo sur
      B.door(14, 38, 15, 40); B.door(40, 38, 41, 40);                                    // pasillo sur -> perdidos y guardia
      B.start = [6 * T + 8, 17 * T + 8];
      B.spawn(51 * T + 8, 25 * T + 12); B.spawn(19 * T + 8, 8 * T + 12); B.spawn(24 * T + 8, 46 * T + 12); B.spawn(50 * T + 8, 47 * T + 12);

      // ======================= PASILLO OESTE (tramo norte) =======================
      B.wall('plate', 5, 13, { ox: 0, oy: 1, text: 'PASILLO OESTE' });
      B.prop('wetBoard', 9, 16, { act: { id: 'sign', name: 'Piso mojado', zone: [-4, 20, 40, 40] } });
      B.wall('safetyBoard', 14, 13, { ox: 2, oy: 0 }); B.wall('evacMap', 17, 13, { ox: 4, oy: 2 }); B.wall('fireExt', 19, 13, { ox: 9, oy: 2 }); B.wall('earsScratch', 21, 13, { ox: 0, oy: 0 });
      B.prop('tubeLight', 23, 14, {}); B.wall('voltWarn', 27, 13, { ox: 0, oy: 4 }); B.wall('notice', 29, 13, { ox: 4, oy: 6 });
      B.wall('wallClock4', 36, 13, { ox: 4, oy: 4 }); B.prop('tubeDead', 38, 14, { oy: 4 }); B.wall('notice', 41, 13, { ox: 0, oy: 5 });
      B.wall('hookRail', 43, 13, { ox: 2, oy: 0 }); B.wall('brokenMirror', 50, 13, { ox: 0, oy: 0 });
      B.prop('bench', 16, 16, {}); B.prop('trashC', 27, 16, {}); B.prop('fountain', 35, 16, {}); B.prop('mopBucket', 40, 16, {}); B.prop('wetsign', 44, 16, { ox: 4 });
      B.prop('boxStack', 52, 16, {});
      B.prop('barrel', 28, 19, {}); B.prop('boxStack', 36, 19, {}); B.prop('barrel', 14, 19, {}); B.prop('wheelieBin', 51, 19, {});
      B.decorPx('wetSheen', 12 * T, 16 * T + 4, {}); B.decorPx('wetSheen', 38 * T, 17 * T, {}); B.decorPx('puddle', 20 * T, 16 * T + 6, {}); B.decorPx('puddle', 31 * T, 17 * T + 4, {});
      B.decorPx('puddle', 50 * T, 16 * T + 8, {}); B.decorPx('stain', 24 * T, 17 * T + 4, {}); B.decorPx('floorCrack', 26 * T, 16 * T + 4, {}); B.decorPx('floorCrack', 44 * T, 17 * T, {});
      B.decorPx('hazard', 7 * T, 15 * T + 6, {}); B.decorPx('hazard', 41 * T, 18 * T + 2, {});
      B.decorPx('paintText', 18 * T, 17 * T + 4, { text: 'PASILLO OESTE' });
      for (i = 0; i < 4; i++) B.decorPx('bunnyScuff', (30 + i * 5) * T, 16 * T + (i % 2) * 24, { dir: 'r' });
      B.decorPx('doormat', 12 * T - 2, 15 * T + 3, { text: 'ALMACEN' }); B.decorPx('doormat', 32 * T - 2, 15 * T + 3, { text: 'BANOS' }); B.decorPx('doormat', 48 * T - 2, 15 * T + 3, { text: 'LIMPIEZA' });
      B.decorPx('doormat', 24 * T - 2, 18 * T + 3, { text: 'MAQUINAS' }); B.decorPx('doormat', 46 * T - 2, 18 * T + 3, { text: 'MAQUINAS' });
      B.decorPx('cobweb', 53 * T - 2, 15 * T, {});
      B.light(7 * T, 16 * T, 70, '#e8e4c0', { clip: HA }); B.light(24 * T, 16 * T, 56, '#cfeaff', { clip: HA, flick: 1 }); B.light(38 * T, 16 * T, 40, '#ff6a5a', { clip: HA, flick: 0.6 });
      B.light(50 * T, 16 * T, 44, '#8ad0a8', { clip: HA, flick: 0.8 });

      // ======================= PASILLO OESTE (tramo oeste) =======================
      B.prop('locker', 4, 22, {}); B.prop('locker', 4, 23, { v: 'b' }); B.prop('locker', 4, 24, {}); B.prop('bench', 7, 27, {}); B.prop('trashC', 4, 29, {});
      B.prop('mopBucket', 8, 23, {}); B.prop('wetsign', 6, 25, {}); B.prop('trashC', 8, 31, {}); B.prop('lampFloor', 8, 21, {});
      B.prop('tapePost', 4, 32, {}); B.prop('barrel', 8, 33, {}); B.prop('steamVent', 5, 27, {});
      B.decorPx('paintText', 5 * T, 20 * T + 4, { text: 'OESTE' }); B.decorPx('wetSheen', 5 * T, 24 * T, {}); B.decorPx('puddle', 6 * T, 29 * T + 4, {}); B.decorPx('puddle', 5 * T, 21 * T + 8, {});
      B.decorPx('floorCrack', 5 * T, 31 * T, {}); B.decorPx('stain', 7 * T, 24 * T + 8, {}); B.decorPx('hazard', 5 * T, 33 * T + 4, {});
      B.decorPx('bunnyScuff', 6 * T, 22 * T, { dir: 'd' }); B.decorPx('bunnyScuff', 6 * T + 4, 30 * T, { dir: 'd' }); B.decorPx('arrowFloor', 6 * T, 33 * T + 8, {});
      B.light(6 * T, 23 * T, 44, '#cfeaff', { clip: HS, flick: 1 }); B.light(6 * T, 31 * T, 40, '#ff6a5a', { clip: HS, flick: 0.5 });

      // ======================= PASILLO SUR =======================
      B.wall('fireExt', 9, 32, { ox: 4, oy: 2 }); B.wall('safetyBoard', 12, 32, { ox: 0, oy: 0 });
      B.prop('tubeLight', 16, 33, {}); B.wall('voltWarn', 24, 32, { ox: 0, oy: 4 }); B.wall('notice', 27, 32, { ox: 0, oy: 6 });
      B.prop('tubeDead', 34, 33, { oy: 4 }); B.wall('notice', 38, 32, { ox: 4, oy: 5 }); B.wall('evacMap', 40, 32, { ox: 0, oy: 2 }); B.wall('earsScratch', 47, 32, { ox: 0, oy: 0 });
      B.wall('wallClock4', 50, 32, { ox: 0, oy: 4 });
      B.prop('sodaMachine', 29, 35, {}); B.prop('bench', 36, 35, {}); B.prop('trashC', 31, 35, {}); B.prop('plant', 4, 35, {}); B.prop('lostCart', 6, 38, {});
      B.prop('wheelieBin', 22, 35, {}); B.prop('barrel', 52, 35, {}); B.prop('mopBucket', 48, 35, {}); B.prop('wetsign', 11, 36, { ox: 2 });
      B.prop('boxStack', 18, 38, {}); B.prop('barrel', 19, 38, {}); B.prop('tapePost', 44, 38, {}); B.prop('boxStack', 28, 38, {}); B.prop('trashC', 52, 38, {});
      B.decorPx('wetSheen', 10 * T, 35 * T + 8, {}); B.decorPx('wetSheen', 46 * T, 36 * T, {}); B.decorPx('puddle', 24 * T, 36 * T, {}); B.decorPx('puddle', 33 * T, 36 * T + 4, {});
      B.decorPx('stain', 20 * T, 35 * T + 6, {}); B.decorPx('floorCrack', 14 * T, 36 * T, {}); B.decorPx('floorCrack', 36 * T, 37 * T - 4, {}); B.decorPx('hazard', 24 * T, 37 * T + 4, {});
      B.decorPx('paintText', 20 * T, 36 * T + 4, { text: 'PASILLO SUR' }); B.decorPx('cobweb', 53 * T - 2, 34 * T, {});
      for (i = 0; i < 4; i++) B.decorPx('bunnyScuff', (6 + i * 6) * T, 35 * T + 8 + (i % 2) * 14, { dir: 'r' });
      B.decorPx('doormat', 20 * T - 2, 34 * T + 3, { text: 'MAQUINAS' }); B.decorPx('doormat', 44 * T - 2, 34 * T + 3, { text: 'MAQUINAS' });
      B.decorPx('doormat', 14 * T - 2, 37 * T + 3, { text: 'PERDIDOS' }); B.decorPx('doormat', 40 * T - 2, 37 * T + 3, { text: 'GUARDIA' });
      B.light(8 * T, 36 * T, 48, '#e8e4c0', { clip: HB, flick: 0.7 }); B.light(24 * T, 35 * T, 56, '#cfeaff', { clip: HB, flick: 1 }); B.light(46 * T, 36 * T, 40, '#ff6a5a', { clip: HB, flick: 0.5 });

      // ======================= ALMACÉN =======================
      B.wall('plate', 8, 1, { ox: 0, oy: 1, text: 'ALMACEN' }); B.wall('notice', 4, 1, { ox: 0, oy: 4 }); B.wall('safetyBoard', 17, 1, { ox: 4, oy: 0 });
      B.prop('padlockGate', 5, 4, { act: { id: 'closet', name: 'Almacén', zone: [-6, 36, 46, 34] } });
      B.prop('suppliesRack', 10, 4, { v: 'a' }); B.prop('suppliesRack', 14, 4, { v: 'b' }); B.prop('cageLamp', 13, 2, { ox: 0 });
      B.prop('palletStack', 6, 9, {}); B.prop('palletStack', 9, 9, {}); B.prop('boxStack', 5, 11, {}); B.prop('barrel', 4, 7, {}); B.prop('boxStack', 17, 8, {});
      B.prop('chemShelf', 20, 7, {}); B.prop('shelfBoxes', 20, 11, {}); B.prop('toolBench', 15, 11, {}); B.prop('ladder', 20, 3, { ox: 2 }); B.prop('wheelieBin', 8, 11, {});
      B.prop('barrel', 18, 11, {}); B.prop('tapePost', 11, 9, {}); B.prop('wetsign', 11, 7, {});
      B.decorPx('paintText', 6 * T, 5 * T + 6, { text: 'ALMACEN' }); B.decorPx('stain', 13 * T, 6 * T, {}); B.decorPx('stain', 7 * T, 8 * T + 8, {}); B.decorPx('floorCrack', 10 * T, 7 * T + 4, {});
      B.decorPx('puddle', 16 * T, 9 * T, {}); B.decorPx('hazard', 11 * T, 11 * T + 4, {}); B.decorPx('greaseStain', 14 * T, 7 * T, {}); B.decorPx('cobweb', 4 * T, 2 * T, {});
      B.decorPx('cobweb', 22 * T - 2, 2 * T, {}); B.decorPx('bunnyScuff', 12 * T, 10 * T, { dir: 'u' }); B.decorPx('bunnyScuff', 12 * T + 4, 8 * T + 4, { dir: 'u' });
      B.decorPx('doormat', 12 * T - 2, 10 * T + 3, { text: 'PASILLO' });
      B.light(11 * T, 7 * T, 56, '#ffcf80', { clip: ALM, flick: 0.7 }); B.light(5 * T, 5 * T, 36, '#ff6a5a', { clip: ALM, flick: 0.5 });

      // ======================= BAÑOS =======================
      B.prop('cageLamp', 25, 2, { ox: 0 }); B.prop('sinkRow', 26, 4, {});
      B.prop('toiletStall', 30, 4, { v: 'a' }); B.prop('toiletStall', 32, 4, { v: 'b' }); B.prop('toiletStall', 34, 4, { v: 'c' }); B.prop('toiletStall', 36, 4, { v: 'a' });
      B.prop('switchPanel', 38, 3, { ox: 8, act: { id: 'lamp', name: 'Interruptor', zone: [-4, 20, 32, 28] } });
      B.wall('restroomSign', 40, 1, { ox: 0, oy: 0, text: 'WC' });
      B.prop('trashC', 41, 11, {}); B.prop('mopBucket', 26, 11, {}); B.prop('wetsign', 28, 11, { ox: 2 }); B.prop('bench', 36, 11, {});
      B.prop('plant', 25, 8, {}); B.prop('wheelieBin', 38, 9, {}); B.prop('steamVent', 33, 8, {}); B.prop('tapePost', 29, 8, {});
      B.decorPx('wetSheen', 28 * T, 6 * T + 4, {}); B.decorPx('wetSheen', 36 * T, 7 * T + 4, {}); B.decorPx('puddle', 31 * T, 6 * T, {}); B.decorPx('puddle', 38 * T, 6 * T + 8, {});
      B.decorPx('puddle', 33 * T, 10 * T, {}); B.decorPx('stain', 27 * T, 9 * T, {}); B.decorPx('floorCrack', 30 * T, 8 * T + 6, {}); B.decorPx('hazard', 29 * T, 6 * T + 12, {});
      B.decorPx('cobweb', 41 * T + 2, 2 * T, {});
      B.decorPx('bunnyScuff', 31 * T, 10 * T, { dir: 'u' }); B.decorPx('bunnyScuff', 33 * T - 4, 7 * T, { dir: 'u' }); B.decorPx('bunnyScuff', 32 * T + 4, 5 * T + 4, { dir: 'u' });
      B.decorPx('doormat', 32 * T - 2, 10 * T + 3, { text: 'PASILLO' });
      B.light(33 * T, 7 * T, 62, '#bfe8ff', { clip: BAN, flick: 1 }); B.light(39 * T, 5 * T, 34, '#ffd060', { clip: BAN, flick: 0.6 });

      // ======================= CUARTO DE LIMPIEZA =======================
      B.prop('janitorSink', 46, 4, {}); B.prop('chemShelf', 49, 4, {}); B.prop('ladder', 53, 3, { ox: -6 }); B.prop('cageLamp', 48, 2, { ox: 0 });
      B.wall('handwash', 51, 1, { ox: 0, oy: 4 }); B.wall('notice', 45, 1, { ox: 0, oy: 4 });
      B.prop('suppliesRack', 50, 11, { v: 'b' }); B.prop('mopBucket', 45, 11, {}); B.prop('wheelieBin', 46, 8, {}); B.prop('barrel', 53, 8, { ox: -4 }); B.prop('boxStack', 46, 11, {});
      B.prop('trashC', 53, 6, {}); B.prop('wetsign', 49, 9, {}); B.prop('boxStack', 53, 11, { ox: -8 });
      B.decorPx('paintText', 46 * T, 7 * T + 4, { text: 'LIMPIEZA' }); B.decorPx('puddle', 49 * T, 6 * T + 6, {}); B.decorPx('puddle', 47 * T, 9 * T, {}); B.decorPx('wetSheen', 49 * T, 8 * T, {});
      B.decorPx('stain', 52 * T, 9 * T, {}); B.decorPx('floorCrack', 46 * T, 10 * T, {}); B.decorPx('cobweb', 45 * T, 2 * T, {}); B.decorPx('bunnyScuff', 48 * T, 9 * T + 4, { dir: 'u' });
      B.decorPx('doormat', 48 * T - 2, 10 * T + 3, { text: 'PASILLO' });
      B.light(49 * T, 7 * T, 48, '#9ae8b8', { clip: LIM, flick: 0.8 });

      // ======================= SALA DE MÁQUINAS =======================
      B.wall('plate', 30, 20, { ox: 0, oy: 1, text: 'SALA DE MAQUINAS' }); B.wall('gaugeWall', 19, 20, { ox: 8, oy: 4 });
      B.wall('valveWheel', 36, 20, { ox: 6, oy: 4 }); B.wall('voltWarn', 22, 20, { ox: 6, oy: 4 });
      B.wall('safetyBoard', 43, 20, { ox: 0, oy: 0 }); B.wall('earsScratch', 49, 20, { ox: 2, oy: 0 });
      B.wall('smokeWarn', 51, 20, { ox: 0, oy: 6 });
      B.prop('boiler', 14, 24, {}); B.prop('pipeRiser', 18, 23, {}); B.prop('genSet', 27, 23, {}); B.prop('pumpMotor', 32, 23, {}); B.prop('pipeRiser', 35, 23, {});
      B.prop('breakerBoard', 39, 23, { act: { id: 'breaker', name: 'Caja de breakers', zone: [-4, 40, 72, 36] } });
      
      B.prop('toolBench', 15, 31, {}); B.prop('ladder', 18, 31, {}); B.prop('boxStack', 24, 31, {}); B.prop('barrel', 26, 31, {}); B.prop('pumpMotor', 29, 31, {});
      B.prop('wheelieBin', 38, 31, {}); B.prop('barrel', 41, 31, {}); B.prop('boxStack', 50, 31, {}); B.prop('mopBucket', 52, 31, {});
      B.prop('steelTable', 26, 28, { v: 'a' }); B.prop('steamVent', 33, 28, {}); B.prop('steamVent', 49, 26, {}); B.prop('wetsign', 35, 27, {});
      B.prop('boxStack', 13, 28, {}); B.prop('barrel', 13, 29, {}); B.prop('locker', 53, 25, {}); B.prop('locker', 53, 26, { v: 'b' });
      B.decorPx('cables', 20 * T, 26 * T, {}); B.decorPx('cables', 36 * T, 29 * T, {}); B.decorPx('cables', 45 * T, 25 * T + 4, {});
      B.decorPx('floorGrate', 16 * T, 26 * T, {}); B.decorPx('floorGrate', 40 * T, 27 * T, {}); B.decorPx('greaseStain', 24 * T, 25 * T, {}); B.decorPx('greaseStain', 31 * T, 28 * T, {});
      B.decorPx('greaseStain', 47 * T, 28 * T + 4, {}); B.decorPx('puddle', 18 * T, 28 * T, {}); B.decorPx('puddle', 37 * T, 25 * T, {}); B.decorPx('puddle', 51 * T, 28 * T, {});
      B.decorPx('wetSheen', 30 * T, 26 * T, {}); B.decorPx('wetSheen', 44 * T, 29 * T, {}); B.decorPx('floorCrack', 22 * T, 29 * T, {}); B.decorPx('floorCrack', 48 * T, 24 * T, {});
      B.decorPx('hazard', 39 * T, 24 * T + 4, {}); B.decorPx('hazard', 39 * T, 25 * T + 8, {});
      B.decorPx('paintText', 15 * T, 27 * T + 8, { text: 'MAQUINAS' }); B.decorPx('partsFloor', 43 * T, 28 * T, {});
      for (i = 0; i < 5; i++) B.decorPx('bunnyScuff', (46 + (i % 3) * 2) * T, (21 + i) * T, { dir: 'd' });
      B.decorPx('doormat', 24 * T - 2, 22 * T + 3, { text: 'PASILLO' }); B.decorPx('doormat', 46 * T - 2, 22 * T + 3, { text: 'PASILLO' });
      B.decorPx('doormat', 20 * T - 2, 30 * T - 4, { text: 'PASILLO' }); B.decorPx('doormat', 44 * T - 2, 30 * T - 4, { text: 'PASILLO' });
      B.light(30 * T, 26 * T, 80, '#ff9a4a', { clip: MAQ, flick: 0.6 }); B.light(15 * T, 25 * T, 44, '#ff6a2a', { clip: MAQ, flick: 0.7 });
      B.light(50 * T, 27 * T, 44, '#ff4040', { clip: MAQ, flick: 0.5 });

      // ======================= OBJETOS PERDIDOS =======================
      B.wall('plate', 21, 39, { ox: 0, oy: 1, text: 'OBJETOS PERDIDOS' }); B.wall('notice', 11, 39, { ox: 0, oy: 6 }); B.wall('kidDraw', 12, 39, { ox: 4, oy: 4 });
      B.wall('earsScratch', 26, 39, { ox: 0, oy: 0 });
      B.prop('cubbyShelf', 17, 42, { v: 'b' }); B.prop('posterBoard', 8, 42, { act: { id: 'poster', name: 'Póster arrugado', zone: [-4, 34, 56, 34] } });
      B.prop('cageLamp', 16, 40, { ox: 0 }); B.prop('cubbyShelf', 4, 42, { v: 'a' });
      B.prop('lostCart', 21, 45, {}); B.prop('lostCart', 6, 49, {}); B.prop('plushPile', 24, 50, {}); B.prop('plushPile', 11, 50, {}); B.prop('sofa', 10, 47, {});
      B.prop('coffeeTbl', 14, 47, {}); B.prop('lampFloor', 13, 50, {}); B.prop('boxStack', 27, 45, { ox: -8 }); B.prop('locker', 27, 48, {}); B.prop('locker', 27, 49, { v: 'b' });
      B.prop('bench', 17, 49, {}); B.prop('trashC', 4, 45, {}); B.prop('plant', 20, 50, {}); B.prop('chairStack', 5, 47, {}); B.prop('barrel', 26, 50, {}); B.prop('boxStack', 22, 49, {});
      B.decorPx('rugO', 8 * T, 44 * T + 6, {}); B.decorPx('rugO', 17 * T, 46 * T, {}); B.decorPx('paintText', 8 * T, 43 * T + 4, { text: 'OBJETOS PERDIDOS' }); B.decorPx('confetti', 19 * T, 43 * T, {});
      B.decorPx('stain', 5 * T, 44 * T, {}); B.decorPx('puddle', 23 * T, 47 * T, {}); B.decorPx('floorCrack', 18 * T, 44 * T + 8, {}); B.decorPx('partsFloor', 13 * T, 44 * T, {});
      B.decorPx('cobweb', 4 * T, 40 * T + 2, {}); B.decorPx('cobweb', 28 * T - 2, 40 * T + 2, {}); B.decorPx('bunnyScuff', 14 * T, 42 * T, { dir: 'd' });
      B.decorPx('bunnyScuff', 15 * T - 4, 44 * T + 8, { dir: 'd' }); B.decorPx('bunnyScuff', 16 * T, 47 * T - 4, { dir: 'd' });
      B.decorPx('doormat', 14 * T - 2, 41 * T + 3, { text: 'PASILLO' });
      B.light(14 * T, 46 * T, 60, '#9a88e8', { clip: OBJ, flick: 0.7 }); B.light(22 * T, 44 * T, 40, '#ffd070', { clip: OBJ, flick: 0.9 });

      // ======================= SALA DE GUARDIA =======================
      B.wall('plate', 42, 39, { ox: 2, oy: 1, text: 'SALA DE GUARDIA' }); B.wall('corkboard', 47, 39, { ox: 0, oy: 4 }); B.wall('clock', 49, 39, { ox: 4, oy: 6 });
      B.wall('posterA', 50, 39, { ox: 6, oy: 2 }); B.wall('kidDraw', 36, 39, { ox: 4, oy: 4 });
      B.prop('guardDesk', 45, 47, {}); B.prop('camBank', 32, 41, {}); B.prop('cageLamp', 38, 40, { ox: 0 });
      B.prop('chairO', 47, 45, {}); B.prop('cot', 50, 50, {}); B.prop('locker', 32, 46, {}); B.prop('locker', 32, 47, { v: 'b' }); B.prop('locker', 32, 48, {});
      B.prop('fridge', 36, 45, {}); B.prop('coffee', 39, 45, {}); B.prop('bench', 43, 50, {}); B.prop('trashC', 53, 45, {}); B.prop('boxStack', 53, 50, { ox: -8 }); B.prop('barrel', 36, 50, {});
      B.prop('lampFloor', 53, 42, {}); B.prop('plant', 40, 50, {}); B.prop('sodaK', 48, 50, {});
      B.decorPx('rugO', 42 * T, 46 * T, {}); B.decorPx('spill', 40 * T, 47 * T, {}); B.decorPx('stain', 46 * T, 48 * T, {}); B.decorPx('puddle', 35 * T, 48 * T, {}); B.decorPx('floorCrack', 49 * T, 46 * T, {});
      B.decorPx('paintText', 42 * T, 43 * T + 4, { text: 'SALA DE GUARDIA' }); B.decorPx('cobweb', 53 * T - 2, 40 * T + 2, {}); B.decorPx('partsFloor', 34 * T, 44 * T, {});
      B.decorPx('bunnyScuff', 40 * T, 42 * T, { dir: 'd' }); B.decorPx('bunnyScuff', 41 * T - 4, 44 * T + 6, { dir: 'd' }); B.decorPx('bunnyScuff', 41 * T, 47 * T + 8, { dir: 'r' });
      B.decorPx('doormat', 40 * T - 2, 41 * T + 3, { text: 'PASILLO' });
      B.light(46 * T, 46 * T, 60, '#ffe08a', { clip: GUA, flick: 0.6 }); B.light(36 * T, 43 * T, 40, '#3fd479', { clip: GUA, flick: 0.8 });
    }
  };
})(window);
