/* levels.js — contenido de la actividad: noches, objetos con pistas y preguntas.
   Tema: criterios de congruencia de triángulos (LLL, LAL, ALA, AAL, HC). Cada pregunta muestra dos triángulos
   (dibujados por tri.js) y pide el criterio que aplica. La respuesta se guarda como código numérico (1–5)
   para que sirvan todos los widgets de inputs.js; fmt() lo muestra como nombre del criterio. */
(function (G) {
  'use strict';

  /* ---------- Criterios ---------- */
  var CODE = { LLL: 1, LAL: 2, ALA: 3, AAL: 4, HC: 5 }, NAME = ['', 'LLL', 'LAL', 'ALA', 'AAL', 'HC'];
  var FULL = { LLL: 'Lado-Lado-Lado', LAL: 'Lado-Ángulo-Lado', ALA: 'Ángulo-Lado-Ángulo', AAL: 'Ángulo-Ángulo-Lado', HC: 'Hipotenusa-Cateto' };
  var EXPL = {
    LLL: 'Los tres lados son iguales: <b>LLL</b>.',
    LAL: 'Dos lados iguales y el ángulo ENTRE ellos: <b>LAL</b>.',
    ALA: 'Dos ángulos iguales y el lado ENTRE ellos: <b>ALA</b>.',
    AAL: 'Dos ángulos iguales y un lado que NO está entre ellos: <b>AAL</b>.',
    HC: 'Triángulos rectángulos con la hipotenusa y un cateto iguales: <b>HC</b>.'
  };
  var HINT = {
    LLL: 'Cuenta las rayitas: ¿están marcados los tres lados?',
    LAL: 'Mira dónde está el arco: ¿queda ENTRE los dos lados marcados?',
    ALA: 'Hay dos arcos. ¿El lado marcado queda ENTRE esos dos ángulos?',
    AAL: 'Hay dos arcos. ¿El lado marcado queda FUERA de esos dos ángulos?',
    HC: 'Busca el cuadradito del ángulo recto. La hipotenusa es el lado opuesto a él.'
  };
  function fmt(n) { return NAME[n] || (n < 0 ? '−' + (-n) : String(n)); }

  var PAIRS = [['ABC', 'DEF'], ['PQR', 'XYZ'], ['MNO', 'STU'], ['GHI', 'JKL']], seed = 11;
  function figure(kind, vals) { seed += 7; return TRI.pair(kind, { seed: seed, vals: vals, names: PAIRS[seed % PAIRS.length] }); }

  /* Un par de triángulos → pregunta. o: { type, vals } */
  function crit(kind, o) {
    o = o || {};
    var tri = figure(kind, o.vals);
    return {
      type: o.type || 'choice', crit: true, kind: kind, seed: seed, answer: CODE[kind], opts: [1, 2, 3, 4, 5], tri: tri,
      q: '¿Qué criterio muestra que los triángulos son congruentes?' + '', hint: HINT[kind], expl: EXPL[kind]
    };
  }
  /* El intruso: 4 pares, tres usan `main` y uno usa `other` (la respuesta es el criterio del intruso). */
  function critOdd(main, other) {
    seed += 31; var s0 = seed, idx = s0 % 4;
    return {
      type: 'number', crit: true, kind: main, odd: { main: main, other: other, idx: idx, seeds: [s0 + 1, s0 + 2, s0 + 3, s0 + 4] }, answer: CODE[other], opts: [1, 2, 3, 4, 5],
      q: '¿Cuál de los 4 pares NO usa el mismo criterio que los otros tres?', hint: 'Tres pares usan ' + main + '. Busca el que tenga marcas distintas.',
      expl: 'Los otros tres usan <b>' + main + '</b>; el intruso usa <b>' + other + '</b>.'
    };
  }
  /* Varios pares en una sola pregunta (un campo por par). */
  function critMulti(kinds, o) {
    o = o || {};
    return {
      type: 'multi', crit: true, tri: kinds.map(function (k) { return figure(k, o.vals); }),
      fields: kinds.map(function (k, i) { return { crit: true, label: 'Par ' + 'ABC'[i], answer: CODE[k], expl: 'Par ' + 'ABC'[i] + ': ' + EXPL[k], hint: 'Par ' + 'ABC'[i] + ': ' + HINT[k] }; }),
      q: '¿Qué criterio aplica en cada par?' + '',
      expl: kinds.map(function (k, i) { return 'Par ' + 'ABC'[i] + ': ' + EXPL[k]; }).join('<br>'), hint: HINT[kinds[0]]
    };
  }

  /* ---------- Intro (cinemática) ---------- */
  var INTRO = [
    { scene: 'exterior', lines: [
      { w: 'sys', t: '1987. Freddy Fazbear’s Pizza.' },
      { w: 'sys', t: 'El lugar más feliz del mundo… de día.' } ] },
    { scene: 'eyes', lines: [
      { w: 'sys', t: 'De noche, los animatrónicos se ponen RAROS.' },
      { w: 'sys', t: 'Caminan. Te miran. Y no hay quien los detenga.' } ] },
    { scene: 'office', lines: [
      { w: 'mike', t: 'Soy Mike, el nuevo guardia nocturno. ¿Qué podría salir mal?' },
      { w: 'phone', t: 'Cada animatrónico se bloquea con dos triángulos. Tienes que decir si son CONGRUENTES y por qué.' },
      { w: 'phone', t: 'Usa los CRITERIOS DE CONGRUENCIA: LLL, LAL, ALA, AAL y HC. ¡Sobrevive 7 noches!' } ] }
  ];

  var WRONG = ['¡Ups! Revisa el manual.', 'Casi… ¡intenta otra vez!', 'Hmm, ¡no es ese criterio!', '¡Cuidado! Algo se mueve…', 'Mira bien las marcas…'];
  var RIGHT = ['¡Correcto!', '¡Exacto!', '¡Bien, guardia!', '¡Pista conseguida!', '¡Así se hace!'];

  /* ---------- Noches ---------- */
  var LEVELS = [
    /* ===== NOCHE 1 (modo exploración: pasillo y cuartos) ===== */
    { n: 1, sub: 'El Pasillo', topic: 'Conoce los 5 criterios', scene: 'office', explore: 'noche1', enemy: 'freddy', manual: 6,
      howto: [
        ['eye', 'Muévete con <b>WASD</b> (o las flechas).'],
        ['lamp', 'Prende o apaga la lámpara con <b>F</b>. Apunta con el <b>mouse</b>. Gasta <b>batería</b>: apágala para recargarla.'],
        ['skull', 'Si el animatrónico está cerca, apúntale y presiona <b>Q</b>: el destello lo hace retroceder.'],
        ['star', 'Acércate a un objeto y presiona <b>E</b> para completar tu tarea.'],
        ['bolt', 'Cada error gasta <b>energía</b> y Freddy se acerca. ¡La luz lo detiene!'] ],
      intro: [
        { w: 'phone', t: '¡Hola, hola! Aquí tu amigo del teléfono.' },
        { w: 'phone', t: 'Dos triángulos son congruentes si tienen la misma forma y el mismo tamaño.' },
        { w: 'phone', t: 'No hay que medirlo todo. Hay 5 criterios: LLL, LAL, ALA, AAL y HC. Están en tu manual (M).' },
        { w: 'phone', t: 'En los dibujos, las rayitas marcan lados iguales y los arcos marcan ángulos iguales.' },
        { w: 'phone', t: 'Esta noche tienes 5 tareas. Cada una te muestra dos triángulos: ¿qué criterio aplica?' },
        { w: 'phone', t: 'Camina con WASD y prende la lámpara con F. Presiona E en los objetos.' },
        { w: 'phone', t: 'Cada tarea te da un objeto. Quizá lo necesites en otra tarea.' } ],
      outro: 'Freddy se aleja por el pasillo… por ahora.',
      spots: [
        { id: 'phone', needs: 'cable', name: 'Teléfono', icon: 'phone', task: 'Contesta el teléfono', room: 'Oficina de seguridad', title: 'MENSAJE GRABADO', flavor: 'RING RING… el teléfono muestra dos triángulos.',
          q: crit('AAL') },
        { id: 'monitor', input: 'overlay', dark: true, needs: 'llave', gives: ['tarjeta', 'Tarjeta de seguridad', 'card'], name: 'Computadora', icon: 'eye', task: 'Encuentra la computadora', room: 'Oficina del gerente', title: 'COMPUTADORA', flavor: 'La pantalla compara dos planos.',
          q: crit('ALA') },
        { id: 'poster', input: 'detective', gives: ['llave', 'Llave del gerente', 'key'], name: 'Póster de fiesta', icon: 'book', task: 'Lee el póster', room: 'Sala de fiestas', title: 'NOTA OCULTA', flavor: 'Detrás del póster hay dos triángulos dibujados.',
          q: crit('LLL') },
        { id: 'cupcake', gives: ['cable', 'Cable del teléfono', 'cable'], name: 'Pastelito de Chica', icon: 'star', task: 'Busca el pastelito', room: 'Cocina', title: 'PASTELITO', flavor: 'El pastelito trae un papel con dos triángulos.',
          q: crit('LAL') },
        { id: 'panel', input: 'slots', needs: 'tarjeta', name: 'Panel de la puerta', icon: 'lock', task: 'Abre el panel', room: 'Oficina de seguridad', final: true, title: 'PANEL DE LA PUERTA', flavor: 'Pide el criterio de cada par.',
          q: critMulti(["HC", "LLL"]) }
      ] },

    /* ===== NOCHE 2 (modo exploración: escenario, comedor y cabinas) ===== */
    { n: 2, sub: 'El Escenario', topic: 'LLL y LAL: los lados', scene: 'stage', explore: 'noche2', enemy: 'bonnie', manual: 7,
      intro: [
        { w: 'phone', t: 'Noche 2. El lugar de Bonnie en el escenario está vacío…' },
        { w: 'phone', t: 'Recorre el comedor y las cabinas. Tus 5 tareas están en la lista.' },
        { w: 'phone', t: 'Hoy repasa LLL y LAL. En LLL van tres lados. En LAL, dos lados y el ángulo ENTRE ellos.' },
        { w: 'phone', t: 'Camina con WASD, prende la lámpara con F y presiona E en los objetos.' },
        { w: 'phone', t: 'Ojo: desde hoy la batería dura menos. Si dejas la lámpara prendida mucho rato, Bonnie te encuentra más rápido. Con Q lanzas un destello.' } ],
      outro: 'Bonnie regresa al escenario, confundido.',
      spots: [
        { id: 'guitar', input: 'cards', needs: 'afina', name: 'Guitarra de Bonnie', icon: 'star', task: 'Encuentra la guitarra', room: 'Escenario', title: 'GUITARRA', flavor: 'La guitarra tiene dos triángulos pegados.',
          q: crit('LLL') },
        { id: 'mic', input: 'odd', gives: ['fusible', 'Fusible', 'fuse'], name: 'Micrófono de Freddy', icon: 'spk', task: 'Busca el micrófono', room: 'Escenario', title: 'MICRÓFONO', flavor: '¡El micrófono tiene un dibujo!',
          q: critOdd('LLL', 'LAL') },
        { id: 'cake', input: 'dial', gives: ['afina', 'Llave de afinación', 'key'], name: 'Pastel de Chica', icon: 'star', task: 'Revisa el pastel', room: 'Comedor', title: 'PASTEL', flavor: 'El pastel esconde otro papel.',
          q: crit('LLL', { type: 'number' }) },
        { id: 'lights', input: 'detective', dark: true, needs: 'fusible', gives: ['llaveC', 'Llave de la consola', 'key'], name: 'Luces del escenario', icon: 'bolt', task: 'Ajusta las luces', room: 'Cabina de luces', title: 'LUCES', flavor: 'Las luces proyectan dos triángulos.',
          q: crit('LAL') },
        { id: 'control', input: 'dial', needs: 'llaveC', name: 'Consola de control', icon: 'lock', task: 'Usa la consola', room: 'Cabina de control', final: true, title: 'CONSOLA', flavor: 'Falta el criterio final del show.',
          q: critMulti(["LAL", "LLL"]) }
      ] },

    /* ===== NOCHE 3 (modo exploración: barco pirata y la cala de Foxy) ===== */
    { n: 3, sub: 'Pirate Cove', topic: 'ALA y AAL: los ángulos', scene: 'cove', explore: 'noche3', enemy: 'foxy', manual: 7,
      intro: [
        { w: 'phone', t: 'Noche 3. Foxy odia que lo miren… ¡y es rapidísimo!' },
        { w: 'phone', t: 'Recorre el barco y la cala. Tus 5 tareas están en la lista.' },
        { w: 'phone', t: 'Hoy: ALA y AAL. Los dos llevan dos ángulos. ¿El lado queda ENTRE ellos (ALA) o FUERA (AAL)?' },
        { w: 'phone', t: 'Si lo oyes correr, ¡alúmbralo con la lámpara (F)!' } ],
      outro: 'Foxy se esconde otra vez tras la cortina.',
      spots: [
        { id: 'hook', input: 'overlay', gives: ['llaveC', 'Llave del cofre', 'key'], name: 'Garfio de Foxy', icon: 'skull', task: 'Encuentra el garfio', room: 'Cubierta', title: 'GARFIO', flavor: 'El garfio tiene dos triángulos grabados.',
          q: crit('ALA', { type: 'number' }) },
        { id: 'sign', input: 'catch', gives: ['brujula', 'Brújula', 'compass'], name: 'Cartel', icon: 'book', task: 'Lee el cartel', room: 'Cala', title: 'CARTEL', flavor: '“Fuera de servicio”… y un dibujo detrás.',
          q: crit('AAL') },
        { id: 'chest', input: 'odd', dark: true, needs: 'llaveC', name: 'Cofre del tesoro', icon: 'lock', task: 'Abre el cofre', room: 'Bodega', title: 'COFRE', flavor: 'El cofre tiene un candado con dibujos.',
          q: critOdd('ALA', 'AAL') },
        { id: 'map', input: 'dial', needs: 'brujula', gives: ['timon', 'Manija del timón', 'wheel'], name: 'Mapa pirata', icon: 'eye', task: 'Revisa el mapa', room: 'Camarote', title: 'MAPA', flavor: 'El mapa marca dos triángulos.',
          q: crit('AAL', { type: 'number' }) },
        { id: 'wheel', input: 'catch', needs: 'timon', name: 'Timón del barco', icon: 'star', task: 'Gira el timón', room: 'Puente de mando', final: true, title: 'TIMÓN', flavor: 'El timón gira. Se ven dos triángulos.',
          q: crit('ALA', { type: 'number', vals: true }) }
      ] },

    /* ===== NOCHE 4 ===== */
    { n: 4, sub: 'La Cocina', topic: 'HC: triángulos rectángulos', scene: 'kitchen', explore: 'noche4', enemy: 'chica', manual: 7,
      intro: [
        { w: 'phone', t: 'Noche 4. Chica anda por la cocina. Allí solo se oye… no se ve.' },
        { w: 'phone', t: 'Todo está a oscuras. Camina con cuidado y usa la lámpara (F).' },
        { w: 'phone', t: 'Hoy: HC. Solo sirve con triángulos RECTÁNGULOS: hipotenusa y un cateto iguales.' },
        { w: 'phone', t: 'Si oyes ollas golpear, ¡ella está cerca!' } ],
      outro: 'Chica deja de golpear las ollas. Silencio…',
      spots: [
        { id: 'pot', input: 'padK', gives: ['fosforos', 'Fósforos', 'match'], name: 'Olla', icon: 'spk', task: 'Busca la olla', room: 'Cocina', title: 'OLLA', flavor: '¡CLANG! Algo se dibuja en la olla.',
          q: crit('HC', { type: 'number' }) },
        { id: 'pan', input: 'detective', needs: 'espatula', name: 'Sartén', icon: 'spk', task: 'Revisa la sartén', room: 'Cocina', title: 'SARTÉN', flavor: 'La sartén chisporrotea sobre un plano.',
          q: crit('HC') },
        { id: 'oven', dark: true, input: 'slots', needs: 'fosforos', gives: ['llaveF', 'Llave de la cámara fría', 'key'], name: 'Horno', icon: 'bolt', task: 'Abre el horno', room: 'Horno de pizza', title: 'HORNO', flavor: 'El horno guarda un dibujo.',
          q: crit('HC', { type: 'number' }) },
        { id: 'bib', input: 'overlay', dark: true, gives: ['espatula', 'Espátula', 'spatula'], name: 'Babero de Chica', icon: 'book', task: 'Encuentra el babero', room: 'Vestidor', title: 'BABERO', flavor: 'El babero trae un dibujo bordado.',
          q: crit('ALA', { type: 'number' }) },
        { id: 'fridge', input: 'padK', needs: 'llaveF', name: 'Refrigerador', icon: 'lock', task: 'Abre el refrigerador', room: 'Cámara fría', final: true, title: 'REFRIGERADOR', flavor: 'Tiene un candado de formas.',
          q: crit('HC', { type: 'number', vals: true }) }
      ] },

    /* ===== NOCHE 5 ===== */
    { n: 5, sub: 'Pasillo Oeste', topic: 'Con medidas (cm y °)', scene: 'hall', explore: 'noche5', enemy: 'bonnie', manual: 7,
      intro: [
        { w: 'phone', t: 'Noche 5. Bonnie anda por el pasillo oeste.' },
        { w: 'phone', t: 'Recorre el pasillo y sus cuartos. Las luces parpadean: usa la lámpara (F).' },
        { w: 'phone', t: 'Hoy los dibujos traen medidas en cm y grados, no rayitas.' },
        { w: 'phone', t: 'Compara los números de los dos triángulos y decide el criterio.' } ],
      outro: 'Las luces se estabilizan. Bonnie desaparece.',
      spots: [
        { id: 'sign', input: 'levers', gives: ['llaveA', 'Llave del almacén', 'key'], name: 'Piso mojado', icon: 'skull', task: 'Lee el letrero', room: 'Pasillo Oeste', title: 'PISO MOJADO', flavor: 'El letrero tiene un dibujo con medidas.',
          q: crit('LAL', { type: 'number', vals: true }) },
        { id: 'closet', input: 'cards', needs: 'llaveA', gives: ['foco', 'Foco nuevo', 'bulb'], name: 'Almacén', icon: 'lock', task: 'Abre el almacén', room: 'Almacén', title: 'ALMACÉN', flavor: 'La puerta tiene un candado de formas.',
          q: crit('ALA', { type: 'number', vals: true }) },
        { id: 'poster', dark: true, input: 'pipes', gives: ['fusible', 'Fusible', 'fuse'], name: 'Póster arrugado', icon: 'book', task: 'Revisa el póster', room: 'Objetos perdidos', title: 'PÓSTER', flavor: 'Un póster arrugado… con medidas.',
          q: crit('AAL', { type: 'number', vals: true }) },
        { id: 'lamp', input: 'odd', dark: true, needs: 'foco', name: 'Interruptor', icon: 'bolt', task: 'Prende el interruptor', room: 'Baños', title: 'INTERRUPTOR', flavor: 'Hay un dibujo pegado al interruptor.',
          q: critOdd('LLL', 'HC') },
        { id: 'breaker', input: 'pipes', needs: 'fusible', name: 'Caja de breakers', icon: 'lock', task: 'Usa los breakers', room: 'Sala de máquinas', final: true, title: 'BREAKERS', flavor: 'Falta el criterio final.',
          q: crit('LLL', { type: 'number', vals: true }) }
      ] },

    /* ===== NOCHE 6 ===== */
    { n: 6, sub: 'La Trastienda', topic: 'Todos los criterios', scene: 'backstage', explore: 'noche6', enemy: 'freddy', manual: 7,
      intro: [
        { w: 'phone', t: 'Noche 6. Freddy ronda la trastienda.' },
        { w: 'phone', t: 'Recorre el taller y sus cuartos. Las cabezas de repuesto te siguen con la mirada.' },
        { w: 'phone', t: 'Hoy se mezclan los cinco criterios. Algunos pares traen rayitas y otros, medidas.' },
        { w: 'phone', t: 'Recuerda: AAA y LLA NO bastan para decir que dos triángulos son congruentes.' } ],
      outro: 'Las cabezas cierran los ojos. Freddy retrocede.',
      spots: [
        { id: 'freddyHead', input: 'overlay', gives: ['destor', 'Destornillador', 'screwdriver'], name: 'Cabeza de Freddy', icon: 'eye', task: 'Cabeza de Freddy', room: 'Sala de cabezas', title: 'CABEZA DE FREDDY', flavor: 'Freddy te sigue con la mirada.',
          q: crit('LLL', { type: 'number' }) },
        { id: 'bonnieHead', input: 'detective', gives: ['bateria', 'Batería', 'battery'], name: 'Cabeza de Bonnie', icon: 'eye', task: 'Cabeza de Bonnie', room: 'Sala de cabezas', title: 'CABEZA DE BONNIE', flavor: 'Bonnie parpadea… ¡y muestra un dibujo!',
          q: crit('AAL') },
        { id: 'chicaHead', dark: true, input: 'slots', needs: 'bateria', gives: ['llaveT', 'Llave del taller', 'key'], name: 'Cabeza de Chica', icon: 'eye', task: 'Cabeza de Chica', room: 'Almacén de partes', title: 'CABEZA DE CHICA', flavor: 'Chica susurra un acertijo de formas.',
          q: crit('ALA', { type: 'number', vals: true }) },
        { id: 'foxyHead', input: 'odd', needs: 'llaveT', name: 'Cabeza de Foxy', icon: 'eye', task: 'Cabeza de Foxy', room: 'Taller', title: 'CABEZA DE FOXY', flavor: 'Foxy gruñe y muestra un plano.',
          q: critOdd('ALA', 'LAL') },
        { id: 'endo', input: 'slots', needs: 'destor', gives: ['disco', 'Disco de datos', 'disc'], name: 'Endoesqueleto', icon: 'skull', task: 'Examina el endo', room: 'Taller', title: 'ENDOESQUELETO', flavor: 'Cuelga con dos planos en la mano.',
          q: critMulti(["HC", "AAL"], { vals: true }) },
        { id: 'terminal', input: 'slots', needs: 'disco', name: 'Terminal', icon: 'lock', task: 'Compara los planos', room: 'Oficina de servicio', final: true, title: 'TERMINAL', flavor: 'Pide el criterio de cada par.',
          q: critMulti(["LLL", "ALA", "LAL"], { vals: true }) }
      ] },

    /* ===== NOCHE 7 ===== */
    { n: 7, sub: 'Golden Freddy', topic: 'Reto final', scene: 'office7', explore: 'noche7', enemy: 'golden', manual: 7,
      intro: [
        { w: 'phone', t: 'Golden Freddy. No debería estar aquí.' },
        { w: 'phone', t: 'Solo el criterio correcto lo calma. Cada par que resuelvas lo debilita.' },
        { w: 'phone', t: 'Recorre el lugar a oscuras. Cada tarea te da un objeto que necesitarás en otra.' },
        { w: 'phone', t: 'Golden aparece y desaparece. ¡Suerte, Mike!' } ],
      outro: '¡Golden Freddy se desvanece!',
      spots: [
        { id: 'poster', input: 'slots', gives: ['llaveG', 'Llave del cuarto de Golden', 'key'], name: 'Póster “IT’S ME”', icon: 'eye', task: 'Lee el póster', room: 'Pasillo Oeste', title: 'PISTA', flavor: 'Tres pares de triángulos.',
          q: critMulti(["LLL", "LAL", "ALA"]) },
        { id: 'golden', dark: true, input: 'cards', needs: 'llaveG', gives: ['tarjeta', 'Tarjeta de la oficina', 'card'], name: 'Golden Freddy', icon: 'skull', task: 'Examina a Golden', room: 'Cuarto de Golden', title: 'PISTA', flavor: 'El papel está en su pecho.',
          q: critMulti(["AAL", "HC"], { vals: true }) },
        { id: 'monitor', input: 'pipes', confirm: true, needs: 'tarjeta', gives: ['codigo', 'Código del panel', 'book'], name: 'Monitor', icon: 'eye', task: 'Revisa el monitor', room: 'Oficina', title: 'PISTA', flavor: 'El monitor muestra dos triángulos con medidas.',
          q: crit('ALA', { type: 'number', vals: true }) },
        { id: 'phone', input: 'odd', confirm: true, needs: 'cable', name: 'Teléfono', icon: 'phone', task: 'Contesta el teléfono', room: 'Oficina', title: 'PISTA', flavor: 'El teléfono suena: ¿qué criterio?',
          q: critOdd('ALA', 'AAL') },
        { id: 'fan', dark: true, input: 'dial', confirm: true, gives: ['cable', 'Cable del teléfono', 'cable'], name: 'Ventilador', icon: 'bolt', task: 'Revisa el ventilador', room: 'Ventilación', title: 'PISTA', flavor: 'Un papel gira en el ventilador.',
          q: critMulti(["LAL", "HC"], { vals: true }) },
        { id: 'panel', input: 'padK', confirm: true, needs: 'codigo', name: 'Panel final', icon: 'lock', task: 'Usa el panel', room: 'Oficina', final: true, title: 'PISTA', flavor: '¡Ya casi! Último par de planos.',
          q: critMulti(["ALA", "LLL"], { vals: true }) }
      ] }
  ];

  /* ---------- Manual del guardia (se desbloquea por noche) ---------- */
  function pg(kind, seed, text, vals) { return '<div class="m-fig">' + TRI.pair(kind, { seed: seed, vals: vals }) + '</div>' + text; }
  var MANUAL = [
    { t: 'Congruentes', html:
      '<p>Dos triángulos son <b>congruentes</b> (≅) si tienen la misma forma y el mismo tamaño: uno cabe exacto sobre el otro (aunque esté girado o volteado).</p>' +
      '<ul><li><b>Rayitas</b> iguales = lados iguales</li><li><b>Arcos</b> iguales = ángulos iguales</li><li><b>Cuadradito</b> = ángulo recto (90°)</li></ul>' +
      '<p class="m-tip">Con 3 datos bien elegidos ya basta</p>' },
    { t: 'LLL', html: pg('LLL', 3, '<p><b>Lado-Lado-Lado</b>: los tres lados de uno son iguales a los tres del otro.</p>') },
    { t: 'LAL', html: pg('LAL', 5, '<p><b>Lado-Ángulo-Lado</b>: dos lados iguales y el ángulo <b>entre</b> ellos igual.</p><p class="m-tip">El ángulo queda en medio de los lados</p>') },
    { t: 'ALA', html: pg('ALA', 9, '<p><b>Ángulo-Lado-Ángulo</b>: dos ángulos iguales y el lado <b>entre</b> ellos igual.</p><p class="m-tip">El lado queda en medio de los ángulos</p>') },
    { t: 'AAL', html: pg('AAL', 12, '<p><b>Ángulo-Ángulo-Lado</b>: dos ángulos iguales y un lado igual que <b>no</b> está entre ellos.</p><p class="m-tip">ALA: el lado va en medio · AAL: el lado va afuera</p>') },
    { t: 'HC', html: pg('HC', 2, '<p><b>Hipotenusa-Cateto</b>: solo para triángulos <b>rectángulos</b>. La hipotenusa (opuesta al ángulo recto) y un cateto son iguales.</p>') },
    { t: 'Trampas', html:
      '<ul><li><b>AAA</b>: tres ángulos iguales NO bastan. Pueden ser semejantes, pero de otro tamaño.</li><li><b>LLA</b>: dos lados y un ángulo que no está entre ellos NO basta (salvo en rectángulos: ahí es HC).</li></ul>' +
      '<p class="m-ex">Siempre pregunta: ¿qué partes están marcadas y dónde?</p>' }
  ];

  G.LV = { LEVELS: LEVELS, INTRO: INTRO, MANUAL: MANUAL, WRONG: WRONG, RIGHT: RIGHT, NAME: NAME, FULL: FULL, fmt: fmt };
})(window);
