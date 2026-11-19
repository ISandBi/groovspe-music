import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Press from './Press';
import Cover from './Cover';
import { colors, MINI_HEIGHT } from '../theme';
import { useApp } from '../store';

// Barra inferior "reproduciendo ahora". Al tocarla se abre el reproductor completo.
export default function MiniPlayer({ bottom }) {
  const { current, band, status, toggle, isYt, videoMode } = useApp();
  const router = useRouter();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.spring(v, { toValue: current ? 1 : 0, useNativeDriver: true, bounciness: 8 }).start(); }, [!!current]); // eslint-disable-line
  if (!current) return null;
  const dur = status.duration || current.duration;
  const pct = dur ? Math.min(1, (status.currentTime || 0) / dur) : 0;
  return (
    <Animated.View style={[s.wrap, { bottom, opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }]}>
      <Press onPress={() => router.push('/player')} scale={0.985} style={{ flex: 1 }} accessibilityLabel="Abrir reproductor">
        <LinearGradient colors={[band.colors[0] + 'dd', band.colors[1] + 'ee']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.card}>
          <Cover band={band} size={44} radius={8} seed={current.id} />
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={s.title}>{current.title}</Text>
            <View style={s.sub}>
              <Ionicons name={isYt && videoMode ? 'videocam' : 'musical-notes'} size={12} color="rgba(255,255,255,0.85)" />
              <Text numberOfLines={1} style={s.band}>{band.name}</Text>
            </View>
          </View>
          <Press onPress={toggle} scale={0.88} style={s.play} accessibilityLabel={status.playing ? 'Pausar' : 'Reproducir'}>
            <Ionicons name={status.playing ? 'pause' : 'play'} size={22} color={colors.onLime} style={!status.playing && { marginLeft: 2 }} />
          </Press>
          <View style={s.track}><View style={[s.fill, { width: `${pct * 100}%` }]} /></View>
        </LinearGradient>
      </Press>
    </Animated.View>
  );
}
const s = StyleSheet.create({
  wrap: { position: 'absolute', left: 8, right: 8, height: MINI_HEIGHT, zIndex: 20 },
  card: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, paddingHorizontal: 10, overflow: 'hidden' },
  title: { color: '#fff', fontSize: 15, fontWeight: '800' },
  sub: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  band: { color: 'rgba(255,255,255,0.88)', fontSize: 13, flexShrink: 1 },
  play: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' },
  track: { position: 'absolute', left: 10, right: 10, bottom: 3, height: 2, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
  fill: { height: 2, borderRadius: 1, backgroundColor: '#fff' },
});
