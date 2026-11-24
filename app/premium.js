import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Press from '../src/components/Press';
import { useTheme } from '../src/theme';
import { useApp } from '../src/store';

const PERKS = [
  ['school', 'Aprende a tocar', 'Acordes, diagramas de guitarra, tempo, metrónomo y letra con acordes sincronizada con la canción.'],
  ['ban', 'Sin anuncios', 'Escucha sin los anuncios de GrooveSpace.'],
  ['heart', 'Apoya a las bandas', 'Tus reproducciones válidas siguen sumando saldo para las bandas, igual que en el plan gratuito.'],
];

export default function Premium() {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  const { premium, setPremium } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 40 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#ff4f8b', '#8b5cff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.hero, { paddingTop: insets.top + 12 }]}>
          <Press onPress={() => router.back()} hitSlop={12} style={s.back}><Ionicons name="chevron-back" size={26} color="#fff" /><Text style={s.backTxt}>Atrás</Text></Press>
          <Text style={s.kicker}>GROOVESPACE</Text>
          <Text style={s.title}>Premium</Text>
          <Text style={s.price}>$49 MXN / mes</Text>
          <Text style={s.demo}>Precio de demostración · sin cobro real</Text>
        </LinearGradient>
        <View style={{ padding: 20, gap: 16 }}>
          {PERKS.map(([icon, t, d]) => (
            <View key={t} style={s.perk}>
              <View style={s.perkIcon}><Ionicons name={icon} size={22} color={colors.accent} /></View>
              <View style={{ flex: 1 }}><Text style={type.h3}>{t}</Text><Text style={[type.body, { fontSize: 14 }]}>{d}</Text></View>
            </View>
          ))}
          <Press onPress={() => setPremium(!premium)} style={[s.cta, premium && { backgroundColor: colors.surface }]}>
            <Text style={[s.ctaTxt, premium && { color: colors.text }]}>{premium ? 'Cancelar Premium (demostración)' : 'Activar Premium (demostración)'}</Text>
          </Press>
          {premium && <Text style={[type.small, { textAlign: 'center' }]}>Premium activo. Ya puedes abrir "Aprende a tocar" en cualquier canción de GrooveSpace.</Text>}
        </View>
      </ScrollView>
    </View>
  );
}
const makeS = (colors, type) => StyleSheet.create({
  hero: { paddingHorizontal: 20, paddingBottom: 32 },
  back: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 6 },
  backTxt: { color: '#fff', fontSize: 17 },
  kicker: { color: 'rgba(255,255,255,0.85)', fontWeight: '800', letterSpacing: 1.4, marginTop: 18, fontSize: 12 },
  title: { color: '#fff', fontSize: 44, fontWeight: '900', letterSpacing: -1.2 },
  price: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 6 },
  demo: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  perk: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  perkIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  cta: { backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  ctaTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
