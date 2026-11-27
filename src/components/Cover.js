import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { shadow, useTheme } from '../theme';
import { useArtwork } from '../lib/artwork';

// Carátula generada: degradado de la banda + iniciales. `elevated` añade la sombra suave tipo álbum.
export default function Cover({ band, size = 56, radius = 10, style, seed = 0, elevated, cover }) {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  const art = useArtwork(seed);
  const n = typeof seed === 'number' ? seed : [...String(seed)].reduce((a, c) => a + c.charCodeAt(0), 0);
  const dirs = [[0, 0, 1, 1], [1, 0, 0, 1], [0, 1, 1, 0], [0.5, 0, 0.5, 1]];
  const d = dirs[n % 4];
  const initials = band.name.split(' ').slice(0, 2).map((w) => w[0]).join('');
  return (
    <View style={[{ width: size, height: size, borderRadius: radius, backgroundColor: band.colors[0] }, elevated && shadow, style]}>
      <LinearGradient colors={band.colors} start={{ x: d[0], y: d[1] }} end={{ x: d[2], y: d[3] }} style={[s.fill, { borderRadius: radius }]}>
        <View style={[s.ring, { width: size * 0.95, height: size * 0.95, borderRadius: size, right: -size * 0.32, top: -size * 0.32 }]} />
        <View style={[s.ring, { width: size * 0.6, height: size * 0.6, borderRadius: size, left: -size * 0.15, bottom: -size * 0.2 }]} />
        <Text style={[s.txt, { fontSize: size * 0.3, left: size * 0.1, bottom: size * 0.07 }]}>{initials}</Text>
      </LinearGradient>
      {band.logo ? <Image source={{ uri: band.logo }} resizeMode="cover" style={[StyleSheet.absoluteFill, { borderRadius: radius }]} /> : null}
      {cover ? <Image source={{ uri: cover }} resizeMode="cover" style={[StyleSheet.absoluteFill, { borderRadius: radius }]} /> : null}
      {art ? <Image source={{ uri: art }} resizeMode="cover" style={[StyleSheet.absoluteFill, { borderRadius: radius }]} /> : null}
    </View>
  );
}
const makeS = (colors, type) => StyleSheet.create({
  fill: { flex: 1, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.12)' },
  ring: { position: 'absolute', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.28)' },
  txt: { position: 'absolute', color: 'rgba(255,255,255,0.95)', fontWeight: '800', letterSpacing: -0.5 },
});
