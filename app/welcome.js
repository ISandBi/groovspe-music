import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Cover from '../src/components/Cover';
import Press from '../src/components/Press';
import FadeIn from '../src/components/FadeIn';
import { BANDS } from '../src/data';
import { colors } from '../src/theme';

const SIZE = 118, GAP = 12, ITEM = SIZE + GAP;
const LOOP = BANDS.length * ITEM;

// Columna de carátulas que se desplaza sin fin (mosaico animado).
function Column({ offset, reverse, duration }) {
  const y = useRef(new Animated.Value(reverse ? -LOOP : 0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(y, { toValue: reverse ? 0 : -LOOP, duration, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, []); // eslint-disable-line
  const rows = [...BANDS, ...BANDS, ...BANDS].map((_, i) => BANDS[(i + offset) % BANDS.length]);
  return (
    <Animated.View style={{ gap: GAP, transform: [{ translateY: y }] }}>
      {rows.map((b, i) => <Cover key={i} band={b} size={SIZE} radius={18} seed={i + offset} />)}
    </Animated.View>
  );
}

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  return (
    <View style={s.root}>
      <View style={[s.mosaic, { width: width * 1.5, height: height * 1.1, left: -width * 0.28, top: -height * 0.12 }]}>
        <View style={{ flexDirection: 'row', gap: GAP, justifyContent: 'center' }}>
          <Column offset={0} duration={42000} />
          <Column offset={2} reverse duration={52000} />
          <Column offset={4} duration={46000} />
          <Column offset={1} reverse duration={58000} />
        </View>
      </View>
      <LinearGradient colors={['rgba(16,13,23,0.2)', 'rgba(16,13,23,0.0)']} style={[StyleSheet.absoluteFill, { height: height * 0.25 }]} />
      <LinearGradient colors={['rgba(16,13,23,0)', 'rgba(16,13,23,0.92)', colors.bg]} locations={[0, 0.5, 0.75]} style={[s.fade, { height: height * 0.7 }]} />
      <LinearGradient colors={['rgba(255,93,143,0.35)', 'rgba(106,44,255,0)']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={[s.glow, { height: height * 0.5 }]} pointerEvents="none" />

      <View style={[s.content, { paddingBottom: insets.bottom + 20 }]}>
        <FadeIn delay={100} style={s.brand}>
          <LinearGradient colors={[colors.lime, '#12c28a']} style={s.logo}><Ionicons name="musical-notes" size={22} color={colors.onLime} /></LinearGradient>
          <Text style={s.brandTxt}>GrooveSpace <Text style={{ color: colors.lime }}>Music</Text></Text>
        </FadeIn>
        <FadeIn delay={220}><Text style={s.title}>Música que{'\n'}nace en la sala.</Text></FadeIn>
        <FadeIn delay={340}><Text style={s.sub}>Escucha a bandas grabadas en GrooveSpace. Cada reproducción válida les suma saldo para ensayar, grabar y crecer.</Text></FadeIn>
        <FadeIn delay={460} style={{ gap: 12, marginTop: 26 }}>
          <Press onPress={() => router.push({ pathname: '/auth', params: { mode: 'register' } })} style={s.primary}>
            <Text style={s.primaryTxt}>Empezar gratis</Text>
          </Press>
          <Press onPress={() => router.push({ pathname: '/auth', params: { mode: 'login' } })} style={s.ghost}>
            <Text style={s.ghostTxt}>Ya tengo cuenta</Text>
          </Press>
        </FadeIn>
        <FadeIn delay={560}><Text style={s.foot}>¿Eres banda de GrooveSpace? Entra con tu cuenta del sitio.</Text></FadeIn>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, overflow: 'hidden' },
  mosaic: { position: 'absolute', transform: [{ rotate: '-14deg' }], opacity: 0.95 },
  fade: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  glow: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  content: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 24 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  logo: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  brandTxt: { color: colors.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  title: { color: colors.text, fontSize: 46, lineHeight: 50, fontWeight: '900', letterSpacing: -2 },
  sub: { color: colors.body, fontSize: 16, lineHeight: 23, marginTop: 12 },
  primary: { backgroundColor: colors.lime, borderRadius: 999, paddingVertical: 17, alignItems: 'center' },
  primaryTxt: { color: colors.onLime, fontWeight: '800', fontSize: 16 },
  ghost: { borderRadius: 999, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,248,255,0.35)' },
  ghostTxt: { color: colors.text, fontWeight: '700', fontSize: 16 },
  foot: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 16 },
});
