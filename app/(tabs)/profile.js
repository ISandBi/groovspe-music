import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Press from '../../src/components/Press';
import Header from '../../src/components/Header';
import AppearancePicker from '../../src/components/AppearancePicker';
import { useTheme } from '../../src/theme';
import { RULES } from '../../src/data';
import { useApp } from '../../src/store';

export default function Profile() {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  const { user, premium, setPremium, plays, favorites, logout } = useApp();
  const router = useRouter();
  const initial = (user?.name || '?')[0].toUpperCase();
  const rules = [
    `Una reproducción es válida desde los ${RULES.minSeconds} s, con tu sesión iniciada.`,
    'Solo se acredita una reproducción por canción al día.',
    `Cada válida suma $${RULES.creditPerPlay} MXN al saldo virtual de la banda (no retirable).`,
    `Las primeras ${RULES.bonusPlays} reproducciones de una banda valen el doble.`,
    `Tope de $${RULES.monthlyCapPerBand.toLocaleString('es-MX')} MXN al mes por banda; el saldo caduca a los ${RULES.expiryMonths} meses.`,
    `La banda puede usarlo hasta en el ${RULES.maxBookingShare * 100} % de una reserva de salas, equipo o ingeniero.`,
  ];
  return (
    <ScrollView style={{ backgroundColor: colors.groupBg }} contentContainerStyle={{ paddingBottom: 190 }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: colors.groupBg }}>
        <Header title="Cuenta" right={<Press onPress={() => router.back()} hitSlop={10}><Text style={s.done}>Listo</Text></Press>} />
      </View>

      <View style={s.group}>
        <View style={s.profile}>
          <View style={s.avatar}><Text style={s.avatarTxt}>{initial}</Text></View>
          <View style={{ flex: 1 }}><Text style={type.h2}>{user?.name}</Text><Text style={type.small}>{user?.email}</Text></View>
        </View>
      </View>

      <View style={s.group}>
        <Stat n={plays} l="Reproducciones válidas" />
        <Stat n={`$${plays * RULES.creditPerPlay} MXN`} l="Acreditados a bandas" />
        <Stat n={favorites.length} l="Canciones favoritas" last />
      </View>

      <View style={s.group}><AppearancePicker /></View>

      <View style={s.group}>
        <View style={s.switchRow}>
          <View style={{ flex: 1 }}><Text style={type.h3}>Sin anuncios (demostración)</Text><Text style={type.small}>Activa o desactiva los anuncios propios de GrooveSpace.</Text></View>
          <Switch value={premium} onValueChange={setPremium} trackColor={{ true: colors.accent, false: colors.track }} thumbColor="#fff" />
        </View>
      </View>

      <Text style={s.cap}>CÓMO CUENTAN TUS REPRODUCCIONES</Text>
      <View style={[s.group, { padding: 16, gap: 10 }]}>
        {rules.map((t) => (
          <View key={t} style={{ flexDirection: 'row', gap: 10 }}>
            <Ionicons name="checkmark-circle" size={18} color={colors.green} style={{ marginTop: 2 }} />
            <Text style={[type.body, { flex: 1, fontSize: 14, lineHeight: 20 }]}>{t}</Text>
          </View>
        ))}
      </View>

      <View style={s.group}>
        <Press onPress={() => { logout(); router.replace('/welcome'); }} style={s.logout}><Text style={s.logoutTxt}>Cerrar sesión</Text></Press>
      </View>
      <Text style={[type.small, { textAlign: 'center', marginTop: 16 }]}>GrooveSpace Music · v1.0.0 · Proyecto académico</Text>
    </ScrollView>
  );
}
const Stat = ({ n, l, last }) => {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  return (
  <View style={[s.stat, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line }]}>
    <Text style={type.h3}>{l}</Text><Text style={[type.h3, { color: colors.muted, fontWeight: '400' }]}>{n}</Text>
  </View>
  );
};
const makeS = (colors, type) => StyleSheet.create({
  done: { color: colors.accent, fontSize: 17, fontWeight: '600', marginBottom: 6 },
  group: { backgroundColor: colors.groupCard, borderRadius: 12, marginHorizontal: 16, marginTop: 16, overflow: 'hidden' },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: '#fff', fontSize: 26, fontWeight: '800' },
  stat: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  cap: { marginTop: 22, marginLeft: 32, fontSize: 12, color: colors.muted, fontWeight: '600', letterSpacing: 0.4 },
  logout: { paddingVertical: 15, alignItems: 'center' },
  logoutTxt: { color: colors.accent, fontSize: 17 },
});
