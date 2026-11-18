import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Press from '../../src/components/Press';
import FadeIn from '../../src/components/FadeIn';
import { colors, type } from '../../src/theme';
import { RULES } from '../../src/data';
import { useApp } from '../../src/store';

export default function Profile() {
  const { user, premium, setPremium, plays, favorites, logout } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const initial = (user?.name || '?')[0].toUpperCase();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 170, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
      <FadeIn style={s.head}>
        <View style={s.avatar}><Text style={s.avatarTxt}>{initial}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={type.h1}>{user?.name}</Text>
          <Text style={type.small}>{user?.email}</Text>
        </View>
      </FadeIn>

      <FadeIn delay={100} style={s.stats}>
        <Stat n={plays} l="Reproducciones válidas" />
        <Stat n={`$${plays * RULES.creditPerPlay}`} l="MXN a bandas" />
        <Stat n={favorites.length} l="Favoritas" />
      </FadeIn>

      <FadeIn delay={200} style={s.card}>
        <View style={{ flex: 1 }}>
          <Text style={type.h3}>Plan Premium (sin anuncios)</Text>
          <Text style={[type.small, { marginTop: 2 }]}>Demostración: activa o desactiva los anuncios propios de GrooveSpace.</Text>
        </View>
        <Switch value={premium} onValueChange={setPremium} trackColor={{ true: colors.lime, false: colors.raised }} thumbColor="#fff" />
      </FadeIn>

      <FadeIn delay={280} style={[s.card, { flexDirection: 'column', alignItems: 'stretch', gap: 8 }]}>
        <Text style={type.h3}>Cómo cuentan tus reproducciones</Text>
        {[
          `Una reproducción es válida desde los ${RULES.minSeconds} s, con tu sesión iniciada.`,
          'Solo se acredita una reproducción por canción al día.',
          `Cada válida suma $${RULES.creditPerPlay} MXN al saldo virtual de la banda (no retirable).`,
          `Las primeras ${RULES.bonusPlays} reproducciones valen el doble.`,
          `Tope de $${RULES.monthlyCapPerBand.toLocaleString('es-MX')} MXN al mes por banda; el saldo caduca a los ${RULES.expiryMonths} meses.`,
          `La banda puede usarlo hasta en el ${RULES.maxBookingShare * 100} % de una reserva de salas, equipo o ingeniero.`,
        ].map((t) => (
          <View key={t} style={{ flexDirection: 'row', gap: 8 }}>
            <Ionicons name="checkmark-circle" size={16} color={colors.lime} style={{ marginTop: 3 }} />
            <Text style={[type.body, { flex: 1, fontSize: 14, lineHeight: 20 }]}>{t}</Text>
          </View>
        ))}
      </FadeIn>

      <FadeIn delay={360} style={{ marginTop: 16 }}>
        <Press onPress={() => { logout(); router.replace('/welcome'); }} style={s.logout}>
          <Ionicons name="log-out-outline" size={18} color={colors.pink} />
          <Text style={{ color: colors.pink, fontWeight: '700' }}>Cerrar sesión</Text>
        </Press>
        <Text style={[type.small, { textAlign: 'center', marginTop: 16 }]}>GrooveSpace Music · v1.0.0 · Proyecto académico</Text>
      </FadeIn>
    </ScrollView>
  );
}
const Stat = ({ n, l }) => (
  <View style={{ flex: 1 }}>
    <Text style={[type.h1, { fontSize: 24 }]}>{n}</Text>
    <Text style={[type.small, { fontSize: 11 }]}>{l}</Text>
  </View>
);
const s = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: colors.onLime, fontSize: 28, fontWeight: '900' },
  stats: { flexDirection: 'row', marginTop: 24, backgroundColor: colors.surface, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.line },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14, backgroundColor: colors.surface, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.line },
  logout: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,93,143,0.4)' },
});
