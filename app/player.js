import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
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
  const { current, band, status, toggle, step, seek, favorites, toggleFav, premium, adGate, user } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const spin = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [w, setW] = useState(1);

  // El disco gira mientras suena y "respira" al pausar.
  useEffect(() => {
    let loop;
    if (status.playing) {
      loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 14000, easing: Easing.linear, useNativeDriver: true }));
      spin.setValue(0); loop.start();
    }
    Animated.spring(scale, { toValue: status.playing ? 1 : 0.88, useNativeDriver: true, bounciness: 8 }).start();
    return () => loop && loop.stop();
  }, [status.playing]); // eslint-disable-line

  useEffect(() => { if (!current) router.back(); }, [current]); // eslint-disable-line
  if (!current) return null;
  const fav = favorites.includes(current.id);
  const dur = status.duration || current.duration;
  const pct = Math.min(1, (status.currentTime || 0) / dur);
  const valid = (status.currentTime || 0) >= 30;
  const ad = ADS[adGate % ADS.length];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient colors={[band.colors[0] + '88', colors.bg]} style={StyleSheet.absoluteFill} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 0.7 }} />
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: insets.bottom + 16, flex: 1 }}>
        <View style={s.top}>
          <Press onPress={() => router.back()} style={s.round} accessibilityLabel="Cerrar"><Ionicons name="chevron-down" size={22} color={colors.text} /></Press>
          <Text style={type.label}>Reproduciendo</Text>
          <Press onPress={() => { router.back(); router.push(`/band/${band.id}`); }} style={s.round} accessibilityLabel="Ver banda"><Ionicons name="people" size={18} color={colors.text} /></Press>
        </View>

        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <Animated.View style={{ transform: [{ scale }, { rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
            <View style={s.disc}>
              <Cover band={band} size={250} radius={125} />
              <View style={s.hole} />
            </View>
          </Animated.View>
        </View>

        <View style={s.meta}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={type.h1}>{current.title}</Text>
            <Text numberOfLines={1} style={[type.body, { color: colors.muted }]}>{band.name}</Text>
          </View>
          <Press onPress={() => toggleFav(current.id)} scale={0.8} hitSlop={10}><Ionicons name={fav ? 'heart' : 'heart-outline'} size={28} color={fav ? colors.pink : colors.text} /></Press>
        </View>

        <Pressable onLayout={(e) => setW(e.nativeEvent.layout.width)} onPress={(e) => seek((e.nativeEvent.locationX / w) * dur)} style={s.trackHit} accessibilityLabel="Barra de progreso">
          <View style={s.track}><View style={[s.fill, { width: `${pct * 100}%` }]} /></View>
          <View style={[s.knob, { left: `${pct * 100}%` }]} />
        </Pressable>
        <View style={s.times}><Text style={type.small}>{clock(status.currentTime)}</Text><Text style={type.small}>{clock(dur)}</Text></View>

        <View style={s.controls}>
          <Press onPress={() => step(-1)} scale={0.85} hitSlop={10}><Ionicons name="play-skip-back" size={30} color={colors.text} /></Press>
          <Press onPress={toggle} scale={0.92} style={s.bigPlay} accessibilityLabel={status.playing ? 'Pausar' : 'Reproducir'}>
            <Ionicons name={status.playing ? 'pause' : 'play'} size={34} color={colors.onLime} style={!status.playing && { marginLeft: 4 }} />
          </Press>
          <Press onPress={() => step(1)} scale={0.85} hitSlop={10}><Ionicons name="play-skip-forward" size={30} color={colors.text} /></Press>
        </View>

        <View style={[s.valid, valid && user && { backgroundColor: colors.limeSoft }]}>
          <Ionicons name={valid && user ? 'checkmark-circle' : 'time-outline'} size={16} color={valid && user ? colors.lime : colors.muted} />
          <Text style={[type.small, valid && user && { color: colors.lime }]}>
            {!user ? 'Inicia sesión para que cuente' : valid ? 'Reproducción válida: acreditada a la banda' : `Cuenta como válida a los 30 s (${Math.max(0, 30 - Math.floor(status.currentTime || 0))} s)`}
          </Text>
        </View>

        {!premium && <View style={{ marginTop: 16 }}><AdCard ad={ad} compact /></View>}
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  round: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  disc: { width: 262, height: 262, borderRadius: 131, backgroundColor: '#0b0910', alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: '#0b0910' },
  hole: { position: 'absolute', width: 28, height: 28, borderRadius: 14, backgroundColor: colors.bg, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 28 },
  trackHit: { height: 28, justifyContent: 'center', marginTop: 14 },
  track: { height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.14)', overflow: 'hidden' },
  fill: { height: 5, backgroundColor: colors.lime },
  knob: { position: 'absolute', width: 14, height: 14, borderRadius: 7, backgroundColor: colors.lime, marginLeft: -7 },
  times: { flexDirection: 'row', justifyContent: 'space-between' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 12 },
  bigPlay: { width: 74, height: 74, borderRadius: 37, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' },
  valid: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, paddingVertical: 9, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)' },
});
