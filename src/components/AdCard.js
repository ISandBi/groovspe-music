import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Press from './Press';
import { useTheme } from '../theme';

// Anuncio propio de GrooveSpace (eventos, bandas nuevas, renta de salas). Solo versión gratuita.
export default function AdCard({ ad, compact, dark }) {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  return (
    <Press scale={0.985} style={[s.card, dark && s.dark]} accessibilityRole="button" accessibilityLabel={`Anuncio: ${ad.title}`}>
      <LinearGradient colors={ad.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.thumb, compact && { width: 44, height: 44 }]}>
        <Ionicons name="sparkles" size={compact ? 18 : 22} color="#fff" />
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <Text style={[s.tag, dark && { color: 'rgba(255,255,255,0.7)' }]}>ANUNCIO · {ad.kicker}</Text>
        <Text numberOfLines={1} style={[s.title, dark && { color: '#fff' }]}>{ad.title}</Text>
        {!compact && <Text numberOfLines={2} style={[s.text, dark && { color: 'rgba(255,255,255,0.8)' }]}>{ad.text}</Text>}
      </View>
      <View style={[s.cta, dark && { backgroundColor: '#fff' }]}><Text style={[s.ctaTxt, dark && { color: colors.text }]}>{ad.cta}</Text></View>
    </Press>
  );
}
const makeS = (colors, type) => StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 14, padding: 12 },
  dark: { backgroundColor: 'rgba(255,255,255,0.16)' },
  thumb: { width: 56, height: 56, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tag: { fontSize: 10, fontWeight: '700', letterSpacing: 0.6, color: colors.muted },
  title: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 1 },
  text: { fontSize: 13, color: colors.muted, marginTop: 1 },
  cta: { backgroundColor: colors.accent, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999 },
  ctaTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
