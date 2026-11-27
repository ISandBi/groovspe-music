import { SONG_LYRICS } from '../lyrics';

// Letras: propias (canciones de muestra de GrooveSpace) o desde LRCLIB (servicio abierto de letras sincronizadas).
// En producción usa un proveedor con licencia (por ejemplo Musixmatch) o las letras que entreguen las bandas.
const cache = new Map();
const enc = encodeURIComponent;

const parseLrc = (lrc) => lrc.split('\n').flatMap((line) => {
  const text = line.replace(/\[[^\]]*\]/g, '').trim();
  return [...line.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)].map((m) => ({ t: Number(m[1]) * 60 + Number(m[2]), text }));
}).filter((l) => l.text).sort((a, b) => a.t - b.t);

export async function getLyrics(song, band) {
  if (cache.has(song.id)) return cache.get(song.id);
  let result = null;
  const own = SONG_LYRICS[song.id];
  // Letra que la banda publicó desde el sitio web: se reparte a lo largo de la canción (sin tiempos exactos).
  // Si la banda marcó el tiempo de cada línea ([mm:ss.xx] texto), la letra va sincronizada con la canción.
  const timed = !own && song.lyrics && /\[\d+:\d+(?:\.\d+)?\]/.test(song.lyrics) ? parseLrc(song.lyrics) : null;
  const site = !own && song.lyrics ? song.lyrics.split('\n').map((x) => x.trim()).filter(Boolean) : null;
  if (timed?.length) {
    result = { synced: true, source: 'GrooveSpace', lines: timed };
  } else if (site?.length) {
    const start = 10; const end = (song.duration || 0) * 0.88;
    const step = end > start ? (end - start) / site.length : 0;
    result = { synced: step > 0, source: 'GrooveSpace', lines: site.map((text, i) => ({ t: step ? start + i * step : 0, text })) };
  } else if (own) {
    const start = 10; const end = song.duration * 0.88; const step = (end - start) / own.length;
    result = { synced: true, source: 'GrooveSpace', lines: own.map((text, i) => ({ t: start + i * step, text })) };
  } else {
    try {
      const q = `track_name=${enc(song.title)}&artist_name=${enc(band.name)}`;
      const headers = { 'Lrclib-Client': 'GrooveSpace Music (proyecto académico)' };
      let res = await fetch(`https://lrclib.net/api/get?${q}&duration=${Math.round(song.duration)}`, { headers });
      let data = res.ok ? await res.json() : null;
      if (!data) {
        res = await fetch(`https://lrclib.net/api/search?${q}`, { headers });
        const list = res.ok ? await res.json() : [];
        data = Array.isArray(list) ? list.find((x) => x.syncedLyrics) || list[0] || null : null;
      }
      if (data?.syncedLyrics) result = { synced: true, source: 'LRCLIB', lines: parseLrc(data.syncedLyrics) };
      else if (data?.plainLyrics) result = { synced: false, source: 'LRCLIB', lines: data.plainLyrics.split('\n').map((x) => x.trim()).filter(Boolean).map((text) => ({ t: 0, text })) };
    } catch (e) { result = null; }
    if (!result) {
      // Respaldo: lyrics.ovh (letra sin sincronía).
      try {
        const r = await fetch(`https://api.lyrics.ovh/v1/${enc(band.name)}/${enc(song.title)}`);
        const d = r.ok ? await r.json() : null;
        if (d?.lyrics) result = { synced: false, source: 'lyrics.ovh', lines: d.lyrics.split('\n').map((x) => x.trim()).filter(Boolean).map((text) => ({ t: 0, text })) };
      } catch (e) { result = null; }
    }
  }
  if (result && result.lines.length) cache.set(song.id, result); else result = null;
  return result;
}
