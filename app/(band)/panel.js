import React, { useEffect, useState, useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FadeIn from '../../src/components/FadeIn';
import Press from '../../src/components/Press';
import { useTheme } from '../../src/theme';
import { useApp } from '../../src/store';
import { bandFetch } from '../../src/lib/api';

export default function BandPanel() {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  const { user, plays, setUser } = useApp();
  const insets = useSafeAreaInsets();
  const [demos, setDemos] = useState([]);
  const [note, setNote] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    try { setDemos(await bandFetch('/api/demos/mine', user.token)); setNote(''); }
    catch (e) { setNote(e.message); }
    finally { setRefreshing(false); }
  };
  useEffect(() => { load(); }, []); // eslint-disable-line

  const list = Array.isArray(demos) ? demos : [];
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 130, paddingHorizontal: 20 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} tintColor={colors.lime} />} showsVerticalScrollIndicator={false}>
      <FadeIn>
        <Text style={type.label}>Panel de banda</Text>
        <Text style={[type.h1, { marginTop: 2 }]}>{user.bandName}</Text>
        <Text style={type.small}>Líder: {user.name}</Text>
      </FadeIn>

      <FadeIn delay={120}>
        <LinearGradient colors={[colors.pink, '#8b5cff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.hero}>
          <Text style={s.heroTag}>TUS REPRODUCCIONES VÁLIDAS</Text>
          <Text style={s.heroNum}>${plays}</Text>
          <Text style={s.heroTxt}>MXN de saldo acumulado en esta sesión · el saldo se usa en salas, equipo e ingenieros</Text>
        </LinearGradient>
      </FadeIn>

      <FadeIn delay={200} style={s.grid}>
        <Metric icon="musical-notes" label="Demos" value={list.length} />
        <Metric icon="calendar" label="Reservas" value="—" />
        <Metric icon="wallet" label="Saldo" value="—" />
      </FadeIn>

      <FadeIn delay={280} style={{ marginTop: 24 }}>
        <Text style={type.h2}>Últimos demos</Text>
        {note ? <Text style={[type.small, { marginTop: 8 }]}>{note}</Text> : null}
        {!note && list.length === 0 && <Text style={[type.body, { marginTop: 8 }]}>Aún no hay demos. Envíalos desde el sitio de GrooveSpace.</Text>}
        {list.slice(0, 5).map((d, i) => (
          <View key={d._id || d.id || i} style={s.item}>
            <Ionicons name="musical-note" size={18} color={colors.pink} />
            <Text style={[type.h3, { flex: 1 }]} numberOfLines={1}>{d.title || 'Demo sin título'}</Text>
            <Text style={type.small}>{d.status || 'En revisión'}</Text>
          </View>
        ))}
      </FadeIn>

      <Press onPress={() => setUser(null)} style={s.logout}>
        <Ionicons name="log-out-outline" size={18} color={colors.pink} />
        <Text style={{ color: colors.pink, fontWeight: '700' }}>Cerrar sesión</Text>
      </Press>
    </ScrollView>
  );
}
const Metric = ({ icon, label, value }) => {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  return (
  <View style={s.metric}>
    <Ionicons name={icon} size={18} color={colors.pink} />
    <Text style={[type.h1, { fontSize: 22, marginTop: 8 }]}>{value}</Text>
    <Text style={type.small}>{label}</Text>
  </View>
  );
};
const makeS = (colors, type) => StyleSheet.create({
  hero: { borderRadius: 24, padding: 22, marginTop: 20 },
  heroTag: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  heroNum: { color: '#fff', fontSize: 44, fontWeight: '900', letterSpacing: -1.5, marginTop: 4 },
  heroTxt: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4 },
  grid: { flexDirection: 'row', gap: 10, marginTop: 14 },
  metric: { flex: 1, backgroundColor: colors.surface, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: colors.line },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginTop: 8, borderWidth: 1, borderColor: colors.line },
  logout: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,93,143,0.4)', marginTop: 28 },
});
