import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Cover from '../src/components/Cover';
import Press from '../src/components/Press';
import AdCard from '../src/components/AdCard';
import { colors, shadow } from '../src/theme';
import { ADS } from '../src/data';
import { clock } from '../src/lib/format';
import { useApp } from '../src/store';

// Reproductor "ahora suena": fondo dinámico con los colores de la banda, portada grande y controles blancos.
export default function Player() {
  const { current, band, status, toggle, step, seek, favorites, toggleFav, premium, adGate, user, isBand, shuffle, repeat, toggleShuffle, cycleRepeat, context, openSheet, isYt, videoMode, setMode, setVideoRect, openOnYoutube } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scale = useRef(new Animated.Value(1)).current;
  const [w, setW] = useState(1);
  const artRef = useRef(null);
  const art = Math.min(width - 56, 340);

  useEffect(() => { Animated.spring(scale, { toValue: status.playing ? 1 : 0.86, useNativeDriver: true, bounciness: 8 }).start(); }, [status.playing]); // eslint-disable-line
  useEffect(() => { if (!current) router.back(); }, [current]); // eslint-disable-line
  // Posiciona el video de YouTube sobre la carátula cuando el modo es "video".
  useEffect(() => {
    if (!videoMode || !isYt) { setVideoRect(null); return undefined; }
    const t = setTimeout(() => artRef.current?.measureInWindow((x, y, wd, ht) => {
      const h = Math.round((wd * 9) / 16);
      setVideoRect({ x, y: y + (ht - h) / 2, w: wd, h });
    }), 420);
    return () => clearTimeout(t);
  }, [videoMode, isYt, current?.id, width]); // eslint-disable-line
  useEffect(() => () => setVideoRect(null), []); // eslint-disable-line
  if (!current) return null;

  const fav = favorites.includes(current.id);
  const dur = status.duration || current.duration;
  const elapsed = status.currentTime || 0;
  const pct = Math.min(1, elapsed / dur);
  const valid = elapsed >= 30;
  const counts = user && !isBand && !band.provisional;
  const ad = ADS[adGate % ADS.length];
  const note = band.provisional ? 'Contenido de prueba · no acredita saldo' : isBand ? 'Cuenta de banda · no acredita' : !user ? 'Inicia sesión para que cuente' : valid ? 'Reproducción válida acreditada' : `Válida en ${Math.max(0, 30 - Math.floor(elapsed))} s`;

  return (
    <View style={{ flex: 1, backgroundColor: '#1a1325' }}>
      <StatusBar style="light" />
      <LinearGradient colors={band.colors} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)']} style={StyleSheet.absoluteFill} />
      <View style={{ flex: 1, paddingTop: insets.top + 6, paddingHorizontal: 28, paddingBottom: insets.bottom + 14 }}>
        <Pressable onPress={() => router.back()} hitSlop={20} style={s.grabWrap} accessibilityLabel="Cerrar reproductor"><View style={s.grab} /></Pressable>

        <View style={s.modes}>
          {[['audio', 'Audio'], ['video', 'Video']].map(([m, label]) => {
            const on = (m === 'video') === videoMode;
            return (
              <Press key={m} onPress={() => setMode(m)} scale={0.96} style={[s.mode, on && s.modeOn, m === 'video' && !isYt && { opacity: 0.4 }]} accessibilityLabel={`Modo ${label}`}>
                <Text style={[s.modeTxt, on && { color: '#1a1325' }]}>{label}</Text>
              </Press>
            );
          })}
        </View>

        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <View ref={artRef} collapsable={false} style={{ width: art, height: art, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={{ transform: [{ scale: videoMode ? 1 : scale }], opacity: videoMode && isYt ? 0 : 1 }}>
              <Cover band={band} size={art} radius={14} seed={current.id} elevated />
            </Animated.View>
          </View>
        </View>
        {status.error ? (
          <Pressable onPress={openOnYoutube} style={s.errBox}>
            <Ionicons name="alert-circle" size={16} color="#fff" />
            <Text style={s.errTxt}>YouTube no pudo reproducir este video (código {status.error}). Toca para abrirlo en YouTube.</Text>
          </Pressable>
        ) : null}

        <View style={s.meta}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={s.title}>{current.title}</Text>
            <Pressable onPress={() => { router.back(); router.push(`/band/${band.id}`); }}><Text numberOfLines={1} style={s.artist}>{band.name}</Text></Pressable>
          </View>
          <Press onPress={() => toggleFav(current.id)} scale={0.85} hitSlop={8} style={s.circle} accessibilityLabel="Favorita"><Ionicons name={fav ? 'heart' : 'heart-outline'} size={20} color="#fff" /></Press>
          <Press onPress={() => openSheet(current.id)} scale={0.85} hitSlop={8} style={s.circle} accessibilityLabel="Más opciones"><Ionicons name="ellipsis-horizontal" size={20} color="#fff" /></Press>
        </View>

        <Pressable onLayout={(e) => setW(e.nativeEvent.layout.width)} onPress={(e) => seek((e.nativeEvent.locationX / w) * dur)} style={s.trackHit} accessibilityLabel="Barra de progreso">
          <View style={s.track}><View style={[s.fill, { width: `${pct * 100}%` }]} /></View>
        </Pressable>
        <View style={s.times}><Text style={s.time}>{clock(elapsed)}</Text><Text style={s.time}>-{clock(Math.max(0, dur - elapsed))}</Text></View>

        <View style={s.controls}>
          <Press onPress={() => step(-1)} scale={0.85} hitSlop={12} accessibilityLabel="Anterior"><Ionicons name="play-back" size={40} color="#fff" /></Press>
          <Press onPress={toggle} scale={0.9} hitSlop={12} accessibilityLabel={status.playing ? 'Pausar' : 'Reproducir'}><Ionicons name={status.playing ? 'pause' : 'play'} size={62} color="#fff" /></Press>
          <Press onPress={() => step(1)} scale={0.85} hitSlop={12} accessibilityLabel="Siguiente"><Ionicons name="play-forward" size={40} color="#fff" /></Press>
        </View>

        <View style={s.bottom}>
          <Press onPress={toggleShuffle} scale={0.85} hitSlop={12} style={[s.tool, shuffle && s.toolOn]} accessibilityLabel="Aleatorio"><Ionicons name="shuffle" size={22} color={shuffle ? '#1a1325' : '#fff'} /></Press>
          <View style={s.note}>
            <Ionicons name={valid && counts ? 'checkmark-circle' : 'time-outline'} size={14} color="#fff" />
            <Text style={s.noteTxt} numberOfLines={1}>{note}</Text>
          </View>
          <Press onPress={cycleRepeat} scale={0.85} hitSlop={12} style={[s.tool, repeat !== 'off' && s.toolOn]} accessibilityLabel="Repetir">
            <Ionicons name="repeat" size={22} color={repeat !== 'off' ? '#1a1325' : '#fff'} />
            {repeat === 'one' && <Text style={s.one}>1</Text>}
          </Press>
          <Press onPress={() => router.push('/queue')} scale={0.85} hitSlop={12} style={s.tool} accessibilityLabel="Ver cola"><Ionicons name="list" size={22} color="#fff" /></Press>
        </View>

        {!premium && !isBand && <View style={{ marginTop: 14 }}><AdCard ad={ad} compact dark /></View>}
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  grabWrap: { alignSelf: 'center', paddingVertical: 8 },
  grab: { width: 40, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },
  modes: { flexDirection: 'row', alignSelf: 'center', marginTop: 6, padding: 3, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.2)' },
  mode: { paddingHorizontal: 22, paddingVertical: 7, borderRadius: 999 },
  modeOn: { backgroundColor: '#fff' },
  modeTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  errBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, padding: 10, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.35)' },
  errTxt: { flex: 1, color: '#fff', fontSize: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 24 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  artist: { color: 'rgba(255,255,255,0.75)', fontSize: 20, marginTop: 1 },
  circle: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
  trackHit: { height: 24, justifyContent: 'center', marginTop: 14 },
  track: { height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.28)', overflow: 'hidden' },
  fill: { height: 5, backgroundColor: 'rgba(255,255,255,0.9)' },
  times: { flexDirection: 'row', justifyContent: 'space-between' },
  time: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 20 },
  tool: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  toolOn: { backgroundColor: '#fff' },
  one: { position: 'absolute', top: 4, right: 7, color: '#1a1325', fontSize: 9, fontWeight: '900' },
  note: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.25)' },
  noteTxt: { color: '#fff', fontSize: 12, fontWeight: '600', flexShrink: 1 },
});
