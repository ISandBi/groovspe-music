import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Press from './Press';
import Cover from './Cover';
import { colors, type, MINI_HEIGHT } from '../theme';
import { useApp } from '../store';

export default function MiniPlayer({ bottom }) {
  const { current, band, status, toggle, step } = useApp();
  const router = useRouter();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(v, { toValue: current ? 1 : 0, useNativeDriver: true, bounciness: 8 }).start();
  }, [!!current]); // eslint-disable-line
  if (!current) return null;
  const pct = status.duration ? Math.min(1, status.currentTime / status.duration) : 0;
  return (
    <Animated.View style={[s.wrap, { bottom, opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }]}>
      <Press onPress={() => router.push('/player')} scale={0.985} style={s.card} accessibilityLabel="Abrir reproductor">
        <Cover band={band} size={44} radius={10} />
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={type.h3}>{current.title}</Text>
          <Text numberOfLines={1} style={type.small}>{band.name}</Text>
        </View>
        <Press onPress={() => step(-1)} hitSlop={8} scale={0.85}><Ionicons name="play-skip-back" size={20} color={colors.text} /></Press>
        <Press onPress={toggle} scale={0.88} style={s.play} accessibilityLabel={status.playing ? 'Pausar' : 'Reproducir'}>
          <Ionicons name={status.playing ? 'pause' : 'play'} size={20} color={colors.onLime} style={!status.playing && { marginLeft: 2 }} />
        </Press>
        <Press onPress={() => step(1)} hitSlop={8} scale={0.85}><Ionicons name="play-skip-forward" size={20} color={colors.text} /></Press>
        <View style={s.track}><View style={[s.fill, { width: `${pct * 100}%` }]} /></View>
      </Press>
    </Animated.View>
  );
}
const s = StyleSheet.create({
  wrap: { position: 'absolute', left: 10, right: 10, height: MINI_HEIGHT, zIndex: 20 },
  card: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.raised, borderRadius: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  play: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' },
  track: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, backgroundColor: 'rgba(255,255,255,0.08)' },
  fill: { height: 3, backgroundColor: colors.lime },
});
