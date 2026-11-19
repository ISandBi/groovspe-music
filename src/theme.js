// Sistema de diseño GrooveSpace Music: superficies violeta profundo + acentos lima/rosa/violeta.
export const colors = {
  bg: '#0c0914',
  surface: '#161021',
  raised: '#221a30',
  line: 'rgba(255,255,255,0.08)',
  lime: '#c8ff3d',
  limeSoft: 'rgba(200,255,61,0.16)',
  pink: '#ff4f8b',
  violet: '#8b5cff',
  cyan: '#2fd6c8',
  amber: '#ffb347',
  text: '#fdf7ff',
  body: '#e4dbee',
  muted: '#a99bbb',
  onLime: '#0c0914',
};

// Degradados de marca (úsalos para cabeceras, tarjetas y anuncios).
export const gradients = {
  brand: ['#ff4f8b', '#8b5cff'],
  lime: ['#c8ff3d', '#12c28a'],
  sunset: ['#ffb347', '#ff4f8b'],
  ocean: ['#38bdf8', '#4f46e5'],
  aurora: ['#8b5cff', '#2fd6c8'],
  night: ['#6366f1', '#1e1b4b'],
};

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const radius = { sm: 10, md: 16, lg: 24, pill: 999 };

export const type = {
  display: { fontSize: 34, fontWeight: '800', letterSpacing: -1, color: colors.text },
  h1: { fontSize: 28, fontWeight: '800', letterSpacing: -0.6, color: colors.text },
  h2: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3, color: colors.text },
  h3: { fontSize: 16, fontWeight: '700', color: colors.text },
  body: { fontSize: 15, lineHeight: 22, color: colors.body },
  small: { fontSize: 13, color: colors.muted },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: colors.muted },
};

export const TAB_HEIGHT = 62;
export const MINI_HEIGHT = 64;
