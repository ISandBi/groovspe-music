import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Carátula generada: degradado de la banda + iniciales + círculos decorativos.
export default function Cover({ band, size = 56, radius = 12, style }) {
  const initials = band.name.split(' ').slice(0, 2).map((w) => w[0]).join('');
  return (
    <LinearGradient colors={band.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[{ width: size, height: size, borderRadius: radius, overflow: 'hidden' }, style]}>
      <View style={[s.ring, { width: size * 0.9, height: size * 0.9, borderRadius: size, right: -size * 0.3, top: -size * 0.3 }]} />
      <View style={[s.ring, { width: size * 0.6, height: size * 0.6, borderRadius: size, left: -size * 0.15, bottom: -size * 0.2 }]} />
      <Text style={[s.txt, { fontSize: size * 0.34, left: size * 0.12, bottom: size * 0.08 }]}>{initials}</Text>
    </LinearGradient>
  );
}
const s = StyleSheet.create({
  ring: { position: 'absolute', borderWidth: 2, borderColor: 'rgba(255,255,255,0.28)' },
  txt: { position: 'absolute', color: 'rgba(255,255,255,0.95)', fontWeight: '900', letterSpacing: -1 },
});
