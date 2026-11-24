// Lecciones "Aprende a tocar" (Premium). Acordes y tempo ORIGINALES de las canciones de GrooveSpace.
// Cada línea de la letra toma el siguiente acorde de la progresión (en ciclo).
export const LESSONS = {
  s1: { key: 'La menor', bpm: 112, level: 'Fácil', prog: ['Am', 'F', 'C', 'G'], strum: 'A B A B A B A B', tip: 'Rasguea con la muñeca suelta y deja respirar el reverb entre acordes.' },
  s2: { key: 'Sol mayor', bpm: 78, level: 'Fácil', prog: ['G', 'D', 'Em', 'C'], strum: 'A B  A B', tip: 'Tempo lento: cuida que cada cuerda suene limpia al cambiar de acorde.' },
  s3: { key: 'Do mayor', bpm: 92, level: 'Fácil', prog: ['C', 'G', 'Am', 'F'], strum: 'A B A B A B', tip: 'Folk clásico: pulgar en el bajo y rasgueo suave hacia abajo.' },
  s4: { key: 'Re mayor', bpm: 84, level: 'Fácil', prog: ['D', 'A', 'Bm', 'G'], strum: 'A B A B', tip: 'El Bm es el reto: practica la cejilla aparte antes de tocar la canción.' },
  s5: { key: 'Mi menor', bpm: 100, level: 'Medio', prog: ['Em', 'C', 'G', 'D'], strum: 'A B A B', tip: 'Silencia con la palma en el cuarto tiempo para el efecto de metro.' },
  s6: { key: 'La menor', bpm: 126, level: 'Medio', prog: ['Am', 'G', 'F', 'E'], strum: 'A A B A A B', tip: 'Es post-punk: golpes secos y mucha precisión en el tempo.' },
  s7: { key: 'Re menor', bpm: 118, level: 'Fácil', prog: ['Dm', 'Am', 'C', 'G'], strum: 'A B A B A B', tip: 'Ritmo de cumbia: acentúa el contratiempo.' },
  s8: { key: 'Do mayor', bpm: 104, level: 'Fácil', prog: ['C', 'Am', 'F', 'G7'], strum: 'A B A B', tip: 'Cumbia suave: no cargues el pulgar, deja el güiro marcar el compás.' },
  s9: { key: 'Mi menor', bpm: 70, level: 'Fácil', prog: ['Em', 'Cadd9', 'G', 'D'], strum: 'Arpegio', tip: 'Arpegia con los dedos: pulgar-índice-medio-anular, despacio.' },
  s10: { key: 'La menor', bpm: 96, level: 'Medio', prog: ['Am', 'Em', 'F', 'G'], strum: 'A B A B', tip: 'Es un loop: repite la progresión y varía la dinámica en cada vuelta.' },
  s11: { key: 'Mi menor', bpm: 138, level: 'Difícil', prog: ['Em', 'Am', 'B7', 'Em'], strum: 'Compás de 7', tip: 'Cuenta de 7 en 7 (3+4). Empieza con el metrónomo a la mitad de velocidad.' },
  s12: { key: 'Sol mayor', bpm: 88, level: 'Medio', prog: ['G', 'Em', 'C', 'D'], strum: 'A B A B', tip: 'Crece en intensidad: empieza suave y termina con rasgueo completo.' },
};

// Digitaciones de guitarra (cuerdas 6 → 1). 'x' = no tocar, 0 = al aire, número = traste.
export const CHORDS = {
  Am: 'x02210', C: 'x32010', G: '320003', D: 'xx0232', Em: '022000', F: '133211', E: '022100', A: 'x02220',
  Dm: 'xx0231', Bm: 'x24432', Cadd9: 'x32033', G7: '320001', B7: 'x21202',
};
