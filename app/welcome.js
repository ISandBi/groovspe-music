import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Press from '../src/components/Press';
import FadeIn from '../src/components/FadeIn';
import { colors, shadow } from '../src/theme';

const FEATURES = [
  ['people', 'Bandas de la escena', 'Escucha música grabada por bandas en las salas y estudios de GrooveSpace.'],
  ['heart', 'Tu play suma', 'Cada reproducción válida acredita saldo a la banda para ensayar y grabar.'],
  ['videocam', 'Audio y video', 'Cambia entre escuchar y ver con un solo toque.'],
];

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient colors={['rgba(240,69,127,0.16)', 'rgba(139,92,255,0.07)', 'rgba(255,255,255,0)']} style={[StyleSheet.absoluteFill, { height: 380 }]} />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: 28, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <FadeIn style={{ alignItems: 'center' }}>
          <LinearGradient colors={['#ff4f8b', '#8b5cff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.icon, shadow]}>
            <Ionicons name="musical-notes" size={46} color="#fff" />
          </LinearGradient>
          <Text style={s.title}>Bienvenido a{'\n'}GrooveSpace Music</Text>
        </FadeIn>
        <View style={{ marginTop: 40, gap: 26 }}>
          {FEATURES.map(([icon, t, d], i) => (
            <FadeIn key={t} delay={150 + i * 120} style={s.feature}>
              <Ionicons name={icon} size={30} color={colors.accent} style={{ width: 40 }} />
              <View style={{ flex: 1 }}><Text style={s.fTitle}>{t}</Text><Text style={s.fText}>{d}</Text></View>
            </FadeIn>
          ))}
        </View>
      </ScrollView>
      <FadeIn delay={600} style={{ paddingHorizontal: 28, paddingBottom: insets.bottom + 16, gap: 6 }}>
        <Press onPress={() => router.push({ pathname: '/auth', params: { mode: 'register' } })} style={s.primary}><Text style={s.primaryTxt}>Continuar</Text></Press>
        <Press onPress={() => router.push({ pathname: '/auth', params: { mode: 'login' } })} style={s.link}><Text style={s.linkTxt}>Ya tengo cuenta · Soy una banda de GrooveSpace</Text></Press>
      </FadeIn>
    </View>
  );
}
const s = StyleSheet.create({
  icon: { width: 96, height: 96, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 34, fontWeight: '800', textAlign: 'center', color: colors.text, letterSpacing: -0.8, marginTop: 24, lineHeight: 40 },
  feature: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  fTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  fText: { fontSize: 15, lineHeight: 21, color: colors.muted, marginTop: 2 },
  primary: { backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  primaryTxt: { color: '#fff', fontWeight: '700', fontSize: 17 },
  link: { paddingVertical: 12, alignItems: 'center' },
  linkTxt: { color: colors.accent, fontSize: 15 },
});
