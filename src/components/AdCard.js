import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Press from './Press';
import { colors } from '../theme';

// Anuncio propio de GrooveSpace (eventos, bandas nuevas, renta de salas). Solo versión gratuita.
export default function AdCard({ ad, compact }) {
  return (
    <Press scale={0.98} accessibilityRole="button" accessibilityLabel={`Anuncio: ${ad.title}`}>
      <LinearGradient colors={ad.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.card, compact && { padding: 14 }]}>
        <View style={s.tag}><Text style={s.tagTxt}>ANUNCIO · {ad.kicker}</Text></View>
        <Text style={[s.title, compact && { fontSize: 18 }]}>{ad.title}</Text>
        <Text style={s.text}>{ad.text}</Text>
        <View style={s.cta}><Text style={s.ctaTxt}>{ad.cta}</Text></View>
      </LinearGradient>
    </Press>
  );
}
const s = StyleSheet.create({
  card: { borderRadius: 22, padding: 20, overflow: 'hidden' },
  tag: { alignSelf: 'flex-start', backgroundColor: 'rgba(16,13,23,0.55)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, marginBottom: 12 },
  tagTxt: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  text: { color: 'rgba(255,255,255,0.9)', marginTop: 4, fontSize: 14 },
  cta: { alignSelf: 'flex-start', marginTop: 14, backgroundColor: colors.bg, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999 },
  ctaTxt: { color: colors.text, fontWeight: '700', fontSize: 13 },
});
