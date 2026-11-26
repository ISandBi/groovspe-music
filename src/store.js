import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Linking } from 'react-native';
import { SONGS, RULES, songById, bandById, playlistById, setCatalog } from './data';
import { completePlay, fetchCatalog, normalizeCatalog, startPlay } from './lib/api';
import { API_URL, LOCK_SCREEN } from './lib/config';

const KEY = 'groovespace-music-v2';
const CATALOG_KEY = 'groovespace-catalog-v1';
const Ctx = createContext(null);
const StatusCtx = createContext({ playing: false, currentTime: 0, duration: 0, didJustFinish: false, error: null });
export const useApp = () => useContext(Ctx);
// El progreso cambia varias veces por segundo: va en su propio contexto para no redibujar toda la app.
export const useStatus = () => useContext(StatusCtx);
const today = () => new Date().toISOString().slice(0, 10);
const tap = (f = 'Light') => Haptics.impactAsync(Haptics.ImpactFeedbackStyle[f]).catch(() => {});

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null); // { role: 'listener' | 'band', name, email, bandId?, token? }
  const [premium, setPremium] = useState(false);
  const [card, setCard] = useState(null); // solo { brand, last4 }: nunca el número completo ni el CVV (PCI DSS 3.3)
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [playlists, setPlaylists] = useState([]); // listas del usuario
  const [followed, setFollowed] = useState([]);
  const [credited, setCredited] = useState({});
  const [plays, setPlays] = useState(0);
  const [toast, setToast] = useState(null);
  const [queue, setQueue] = useState(SONGS.map((s) => s.id));
  const [currentId, setCurrentId] = useState(null);
  const [context, setContext] = useState('Catálogo');
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off'); // off | all | one
  const [adGate, setAdGate] = useState(0);
  const [sheetSong, setSheetSong] = useState(null);
  const [viewMode, setViewMode] = useState('lyrics'); // lyrics | cover | video
  const videoMode = viewMode === 'video';
  const [themeMode, setThemeMode] = useState('system'); // system | light | dark
  const [videoRect, setVideoRect] = useState(null);
  const [catalogVersion, setCatalogVersion] = useState(0);
  const [catalogStatus, setCatalogStatus] = useState(API_URL ? 'loading' : 'ok'); // loading | ok | cached | offline
  const [tourPending, setTourPending] = useState(false);
  const playRef = useRef(null); // { songId, playId } de la reproducción abierta en el servidor
  const [ytId, setYtId] = useState(null);
  const [ytStatus, setYtStatus] = useState({ playing: false, currentTime: 0, duration: 0, didJustFinish: false, error: null });
  const ytRef = useRef(null);

  const player = useAudioPlayer(null);
  const audioStatus = useAudioPlayerStatus(player);
  const loaded = useRef(null);

  // Trae bandas, logos, demos publicados y letras desde el sitio web de GrooveSpace.
  const refreshCatalog = useCallback(async () => {
    if (!API_URL) return;
    setCatalogStatus('loading');
    try {
      const { raw } = await fetchCatalog();
      setCatalog(normalizeCatalog(raw));
      setCatalogVersion((v) => v + 1);
      setCatalogStatus('ok');
      AsyncStorage.setItem(CATALOG_KEY, JSON.stringify(raw)).catch(() => {});
    } catch (e) { setCatalogStatus(SONGS.length ? 'cached' : 'offline'); }
  }, []);

  // Al cambiar el catálogo: la cola y los favoritos/listas no deben apuntar a canciones que ya no existen.
  useEffect(() => {
    if (!API_URL || !catalogVersion) return;
    const ok = new Set(SONGS.map((x) => x.id));
    setQueue((q) => { const next = q.filter((id) => ok.has(id)); return next.length ? next : SONGS.map((x) => x.id); });
    setFavorites((f) => f.filter((id) => ok.has(id)));
    setRecent((r) => r.filter((id) => ok.has(id)));
    setPlaylists((p) => p.map((l) => ({ ...l, songIds: l.songIds.filter((id) => ok.has(id)) })));
  }, [catalogVersion]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const s = JSON.parse(raw);
          setUser(s.user || null); setPremium(!!s.premium); setCard(s.card || null); setFavorites(s.favorites || []);
          setRecent(s.recent || []); setCredited(s.credited || {}); setPlays(s.plays || 0);
          setPlaylists(s.playlists || []); setFollowed(s.followed || []); setThemeMode(s.themeMode || 'system'); setTourPending(!!s.tourPending);
        }
      } catch (e) { /* sin datos previos */ }
      if (API_URL) {
        // Copia guardada del último catálogo: la app abre al instante y funciona sin internet.
        try { const cached = await AsyncStorage.getItem(CATALOG_KEY); if (cached) { setCatalog(normalizeCatalog(JSON.parse(cached))); setCatalogVersion((v) => v + 1); } } catch (e) { /* sin copia */ }
      }
      setReady(true);
      refreshCatalog();
    })();
    setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: LOCK_SCREEN, interruptionMode: 'doNotMix' }).catch(() => {});
  }, []);
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(KEY, JSON.stringify({ user, premium, card, favorites, recent, credited, plays, playlists, followed, themeMode, tourPending })).catch(() => {});
  }, [ready, user, premium, card, favorites, recent, credited, plays, playlists, followed, themeMode, tourPending]);

  const showToast = useCallback((msg) => setToast({ msg, id: Date.now() }), []);
  const current = currentId ? songById(currentId) : null;
  const isYt = !!current?.yt;
  const status = isYt ? ytStatus : audioStatus;
  const playing = !!status.playing;
  const ytCmd = useCallback((c, v = 0) => { ytRef.current?.injectJavaScript(`window.cmd(${JSON.stringify(c)},${Number(v)});true;`); }, []);

  // Mensajes del reproductor de YouTube -> estado unificado.
  const onYtMessage = useCallback((e) => {
    let m; try { m = JSON.parse(e.nativeEvent.data); } catch (err) { return; }
    if (m.t === 'time') setYtStatus((s) => (Math.abs(s.currentTime - m.c) < 0.2 && s.duration === (m.d || s.duration) ? s : { ...s, currentTime: m.c || 0, duration: m.d || s.duration }));
    else if (m.t === 'state') setYtStatus((s) => ({ ...s, playing: m.s === 1 || m.s === 3, didJustFinish: m.s === 0, error: m.s === 1 ? null : s.error, ...(m.s === -1 || m.s === 3 ? { didJustFinish: false } : {}) }));
    else if (m.t === 'error') setYtStatus((s) => ({ ...s, playing: false, error: m.c }));
  }, []);

  const band = current ? bandById(current.bandId) : null;
  const isBand = user?.role === 'band';

  const play = useCallback((songId, list, ctx) => {
    const song = songById(songId);
    if (!song) return;
    if (list) setQueue(list);
    if (ctx) setContext(ctx);
    tap();
    setCurrentId(songId);
    setRecent((r) => [songId, ...r.filter((x) => x !== songId)].slice(0, 20));
    playRef.current = null;
    if (song.remote && user?.token && user.role === 'listener') {
      startPlay(user.token, songId).then((r) => { playRef.current = { songId, playId: r.playId }; }).catch(() => {});
    }
    if (song.yt) {
      try { player.pause(); } catch (e) {}
      loaded.current = null;
      setYtStatus({ playing: false, currentTime: 0, duration: song.duration, didJustFinish: false, error: null });
      if (ytId === song.yt) { ytCmd('seek', 0); ytCmd('play'); } else setYtId(song.yt);
      return;
    }
    ytCmd('pause'); setViewMode((m) => (m === 'video' ? 'lyrics' : m));
    if (loaded.current !== songId) {
      player.replace({ uri: song.url });
      loaded.current = songId;
      if (LOCK_SCREEN) try { player.setActiveForLockScreen(true, { title: song.title, artist: bandById(song.bandId).name, albumTitle: 'GrooveSpace Music' }); } catch (e) {}
    } else { try { player.seekTo(0); } catch (e) {} }
    player.play();
  }, [player, ytId, ytCmd, user]);

  const toggle = useCallback(() => {
    if (!current) return;
    Haptics.selectionAsync().catch(() => {});
    if (isYt) { ytCmd(playing ? 'pause' : 'play'); return; }
    if (playing) player.pause(); else player.play();
  }, [current, isYt, playing, player, ytCmd]);

  const step = useCallback((dir, auto = false) => {
    if (!current || !queue.length) return;
    const i = queue.indexOf(current.id);
    if (shuffle && queue.length > 1) {
      let n; do { n = queue[Math.floor(Math.random() * queue.length)]; } while (n === current.id);
      return play(n);
    }
    const ni = i + dir;
    if (auto && repeat === 'off' && ni >= queue.length) { player.pause(); try { player.seekTo(0); } catch (e) {} return; }
    play(queue[(ni + queue.length) % queue.length]);
  }, [current, queue, shuffle, repeat, play, player]);

  const seek = useCallback((sec) => { if (isYt) return ytCmd('seek', sec); try { player.seekTo(sec); } catch (e) {} }, [player, isYt, ytCmd]);
  const setMode = useCallback((m) => {
    if (m === 'video' && !isYt) { showToast('Esta canción no tiene video'); return; }
    tap(); setViewMode(m);
  }, [isYt, showToast]);
  const openOnYoutube = useCallback(() => { if (current?.yt) Linking.openURL(`https://www.youtube.com/watch?v=${current.yt}`); }, [current]);
  const cycleRepeat = useCallback(() => { tap(); setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off')); }, []);
  const toggleShuffle = useCallback(() => { tap(); setShuffle((v) => !v); }, []);

  const enqueueNext = useCallback((id) => {
    setQueue((q) => {
      const base = q.filter((x) => x !== id);
      const i = current ? base.indexOf(current.id) : -1;
      base.splice(i + 1, 0, id);
      return base;
    });
    showToast('Añadida a la cola');
  }, [current, showToast]);

  useEffect(() => {
    if (!status.didJustFinish) return;
    setAdGate((n) => n + 1);
    if (repeat === 'one') { if (isYt) { ytCmd('seek', 0); ytCmd('play'); } else { try { player.seekTo(0); player.play(); } catch (e) {} } } else step(1, true);
  }, [status.didJustFinish]); // eslint-disable-line

  // Reproducción válida: sesión iniciada, >= 30 s, una pagada por canción y día.
  // Con backend, el servidor mide el tiempo y decide el abono; sin backend se simula localmente.
  useEffect(() => {
    if (!current || !user || isBand || !status.playing || band?.provisional) return;
    if (status.currentTime < RULES.minSeconds) return;
    const k = `${current.id}|${today()}`;
    if (credited[k]) return;
    if (current.remote) {
      const open = playRef.current;
      if (!open || open.songId !== current.id) return; // todavía no se abrió en el servidor
      playRef.current = null;
      setCredited((c) => ({ ...c, [k]: true }));
      completePlay(user.token, open.playId).then((r) => {
        if (r.credited > 0) {
          setPlays((n) => n + 1);
          showToast(`+$${r.credited} MXN para ${band.name}`);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        }
      }).catch(() => {});
      return;
    }
    setCredited((c) => ({ ...c, [k]: true }));
    setPlays((n) => n + 1);
    showToast(`+$${RULES.creditPerPlay} MXN para ${band.name}`);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, [status.currentTime, status.playing, current, user, credited]); // eslint-disable-line

  const toggleFav = useCallback((id) => {
    Haptics.selectionAsync().catch(() => {});
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [id, ...f]));
  }, []);
  const toggleFollow = useCallback((id) => { tap(); setFollowed((f) => (f.includes(id) ? f.filter((x) => x !== id) : [id, ...f])); }, []);

  const createPlaylist = useCallback((name, songIds = []) => {
    const colorsPool = [['#ff4f8b', '#8b5cff'], ['#c8ff3d', '#12c28a'], ['#4db8ff', '#1b2a8a'], ['#ffb84d', '#e0302f'], ['#b28aff', '#2cd5c4']];
    const id = `u${Date.now()}`;
    setPlaylists((p) => [{ id, name: name.trim() || 'Mi lista', songIds, colors: colorsPool[p.length % colorsPool.length] }, ...p]);
    showToast('Lista creada');
    return id;
  }, [showToast]);
  const addToPlaylist = useCallback((pid, sid) => {
    setPlaylists((p) => p.map((l) => (l.id === pid && !l.songIds.includes(sid) ? { ...l, songIds: [...l.songIds, sid] } : l)));
    showToast('Añadida a la lista');
  }, [showToast]);
  const removeFromPlaylist = useCallback((pid, sid) => setPlaylists((p) => p.map((l) => (l.id === pid ? { ...l, songIds: l.songIds.filter((x) => x !== sid) } : l))), []);
  const deletePlaylist = useCallback((pid) => setPlaylists((p) => p.filter((l) => l.id !== pid)), []);
  const getPlaylist = useCallback((id) => playlistById(id) || playlists.find((l) => l.id === id), [playlists]);

  const value = useMemo(() => ({
    ready, user, setUser, catalogVersion, catalogStatus, refreshCatalog, tourPending, startTour: () => setTourPending(true), finishTour: () => setTourPending(false), isBand, premium, setPremium, card, subscribe: (c) => { setCard(c); setPremium(true); }, cancelPremium: () => { setCard(null); setPremium(false); }, favorites, toggleFav, recent, plays,
    current, band, playing, play, toggle, step, seek, queue, context, toast, showToast, adGate,
    shuffle, repeat, toggleShuffle, cycleRepeat, enqueueNext,
    playlists, createPlaylist, addToPlaylist, removeFromPlaylist, deletePlaylist, getPlaylist,
    followed, toggleFollow, sheetSong, openSheet: setSheetSong, closeSheet: () => setSheetSong(null),
    logout: () => { setUser(null); try { player.pause(); } catch (e) {} ytCmd('pause'); },
    isYt, videoMode, viewMode, themeMode, setThemeMode, setMode, videoRect, setVideoRect, ytRef, ytId, onYtMessage, openOnYoutube,
  }), [ready, catalogVersion, catalogStatus, tourPending, user, isBand, premium, card, favorites, recent, plays, current, band, playing, queue, context, toast, adGate, shuffle, repeat, playlists, followed, sheetSong, isYt, viewMode, themeMode, videoRect, ytId]); // eslint-disable-line

  const statusValue = useMemo(() => status, [status.playing, status.currentTime, status.duration, status.didJustFinish, status.error]); // eslint-disable-line
  return <Ctx.Provider value={value}><StatusCtx.Provider value={statusValue}>{children}</StatusCtx.Provider></Ctx.Provider>;
}
