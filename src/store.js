import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { SONGS, RULES, songById, bandById } from './data';
import { reportValidPlay } from './lib/api';
import { LOCK_SCREEN } from './lib/config';

const KEY = 'groovespace-music-v1';
const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);
const today = () => new Date().toISOString().slice(0, 10);

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null); // { role: 'listener' | 'band', name, email, bandId?, token? }
  const [premium, setPremium] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [credited, setCredited] = useState({}); // "songId|fecha" -> true
  const [plays, setPlays] = useState(0);
  const [toast, setToast] = useState(null);
  const [queue, setQueue] = useState(SONGS.map((s) => s.id));
  const [currentId, setCurrentId] = useState(null);
  const [adGate, setAdGate] = useState(0); // canciones desde el último anuncio

  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const loaded = useRef(null);

  // Persistencia
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const s = JSON.parse(raw);
          setUser(s.user || null); setPremium(!!s.premium); setFavorites(s.favorites || []);
          setRecent(s.recent || []); setCredited(s.credited || {}); setPlays(s.plays || 0);
        }
      } catch (e) { /* sin datos previos */ }
      setReady(true);
    })();
    setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: LOCK_SCREEN, interruptionMode: 'doNotMix' }).catch(() => {});
  }, []);
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(KEY, JSON.stringify({ user, premium, favorites, recent, credited, plays })).catch(() => {});
  }, [ready, user, premium, favorites, recent, credited, plays]);

  const showToast = useCallback((msg) => { setToast({ msg, id: Date.now() }); }, []);

  const current = currentId ? songById(currentId) : null;
  const band = current ? bandById(current.bandId) : null;
  const isBand = user?.role === 'band';

  const play = useCallback((songId, list) => {
    const song = songById(songId);
    if (!song) return;
    if (list) setQueue(list);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setCurrentId(songId);
    setRecent((r) => [songId, ...r.filter((x) => x !== songId)].slice(0, 20));
    if (loaded.current !== songId) {
      player.replace({ uri: song.url });
      loaded.current = songId;
      if (LOCK_SCREEN) try { player.setActiveForLockScreen(true, { title: song.title, artist: bandById(song.bandId).name, albumTitle: 'GrooveSpace Music' }); } catch (e) {}
    }
    player.play();
  }, [player]);

  const toggle = useCallback(() => {
    if (!current) return;
    Haptics.selectionAsync().catch(() => {});
    if (status.playing) player.pause(); else player.play();
  }, [current, status.playing, player]);

  const step = useCallback((dir) => {
    if (!current) return;
    const i = queue.indexOf(current.id);
    const next = queue[(i + dir + queue.length) % queue.length];
    play(next);
  }, [current, queue, play]);

  const seek = useCallback((sec) => { try { player.seekTo(sec); } catch (e) {} }, [player]);

  // Fin de canción -> siguiente
  useEffect(() => {
    if (status.didJustFinish) {
      setAdGate((n) => n + 1);
      step(1);
    }
  }, [status.didJustFinish]); // eslint-disable-line

  // Reproducción válida: sesión iniciada, >= 30 s, una pagada por canción y día.
  useEffect(() => {
    if (!current || !user || !status.playing) return;
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

  const value = useMemo(() => ({
    ready, user, setUser, isBand, premium, setPremium, favorites, toggleFav, recent, plays,
    current, band, status, play, toggle, step, seek, queue, toast, showToast, adGate, setAdGate,
    logout: () => { setUser(null); player.pause(); },
  }), [ready, user, isBand, premium, favorites, recent, plays, current, band, status, queue, toast, adGate]); // eslint-disable-line

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
