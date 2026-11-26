/* maps-n3.js — Noche 3, «Pirate Cove»: un barco pirata varado. El puente de mando (popa), la cubierta y la cala de Foxy (proa)
   forman el casco; al norte está el camarote y al sur la bodega y el calabozo. Coordenadas en baldosas de 16 px (ver maps.js). */
(function (G) {
  'use strict';
  var MAPS = G.MAPS = G.MAPS || {};

  MAPS.noche3 = {
    cols: 64, rows: 46,
    build: function (B) {
      var T = 16, i;
      // ---- zonas (popa, cubierta y proa están abiertas entre sí y forman el casco) ----
      var PUE = B.room('puente', 'Puente de mando', 3, 17, 13, 23, 'T', { ambient: 0.72, color: '#d8a820', alwaysVisible: true });
      var CUB = B.room('cubierta', 'Cubierta', 14, 14, 46, 26, 'P', { ambient: 0.62, color: '#5a7aa8', alwaysVisible: true });
      var CAL = B.room('cala', 'Cala', 47, 14, 60, 25, 'N', { ambient: 0.74, color: '#a05cff', alwaysVisible: true });
      var CAM = B.room('camarote', 'Camarote', 22, 3, 34, 10, 'R', { ambient: 0.8, color: '#c4283c' });
      var BOD = B.room('bodega', 'Bodega', 14, 30, 27, 40, 'X', { ambient: 0.88, color: '#9a7a4a' });
      var CLB = B.room('calabozo', 'Calabozo', 32, 30, 45, 40, 'L', { ambient: 0.9, color: '#3fd4a0' });
      // ---- puertas ----
      B.door(27, 11, 28, 13);                               // cubierta -> camarote
      B.door(20, 27, 21, 29); B.door(38, 27, 39, 29);       // cubierta -> bodega y calabozo
      B.start = [22 * T, 20 * T + 12];
      B.spawn(48 * T + 8, 15 * T + 12); B.spawn(44 * T + 8, 31 * T + 12); B.spawn(15 * T + 8, 33 * T + 12); B.spawn(3 * T + 8, 20 * T + 12);

      // ======================= CUBIERTA =======================
      // borda del norte (la cara del casco)
      B.wall('cannonPort', 15, 12, { ox: 0, oy: 6 }); B.wall('cannonPort', 19, 12, { ox: 0, oy: 6 }); B.wall('lanternWall', 20, 12, { ox: 6, oy: 4 });
      B.wall('lifebuoy', 21, 12, { ox: 8, oy: 6 }); B.wall('woodSign', 23, 12, { ox: 6, oy: 5, text: 'CAMAROTE' });
      B.wall('jollyFlag', 29, 12, { ox: 0, oy: 4 }); B.wall('porthole', 30, 12, { ox: 14, oy: 4 }); B.wall('cannonPort', 34, 12, { ox: 8, oy: 6 });
      B.wall('lanternWall', 37, 12, { ox: 0, oy: 2 }); B.wall('ropeHang', 38, 12, { ox: 8, oy: 2 }); B.wall('cannonPort', 41, 12, { ox: 2, oy: 6 });
      B.wall('lifebuoy', 43, 12, { ox: 4, oy: 2 }); B.wall('lanternWall', 45, 12, { ox: 8, oy: 0 });
      B.decorPx('doormat', 27 * T - 2, 14 * T + 3, { text: 'CAMAROTE' });
      B.decorPx('doormat', 20 * T - 2, 26 * T + 3, { text: 'BODEGA' }); B.decorPx('doormat', 38 * T - 2, 26 * T + 3, { text: 'CALABOZO' });
      // suelo
      B.decorPx('hatch', 24 * T, 17 * T, {}); B.decorPx('netFloor', 30 * T, 24 * T, {}); B.decorPx('ropeFloor', 18 * T, 21 * T, {}); B.decorPx('ropeFloor', 42 * T, 17 * T + 4, {});
      B.decorPx('puddle', 27 * T, 18 * T, {}); B.decorPx('puddle', 20 * T, 18 * T + 8, {}); B.decorPx('puddle', 38 * T, 21 * T, {}); B.decorPx('puddle', 25 * T, 24 * T, {}); B.decorPx('stain', 17 * T, 19 * T, {}); B.decorPx('stain', 43 * T, 19 * T, {});
      B.decorPx('floorText', 20 * T, 22 * T + 4, { text: 'CUBIERTA' });
      B.decorPx('coins', 41 * T, 21 * T, {}); B.decorPx('coins', 22 * T, 15 * T, {});
      B.decorPx('clawPrints', 45 * T, 20 * T, { dir: 'l' }); B.decorPx('clawPrints', 39 * T, 19 * T + 6, { dir: 'l' }); B.decorPx('clawPrints', 33 * T, 21 * T + 4, { dir: 'l' });
      B.decorPx('clawPrints', 25 * T, 21 * T + 8, { dir: 'l' }); B.decorPx('clawPrints', 21 * T, 23 * T + 4, { dir: 'd' }); B.decorPx('clawPrints', 20 * T + 6, 25 * T, { dir: 'd' });
      // cañones y balas junto a las bordas
      B.prop('cannon', 16, 15, { v: 'r' }); B.prop('ballPile', 19, 15, { ox: 2 }); B.prop('cannon', 33, 15, { v: 'l' }); B.prop('ballPile', 36, 15, { ox: 2 });
      B.prop('cannon', 40, 15, { v: 'r' }); B.prop('ballPile', 43, 15, { ox: 2 });
      B.prop('barrelR', 44, 15, { ox: 4, v: 'a' }); B.prop('barrelR', 45, 15, { ox: 2, v: 'b' }); B.prop('crateN', 46, 15, { ox: -2, v: 'a' }); B.prop('crateN', 46, 15, { ox: -2, oy: -12, v: 'b', solid: false, sb: 240.5 });
      B.prop('cannon', 15, 27, { v: 'l' }); B.prop('barrelR', 18, 27, { ox: 0, v: 'c' }); B.prop('cannon', 42, 27, { v: 'l' });
      // mástil y cordaje
      B.prop('mast', 31, 21, { ox: -20 });
      B.prop('ropeCoil', 29, 22, { ox: 0 }); B.prop('ropeCoil', 35, 22, { ox: 0 }); B.prop('bollard', 45, 18, { ox: 0 }); B.prop('bollard', 45, 24, { ox: 0 });
      // carga y tarea: el garfio de Foxy
      B.prop('hookStand', 41, 24, { ox: 0, act: { id: 'hook', name: 'Garfio de Foxy', zone: [-8, 14, 48, 50] } });
      B.prop('anchor', 45, 27, { ox: 0 }); B.prop('capstan', 36, 22, { ox: -4 });
      B.prop('barrelR', 23, 27, { ox: 2, v: 'a' }); B.prop('crateN', 24, 27, { ox: 4, v: 'c' }); B.prop('crateN', 25, 27, { ox: 6, v: 'b' }); B.prop('crateN', 24, 27, { ox: 4, oy: -13, v: 'a', solid: false, sb: 432.5 });
      B.prop('barrelR', 29, 27, { ox: 2, v: 'c' }); B.prop('barrelR', 30, 27, { ox: 2, v: 'c' }); B.prop('barrelR', 33, 27, { ox: 0, v: 'a' });
      B.prop('crateN', 36, 27, { ox: 0, v: 'a' });
      // más carga en el centro de la cubierta
      B.prop('crateN', 25, 22, { ox: 2, v: 'a' }); B.prop('crateN', 26, 22, { ox: 4, v: 'c' }); B.prop('crateN', 25, 22, { ox: 2, oy: -13, v: 'b', solid: false, sb: 352.5 }); B.prop('barrelR', 27, 22, { ox: 8, v: 'a' });
      B.prop('barrelR', 37, 20, { ox: 0, v: 'b' }); B.prop('barrelR', 38, 20, { ox: 2, v: 'c' }); B.prop('ballPile', 29, 24, { ox: 2 });
      // faroles
      B.prop('lanternPost', 14, 17, { ox: 0 }); B.prop('lanternPost', 14, 25, { ox: 0 }); B.prop('lanternPost', 18, 19, { ox: 0 }); B.prop('lanternPost', 44, 21, { ox: 0 });
      B.prop('farol', 21, 20, { ox: 2 }); B.prop('farol', 35, 19, { ox: 2 }); B.prop('farol', 27, 25, { ox: 0, v: 'r' });
      B.light(21 * T, 17 * T, 66, '#b8d0ff', { clip: CUB }); B.light(40 * T, 21 * T, 66, '#b8d0ff', { clip: CUB });
      B.light(32 * T, 25 * T, 50, '#ffd890', { clip: CUB, flick: 0.4 });

      // ======================= PUENTE DE MANDO =======================
      B.wall('woodSign', 5, 15, { ox: 6, oy: 4, text: 'PUENTE DE MANDO' }); B.wall('lifebuoy', 10, 15, { ox: 2, oy: 6 });
      B.wall('porthole', 11, 15, { ox: 14, oy: 5 });
      B.decorPx('stepEdge', 13 * T + 8, 17 * T, {});
      B.decorPx('compassRose', 7 * T, 21 * T + 2, {}); B.decorPx('puddle', 10 * T, 18 * T, {}); B.decorPx('stain', 4 * T, 20 * T, {});
      B.decorPx('clawPrints', 11 * T, 22 * T, { dir: 'l' });
      B.prop('chartRack', 3, 18, { ox: 0 }); B.prop('bell', 12, 20, { ox: -2 });
      B.prop('wheel', 5, 21, { ox: -2, act: { id: 'wheel', name: 'Timón del barco', zone: [-8, 20, 68, 56] } });
      B.prop('binnacle', 9, 21, { ox: -3 }); B.prop('telescope', 12, 24, { ox: -4 }); B.prop('lanternPost', 3, 24, { ox: 0 });
      B.prop('ropeCoil', 5, 23, { ox: 0 }); B.prop('farol', 11, 19, { ox: 0, v: 'r' }); B.prop('barrelR', 10, 24, { ox: 0, v: 'b' });
      B.light(8 * T, 20 * T, 64, '#ffe0b0', { clip: PUE, flick: 0.3 });

      // ======================= LA CALA DE FOXY =======================
      B.wall('posterFoxy', 47, 12, { ox: 0, oy: 0 }); B.wall('woodSign', 57, 12, { ox: 4, oy: 4, text: 'LA CALA' });
      B.prop('coveStage', 50, 17, { ox: 0 });
      B.prop('outOrder', 52, 19, { ox: 0, act: { id: 'sign', name: 'Cartel «Fuera de servicio»', zone: [-8, 12, 64, 46] } });
      B.prop('torchStand', 49, 18, { ox: 0 }); B.prop('torchStand', 57, 18, { ox: 0 });
      B.prop('palm', 60, 17, { ox: -28 }); B.prop('palm', 60, 24, { ox: -28 });
      B.prop('goldHeap', 58, 20, { ox: 0 }); B.prop('goldHeap', 48, 20, { ox: 0 });
      B.prop('bollard', 47, 18, { ox: 0 }); B.prop('bollard', 47, 23, { ox: 0 });
      B.prop('lifeboat', 49, 25, { ox: 0 }); B.prop('rock', 59, 25, { ox: 0, v: 'a' }); B.prop('rock', 56, 25, { ox: 0, v: 'b' });
      B.prop('cannon', 57, 23, { v: 'l' }); B.prop('crab', 54, 24, { ox: 0 }); B.prop('crab', 51, 19, { ox: 0 });
      B.decorPx('poolWater', 53 * T, 21 * T + 4, {}); B.decorPx('seaweed', 52 * T + 4, 21 * T, {}); B.decorPx('seaweed', 58 * T, 22 * T + 8, {});
      B.decorPx('coins', 55 * T, 19 * T, {}); B.decorPx('bonesFloor', 59 * T, 22 * T, {}); B.decorPx('puddle', 49 * T, 18 * T + 8, {});
      B.decorPx('clawPrints', 53 * T, 17 * T + 8, { dir: 'd' }); B.decorPx('clawPrints', 55 * T, 19 * T + 4, { dir: 'd' }); B.decorPx('clawPrints', 50 * T, 19 * T + 8, { dir: 'l' }); B.decorPx('clawPrints', 48 * T, 20 * T + 8, { dir: 'l' });
      B.light(53 * T, 21 * T, 64, '#c48aff', { clip: CAL }); B.light(57 * T, 23 * T, 40, '#7ad8e8', { clip: CAL, flick: 0.4 });

      // ======================= CAMAROTE =======================
      B.wall('porthole', 25, 1, { ox: 0, oy: 6 }); B.wall('lanternWall', 30, 1, { ox: 6, oy: 8 }); B.wall('swordsX', 32, 1, { ox: 0, oy: 0 });
      B.decorPx('rugCabin', 24 * T + 4, 6 * T + 4, {}); B.decorPx('doormat', 27 * T - 2, 10 * T + 3, { text: 'CUBIERTA' });
      B.decorPx('coins', 33 * T, 5 * T + 8, {}); B.decorPx('clawPrints', 29 * T, 9 * T, { dir: 'u' }); B.decorPx('clawPrints', 27 * T + 4, 6 * T + 8, { dir: 'u' });
      B.prop('shelfShip', 22, 4, { ox: 0 }); B.prop('bedC', 27, 5, { ox: -2 }); B.prop('trunk', 31, 4, { ox: 0, v: 'a' }); B.prop('candelabra', 34, 4, { ox: 0 });
      B.prop('parrotPerch', 22, 7, { ox: 0 }); B.prop('globe', 25, 8, { ox: -4 }); B.prop('trunk', 22, 10, { ox: 0, v: 'b' }); B.prop('goldHeap', 24, 10, { ox: 4 });
      B.prop('chairP', 31, 7, { ox: -2 }); B.prop('mapTable', 30, 9, { ox: 0, act: { id: 'map', name: 'Mapa pirata', zone: [-8, 20, 84, 40] } });
      B.prop('farol', 34, 10, { ox: 0 }); B.prop('trunk', 33, 10, { ox: -12, v: 'a' });
      B.light(28 * T, 8 * T, 66, '#ffe0b0', { clip: CAM, flick: 0.3 });

      // ======================= BODEGA =======================
      B.wall('lanternWall', 19, 28, { ox: 1, oy: 6 }); B.wall('woodSign', 22, 28, { ox: 4, oy: 5, text: 'BODEGA' }); B.wall('netHang', 24, 28, { ox: 6, oy: 0 });
      B.decorPx('coins', 22 * T, 36 * T + 8, {}); B.decorPx('coins', 26 * T, 35 * T, {}); B.decorPx('netFloor', 15 * T, 37 * T, {}); B.decorPx('ropeFloor', 20 * T, 39 * T, {});
      B.decorPx('puddle', 19 * T, 34 * T, {}); B.decorPx('puddle', 17 * T, 38 * T + 8, {}); B.decorPx('puddle', 24 * T, 38 * T, {}); B.decorPx('stain', 16 * T, 33 * T, {}); B.decorPx('stain', 26 * T, 33 * T, {});
      B.decorPx('seaweed', 21 * T, 37 * T + 8, {}); B.decorPx('clawPrints', 20 * T, 31 * T, { dir: 'd' }); B.decorPx('clawPrints', 21 * T + 4, 33 * T, { dir: 'd' }); B.decorPx('clawPrints', 22 * T, 36 * T, { dir: 'r' });
      B.prop('barrelR', 14, 31, { ox: 0, v: 'a' }); B.prop('barrelR', 15, 31, { ox: 0, v: 'b' }); B.prop('barrelR', 16, 31, { ox: 0, v: 'a' });
      B.prop('barrelR', 14, 31, { ox: 0, oy: -9, v: 'a', solid: false, sb: 496.5 }); B.prop('barrelR', 15, 31, { ox: 0, oy: -9, v: 'c', solid: false, sb: 496.5 });
      B.prop('shelfN', 17, 31, { ox: 0 }); B.prop('oars', 14, 35, { ox: 0 }); B.prop('sackPile', 26, 31, { ox: 0, v: 'a' });
      B.prop('dripper', 19, 32, { ox: 0 }); B.prop('dripper', 24, 32, { ox: 4 });
      B.prop('treasureChest', 23, 35, { ox: 0, act: { id: 'chest', name: 'Cofre del tesoro', zone: [-8, 14, 68, 48] } });
      B.prop('crateN', 27, 34, { ox: 0, v: 'a' }); B.prop('crateN', 27, 35, { ox: 0, v: 'c' }); B.prop('crateN', 27, 34, { ox: 0, oy: -12, v: 'b', solid: false, sb: 544.5 });
      B.prop('ballPile', 14, 37, { ox: 2 }); B.prop('ballPile', 15, 37, { ox: 6 }); B.prop('sackPile', 14, 40, { ox: 0, v: 'b' }); B.prop('barrelR', 17, 41, { ox: 0, v: 'b' }); B.prop('barrelR', 18, 41, { ox: 0, v: 'a' });
      B.prop('crateN', 25, 41, { ox: 0, v: 'b' }); B.prop('crateN', 26, 41, { ox: 4, v: 'c' }); B.prop('anchor', 22, 41, { ox: 0 });
      B.prop('farol', 20, 35, { ox: 0 }); B.prop('farol', 17, 35, { ox: 0 }); B.prop('ropeCoil', 19, 40, { ox: 0 });
      B.light(20 * T, 33 * T, 70, '#ffd890', { clip: BOD, flick: 0.9 }); B.light(24 * T, 38 * T, 56, '#ffe08a', { clip: BOD, flick: 0.4 });
     

      // ======================= CALABOZO =======================
      B.wall('shackles', 35, 28, { ox: 6, oy: 0 }); B.wall('woodSign', 40, 28, { ox: 8, oy: 5, text: 'CALABOZO' }); B.wall('keyRack', 43, 28, { ox: 4, oy: 6 });
      B.decorPx('strawFloor', 33 * T, 32 * T + 8, {}); B.decorPx('strawFloor', 41 * T, 33 * T, {}); B.decorPx('strawFloor', 35 * T, 38 * T, {}); B.decorPx('chainFloor', 36 * T, 35 * T, {});
      B.decorPx('puddle', 38 * T, 32 * T, {}); B.decorPx('puddle', 42 * T, 38 * T, {}); B.decorPx('stain', 34 * T, 34 * T, {}); B.decorPx('stain', 44 * T, 35 * T, {});
      B.decorPx('bonesFloor', 40 * T, 36 * T, {}); B.decorPx('bonesFloor', 33 * T, 37 * T + 8, {}); B.decorPx('coins', 36 * T, 31 * T, {});
      B.decorPx('clawPrints', 38 * T, 31 * T, { dir: 'd' }); B.decorPx('clawPrints', 39 * T, 33 * T + 4, { dir: 'd' }); B.decorPx('clawPrints', 39 * T, 36 * T, { dir: 'r' });
      B.prop('cage', 33, 31, { ox: -3, v: 's' }); B.prop('cage', 42, 38, { ox: -3, v: 'e' });
      B.prop('tableGuard', 43, 35, { ox: -2 }); B.prop('chairP', 42, 35, { ox: 2 }); B.prop('skelSit', 45, 38, { ox: -8 });
      B.prop('torchStand', 33, 39, { ox: 0 }); B.prop('torchStand', 45, 33, { ox: 0 });
      B.prop('bench', 36, 38, { ox: -1 }); B.prop('barrelR', 32, 36, { ox: 0, v: 'b' }); B.prop('barrelR', 33, 36, { ox: 2, v: 'a' }); B.prop('skelSit', 32, 34, { ox: 0 });
      B.prop('dripper', 37, 32, { ox: 0 }); B.prop('dripper', 43, 32, { ox: 6 }); B.prop('cage', 40, 41, { ox: -3, v: 'f' }); B.prop('crateN', 45, 41, { ox: -3, v: 'a' }); B.prop('ballPile', 36, 41, { ox: 4 });
      B.light(36 * T, 36 * T, 60, '#9ad8c8', { clip: CLB, glow: '#2a7a6a', flick: 0.7 });
    }
  };
})(window);
