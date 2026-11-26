/* maps-n4.js — Noche 4, «La Cocina»: una cocina industrial a oscuras (solo se oye a Chica).
   Fila norte: despensa, lavado y cámara fría. Fila central: la cocina grande y el horno de pizza.
   Un pasillo de servicio las une con el comedor del personal y el vestidor de Chica al sur.
   Coordenadas en baldosas de 16 px (ver maps.js). */
(function (G) {
  'use strict';
  var MAPS = G.MAPS = G.MAPS || {};

  MAPS.noche4 = {
    cols: 58, rows: 46,
    build: function (B) {
      var T = 16, i;
      // ---- zonas (todas muy oscuras: la lámpara es imprescindible) ----
      var DES = B.room('despensa', 'Despensa', 4, 3, 17, 10, 'k', { ambient: 0.93, color: '#b08a4a' });
      var LAV = B.room('lavado', 'Lavado', 21, 3, 34, 10, 'U', { ambient: 0.93, color: '#3fb8b0' });
      var CAM = B.room('camara', 'Cámara fría', 39, 3, 53, 10, 'Z', { ambient: 0.95, color: '#7ad0ff' });
      var COC = B.room('cocina', 'Cocina', 4, 14, 34, 25, 'J', { ambient: 0.93, color: '#c8d0d0' });
      var HOR = B.room('horno', 'Horno de pizza', 39, 14, 53, 25, 'O', { ambient: 0.93, color: '#ff8030' });
      var PAS = B.room('pasillo', 'Pasillo de servicio', 4, 29, 53, 32, 'C', { ambient: 0.9, color: '#8a8aa0', hall: true });
      var COM = B.room('comedor', 'Comedor trasero', 4, 36, 26, 43, 'I', { ambient: 0.93, color: '#c8a43c' });
      var VES = B.room('vestidor', 'Vestidor', 31, 36, 53, 43, 'Y', { ambient: 0.94, color: '#e8b830' });
      // ---- puertas ----
      B.door(10, 11, 11, 13); B.door(27, 11, 28, 13); B.door(46, 11, 47, 13);            // fila norte -> cocina y horno
      B.door(12, 26, 13, 28); B.door(28, 26, 29, 28); B.door(46, 26, 47, 28);            // cocina y horno -> pasillo
      B.door(14, 33, 15, 35); B.door(41, 33, 42, 35);                                    // pasillo -> comedor y vestidor
      B.start = [8 * T + 8, 31 * T + 12];
      B.spawn(32 * T + 8, 17 * T + 12); B.spawn(51 * T + 8, 17 * T + 12); B.spawn(52 * T + 8, 40 * T + 12); B.spawn(15 * T + 8, 6 * T + 12);

      // ======================= COCINA =======================
      // pared norte: cocinas, mesones y equipo (la altura de cada objeto decide qué decoración se ve encima)
      B.prop('steelTable', 4, 16, { v: 'a' }); B.wall('panWall', 4, 12, { ox: 2, oy: 4 });
      B.prop('counterK', 8, 15, { ox: -1 }); B.wall('plate', 8, 12, { ox: 0, oy: 4, text: 'COCINA' });
      B.prop('grillTop', 12, 15, { ox: 0, act: { id: 'pan', name: 'Sartén', zone: [-8, 30, 68, 42] } });
      B.prop('tiltKettle', 15, 15, { ox: -1 }); B.prop('mixerK', 17, 15, { ox: -1 });
      B.prop('steelPot', 19, 15, { ox: 0, act: { id: 'pot', name: 'Olla', zone: [-8, 26, 52, 46] } });
      B.prop('steelTable', 21, 16, { v: 'c' }); B.wall('ticketRail', 21, 12, { ox: 4, oy: 3 });
      B.prop('cageLamp', 24, 14, { ox: 2 });
      B.prop('veggieCrate', 25, 15, { ox: 0, v: 'a' }); B.wall('ductGrille', 25, 12, { ox: 0, oy: 3 });
      B.prop('stoveBank', 29, 15, { ox: 0 }); B.prop('fryer', 33, 15, { ox: 0 }); B.wall('wallClock4', 33, 12, { ox: 5, oy: 2 });
      // isla central con campana
      B.prop('stoveBank', 11, 20, { ox: 0 }); B.prop('extractor', 11, 18, { ox: 13, oy: -8, solid: false, sb: 900 });
      B.prop('steelTable', 17, 21, { v: 'b' }); B.prop('steelTable', 23, 21, { v: 'a' });
      B.prop('pizzaRack', 28, 21, { ox: 0 }); B.prop('platesCart', 5, 22, { ox: 0 }); B.prop('wheelieBin', 5, 25, { ox: 0 });
      B.prop('veggieCrate', 33, 21, { ox: 0, v: 'b' }); B.prop('platesCart', 31, 24, { ox: 0 }); B.prop('trashC', 34, 25, { ox: 0 });
      B.prop('mopBucket', 8, 25, { ox: 0 }); B.prop('wetsign', 9, 25, { ox: 0 }); B.prop('steamVent', 22, 24, { ox: 0 });
      // suelo
      B.decorPx('kitchenMat', 4 * T + 2, 17 * T, {}); B.decorPx('kitchenMat', 29 * T, 16 * T + 4, {}); B.decorPx('floorGrate', 19 * T, 23 * T, {});
      B.decorPx('greaseStain', 14 * T, 17 * T, {}); B.decorPx('greaseStain', 26 * T, 24 * T, {}); B.decorPx('greaseStain', 8 * T, 21 * T + 4, {}); B.decorPx('stain', 32 * T, 19 * T, {});
      B.decorPx('brokenPlate', 15 * T, 22 * T + 6, {}); B.decorPx('brokenPlate', 27 * T, 17 * T, {}); B.decorPx('flourSpill', 21 * T, 18 * T, {}); B.decorPx('soapPuddle', 30 * T, 22 * T, {});
      B.decorPx('puddle', 7 * T, 24 * T, {}); B.decorPx('puddle', 17 * T, 24 * T + 4, {});
      B.decorPx('sauceSteps', 31 * T, 17 * T, { dir: 'l' }); B.decorPx('sauceSteps', 24 * T, 16 * T + 4, { dir: 'l' }); B.decorPx('sauceSteps', 12 * T, 23 * T, { dir: 'd' }); B.decorPx('sauceSteps', 28 * T + 4, 23 * T + 8, { dir: 'd' });
      B.decorPx('floorText', 24 * T, 24 * T + 8, { text: 'COCINA' });
      B.decorPx('doormat', 10 * T - 2, 14 * T + 3, { text: 'DESPENSA' }); B.decorPx('doormat', 27 * T - 2, 14 * T + 3, { text: 'LAVADO' });
      B.decorPx('doormat', 12 * T - 2, 25 * T + 3, { text: 'PASILLO' }); B.decorPx('doormat', 28 * T - 2, 25 * T + 3, { text: 'PASILLO' });
      B.light(20 * T, 22 * T, 54, '#4a6a66', { clip: COC }); B.light(8 * T, 20 * T, 40, '#ffb060', { clip: COC, flick: 0.7 });
      B.light(32 * T, 22 * T, 40, '#ff3b4a', { clip: COC, flick: 0.5 });

      // ======================= HORNO DE PIZZA =======================
      B.prop('pizzaOven', 39, 15, { ox: 0, act: { id: 'oven', name: 'Horno', zone: [-8, 50, 90, 48] } });
      B.prop('counterK', 44, 15, { ox: 0 }); B.wall('plate', 44, 12, { ox: 2, oy: 4, text: 'HORNO' });
      B.prop('doughShelf', 48, 15, { ox: 0 });
      B.prop('steelTable', 50, 16, { v: 'c' }); B.wall('ovenTools', 50, 12, { ox: 0, oy: -1 }); B.wall('smokeWarn', 52, 12, { ox: 2, oy: 6 });
      B.prop('steelTable', 40, 21, { v: 'b' }); B.prop('pizzaRack', 44, 21, { ox: 0 }); B.prop('steelTable', 49, 21, { v: 'a' });
      B.prop('flourSacks', 50, 25, { ox: 0 }); B.prop('wheelieBin', 53, 25, { ox: -4 }); B.prop('boxStack', 39, 25, { ox: 0 }); B.prop('pizzaBoxes', 41, 25, { ox: 0 });
      B.prop('barrel', 43, 25, { ox: 0 }); B.prop('trashC', 44, 25, { ox: 0 }); B.prop('steamVent', 44, 24, { ox: 6 }); B.prop('mopBucket', 49, 25, { ox: 0 });
      B.prop('cageLamp', 45, 14, { ox: 8 });
      B.decorPx('greaseStain', 44 * T, 18 * T, {}); B.decorPx('greaseStain', 51 * T, 23 * T, {}); B.decorPx('flourSpill', 40 * T, 23 * T, {}); B.decorPx('flourSpill', 48 * T, 16 * T + 4, {});
      B.decorPx('brokenPlate', 43 * T, 23 * T, {}); B.decorPx('brokenPlate', 52 * T, 20 * T, {}); B.decorPx('stain', 41 * T, 18 * T + 8, {}); B.decorPx('stain', 50 * T, 19 * T, {});
      B.decorPx('sauceSteps', 45 * T, 20 * T + 8, { dir: 'u' }); B.decorPx('sauceSteps', 46 * T, 23 * T, { dir: 'u' }); B.decorPx('sauceSteps', 47 * T, 17 * T + 8, { dir: 'u' });
      B.decorPx('puddle', 49 * T, 24 * T, {}); B.decorPx('cobweb', 53 * T - 2, 14 * T, {});
      B.decorPx('floorText', 41 * T, 18 * T + 4, { text: 'HORNO' });
      B.decorPx('doormat', 46 * T - 2, 14 * T + 3, { text: 'CAMARA' }); B.decorPx('doormat', 46 * T - 2, 25 * T + 3, { text: 'PASILLO' });
      B.light(46 * T, 21 * T, 56, '#ff9a50', { clip: HOR, flick: 0.6 });

      // ======================= CÁMARA FRÍA =======================
      B.prop('frostShelf', 39, 4, { ox: 0 }); B.wall('coldSign', 41, 1, { ox: -8, oy: 8 });
      B.prop('walkIn', 43, 5, { ox: 0, act: { id: 'fridge', name: 'Refrigerador', zone: [-8, 56, 68, 46] } });
      B.prop('steelTable', 46, 5, { v: 'b' }); B.wall('ductGrille', 46, 1, { ox: 4, oy: 2 }); B.prop('cageLamp', 49, 3, { ox: 2 });
      B.prop('iceMachine', 50, 4, { ox: 0 }); B.prop('frostShelf', 52, 4, { ox: 0 });
      B.prop('frostShelf', 40, 11, { ox: 0 }); B.prop('frostShelf', 42, 11, { ox: 0 }); B.prop('boxStack', 44, 11, { ox: 0 });
      B.prop('boxStack', 49, 11, { ox: 0 }); B.prop('frostShelf', 51, 11, { ox: 0 }); B.prop('boxStack', 53, 11, { ox: 0 });
      B.prop('steelTable', 49, 9, { v: 'c' }); B.prop('pizzaBoxes', 40, 8, { ox: 0 }); B.prop('pizzaBoxes', 41, 8, { ox: 4 }); B.prop('leakBucket', 42, 4, { ox: 2 });
      B.prop('boxStack', 40, 6, { ox: 0 }); B.prop('steamVent', 45, 9, { ox: 0 });
      B.decorPx('frostPatch', 42 * T, 7 * T, {}); B.decorPx('frostPatch', 48 * T, 6 * T, {}); B.decorPx('frostPatch', 44 * T, 9 * T, {}); B.decorPx('frostPatch', 51 * T, 9 * T, {});
      B.decorPx('puddle', 51 * T, 8 * T, {}); B.decorPx('brokenPlate', 41 * T, 9 * T + 4, {}); B.decorPx('sauceSteps', 46 * T + 4, 9 * T, { dir: 'u' });
      B.decorPx('floorText', 43 * T, 7 * T + 8, { text: 'CAMARA FRIA' }); B.decorPx('doormat', 46 * T - 2, 10 * T + 3, { text: 'HORNO' });
      B.light(44 * T, 7 * T, 78, '#6ac8ff', { clip: CAM, glow: '#1a4a7a', flick: 0.5 });

      // ======================= DESPENSA =======================
      B.prop('canShelf', 4, 4, { v: 'a' }); B.prop('canShelf', 6, 4, { v: 'b' }); B.prop('canShelf', 8, 4, { v: 'a' }); B.prop('cageLamp', 10, 3, { ox: 8 });
      B.prop('canShelf', 12, 4, { v: 'b' }); B.prop('boxStack', 14, 4, { ox: 0 }); B.prop('barrel', 15, 4, { ox: 0 }); B.prop('flourSacks', 16, 4, { ox: 0 });
      B.wall('plate', 14, 1, { ox: 4, oy: 1, text: 'DESPENSA' }); B.wall('notice', 5, 1, { ox: 0, oy: 0 });
      B.prop('canShelf', 5, 8, { v: 'a' }); B.prop('canShelf', 7, 8, { v: 'b' }); B.prop('canShelf', 13, 8, { v: 'a' }); B.prop('canShelf', 15, 8, { v: 'b' });
      B.prop('barrel', 4, 11, { ox: 0 }); B.prop('barrel', 5, 11, { ox: 0 }); B.prop('veggieCrate', 6, 11, { v: 'a' }); B.prop('boxStack', 8, 11, { ox: 0 });
      B.prop('barrel', 13, 11, { ox: 0 }); B.prop('mopBucket', 14, 11, { ox: 0 }); B.prop('pizzaBoxes', 15, 11, { ox: 0 }); B.prop('boxStack', 16, 11, { ox: 0 }); B.prop('trashC', 17, 11, { ox: 0 });
      B.decorPx('cobweb', 4 * T, 2 * T, {}); B.decorPx('cobweb', 17 * T - 2, 2 * T, {}); B.decorPx('stain', 9 * T, 6 * T, {}); B.decorPx('puddle', 12 * T, 9 * T, {}); B.decorPx('flourSpill', 15 * T, 6 * T, {});
      B.decorPx('brokenPlate', 6 * T, 9 * T, {}); B.decorPx('greaseStain', 5 * T, 6 * T, {}); B.decorPx('sauceSteps', 11 * T, 7 * T + 8, { dir: 'u' }); B.decorPx('sauceSteps', 10 * T + 4, 9 * T, { dir: 'u' });
      B.decorPx('floorText', 9 * T + 8, 6 * T + 8, { text: 'DESPENSA' }); B.decorPx('doormat', 10 * T - 2, 10 * T + 3, { text: 'COCINA' }); B.decorPx('rubberMat', 8 * T, 9 * T + 4, {});
      B.light(11 * T, 6 * T, 50, '#ffcf80', { clip: DES, flick: 0.9 });

      // ======================= LAVADO =======================
      B.prop('steelTable', 21, 5, { v: 'a' }); B.wall('steamPipe', 21, 1, { ox: 0, oy: 4 });
      B.prop('steelTable', 25, 5, { v: 'b' }); B.wall('knifeStrip', 25, 1, { ox: 0, oy: 4 }); B.prop('cageLamp', 28, 3, { ox: 0 });
      B.prop('counterK', 29, 4, { ox: 0 }); B.wall('handwash', 29, 1, { ox: 2, oy: 4 }); B.prop('trashC', 31, 4, { ox: 0 }); B.wall('plate', 32, 1, { ox: 0, oy: 4, text: 'LAVADO' });
      B.prop('potSink', 21, 11, { ox: 0 }); B.prop('dishMachine', 24, 11, { ox: 0 }); B.prop('potSink', 29, 11, { ox: 0 }); B.prop('platesCart', 32, 11, { ox: 0 }); B.prop('trashC', 34, 11, { ox: 0 });
      B.prop('mopBucket', 33, 8, { ox: 0 }); B.prop('wetsign', 26, 8, { ox: 0 }); B.prop('steamVent', 30, 8, { ox: 0 }); B.prop('wheelieBin', 34, 6, { ox: -2 });
      B.decorPx('floorGrate', 23 * T, 8 * T, {}); B.decorPx('soapPuddle', 25 * T, 6 * T + 8, {}); B.decorPx('soapPuddle', 31 * T, 7 * T, {}); B.decorPx('soapPuddle', 29 * T, 9 * T + 4, {});
      B.decorPx('puddle', 22 * T, 7 * T, {}); B.decorPx('brokenPlate', 27 * T, 6 * T, {}); B.decorPx('brokenPlate', 21 * T + 4, 8 * T + 8, {}); B.decorPx('stain', 32 * T, 9 * T, {});
      B.decorPx('sauceSteps', 27 * T + 4, 8 * T, { dir: 'u' }); B.decorPx('sauceSteps', 27 * T + 4, 6 * T + 4, { dir: 'l' }); B.decorPx('floorText', 23 * T, 6 * T, { text: 'LAVADO' });
      B.decorPx('doormat', 27 * T - 2, 10 * T + 3, { text: 'COCINA' });
      B.light(27 * T, 7 * T, 60, '#4ad8c8', { clip: LAV, glow: '#1a6a64', flick: 0.4 });

      // ======================= PASILLO DE SERVICIO =======================
      B.wall('plate', 5, 27, { ox: 0, oy: 1, text: 'PASILLO DE SERVICIO' }); B.wall('fireExt', 10, 27, { ox: 4, oy: 2 });
      B.wall('steamPipe', 14, 27, { ox: 0, oy: 6 }); B.wall('vent', 19, 27, { ox: 0, oy: 6 }); B.wall('notice', 21, 27, { ox: 2, oy: 6 });
      B.wall('specialsBoard', 23, 27, { ox: 0, oy: 1 }); B.wall('handwash', 26, 27, { ox: 0, oy: 4 });
      B.wall('kidDraw', 31, 27, { ox: 0, oy: 6 }); B.wall('ductGrille', 33, 27, { ox: 0, oy: 4 }); B.wall('wallClock4', 36, 27, { ox: 0, oy: 4 }); B.wall('smokeWarn', 38, 27, { ox: 0, oy: 6 });
      B.wall('chicaPoster', 41, 27, { ox: 0, oy: 0 }); B.wall('exitSign', 44, 27, { ox: 0, oy: 4 }); B.wall('fireExt', 49, 27, { ox: 2, oy: 2 }); B.wall('notice', 51, 27, { ox: 0, oy: 6 });
      B.prop('boxStack', 5, 30, { ox: 0 }); B.prop('barrel', 7, 30, { ox: 0 }); B.prop('mopBucket', 9, 30, { ox: 0 }); B.prop('trashC', 15, 30, { ox: 0 });
      B.prop('bench', 18, 30, { ox: 0 }); B.prop('wheelieBin', 16, 30, { ox: 0 }); B.prop('boxStack', 32, 30, { ox: 0 }); B.prop('veggieCrate', 34, 30, { ox: 0, v: 'a' });
      B.prop('pizzaBoxes', 38, 30, { ox: 0 }); B.prop('trashC', 40, 30, { ox: 0 }); B.prop('barrel', 44, 30, { ox: 0 }); B.prop('boxStack', 50, 30, { ox: 0 }); B.prop('barrel', 52, 30, { ox: 0 });
      B.prop('wetsign', 20, 32, { ox: 0 }); B.prop('wetsign', 36, 32, { ox: 0 }); B.prop('steamVent', 26, 32, { ox: 0 }); B.prop('steamVent', 48, 32, { ox: 0 });
      B.prop('cageLamp', 11, 29, { ox: 4 }); B.prop('cageLamp', 17, 29, { ox: 8 }); B.prop('cageLamp', 30, 29, { ox: 0 }); B.prop('cageLamp', 47, 29, { ox: 12 });
      B.decorPx('floorText', 24 * T, 31 * T, { text: 'PASILLO' }); B.decorPx('arrowFloor', 16 * T, 30 * T + 8, {}); B.decorPx('arrowFloor', 36 * T, 30 * T + 8, {});
      B.decorPx('puddle', 11 * T, 31 * T, {}); B.decorPx('puddle', 33 * T, 31 * T + 4, {}); B.decorPx('stain', 20 * T, 29 * T + 8, {}); B.decorPx('greaseStain', 39 * T, 31 * T, {});
      B.decorPx('brokenPlate', 27 * T, 31 * T, {}); B.decorPx('brokenPlate', 45 * T, 31 * T + 4, {}); B.decorPx('soapPuddle', 6 * T, 31 * T, {});
      for (i = 0; i < 6; i++) B.decorPx('sauceSteps', (8 + i * 7) * T, 31 * T + 2 + (i % 2) * 4, { dir: 'r' });
      B.decorPx('doormat', 12 * T - 2, 29 * T + 3, { text: 'COCINA' }); B.decorPx('doormat', 28 * T - 2, 29 * T + 3, { text: 'COCINA' }); B.decorPx('doormat', 46 * T - 2, 29 * T + 3, { text: 'HORNO' });
      B.decorPx('doormat', 14 * T - 2, 32 * T + 3, { text: 'COMEDOR' }); B.decorPx('doormat', 41 * T - 2, 32 * T + 3, { text: 'VESTIDOR' });
      B.light(8 * T, 30 * T, 70, '#ff7a5a', { clip: PAS, flick: 0.5 }); B.light(24 * T, 31 * T, 44, '#7a8aa8', { clip: PAS, flick: 0.8 }); B.light(40 * T, 31 * T, 44, '#7a8aa8', { clip: PAS });

      // ======================= COMEDOR TRASERO =======================
      B.prop('sodaK', 4, 37, { ox: 0 }); B.prop('fridge', 6, 37, { ox: 0 }); B.prop('counterK', 8, 37, { ox: 0 }); B.prop('coffee', 10, 37, { ox: 0 });
      B.wall('corkboard', 10, 34, { ox: 0, oy: 4 }); B.wall('clock', 12, 34, { ox: 0, oy: 6 });
      B.prop('locker', 16, 37, { ox: 0, v: 'b' }); B.prop('locker', 17, 37, { ox: 0 }); B.prop('locker', 18, 37, { ox: 0, v: 'b' }); B.prop('locker', 19, 37, { ox: 0 });
      B.prop('bench', 21, 37, { ox: 0 }); B.wall('plate', 21, 34, { ox: 0, oy: 4, text: 'COMEDOR' }); B.wall('kidDraw', 24, 34, { ox: 0, oy: 4 }); B.wall('chicaPoster', 25, 34, { ox: 4, oy: -4 });
      B.prop('staffTable', 6, 41, { v: 'a' }); B.prop('staffTable', 13, 41, { v: 'b' }); B.prop('staffTable', 20, 41, { v: 'a' });
      B.prop('stool', 5, 41, { ox: 0 }); B.prop('stool', 10, 41, { ox: 0 }); B.prop('stool', 12, 41, { ox: 0 }); B.prop('stool', 17, 41, { ox: 0 }); B.prop('stool', 19, 41, { ox: 0 }); B.prop('stool', 24, 41, { ox: 0 });
      B.prop('trashC', 4, 44, { ox: 0 }); B.prop('wheelieBin', 25, 44, { ox: 0 }); B.prop('boxStack', 22, 44, { ox: 0 }); B.prop('plant', 8, 44, { ox: 0 }); B.prop('cageLamp', 13, 35, { ox: 4 });
      B.decorPx('rugO', 12 * T, 38 * T - 4, {}); B.decorPx('spill', 8 * T, 39 * T, {}); B.decorPx('brokenPlate', 18 * T, 39 * T + 4, {}); B.decorPx('brokenPlate', 11 * T, 43 * T, {});
      B.decorPx('stain', 21 * T, 39 * T, {}); B.decorPx('puddle', 5 * T, 39 * T + 8, {}); B.decorPx('greaseStain', 23 * T, 43 * T, {}); B.decorPx('flourSpill', 15 * T, 43 * T, {});
      B.decorPx('sauceSteps', 15 * T + 4, 37 * T, { dir: 'd' }); B.decorPx('sauceSteps', 16 * T, 39 * T + 4, { dir: 'r' }); B.decorPx('sauceSteps', 22 * T, 39 * T + 8, { dir: 'r' });
      B.decorPx('floorText', 8 * T, 36 * T + 8, { text: 'COMEDOR' }); B.decorPx('doormat', 14 * T - 2, 36 * T + 3, { text: 'PASILLO' });
      B.light(13 * T, 40 * T, 54, '#ffd070', { clip: COM, flick: 0.8 }); B.light(5 * T, 37 * T, 34, '#ff7a8a', { clip: COM, flick: 0.9 });

      // ======================= VESTIDOR DE CHICA =======================
      B.prop('rackC', 31, 37, { ox: 0, v: 'a' }); B.prop('rackC', 33, 37, { ox: 0, v: 'b' }); B.prop('vanityC', 35, 37, { ox: 0 });
      B.prop('sofa', 38, 37, { ox: 0 }); B.wall('plate', 38, 34, { ox: 8, oy: 1, text: 'VESTIDOR' });
      B.prop('rackC', 43, 37, { ox: 0, v: 'a' }); B.wall('mirrorFull', 45, 34, { ox: 0, oy: 0 }); B.wall('posterA', 48, 34, { ox: 0, oy: 2 }); B.wall('kidDraw', 50, 34, { ox: 0, oy: 4 }); B.wall('diploma', 52, 34, { ox: 0, oy: 4 });
      B.prop('bench', 45, 37, { ox: 0 }); B.prop('bench', 49, 37, { ox: 0 });
      B.prop('bibStand', 46, 41, { ox: -6, act: { id: 'bib', name: 'Babero de Chica', zone: [-12, 34, 52, 38] } });
      B.prop('rackC', 50, 42, { ox: 0, v: 'b' }); B.prop('sofa', 32, 42, { ox: 0 }); B.prop('coffeeTbl', 36, 42, { ox: 0 }); B.prop('lampFloor', 31, 44, { ox: 0 });
      B.prop('boxStack', 33, 44, { ox: 0 }); B.prop('barrel', 38, 44, { ox: 0 }); B.prop('trashC', 52, 44, { ox: 0 }); B.prop('stool', 40, 41, { ox: 0 }); B.prop('stool', 43, 43, { ox: 0 });
      B.prop('cageLamp', 41, 35, { ox: -6 });
      B.decorPx('rugO', 36 * T, 39 * T, {}); B.decorPx('partsFloor', 41 * T, 41 * T + 4, {}); B.decorPx('partsFloor', 48 * T, 38 * T, {}); B.decorPx('stain', 33 * T, 40 * T, {}); B.decorPx('puddle', 52 * T, 40 * T, {});
      B.decorPx('brokenPlate', 44 * T, 40 * T + 8, {}); B.decorPx('brokenPlate', 38 * T, 43 * T, {}); B.decorPx('greaseStain', 47 * T, 43 * T, {}); B.decorPx('flourSpill', 34 * T, 41 * T, {});
      B.decorPx('sauceSteps', 41 * T + 4, 37 * T, { dir: 'd' }); B.decorPx('sauceSteps', 42 * T, 39 * T + 4, { dir: 'd' }); B.decorPx('sauceSteps', 44 * T, 41 * T + 4, { dir: 'r' });
      B.decorPx('floorText', 44 * T, 38 * T + 4, { text: 'VESTIDOR' }); B.decorPx('doormat', 41 * T - 2, 36 * T + 3, { text: 'PASILLO' });
      B.light(42 * T, 40 * T, 60, '#ffe08a', { clip: VES, flick: 0.7 }); B.light(37 * T, 38 * T, 40, '#ffc880', { clip: VES, flick: 0.6 });
    }
  };
})(window);
