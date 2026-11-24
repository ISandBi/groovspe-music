import React, { useEffect, useRef, useMemo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Press from './Press';
import Cover from './Cover';
import { MINI_HEIGHT, useTheme } from '../theme';
import { useApp, useStatus } from '../store';

// Barra "reproduciendo ahora" con efecto cristal sobre la barra de pestañas. Al tocarla se abre el reproductor.
export default function MiniPlayer({ bottom }) {
  const { colors, type, dark } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  const status = useStatus();
  const { current, band, toggle, step, isYt, videoMode } = useApp();
  const router = useRouter();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.spring(v, { toValue: current ? 1 : 0, useNativeDriver: true, bounciness: 6 }).start(); }, [!!current]); // eslint-disable-line
  if (!current) return null;
  const dur = status.duration || current.duration;
  const pct = dur ? Math.min(1, (status.currentTime || 0) / dur) : 0;
  return (
    <Animated.View style={[s.wrap, { bottom, opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }]}>
      <BlurView tint={dark ? 'dark' : 'light'} intensity={90} style={s.blur}>
        <View style={[s.tint, { backgroundColor: colors.glass }]} />
        <Pressable onPress={() => router.push('/player')} style={s.row} accessibilityLabel="Abrir reproductor">
          <Cover band={band} size={42} radius={6} seed={current.id} />
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={s.title}>{current.title}</Text>
            <View style={s.sub}>
              {isYt && <Ionicons name={videoMode ? 'videocam' : 'musical-notes'} size={11} color={colors.muted} />}
              <Text numberOfLines={1} style={s.band}>{band.name}</Text>
            </View>
          </View>
          <Press onPress={toggle} scale={0.85} hitSlop={8} accessibilityLabel={status.playing ? 'Pausar' : 'Reproducir'}>
            <Ionicons name={status.playing ? 'pause' : 'play'} size={26} color={colors.text} />
          </Press>
          <Press onPress={() => step(1)} scale={0.85} hitSlop={8} accessibilityLabel="Siguiente">
            <Ionicons name="play-forward" size={26} color={colors.text} />
          </Press>
        </Pressable>
        <View style={s.track}><View style={[s.fill, { width: `${pct * 100}%` }]} /></View>
      </BlurView>
    </Animated.View>
  );
}
const makeS = (colors, type) => StyleSheet.create({
  wrap: { position: 'absolute', left: 8, right: 8, height: MINI_HEIGHT, zIndex: 20, borderRadius: 14, shadowColor: '#1a1325', shadowOpacity: 0.16, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  blur: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  tint: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(250,248,253,0.82)' },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 8 },
  title: { fontSize: 15, fontWeight: '600', color: colors.text },
  sub: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  band: { fontSize: 13, color: colors.muted, flexShrink: 1 },
  track: { position: 'absolute', left: 8, right: 8, bottom: 0, height: 2, backgroundColor: colors.line },
  fill: { height: 2, backgroundColor: colors.accent },
});
