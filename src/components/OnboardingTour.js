import React, { useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Press from './Press';
import FadeIn from './FadeIn';
import { useTheme } from '../theme';
import { useApp } from '../store';

// Pasos del recorrido guiado: se muestra una sola vez, justo después del registro.
const STEPS = [
  { icon: 'play-circle', title: '¡Bienvenido a GrooveSpace!', text: 'Aquí escuchas a las bandas del sitio web y, con cada reproducción válida, les ayudas a ganar saldo.' },
  { icon: 'albums', title: 'Escuchar y Biblioteca', text: 'En "Escuchar" tienes lo nuevo y lo más sonado; en "Biblioteca" guardas tus favoritas, listas y las bandas que sigues.' },
  { icon: 'search', title: 'Buscar', text: 'Encuentra bandas y canciones por nombre o género en la pestaña "Buscar".' },
  { icon: 'heart', title: 'Reproducciones válidas', text: 'Si escuchas al menos 30 segundos con tu sesión iniciada, la banda recibe saldo. Solo cuenta una vez por canción al día.' },
  { icon: 'star', title: 'Aprende a tocar', text: 'Con GrooveSpace Premium desbloqueas lecciones para aprender a tocar las canciones del catálogo.' },
  { icon: 'person-circle', title: 'Tu cuenta', text: 'En "Cuenta" ajustas tu perfil, ves tu impacto y puedes repetir este recorrido cuando quieras.' },
];

export default function OnboardingTour() {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  const insets = useSafeAreaInsets();
  const { tourPending, finishTour } = useApp();
  const [i, setI] = useState(0);
  if (!tourPending) return null;
  const step = STEPS[i];
  const last = i === STEPS.length - 1;
  const close = () => { setI(0); finishTour(); };
  const next = () => (last ? close() : setI((n) => n + 1));

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={close}>
      <View style={[s.backdrop, { paddingBottom: insets.bottom + 24, paddingTop: insets.top + 24 }]}>
        <Press onPress={close} hitSlop={12} style={s.skip} accessibilityLabel="Saltar recorrido"><Text style={s.skipTxt}>Saltar</Text></Press>
        <FadeIn key={i} style={s.card}>
          <LinearGradient colors={['#ff4f8b', '#8b5cff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.icon}>
            <Ionicons name={step.icon} size={34} color="#fff" />
          </LinearGradient>
          <Text style={[type.h2, { textAlign: 'center', marginTop: 18 }]}>{step.title}</Text>
          <Text style={[type.body, { textAlign: 'center', marginTop: 10, color: colors.muted }]}>{step.text}</Text>
          <View style={s.dots}>
            {STEPS.map((_, d) => <View key={d} style={[s.dot, { backgroundColor: d === i ? colors.accent : colors.line, width: d === i ? 18 : 7 }]} />)}
          </View>
          <Press onPress={next} style={s.next}><Text style={s.nextTxt}>{last ? 'Empezar a escuchar' : 'Siguiente'}</Text></Press>
        </FadeIn>
      </View>
    </Modal>
  );
}
const makeS = (colors, type) => StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.78)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  skip: { position: 'absolute', top: 54, right: 20, zIndex: 2, padding: 8 },
  skipTxt: { color: '#fff', fontSize: 15, fontWeight: '600', opacity: 0.85 },
  card: { width: '100%', maxWidth: 380, backgroundColor: colors.surface, borderRadius: 24, padding: 28, alignItems: 'center' },
  icon: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center' },
  dots: { flexDirection: 'row', gap: 6, marginTop: 22, marginBottom: 20 },
  dot: { height: 7, borderRadius: 4 },
  next: { backgroundColor: colors.accent, borderRadius: 24, paddingVertical: 14, paddingHorizontal: 28, width: '100%', alignItems: 'center' },
  nextTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
