import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { SONGS, RULES, songById, bandById, playlistById } from './data';
import { reportValidPlay } from './lib/api';
import { LOCK_SCREEN } from './lib/config';

const KEY = 'groovespace-music-v2';
const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);
const today = () => new Date().toISOString().slice(0, 10);
const tap = (f = 'Light') => Haptics.impactAsync(Haptics.ImpactFeedbackStyle[f]).catch(() => {});

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null); // { role: 'listener' | 'band', name, email, bandId?, token? }
  const [premium, setPremium] = useState(false);
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

  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const loaded = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const s = JSON.parse(raw);
          setUser(s.user || null); setPremium(!!s.premium); setFavorites(s.favorites || []);
          setRecent(s.recent || []); setCredited(s.credited || {}); setPlays(s.plays || 0);
          setPlaylists(s.playlists || []); setFollowed(s.followed || []);
        }
      } catch (e) { /* sin datos previos */ }
      setReady(true);
    })();
    setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: LOCK_SCREEN, interruptionMode: 'doNotMix' }).catch(() => {});
  }, []);
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(KEY, JSON.stringify({ user, premium, favorites, recent, credited, plays, playlists, followed })).catch(() => {});
  }, [ready, user, premium, favorites, recent, credited, plays, playlists, followed]);

  const showToast = useCallback((msg) => setToast({ msg, id: Date.now() }), []);
  const current = currentId ? songById(currentId) : null;
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
    if (loaded.current !== songId) {
      player.replace({ uri: song.url });
      loaded.current = songId;
      if (LOCK_SCREEN) try { player.setActiveForLockScreen(true, { title: song.title, artist: bandById(song.bandId).name, albumTitle: 'GrooveSpace Music' }); } catch (e) {}
    } else { try { player.seekTo(0); } catch (e) {} }
    player.play();
  }, [player]);

  const toggle = useCallback(() => {
    if (!current) return;
    Haptics.selectionAsync().catch(() => {});
    if (status.playing) player.pause(); else player.play();
  }, [current, status.playing, player]);

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

  const seek = useCallback((sec) => { try { player.seekTo(sec); } catch (e) {} }, [player]);
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
    if (repeat === 'one') { try { player.seekTo(0); player.play(); } catch (e) {} } else step(1, true);
  }, [status.didJustFinish]); // eslint-disable-line

  // Reproducción válida: sesión iniciada, >= 30 s, una pagada por canción y día.
  useEffect(() => {
    if (!current || !user || isBand || !status.playing) return;
    if (status.currentTime < RULES.minSeconds) return;
    const k = `${current.id}|${today()}`;
    if (credited[k]) return;
    setCredited((c) => ({ ...c, [k]: true }));
    setPlays((n) => n + 1);
    reportValidPlay({ songId: current.id, bandId: current.bandId });
    showToast(`+$${RULES.creditPerPlay} MXN para ${band.name}`);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, [status.currentTime, status.playing, current, user, credited]); // eslint-disable-line

  const toggleFav = useCallback((id) => {
    Haptics.selectionAsync().catch(() => {});
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [id, ...f]));
  }, []);
  const toggleFollow = useCallback((id) => { tap(); setFollowed((f) => (f.includes(id) ? f.filter((x) => x !== id) : [id, ...f])); }, []);

  const createPlaylist = useCallback((name, songIds = []) => {
    const colorsPool = [['#ff5d8f', '#6a2cff'], ['#c2ff3c', '#0fa968'], ['#4db8ff', '#1b2a8a'], ['#ffb84d', '#e0302f'], ['#b28aff', '#2cd5c4']];
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
    ready, user, setUser, isBand, premium, setPremium, favorites, toggleFav, recent, plays,
    current, band, status, play, toggle, step, seek, queue, context, toast, showToast, adGate,
    shuffle, repeat, toggleShuffle, cycleRepeat, enqueueNext,
    playlists, createPlaylist, addToPlaylist, removeFromPlaylist, deletePlaylist, getPlaylist,
    followed, toggleFollow, sheetSong, openSheet: setSheetSong, closeSheet: () => setSheetSong(null),
    logout: () => { setUser(null); try { player.pause(); } catch (e) {} },
  }), [ready, user, isBand, premium, favorites, recent, plays, current, band, status, queue, context, toast, adGate, shuffle, repeat, playlists, followed, sheetSong]); // eslint-disable-line

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
