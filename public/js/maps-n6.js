/* maps-n6.js — Noche 6, «La Trastienda»: el taller de repuestos de la pizzería.
   El Taller es la sala central. Al norte le dan la Sala de cabezas; al este, la Oficina de servicio (por un túnel);
   al oeste, un pasillo de servicio vertical (con el Vestidor) que baja y gira al sur; ese tramo sur lleva al Almacén de partes.
   Freddy acecha entre las cabezas que te miran. Coordenadas en baldosas de 16 px (ver maps.js). */
(function (G) {
  'use strict';
  var MAPS = G.MAPS = G.MAPS || {};

  MAPS.noche6 = {
    cols: 60, rows: 50,
    build: function (B) {
      var T = 16, i;
      // ---- zonas ----
      var HW = B.room('pasillo', 'Pasillo de servicio', 4, 3, 7, 36, 'h', { ambient: 0.55, color: '#7a90c0', hall: true });
      var HB = B.room('pasilloS', 'Pasillo de servicio', 8, 33, 55, 36, 'h', { ambient: 0.74, color: '#7a90c0', hall: true });
      var VES = B.room('vestidor', 'Vestidor de trajes', 11, 3, 24, 11, 'y', { ambient: 0.88, color: '#d070a0' });
      var CAB = B.room('cabezas', 'Sala de cabezas', 28, 3, 43, 11, 'q', { ambient: 0.84, color: '#d05a6a' });
      var TAL = B.room('taller', 'Taller', 11, 15, 38, 29, 'w', { ambient: 0.8, color: '#4ab0c8' });
      var OFI = B.room('oficina', 'Oficina de servicio', 42, 15, 55, 29, 'v', { ambient: 0.8, color: '#4adc8a' });
      var ALM = B.room('almacen', 'Almacén de partes', 12, 40, 38, 48, 'u', { ambient: 0.86, color: '#c89a50' });
      // ---- puertas ----
      B.door(8, 6, 10, 7); B.door(8, 21, 10, 22);                                        // pasillo -> vestidor y taller (túneles)
      B.door(39, 21, 41, 22);                                                            // taller -> oficina (túnel)
      B.door(34, 12, 35, 14);                                                            // taller -> sala de cabezas
      B.door(18, 30, 19, 32); B.door(30, 30, 31, 32);                                    // taller -> pasillo sur
      B.door(26, 37, 27, 39);                                                            // pasillo sur -> almacén
      B.start = [5 * T + 8, 5 * T + 8];
      B.spawn(52 * T + 8, 27 * T + 12); B.spawn(35 * T + 8, 45 * T + 12); B.spawn(41 * T + 8, 9 * T + 12); B.spawn(35 * T + 8, 25 * T + 12);

      // ======================= PASILLO DE SERVICIO (tramo oeste) =======================
      B.wall('plate', 4, 1, { ox: 8, oy: 1, text: 'SERVICIO' }); B.wall('plate', 8, 4, { ox: 4, oy: 1, text: 'VESTIDOR' });
      B.wall('plate', 8, 19, { ox: 8, oy: 1, text: 'TALLER' });
      B.prop('locker', 4, 12, {}); B.prop('barrel', 4, 16, {}); B.prop('trashC', 4, 26, {}); B.prop('cabinet', 4, 30, {});
      B.prop('lampFloor', 7, 10, {}); B.prop('stool', 7, 14, {}); B.prop('plant', 7, 17, { ox: -2 }); B.prop('boxStack', 7, 28, { ox: -8 }); B.prop('trashC', 7, 31, {});
      B.decorPx('paintText', 4 * T + 8, 3 * T + 4, { text: 'SERVICIO' }); B.decorPx('doormat', 5 * T, 6 * T + 3, { text: 'VESTIDOR' }); B.decorPx('doormat', 5 * T, 21 * T + 3, { text: 'TALLER' });
      B.decorPx('wetSheen', 4 * T, 12 * T, {}); B.decorPx('puddle', 5 * T, 18 * T, {}); B.decorPx('stain', 6 * T, 24 * T + 4, {}); B.decorPx('floorCrack', 5 * T, 27 * T, {});
      B.decorPx('hazard', 5 * T, 9 * T + 6, {}); B.decorPx('boltsFloor', 5 * T, 14 * T, {}); B.decorPx('sawdust', 4 * T + 2, 19 * T + 8, {}); B.decorPx('wireTangle', 4 * T + 6, 24 * T + 8, {});
      B.decorPx('arrowFloor', 5 * T, 11 * T + 4, {}); B.decorPx('cobweb', 4 * T, 3 * T, {}); B.decorPx('cobweb', 8 * T - 2, 3 * T, {});
      for (i = 0; i < 4; i++) B.decorPx('bearPrints', 5 * T + (i % 2) * 14, (13 + i * 3) * T, { dir: 'd' });
      B.light(5 * T, 5 * T, 70, '#e8e0b0', { clip: HW }); B.light(6 * T, 14 * T, 48, '#cfeaff', { clip: HW, flick: 1 }); B.light(6 * T, 25 * T, 44, '#ff6a5a', { clip: HW, flick: 0.5 });

      // ======================= PASILLO DE SERVICIO (tramo sur) =======================
      B.wall('plate', 8, 31, { ox: 4, oy: 1, text: 'SERVICIO' }); B.wall('fireExt', 14, 31, { ox: 4, oy: 6 }); B.wall('notice', 15, 31, { ox: 4, oy: 4 });
      B.wall('blueprintWall', 20, 31, { ox: 0, oy: 0 }); B.wall('wallClock4', 25, 31, { ox: 0, oy: 4 }); B.wall('evacMap', 26, 31, { ox: 8, oy: 2 });
      B.wall('voltWarn', 32, 31, { ox: 6, oy: 4 }); B.wall('wallClock4', 36, 31, { ox: 4, oy: 4 }); B.wall('toolWall', 40, 31, { ox: 0, oy: 0 });
      B.wall('safetyBoard', 47, 31, { ox: 6, oy: 0 }); B.wall('staffOnly', 52, 31, { ox: 4, oy: 0 });
      B.prop('trashC', 10, 34, {}); B.prop('partsCrate', 12, 34, {}); B.prop('cableReel', 23, 34, {}); B.prop('wheelieBin', 34, 34, {}); B.prop('boxStack', 38, 34, {});
      B.prop('toolBench', 44, 34, {}); B.prop('bench', 50, 34, {});
      B.prop('bench', 8, 37, {}); B.prop('barrel', 15, 37, {}); B.prop('boxStack', 17, 37, {}); B.prop('tapePost', 20, 37, {}); B.prop('trashC', 29, 37, {});
      B.prop('mopBucket', 32, 37, {}); B.prop('partsCrate', 36, 37, {}); B.prop('trashC', 41, 37, {}); B.prop('wheelieBin', 48, 37, {}); B.prop('bench', 52, 37, {});
      B.decorPx('paintText', 26 * T, 35 * T + 4, { text: 'SERVICIO' }); B.decorPx('sawdust', 17 * T, 35 * T, {}); B.decorPx('sawdust', 43 * T, 36 * T + 2, {});
      B.decorPx('wireTangle', 24 * T, 34 * T + 4, {}); B.decorPx('boltsFloor', 31 * T, 34 * T + 4, {}); B.decorPx('boltsFloor', 14 * T, 35 * T + 6, {});
      B.decorPx('stain', 35 * T, 35 * T + 4, {}); B.decorPx('stain', 54 * T - 4, 34 * T, {}); B.decorPx('greaseStain', 40 * T, 35 * T + 8, {}); B.decorPx('puddle', 11 * T, 35 * T + 6, {});
      B.decorPx('floorCrack', 28 * T, 34 * T, {}); B.decorPx('floorCrack', 46 * T, 35 * T + 4, {}); B.decorPx('hazard', 22 * T, 36 * T + 6, {});
      for (i = 0; i < 4; i++) B.decorPx('bearPrints', (9 + i * 4) * T, 35 * T + (i % 2) * 12, { dir: 'r' });
      B.decorPx('doormat', 18 * T - 2, 33 * T + 3, { text: 'TALLER' }); B.decorPx('doormat', 30 * T - 2, 33 * T + 3, { text: 'TALLER' }); B.decorPx('doormat', 26 * T - 2, 36 * T - 3, { text: 'ALMACEN' });
      B.decorPx('cobweb', 55 * T - 2, 33 * T, {});
      B.light(12 * T, 35 * T, 52, '#e8e0b0', { clip: HB, flick: 0.7 }); B.light(26 * T, 35 * T, 56, '#cfeaff', { clip: HB, flick: 1 }); B.light(40 * T, 35 * T, 44, '#ffb050', { clip: HB, flick: 0.6 });
      B.light(53 * T, 35 * T, 40, '#ff6a5a', { clip: HB, flick: 0.5 });

      // ======================= VESTIDOR DE TRAJES =======================
      B.wall('notice', 11, 1, { ox: 0, oy: 8 }); B.wall('posterA', 20, 1, { ox: 4, oy: 4 }); B.wall('mirrorFull', 23, 1, { ox: 0, oy: 0 });
      B.prop('suitRail', 12, 5, {}); B.prop('costumeRack', 18, 5, {}); B.prop('vanity', 22, 6, {});
      B.prop('suitStand', 13, 9, { v: 'f', ox: -2 }); B.prop('suitStand', 15, 9, { v: 'b', ox: -2 }); B.prop('suitStand', 17, 9, { v: 'c', ox: -2 });
      B.prop('sewingTable', 22, 11, {}); B.prop('sofa', 11, 11, {}); B.prop('plant', 11, 9, {}); B.prop('lampFloor', 20, 9, {}); B.prop('trashC', 21, 11, {});
      B.decorPx('rugO', 14 * T, 9 * T, {}); B.decorPx('paintText', 19 * T, 5 * T + 6, { text: 'TRAJES' }); B.decorPx('bearPrints', 18 * T, 10 * T + 4, { dir: 'u' });
      B.decorPx('wireTangle', 16 * T, 10 * T + 6, {}); B.decorPx('stain', 20 * T, 8 * T, {}); B.decorPx('floorCrack', 14 * T, 6 * T, {}); B.decorPx('boltsFloor', 19 * T, 9 * T + 6, {});
      B.decorPx('cobweb', 11 * T, 3 * T, {}); B.decorPx('cobweb', 25 * T - 2, 3 * T, {});
      B.light(17 * T, 7 * T, 56, '#e890b8', { clip: VES, flick: 0.7 }); B.light(23 * T, 11 * T, 30, '#ffd070', { clip: VES, flick: 0.9 });

      // ======================= SALA DE CABEZAS =======================
      B.wall('plate', 31, 1, { ox: 6, oy: 2, text: 'CABEZAS' }); B.wall('maskWall', 37, 1, { ox: 0, oy: 4 }); B.wall('posterA', 39, 1, { ox: 8, oy: 4 });
      B.prop('headRack', 28, 5, {}); B.prop('headRack', 34, 5, {}); B.prop('headRack', 41, 5, {});
      B.prop('spareHead', 31, 8, { v: 'freddy', act: { id: 'freddyHead', name: 'Cabeza de Freddy', zone: [-6, 30, 44, 34] } });
      B.prop('spareHead', 38, 8, { v: 'bonnie', act: { id: 'bonnieHead', name: 'Cabeza de Bonnie', zone: [-6, 30, 44, 34] } });
      B.prop('headShelf', 28, 11, {}); B.prop('earBin', 31, 11, {}); B.prop('eyeCrate', 41, 11, {});
      B.prop('stool', 35, 9, {}); B.prop('lampFloor', 43, 8, {}); B.prop('cabinet', 43, 11, {});
      B.decorPx('rugO', 29 * T + 8, 6 * T + 8, {}); B.decorPx('rugO', 36 * T + 8, 6 * T + 8, {}); B.decorPx('paintText', 37 * T, 10 * T + 4, { text: 'CABEZAS' });
      B.decorPx('wireTangle', 33 * T, 7 * T + 8, {}); B.decorPx('boltsFloor', 40 * T, 8 * T, {}); B.decorPx('stain', 41 * T, 9 * T + 8, {}); B.decorPx('floorCrack', 33 * T, 10 * T, {});
      B.decorPx('bearPrints', 33 * T, 11 * T - 8, { dir: 'u' }); B.decorPx('bearPrints', 34 * T, 8 * T + 6, { dir: 'u' });
      B.decorPx('cobweb', 44 * T - 2, 3 * T, {});
      B.decorPx('doormat', 34 * T - 2, 10 * T + 3, { text: 'TALLER' });
      B.light(34 * T, 7 * T, 64, '#e06a7a', { clip: CAB, flick: 0.6 }); B.light(42 * T, 6 * T, 40, '#ffb050', { clip: CAB, flick: 0.9 });

      // ======================= TALLER =======================
      B.wall('toolWall', 12, 13, { ox: 0, oy: 0 }); B.wall('wallClock4', 16, 13, { ox: 0, oy: 2 }); B.wall('notice', 18, 13, { ox: 2, oy: 6 }); B.wall('blueprintWall', 22, 13, { ox: 0, oy: 0 });
      B.wall('safetyBoard', 26, 13, { ox: 0, oy: 0 }); B.wall('plate', 30, 13, { ox: 0, oy: 2, text: 'TALLER' }); B.wall('wallClock4', 36, 13, { ox: 0, oy: 4 }); B.wall('fireExt', 38, 13, { ox: 4, oy: 6 });
      B.wall('plate', 39, 19, { ox: 6, oy: 1, text: 'OFICINA' });
      B.prop('repairBench', 12, 18, {}); B.prop('solderBench', 20, 18, {}); B.prop('steelTable', 26, 18, { v: 'a' }); B.prop('shelfBoxes', 37, 18, {});
      B.prop('endoHang', 17, 22, { act: { id: 'endo', name: 'Endoesqueleto', zone: [-6, 76, 60, 36] } });
      B.prop('spareHead', 31, 23, { v: 'foxy', act: { id: 'foxyHead', name: 'Cabeza de Foxy', zone: [-6, 30, 44, 34] } });
      B.prop('repairBench', 23, 26, {}); B.prop('stool', 22, 26, {}); B.prop('stool', 27, 26, {}); B.prop('endoCart', 13, 26, {}); B.prop('solderBench', 33, 27, {});
      B.prop('locker', 11, 30, {}); B.prop('locker', 12, 30, { v: 'b' }); B.prop('locker', 13, 30, {}); B.prop('toolBench', 14, 30, {}); B.prop('cableReel', 21, 30, {});
      B.prop('barrel', 24, 30, {}); B.prop('boxStack', 26, 30, {}); B.prop('cabinet', 28, 30, {}); B.prop('trashC', 29, 30, {}); B.prop('partsCrate', 33, 30, { v: 'b' });
      B.prop('wheelieBin', 35, 30, {}); B.prop('shelfBoxes', 37, 30, {});
      B.decorPx('sawdust', 15 * T, 20 * T, {}); B.decorPx('sawdust', 28 * T, 22 * T + 4, {}); B.decorPx('boltsFloor', 24 * T, 20 * T, {}); B.decorPx('boltsFloor', 19 * T, 27 * T + 4, {});
      B.decorPx('wireTangle', 14 * T, 23 * T, {}); B.decorPx('wireTangle', 30 * T, 26 * T + 4, {}); B.decorPx('greaseStain', 18 * T, 25 * T, {}); B.decorPx('greaseStain', 25 * T, 21 * T, {});
      B.decorPx('stain', 12 * T, 28 * T, {}); B.decorPx('floorCrack', 29 * T, 19 * T, {}); B.decorPx('partsFloor', 20 * T, 28 * T, {}); B.decorPx('hazard', 36 * T, 24 * T, {});
      B.decorPx('paintText', 12 * T, 23 * T + 8, { text: 'TALLER' }); B.decorPx('cables', 22 * T, 23 * T + 4, {});
      B.decorPx('bearPrints', 14 * T, 20 * T + 6, { dir: 'r' }); B.decorPx('bearPrints', 18 * T, 24 * T + 8, { dir: 'r' }); B.decorPx('bearPrints', 34 * T, 17 * T, { dir: 'u' });
      B.decorPx('cobweb', 11 * T, 15 * T, {}); B.decorPx('cobweb', 39 * T - 2, 15 * T, {});
      B.decorPx('doormat', 34 * T - 2, 15 * T + 3, { text: 'CABEZAS' }); B.decorPx('doormat', 18 * T - 2, 29 * T - 4, { text: 'PASILLO' }); B.decorPx('doormat', 30 * T - 2, 29 * T - 4, { text: 'PASILLO' });
      B.light(15 * T, 21 * T, 60, '#4ab0c8', { clip: TAL, flick: 0.8 }); B.light(26 * T, 22 * T, 64, '#ffb050', { clip: TAL, flick: 0.5 }); B.light(34 * T, 19 * T, 44, '#7ad8ff', { clip: TAL, flick: 1 });
      B.light(23 * T, 28 * T, 40, '#ffb050', { clip: TAL, flick: 0.7 });

      // ======================= OFICINA DE SERVICIO =======================
      B.wall('corkboard', 42, 13, { ox: 4, oy: 4 }); B.wall('plate', 44, 13, { ox: 4, oy: 2, text: 'OFICINA' }); B.wall('dutyBoard', 46, 13, { ox: 6, oy: 3 });
      B.wall('evacMap', 49, 13, { ox: 0, oy: 2 }); B.wall('wallClock4', 55, 13, { ox: -6, oy: 4 });
      B.prop('deskL', 44, 18, {}); B.prop('chairO', 46, 19, {}); B.prop('coffee', 49, 18, {});
      B.prop('serviceTerminal', 52, 18, { act: { id: 'terminal', name: 'Terminal', zone: [-6, 38, 60, 34] } });
      B.prop('lampFloor', 54, 22, {}); B.prop('staffTable', 47, 25, {}); B.prop('stool', 46, 26, {}); B.prop('stool', 51, 26, {});
      B.prop('chargerBank', 43, 30, {}); B.prop('plant', 47, 30, {}); B.prop('trashC', 48, 30, {});
      B.prop('cabinet', 50, 30, {}); B.prop('cabinet', 51, 30, {}); B.prop('cabinet', 52, 30, {}); B.prop('locker', 53, 30, {}); B.prop('locker', 54, 30, { v: 'b' }); B.prop('locker', 55, 30, {});
      B.prop('barrel', 55, 26, { ox: -4 }); B.prop('boxStack', 55, 24, { ox: -8 });
      B.decorPx('rugO', 44 * T, 21 * T + 8, {}); B.decorPx('rugO', 51 * T, 22 * T, {}); B.decorPx('paintText', 47 * T, 22 * T, { text: 'OFICINA' });
      B.decorPx('wireTangle', 43 * T, 25 * T, {}); B.decorPx('cables', 50 * T, 19 * T + 4, {}); B.decorPx('stain', 52 * T, 27 * T, {}); B.decorPx('stain', 43 * T, 18 * T, {});
      B.decorPx('floorCrack', 45 * T, 28 * T, {}); B.decorPx('boltsFloor', 53 * T, 28 * T, {}); B.decorPx('bearPrints', 49 * T, 21 * T, { dir: 'r' }); B.decorPx('bearPrints', 51 * T, 20 * T, { dir: 'u' });
      B.decorPx('cobweb', 42 * T, 15 * T, {}); B.decorPx('cobweb', 56 * T - 2, 15 * T, {});
      B.light(46 * T, 19 * T, 62, '#9ae8b8', { clip: OFI, flick: 0.8 }); B.light(52 * T, 21 * T, 52, '#3fe08a', { clip: OFI, flick: 0.5 }); B.light(47 * T, 27 * T, 40, '#ffd070', { clip: OFI, flick: 0.9 });

      // ======================= ALMACÉN DE PARTES =======================
      B.wall('notice', 12, 38, { ox: 0, oy: 8 }); B.wall('wallClock4', 16, 38, { ox: 5, oy: 6 }); B.wall('plate', 22, 38, { ox: 2, oy: 2, text: 'ALMACEN' });
      B.wall('notice', 28, 38, { ox: 1, oy: 8 }); B.wall('fireExt', 38, 38, { ox: 4, oy: 8 });
      B.prop('ladder', 33, 40, { ox: 5 });
      B.prop('partsShelf', 13, 42, {}); B.prop('partsShelf', 18, 42, {}); B.prop('partsShelf', 30, 42, {}); B.prop('partsShelf', 35, 42, {});
      B.prop('spareHead', 23, 45, { v: 'chica', act: { id: 'chicaHead', name: 'Cabeza de Chica', zone: [-6, 30, 44, 34] } });
      B.prop('partsPallet', 14, 48, {}); B.prop('partsCrate', 17, 47, {}); B.prop('partsCrate', 19, 48, { v: 'b' }); B.prop('barrel', 12, 44, {}); B.prop('boxStack', 12, 46, {});
      B.prop('limbBin', 29, 46, {}); B.prop('wheelieBin', 33, 45, {}); B.prop('partsCrate', 36, 48, {}); B.prop('partsPallet', 31, 48, {}); B.prop('cableReel', 26, 48, {});
      B.prop('lampFloor', 38, 44, {}); B.prop('cabinet', 38, 47, {});
      B.decorPx('hazard', 21 * T, 41 * T + 4, {}); B.decorPx('partsFloor', 20 * T, 45 * T, {}); B.decorPx('sawdust', 28 * T, 43 * T + 8, {}); B.decorPx('boltsFloor', 16 * T, 44 * T, {});
      B.decorPx('stain', 24 * T, 47 * T, {}); B.decorPx('cables', 31 * T, 44 * T, {}); B.decorPx('floorCrack', 34 * T, 47 * T + 6, {}); B.decorPx('paintText', 20 * T, 43 * T + 4, { text: 'ALMACEN' });
      B.decorPx('cobweb', 12 * T, 40 * T, {}); B.decorPx('cobweb', 39 * T - 2, 40 * T, {}); B.decorPx('bearPrints', 26 * T, 42 * T, { dir: 'd' }); B.decorPx('bearPrints', 27 * T, 45 * T, { dir: 'd' });
      B.decorPx('doormat', 26 * T - 2, 40 * T + 3, { text: 'PASILLO' });
      B.light(25 * T, 44 * T, 66, '#ffc060', { clip: ALM, flick: 0.8 }); B.light(14 * T, 47 * T, 36, '#ff8a3a', { clip: ALM, flick: 0.6 }); B.light(36 * T, 44 * T, 36, '#ffb050', { clip: ALM, flick: 0.9 });
    }
  };
})(window);
