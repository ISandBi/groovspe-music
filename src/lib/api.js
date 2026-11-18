// Capa de datos. Hoy usa datos locales; para conectar con el backend de GrooveSpace
// cambia estas funciones por llamadas fetch a tu API (por ejemplo EXPO_PUBLIC_API_URL).
import { BANDS, SONGS, ADS } from '../data';

const API_URL = process.env.EXPO_PUBLIC_API_URL || null;

export async function getCatalog() {
  if (API_URL) {
    const res = await fetch(`${API_URL}/api/music/catalog`);
    if (res.ok) return res.json();
  }
  return { bands: BANDS, songs: SONGS, ads: ADS };
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
