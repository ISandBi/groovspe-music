// Sistema de diseño GrooveSpace Music (misma paleta que la plataforma web).
export const colors = {
  bg: '#100d17',
  surface: '#1d1725',
  raised: '#261e31',
  line: 'rgba(255,248,255,0.10)',
  lime: '#c2ff3c',
  limeSoft: 'rgba(194,255,60,0.14)',
  pink: '#ff5d8f',
  violet: '#b28aff',
  amber: '#ffb84d',
  text: '#fff8ff',
  body: '#e6deed',
  muted: '#b1a4bd',
  onLime: '#100d17',
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
