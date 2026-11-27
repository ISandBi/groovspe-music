// Capa de datos. Con EXPO_PUBLIC_API_URL la app se alimenta del sitio web de GrooveSpace
// (bandas, logos, demos publicados, letras). Sin ella usa los datos de muestra de src/data.js.
import { API_URL } from './config';

const PALETTE = [['#ff4f8b', '#8b5cff'], ['#5fd6a4', '#0f8f6b'], ['#ffb347', '#ff4f8b'], ['#38bdf8', '#4f46e5'], ['#8b5cff', '#2fd6c8'], ['#6366f1', '#1e1b4b'], ['#f97316', '#be123c'], ['#22d3ee', '#6366f1']];
const hashOf = (text) => [...String(text)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const colorsFor = (name) => PALETTE[hashOf(name) % PALETTE.length];
const abs = (path) => (!path ? null : /^https?:/i.test(path) ? path : `${API_URL}${path}`);

async function request(path, { method = 'GET', token, body } = {}) {
  if (!API_URL) throw new Error('La app no está conectada al sitio de GrooveSpace.');
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) { throw new Error('Sin conexión con GrooveSpace. Revisa tu internet.'); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) { const err = new Error(data.error || 'Error al comunicarse con GrooveSpace.'); err.status = res.status; throw err; }
  return data;
}

// Listas editoriales generadas con lo que hay publicado.
function buildPlaylists(songs, bands) {
  const lists = [];
  const mk = (id, name, desc, colors, list) => { if (list.length) lists.push({ id, name, desc, colors, songIds: list.map((x) => x.id) }); };
  mk('e5', 'Grabado en GrooveSpace', 'Todo el catálogo publicado por las bandas.', ['#4db8ff', '#1b2a8a'], songs);
  mk('e1', 'Lo más escuchado', 'Las canciones con más reproducciones válidas.', ['#ff4f8b', '#8b5cff'], [...songs].sort((a, b) => b.plays - a.plays).slice(0, 20));
  mk('e2', 'Recién publicadas', 'Lo último que subieron las bandas.', ['#c8ff3d', '#12c28a'], [...songs].sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt))).slice(0, 20));
  const genres = [...new Set(bands.map((b) => b.genre).filter(Boolean))];
  genres.forEach((g, i) => mk(`g${i}`, g, `Bandas de ${g} en GrooveSpace.`, PALETTE[(i + 3) % PALETTE.length], songs.filter((x) => bands.find((b) => b.id === x.bandId)?.genre === g)));
  return lists;
}

export function normalizeCatalog(raw) {
  const bands = (raw.bands || []).map((b) => ({
    id: b.id, name: b.name, genre: b.genre || 'Sin género', city: b.city || 'México', bio: b.bio || 'Banda registrada en GrooveSpace.',
    logo: abs(b.logo), colors: colorsFor(b.name), listeners: b.listeners || 0, remote: true,
  }));
  const songs = (raw.songs || []).filter((s) => bands.some((b) => b.id === s.bandId)).map((s) => ({
    id: s.id, bandId: s.bandId, title: s.title, url: abs(s.streamPath), duration: s.duration || 0, plays: s.plays || 0,
    lyrics: s.lyrics || '', cover: abs(s.cover), kind: s.kind, publishedAt: s.publishedAt || '', remote: true,
  }));
  return { bands, songs, ads: raw.ads || [], playlists: buildPlaylists(songs, bands), rules: raw.rules };
}

// Devuelve el catálogo del sitio web. Lanza error si no hay conexión (el llamador decide si usa la copia guardada).
export async function fetchCatalog() {
  return { raw: await request('/api/music/catalog') };
}

// ---- Cuenta de oyente (en el sitio web de GrooveSpace) ----
export const registerListener = (name, email, password) => request('/api/music/register', { method: 'POST', body: { name, email, password } });
export const loginListener = (email, password) => request('/api/music/login', { method: 'POST', body: { email, password } });
export const fetchMe = (token) => request('/api/music/me', { token });

// Inicio de sesión de banda con la MISMA cuenta que en el sitio web.
// Devuelve { band, accessToken } si es una banda; null si las credenciales no son de banda; lanza error si no hay conexión.
export async function loginBand(email, password) {
  if (!API_URL) return null;
  let res;
  try {
    res = await fetch(`${API_URL}/api/bands/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  } catch (e) { throw new Error('Sin conexión con GrooveSpace. Revisa tu internet.'); }
  if (res.status === 401) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'No se pudo iniciar sesión.');
  return data;
}

// Llamadas autenticadas de banda (Authorization: Bearer).
export const bandFetch = (path, token, opts = {}) => request(path, { ...opts, token });

// Publica / retira un demo en la app y guarda su letra (sólo líder o tesorero de la banda).
export const publishDemo = (token, id, patch) => request(`/api/demos/${id}/publish`, { method: 'PATCH', token, body: patch });

// ---- Reproducciones válidas: el servidor mide los 30 s entre "inicio" y "completado" ----
export const startPlay = (token, songId) => request('/api/music/plays/start', { method: 'POST', token, body: { songId } });
export const completePlay = (token, playId) => request(`/api/music/plays/${playId}/complete`, { method: 'POST', token });
