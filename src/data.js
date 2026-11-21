// Datos de demostración. Sustituir por la API de GrooveSpace (ver src/lib/api.js).
const SAMPLE = (n) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;
const G = { brand: ['#ff4f8b', '#8b5cff'], lime: ['#5fd6a4', '#0f8f6b'], sunset: ['#ffb347', '#ff4f8b'], ocean: ['#38bdf8', '#4f46e5'], aurora: ['#8b5cff', '#2fd6c8'], night: ['#6366f1', '#1e1b4b'] };

export const BANDS = [
  // Bandas de GrooveSpace (grabadas por ingenieros de la plataforma).
  { id: 'b1', name: 'Neón Pantera', genre: 'Rock alternativo', city: 'Coyoacán, CDMX', colors: G.brand, listeners: 12840, bio: 'Cuatro amigos, una sala de ensayo y mucho reverb. Grabaron su primer EP en la Sala Pulso de GrooveSpace con ingeniería de Diego R.', engineer: 'Diego R.', recorded: 'Sala Pulso' },
  { id: 'b2', name: 'Ceiba Sonora', genre: 'Folk / Indie', city: 'Roma Norte, CDMX', colors: G.lime, listeners: 8310, bio: 'Folk urbano con guitarras acústicas y percusión de objetos cotidianos. Sesión en vivo multitrack incluida.', engineer: 'Marian L.', recorded: 'Sala Bosque' },
  { id: 'b3', name: 'Concreto Azul', genre: 'Post-punk', city: 'Iztapalapa, CDMX', colors: G.ocean, listeners: 6120, bio: 'Bajos densos, voces frías y letras sobre la ciudad que nunca duerme.', engineer: 'Diego R.', recorded: 'Sala Pulso' },
  { id: 'b4', name: 'La Última Rumba', genre: 'Cumbia psicodélica', city: 'Tlalpan, CDMX', colors: G.sunset, listeners: 15990, bio: 'Cumbia con sintetizadores analógicos y mucho groove para bailar hasta tarde.', engineer: 'Marian L.', recorded: 'Sala Bosque' },
  { id: 'b5', name: 'Vidrio Líquido', genre: 'Electrónica', city: 'Condesa, CDMX', colors: G.aurora, listeners: 4380, bio: 'Beats suaves y texturas de vidrio. Música para estudiar, manejar de noche o no hacer nada.', engineer: 'Diego R.', recorded: 'Estudio Cristal' },
  { id: 'b6', name: 'Tormenta en Marzo', genre: 'Metal progresivo', city: 'Azcapotzalco, CDMX', colors: G.night, listeners: 3210, bio: 'Compases impares, guitarras de siete cuerdas y una batería que no perdona.', engineer: 'Marian L.', recorded: 'Sala Trueno' },
  // Bandas de referencia (contenido PROVISIONAL de prueba vía YouTube; no acreditan saldo).
  { id: 'r1', provisional: true, name: 'Café Tacvba', genre: 'Rock alternativo', city: 'Ciudad de México', colors: ['#f97316', '#be123c'], listeners: 4200000, bio: 'Banda mexicana de rock alternativo, referente del rock en español desde los años 90.' },
  { id: 'r2', provisional: true, name: 'Zoé', genre: 'Rock alternativo', city: 'Cuernavaca, Morelos', colors: ['#22d3ee', '#6366f1'], listeners: 3100000, bio: 'Banda mexicana de rock alternativo y neopsicodelia.' },
  { id: 'r3', provisional: true, name: 'Joy Division', genre: 'Post-punk', city: 'Salford, Inglaterra', colors: ['#9ca3af', '#1f2937'], listeners: 5600000, bio: 'Banda británica fundamental del post-punk.' },
  { id: 'r4', provisional: true, name: 'Los Ángeles Azules', genre: 'Cumbia psicodélica', city: 'Iztapalapa, CDMX', colors: ['#38bdf8', '#1d4ed8'], listeners: 6900000, bio: 'Agrupación mexicana de cumbia sonidera con proyección mundial.' },
  { id: 'r5', provisional: true, name: 'Daft Punk', genre: 'Electrónica', city: 'París, Francia', colors: ['#fbbf24', '#ec4899'], listeners: 14000000, bio: 'Dúo francés de música electrónica.' },
  { id: 'r6', provisional: true, name: 'Tool', genre: 'Metal progresivo', city: 'Los Ángeles, EE. UU.', colors: ['#a78bfa', '#312e81'], listeners: 7800000, bio: 'Banda estadounidense de metal progresivo.' },
  { id: 'r7', provisional: true, name: 'Queen', genre: 'Rock clásico', city: 'Londres, Inglaterra', colors: ['#fde047', '#dc2626'], listeners: 40000000, bio: 'Banda británica de rock, una de las más influyentes de la historia.' },
  { id: 'r8', provisional: true, name: 'Nirvana', genre: 'Grunge', city: 'Aberdeen, EE. UU.', colors: ['#a3e635', '#0f766e'], listeners: 22000000, bio: 'Banda estadounidense que llevó el grunge al mundo.' },
  { id: 'r9', provisional: true, name: 'Coldplay', genre: 'Pop / Rock', city: 'Londres, Inglaterra', colors: ['#f472b6', '#0ea5e9'], listeners: 38000000, bio: 'Banda británica de pop rock alternativo.' },
];

const t = (id, band, title, n, duration, plays) => ({ id, bandId: band, title, url: SAMPLE(n), duration, plays });
// yt = ID de video oficial de YouTube (audio + video incrustado). Provisional.
const y = (id, band, title, yt, duration, plays) => ({ id, bandId: band, title, yt, duration, plays, provisional: true });

export const SONGS = [
  t('s1', 'b1', 'Luces de Sodio', 1, 372, 9210),
  t('s2', 'b1', 'Fuego Lento', 2, 421, 7040),
  t('s3', 'b2', 'Raíces de Agua', 3, 342, 5120),
  t('s4', 'b2', 'Cielo Prestado', 4, 305, 3980),
  t('s5', 'b3', 'Línea 12', 5, 354, 4410),
  t('s6', 'b3', 'Cemento y Sal', 6, 398, 2760),
  t('s7', 'b4', 'Baile de Neón', 7, 366, 11230),
  t('s8', 'b4', 'Marea Alta', 8, 331, 8770),
  t('s9', 'b5', 'Cristal Líquido', 9, 289, 2910),
  t('s10', 'b5', 'Noche en Loop', 10, 410, 1980),
  t('s11', 'b6', 'Compás Impar', 11, 377, 2210),
  t('s12', 'b6', 'Marzo', 12, 440, 1630),
  y('y1', 'r1', 'Eres', '98Akpf1ph2o', 268, 52000),
  y('y2', 'r2', 'Labios Rotos', '5liaOfyzVjc', 240, 48000),
  y('y3', 'r3', 'Love Will Tear Us Apart', 'zuuObGsB0No', 207, 61000),
  y('y4', 'r4', 'Cómo Te Voy A Olvidar', 'nxXvOEPsE0s', 240, 83000),
  y('y5', 'r5', 'Get Lucky', '5NV6Rdv1a3I', 248, 99000),
  y('y6', 'r6', 'Schism', 'MM62wjLrgmA', 407, 34000),
  y('y7', 'r7', 'Bohemian Rhapsody', 'fJ9rUzIMcZQ', 355, 120000),
  y('y8', 'r8', 'Smells Like Teen Spirit', 'hTWKbfoikeg', 301, 110000),
  y('y9', 'r9', 'Yellow', 'yKNxeF4KMsY', 269, 105000),
];

// Anuncios propios de GrooveSpace (versión gratuita).
export const ADS = [
  { id: 'a1', kicker: 'EVENTO', title: 'Noche de Bandas Nuevas', text: 'Viernes 21:00 · 4 bandas de GrooveSpace en vivo.', cta: 'Ver cartel', colors: ['#ff4f8b', '#8b5cff'] },
  { id: 'a2', kicker: 'RENTA DE SALAS', title: 'Ensaya desde $220/h', text: 'Salas equipadas con consola y backline.', cta: 'Reservar', colors: ['#c8ff3d', '#12c28a'] },
  { id: 'a3', kicker: 'NUEVAS BANDAS', title: 'Descubre a Vidrio Líquido', text: 'Electrónica grabada en Estudio Cristal.', cta: 'Escuchar', colors: ['#b28aff', '#2cd5c4'] },
];

// Listas editoriales de GrooveSpace (solo lectura).
export const PLAYLISTS = [
  { id: 'e1', name: 'Noches de CDMX', desc: 'Guitarras, neón y madrugada en la ciudad.', colors: ['#ff4f8b', '#8b5cff'], songIds: ['s1', 's5', 's9', 's10', 's3'] },
  { id: 'e2', name: 'Para bailar', desc: 'Cumbia psicodélica y groove sin parar.', colors: ['#ffb84d', '#e0302f'], songIds: ['s7', 's8', 's2', 's9'] },
  { id: 'e3', name: 'Folk de sala', desc: 'Acústico grabado en vivo, sin filtros.', colors: ['#c8ff3d', '#12c28a'], songIds: ['s3', 's4', 's2'] },
  { id: 'e4', name: 'Ruido pesado', desc: 'Compases impares y mucha distorsión.', colors: ['#9aa0ff', '#2b1d4d'], songIds: ['s11', 's12', 's6', 's1'] },
  { id: 'e5', name: 'Grabado en GrooveSpace', desc: 'Todo el catálogo, de punta a punta.', colors: ['#4db8ff', '#1b2a8a'], songIds: SONGS.map((x) => x.id) },
  { id: 'e7', name: 'Clásicos de referencia', desc: 'Contenido de prueba: audio y video oficial.', colors: ['#fde047', '#dc2626'], songIds: ['y7', 'y8', 'y9', 'y1', 'y2', 'y5'] },
  { id: 'e6', name: 'Electrónica y cumbia', desc: 'Sintetizadores que no se quedan quietos.', colors: ['#b28aff', '#2cd5c4'], songIds: ['s7', 's8', 's9', 's10'] },
];
export const playlistById = (id) => PLAYLISTS.find((p) => p.id === id);

export const GENRES = ['Todo', 'Rock alternativo', 'Folk / Indie', 'Post-punk', 'Cumbia psicodélica', 'Electrónica', 'Metal progresivo', 'Rock clásico', 'Grunge', 'Pop / Rock'];

export const bandById = (id) => BANDS.find((b) => b.id === id);
export const songById = (id) => SONGS.find((s) => s.id === id);
export const songsOfBand = (id) => SONGS.filter((s) => s.bandId === id);

// Reglas de acreditación (documento legal / modelo de negocio).
export const RULES = {
  creditPerPlay: 1,
  bonusPlays: 100,
  minSeconds: 30,
  monthlyCapPerBand: 1500,
  maxBookingShare: 0.5,
  expiryMonths: 12,
};
