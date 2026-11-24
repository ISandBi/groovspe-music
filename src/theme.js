// GrooveSpace Music · temas claro y oscuro con la paleta de GrooveSpace.
// Rosa = acento principal; violeta/índigo de apoyo; lima de GrooveSpace solo como detalle "válido" en oscuro.
import { useColorScheme } from 'react-native';
import { useApp } from './store';

const common = { onAccent: '#ffffff', onLime: '#ffffff' };

const LIGHT_COLORS = {
  ...common,
  bg: '#ffffff', surface: '#f4f2f8', raised: '#ffffff', groupBg: '#f4f2f8', groupCard: '#ffffff',
  line: 'rgba(26,19,37,0.12)', text: '#1a1325', body: '#463d52', muted: '#7d7589',
  accent: '#f0457f', accentSoft: 'rgba(240,69,127,0.10)', violet: '#7c4dff', green: '#0fa37a', amber: '#f59e0b', cyan: '#0ea5a4',
  grab: 'rgba(26,19,37,0.2)', track: '#d9d4e0', toast: 'rgba(26,19,37,0.94)', glass: 'rgba(250,248,253,0.84)', inactive: '#8a8394',
  lime: '#f0457f', limeSoft: 'rgba(240,69,127,0.10)', pink: '#f0457f',
};

const DARK_COLORS = {
  ...common,
  bg: '#0c0914', surface: '#1a1424', raised: '#241c31', groupBg: '#0c0914', groupCard: '#1a1424',
  line: 'rgba(255,255,255,0.10)', text: '#fdf7ff', body: '#e4dbee', muted: '#a99bbb',
  accent: '#ff5c97', accentSoft: 'rgba(255,92,151,0.16)', violet: '#9d7bff', green: '#c8ff3d', amber: '#ffb347', cyan: '#2fd6c8',
  grab: 'rgba(255,255,255,0.3)', track: '#3a3046', toast: 'rgba(48,38,66,0.97)', glass: 'rgba(16,12,24,0.82)', inactive: '#9a8fae',
  lime: '#ff5c97', limeSoft: 'rgba(255,92,151,0.16)', pink: '#ff5c97',
};

const makeType = (c) => ({
  largeTitle: { fontSize: 34, fontWeight: '800', letterSpacing: -0.8, color: c.text },
  display: { fontSize: 34, fontWeight: '800', letterSpacing: -0.8, color: c.text },
  h1: { fontSize: 28, fontWeight: '800', letterSpacing: -0.6, color: c.text },
  h2: { fontSize: 22, fontWeight: '700', letterSpacing: -0.4, color: c.text },
  h3: { fontSize: 16, fontWeight: '600', color: c.text },
  body: { fontSize: 15, lineHeight: 22, color: c.body },
  small: { fontSize: 13, color: c.muted },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: c.muted },
});

const THEMES = {
  light: { colors: LIGHT_COLORS, type: makeType(LIGHT_COLORS), dark: false },
  dark: { colors: DARK_COLORS, type: makeType(DARK_COLORS), dark: true },
};

// themeMode: 'system' | 'light' | 'dark' (se elige en Cuenta → Apariencia).
export function useTheme() {
  const scheme = useColorScheme();
  const { themeMode } = useApp();
  const dark = themeMode === 'dark' || (themeMode !== 'light' && scheme === 'dark');
  return dark ? THEMES.dark : THEMES.light;
}

// Degradados de marca (portadas, categorías, cabeceras).
export const gradients = {
  brand: ['#ff4f8b', '#8b5cff'], lime: ['#5fd6a4', '#0f8f6b'], sunset: ['#ffb347', '#ff4f8b'],
  ocean: ['#38bdf8', '#4f46e5'], aurora: ['#8b5cff', '#2fd6c8'], night: ['#6366f1', '#1e1b4b'],
};

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const radius = { sm: 6, md: 10, lg: 14, xl: 20, pill: 999 };
export const TAB_HEIGHT = 52;
export const MINI_HEIGHT = 58;
export const shadow = { shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 };
