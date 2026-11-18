import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Cover from '../src/components/Cover';
import Press from '../src/components/Press';
import FadeIn from '../src/components/FadeIn';
import { BANDS } from '../src/data';
import { colors, type } from '../src/theme';

function Floating({ band, size, left, top, delay, rot }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(v, { toValue: 1, duration: 2800 + delay, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: 2800 + delay, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
  }, []); // eslint-disable-line
  return (
    <Animated.View style={{ position: 'absolute', left, top, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -16] }) }, { rotate: `${rot}deg` }] }}>
      <Cover band={band} size={size} radius={size * 0.22} />
    </Animated.View>
  );
}

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={s.root}>
      <LinearGradient colors={['rgba(255,93,143,0.22)', 'rgba(16,13,23,0)']} style={StyleSheet.absoluteFill} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 0.6 }} />
      <View style={s.stage}>
        <Floating band={BANDS[0]} size={150} left={20} top={insets.top + 40} delay={0} rot={-8} />
        <Floating band={BANDS[3]} size={120} left={210} top={insets.top + 90} delay={300} rot={9} />
        <Floating band={BANDS[1]} size={110} left={60} top={insets.top + 230} delay={600} rot={6} />
        <Floating band={BANDS[4]} size={140} left={190} top={insets.top + 260} delay={900} rot={-5} />
      </View>
      <View style={[s.sheet, { paddingBottom: insets.bottom + 20 }]}>
        <FadeIn delay={100}><Text style={type.label}>GrooveSpace Music</Text></FadeIn>
        <FadeIn delay={200}><Text style={[type.display, { marginTop: 8 }]}>Música de bandas reales.{'\n'}<Text style={{ color: colors.lime }}>Tu play las impulsa.</Text></Text></FadeIn>
        <FadeIn delay={320}><Text style={[type.body, { marginTop: 12 }]}>Escucha bandas grabadas en GrooveSpace. Cada reproducción válida acredita saldo a la banda para usarlo en salas, equipo e ingenieros.</Text></FadeIn>
        <FadeIn delay={440} style={{ marginTop: 24, gap: 12 }}>
          <Press onPress={() => router.push({ pathname: '/auth', params: { mode: 'register' } })} style={s.primary}><Text style={s.primaryTxt}>Crear cuenta gratis</Text></Press>
          <Press onPress={() => router.push({ pathname: '/auth', params: { mode: 'login' } })} style={s.ghost}><Text style={s.ghostTxt}>Ya tengo cuenta</Text></Press>
        </FadeIn>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  stage: { flex: 1 },
  sheet: { paddingHorizontal: 24, paddingTop: 8 },
  primary: { backgroundColor: colors.lime, borderRadius: 999, paddingVertical: 16, alignItems: 'center' },
  primaryTxt: { color: colors.onLime, fontWeight: '800', fontSize: 16 },
  ghost: { borderRadius: 999, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.line },
  ghostTxt: { color: colors.text, fontWeight: '700', fontSize: 16 },
});
