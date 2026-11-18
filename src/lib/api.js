// Capa de datos. Con EXPO_PUBLIC_API_URL usa el backend real de GrooveSpace; sin ella usa datos de muestra.
import { BANDS, SONGS, ADS } from '../data';
import { API_URL } from './config';

export async function getCatalog() {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/api/music/catalog`);
      if (res.ok) return res.json();
    } catch (e) { /* cae a datos de muestra */ }
  }
  return { bands: BANDS, songs: SONGS, ads: ADS };
}

// Inicio de sesión de banda con la MISMA cuenta que en el sitio web.
// Devuelve { band, accessToken } si es una banda; null si las credenciales no son de banda; lanza error si no hay conexión.
export async function loginBand(email, password) {
  if (!API_URL) return null;
  const res = await fetch(`${API_URL}/api/bands/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (res.status === 401) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'No se pudo iniciar sesión.');
  return data;
}

// Llamadas autenticadas de banda (Authorization: Bearer).
export async function bandFetch(path, token) {
  if (!API_URL) throw new Error('Sin conexión al backend.');
  const res = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Error al cargar datos.');
  return data;
}

// Debe validarse también en servidor: sesión, ≥30 s, 1 reproducción pagada por canción/día.
export async function reportValidPlay({ songId, bandId }) {
  if (API_URL) {
    try {
      await fetch(`${API_URL}/api/music/plays`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ songId, bandId }) });
    } catch (e) { /* se reintenta en la siguiente versión */ }
  }
  return { ok: true };
}
