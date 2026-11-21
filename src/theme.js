// GrooveSpace Music · diseño claro y limpio (estilo reproductor de Apple) con la paleta de GrooveSpace.
// Rosa = acento principal (como el rojo de Apple Music); violeta e índigo para profundidad; verde solo para "válido".
export const colors = {
  bg: '#ffffff',
  surface: '#f4f2f8',      // campos, tarjetas suaves, listas agrupadas
  raised: '#ffffff',
  line: 'rgba(26,19,37,0.12)',
  text: '#1a1325',
  body: '#463d52',
  muted: '#7d7589',
  accent: '#f0457f',
  accentSoft: 'rgba(240,69,127,0.10)',
  violet: '#7c4dff',
  green: '#0fa37a',
  amber: '#f59e0b',
  cyan: '#0ea5a4',
  onAccent: '#ffffff',
  // Alias para componentes antiguos
  lime: '#f0457f', limeSoft: 'rgba(240,69,127,0.10)', pink: '#f0457f', onLime: '#ffffff',
};

// Degradados de marca (portadas, categorías, cabeceras).
export const gradients = {
  brand: ['#ff4f8b', '#8b5cff'],
  lime: ['#5fd6a4', '#0f8f6b'],
  sunset: ['#ffb347', '#ff4f8b'],
  ocean: ['#38bdf8', '#4f46e5'],
  aurora: ['#8b5cff', '#2fd6c8'],
  night: ['#6366f1', '#1e1b4b'],
};

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const radius = { sm: 6, md: 10, lg: 14, xl: 20, pill: 999 };

export const type = {
  largeTitle: { fontSize: 34, fontWeight: '800', letterSpacing: -0.8, color: colors.text },
  display: { fontSize: 34, fontWeight: '800', letterSpacing: -0.8, color: colors.text },
  h1: { fontSize: 28, fontWeight: '800', letterSpacing: -0.6, color: colors.text },
  h2: { fontSize: 22, fontWeight: '700', letterSpacing: -0.4, color: colors.text },
  h3: { fontSize: 16, fontWeight: '600', color: colors.text },
  body: { fontSize: 15, lineHeight: 22, color: colors.body },
  small: { fontSize: 13, color: colors.muted },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: colors.muted },
};

export const TAB_HEIGHT = 52;
export const MINI_HEIGHT = 58;
export const shadow = { shadowColor: '#1a1325', shadowOpacity: 0.22, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 };
