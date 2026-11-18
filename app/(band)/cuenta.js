import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FadeIn from '../../src/components/FadeIn';
import Press from '../../src/components/Press';
import { colors, type } from '../../src/theme';
import { useApp } from '../../src/store';

export default function Cuenta() {
  const { user, setUser } = useApp();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 130, paddingHorizontal: 20 }}>
      <FadeIn>
        <Text style={type.h1}>Cuenta de banda</Text>
      </FadeIn>
      <FadeIn delay={120} style={s.card}>
        <Row icon="musical-notes" label="Banda" value={user.bandName} />
        <Row icon="person" label="Líder" value={user.name} />
        <Row icon="mail" label="Correo" value={user.email} />
      </FadeIn>
      <FadeIn delay={200} style={{ marginTop: 16 }}>
        <Text style={[type.body, { fontSize: 13 }]}>Para editar integrantes, contratos o pagos, usa el sitio de GrooveSpace con la misma cuenta.</Text>
      </FadeIn>
      <Press onPress={() => setUser(null)} style={s.logout}>
        <Ionicons name="log-out-outline" size={18} color={colors.pink} />
        <Text style={{ color: colors.pink, fontWeight: '700' }}>Cerrar sesión</Text>
      </Press>
    </ScrollView>
  );
}
const Row = ({ icon, label, value }) => (
  <View style={s.row}>
    <Ionicons name={icon} size={18} color={colors.pink} />
    <View style={{ flex: 1 }}>
      <Text style={type.small}>{label}</Text>
      <Text style={type.h3}>{value || '—'}</Text>
    </View>
  </View>
);
const s = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: 6, marginTop: 20, borderWidth: 1, borderColor: colors.line },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  logout: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,93,143,0.4)', marginTop: 28 },
});
