import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Cover from '../src/components/Cover';
import Press from '../src/components/Press';
import AdCard from '../src/components/AdCard';
import { colors, type } from '../src/theme';
import { ADS } from '../src/data';
import { clock } from '../src/lib/format';
import { useApp } from '../src/store';

export default function Player() {
  const { current, band, status, toggle, step, seek, favorites, toggleFav, premium, adGate, user, isBand, shuffle, repeat, toggleShuffle, cycleRepeat, context, openSheet, isYt, videoMode, setMode, setVideoRect, openOnYoutube } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scale = useRef(new Animated.Value(1)).current;
  const [w, setW] = useState(1);
  const artRef = useRef(null);
  const art = Math.min(width - 48, 340);

  // La carátula "respira": grande al reproducir, más pequeña en pausa.
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
  const pct = Math.min(1, (status.currentTime || 0) / dur);
  const valid = (status.currentTime || 0) >= 30;
  const counts = user && !isBand && !band.provisional;
  const ad = ADS[adGate % ADS.length];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient colors={[band.colors[0], band.colors[1] + '99', colors.bg]} locations={[0, 0.45, 0.9]} style={StyleSheet.absoluteFill} />
      <View style={{ flex: 1, paddingTop: insets.top + 8, paddingHorizontal: 24, paddingBottom: insets.bottom + 16 }}>
        <View style={s.top}>
          <Press onPress={() => router.back()} style={s.round} accessibilityLabel="Cerrar"><Ionicons name="chevron-down" size={24} color="#fff" /></Press>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={s.from}>REPRODUCIENDO DESDE</Text>
            <Text style={s.fromName} numberOfLines={1}>{context}</Text>
          </View>
          <Press onPress={() => openSheet(current.id)} style={s.round} accessibilityLabel="Más opciones"><Ionicons name="ellipsis-horizontal" size={22} color="#fff" /></Press>
        </View>

        <View style={s.modes}>
          {[['audio', 'musical-notes', 'Audio'], ['video', 'videocam', 'Video']].map(([m, icon, label]) => {
            const on = (m === 'video') === videoMode;
            const off = m === 'video' && !isYt;
            return (
              <Press key={m} onPress={() => setMode(m)} scale={0.95} style={[s.mode, on && s.modeOn, off && { opacity: 0.4 }]} accessibilityLabel={`Modo ${label}`}>
                <Ionicons name={icon} size={15} color={on ? colors.onLime : '#fff'} />
                <Text style={[s.modeTxt, on && { color: colors.onLime }]}>{label}</Text>
              </Press>
            );
          })}
        </View>

        <View style={{ alignItems: 'center', marginTop: 18 }}>
          <View ref={artRef} collapsable={false} style={{ width: art, height: art, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={{ transform: [{ scale: videoMode ? 1 : scale }], opacity: videoMode && isYt ? 0 : 1 }}>
              <Cover band={band} size={art} radius={14} seed={current.id} />
            </Animated.View>
          </View>
        </View>
        {status.error ? (
          <Pressable onPress={openOnYoutube} style={s.errBox}>
            <Ionicons name="alert-circle" size={16} color={colors.amber} />
            <Text style={s.errTxt}>YouTube no pudo reproducir este video (código {status.error}). Toca para abrirlo en YouTube.</Text>
          </Pressable>
        ) : null}

        <View style={s.meta}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={s.title}>{current.title}</Text>
            <Pressable onPress={() => { router.back(); router.push(`/band/${band.id}`); }}><Text numberOfLines={1} style={s.artist}>{band.name}</Text></Pressable>
          </View>
          <Press onPress={() => toggleFav(current.id)} scale={0.8} hitSlop={10}><Ionicons name={fav ? 'heart' : 'heart-outline'} size={28} color={fav ? colors.pink : '#fff'} /></Press>
        </View>

        <Pressable onLayout={(e) => setW(e.nativeEvent.layout.width)} onPress={(e) => seek((e.nativeEvent.locationX / w) * dur)} style={s.trackHit} accessibilityLabel="Barra de progreso">
          <View style={s.track}><View style={[s.fill, { width: `${pct * 100}%` }]} /></View>
          <View style={[s.knob, { left: `${pct * 100}%` }]} />
        </Pressable>
        <View style={s.times}><Text style={s.time}>{clock(status.currentTime)}</Text><Text style={s.time}>{clock(dur)}</Text></View>

        <View style={s.controls}>
          <Press onPress={toggleShuffle} scale={0.85} hitSlop={10} accessibilityLabel="Aleatorio">
            <Ionicons name="shuffle" size={26} color={shuffle ? colors.lime : '#fff'} />
            {shuffle && <View style={s.dot} />}
          </Press>
          <Press onPress={() => step(-1)} scale={0.85} hitSlop={10}><Ionicons name="play-skip-back" size={34} color="#fff" /></Press>
          <Press onPress={toggle} scale={0.92} style={s.bigPlay} accessibilityLabel={status.playing ? 'Pausar' : 'Reproducir'}>
            <Ionicons name={status.playing ? 'pause' : 'play'} size={34} color={colors.onLime} style={!status.playing && { marginLeft: 4 }} />
          </Press>
          <Press onPress={() => step(1)} scale={0.85} hitSlop={10}><Ionicons name="play-skip-forward" size={34} color="#fff" /></Press>
          <Press onPress={cycleRepeat} scale={0.85} hitSlop={10} accessibilityLabel="Repetir">
            <Ionicons name={repeat === 'one' ? 'repeat' : 'repeat'} size={26} color={repeat === 'off' ? '#fff' : colors.lime} />
            {repeat === 'one' && <Text style={s.one}>1</Text>}
            {repeat !== 'off' && <View style={s.dot} />}
          </Press>
        </View>

        <View style={s.bottom}>
          <View style={[s.valid, valid && counts && { backgroundColor: colors.limeSoft }]}>
            <Ionicons name={valid && counts ? 'checkmark-circle' : 'time-outline'} size={15} color={valid && counts ? colors.lime : '#fff'} />
            <Text style={[s.validTxt, valid && counts && { color: colors.lime }]} numberOfLines={1}>
              {band.provisional ? 'Contenido de prueba: no acredita saldo' : isBand ? 'Cuenta de banda: no acredita reproducciones' : !user ? 'Inicia sesión para que cuente' : valid ? 'Reproducción válida acreditada' : `Válida en ${Math.max(0, 30 - Math.floor(status.currentTime || 0))} s`}
            </Text>
          </View>
          <Press onPress={() => router.push('/queue')} scale={0.9} hitSlop={10} accessibilityLabel="Ver cola"><Ionicons name="list" size={26} color="#fff" /></Press>
        </View>

        {!premium && !isBand && <View style={{ marginTop: 14 }}><AdCard ad={ad} compact /></View>}
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  modes: { flexDirection: 'row', alignSelf: 'center', marginTop: 14, padding: 3, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.3)' },
  mode: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 999 },
  modeOn: { backgroundColor: colors.lime },
  modeTxt: { color: '#fff', fontWeight: '800', fontSize: 13 },
  errBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, padding: 10, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.35)' },
  errTxt: { flex: 1, color: '#fff', fontSize: 12 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  round: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  from: { color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  fromName: { color: '#fff', fontSize: 13, fontWeight: '700' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 28 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  artist: { color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '600', marginTop: 2 },
  trackHit: { height: 28, justifyContent: 'center', marginTop: 8 },
  track: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden' },
  fill: { height: 4, backgroundColor: '#fff' },
  knob: { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: '#fff', marginLeft: -6 },
  times: { flexDirection: 'row', justifyContent: 'space-between' },
  time: { color: 'rgba(255,255,255,0.75)', fontSize: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  bigPlay: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', alignSelf: 'center', bottom: -7, width: 4, height: 4, borderRadius: 2, backgroundColor: colors.lime },
  one: { position: 'absolute', alignSelf: 'center', top: 6, color: colors.lime, fontSize: 9, fontWeight: '900' },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22 },
  valid: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.25)', flexShrink: 1 },
  validTxt: { color: '#fff', fontSize: 12, fontWeight: '600', flexShrink: 1 },
});
