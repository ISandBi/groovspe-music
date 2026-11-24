import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bandById, songById } from '../data';

// Portadas reales: se consultan en la iTunes Search API (pública, sin llave) y se guardan en caché.
// Las canciones propias de GrooveSpace usan su carátula generada con los colores de la banda.
const KEY = 'groovespace-artwork-v1';
const cache = {}; // songId -> url | null
const pending = {};
let loaded = null;
const listeners = new Set();

const load = () => {
  if (!loaded) loaded = AsyncStorage.getItem(KEY).then((v) => { if (v) Object.assign(cache, JSON.parse(v)); }).catch(() => {});
  return loaded;
};

async function fetchArt(songId) {
  await load();
  if (songId in cache) return cache[songId];
  const song = songById(songId);
  if (!song || !song.yt) return null;
  const band = bandById(song.bandId);
  try {
    const q = encodeURIComponent(`${song.title} ${band.name}`);
    const res = await fetch(`https://itunes.apple.com/search?term=${q}&media=music&entity=song&limit=5`);
    const data = await res.json();
    const hit = (data.results || []).find((r) => r.artworkUrl100) || null;
    cache[songId] = hit ? hit.artworkUrl100.replace('100x100bb', '600x600bb') : null;
  } catch (e) { return null; } // sin red: no se guarda, se reintenta después
  AsyncStorage.setItem(KEY, JSON.stringify(cache)).catch(() => {});
  return cache[songId];
}

export function useArtwork(songId) {
  const isSong = typeof songId === 'string' && !!songById(songId)?.yt;
  const [url, setUrl] = useState(isSong ? cache[songId] || null : null);
  useEffect(() => {
    if (!isSong) { setUrl(null); return undefined; }
    let on = true;
    if (cache[songId]) setUrl(cache[songId]);
    else {
      pending[songId] = pending[songId] || fetchArt(songId);
      pending[songId].then((u) => { delete pending[songId]; if (on) setUrl(u || null); });
    }
    return () => { on = false; };
  }, [songId]); // eslint-disable-line
  return url;
}
export { listeners };
