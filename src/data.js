// Datos de demostración. Sustituir por la API de GrooveSpace (ver src/lib/api.js).
const SAMPLE = (n) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

export const BANDS = [
  { id: 'b1', name: 'Neón Pantera', genre: 'Rock alternativo', city: 'Coyoacán, CDMX', colors: ['#ff5d8f', '#6a2cff'], listeners: 12840, bio: 'Cuatro amigos, una sala de ensayo y mucho reverb. Grabaron su primer EP en la Sala Pulso de GrooveSpace con ingeniería de Diego R.', engineer: 'Diego R.', recorded: 'Sala Pulso' },
  { id: 'b2', name: 'Ceiba Sonora', genre: 'Folk / Indie', city: 'Roma Norte, CDMX', colors: ['#c2ff3c', '#0fa968'], listeners: 8310, bio: 'Folk urbano con guitarras acústicas y percusión de objetos cotidianos. Sesión en vivo multitrack incluida.', engineer: 'Marian L.', recorded: 'Sala Bosque' },
  { id: 'b3', name: 'Concreto Azul', genre: 'Post-punk', city: 'Iztapalapa, CDMX', colors: ['#4db8ff', '#1b2a8a'], listeners: 6120, bio: 'Bajos densos, voces frías y letras sobre la ciudad que nunca duerme.', engineer: 'Diego R.', recorded: 'Sala Pulso' },
  { id: 'b4', name: 'La Última Rumba', genre: 'Cumbia psicodélica', city: 'Tlalpan, CDMX', colors: ['#ffb84d', '#e0302f'], listeners: 15990, bio: 'Cumbia con sintetizadores analógicos y mucho groove para bailar hasta tarde.', engineer: 'Marian L.', recorded: 'Sala Bosque' },
  { id: 'b5', name: 'Vidrio Líquido', genre: 'Electrónica', city: 'Condesa, CDMX', colors: ['#b28aff', '#2cd5c4'], listeners: 4380, bio: 'Beats suaves y texturas de vidrio. Música para estudiar, manejar de noche o no hacer nada.', engineer: 'Diego R.', recorded: 'Estudio Cristal' },
  { id: 'b6', name: 'Tormenta en Marzo', genre: 'Metal progresivo', city: 'Azcapotzalco, CDMX', colors: ['#9aa0ff', '#2b1d4d'], listeners: 3210, bio: 'Compases impares, guitarras de siete cuerdas y una batería que no perdona.', engineer: 'Marian L.', recorded: 'Sala Trueno' },
];

const t = (id, band, title, n, duration, plays) => ({ id, bandId: band, title, url: SAMPLE(n), duration, plays });

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
];

// Anuncios propios de GrooveSpace (versión gratuita).
export const ADS = [
  { id: 'a1', kicker: 'EVENTO', title: 'Noche de Bandas Nuevas', text: 'Viernes 21:00 · 4 bandas de GrooveSpace en vivo.', cta: 'Ver cartel', colors: ['#ff5d8f', '#6a2cff'] },
  { id: 'a2', kicker: 'RENTA DE SALAS', title: 'Ensaya desde $220/h', text: 'Salas equipadas con consola y backline.', cta: 'Reservar', colors: ['#c2ff3c', '#0fa968'] },
  { id: 'a3', kicker: 'NUEVAS BANDAS', title: 'Descubre a Vidrio Líquido', text: 'Electrónica grabada en Estudio Cristal.', cta: 'Escuchar', colors: ['#b28aff', '#2cd5c4'] },
];

export const GENRES = ['Todo', 'Rock alternativo', 'Folk / Indie', 'Post-punk', 'Cumbia psicodélica', 'Electrónica', 'Metal progresivo'];

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
