import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Cover from '../../src/components/Cover';
import Press from '../../src/components/Press';
import FadeIn from '../../src/components/FadeIn';
import Section from '../../src/components/Section';
import SongRow from '../../src/components/SongRow';
import AdCard from '../../src/components/AdCard';
import Card from '../../src/components/Card';
import Shelf from '../../src/components/Shelf';
import { colors, type } from '../../src/theme';
import { ADS, BANDS, PLAYLISTS, SONGS, bandById, songById } from '../../src/data';
import { useApp } from '../../src/store';

const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'; };
const FILTERS = ['Todo', 'Música', 'Bandas'];

export default function Home() {
  const { user, premium, plays, recent, play, band: nowBand, favorites, playlists } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('Todo');
  const tint = nowBand?.colors[0] || colors.pink;
  const top = [...SONGS].sort((a, b) => b.plays - a.plays);
  const fresh = [...SONGS].reverse().slice(0, 8);
  const quick = [
    { id: 'fav', name: 'Canciones que te gustan', colors: [colors.pink, '#8b5cff'], icon: 'heart', go: () => router.push('/(tabs)/library') },
    ...playlists.slice(0, 1).map((l) => ({ ...l, go: () => router.push(`/playlist/${l.id}`) })),
    ...PLAYLISTS.slice(0, 5).map((l) => ({ ...l, go: () => router.push(`/playlist/${l.id}`) })),
  ].slice(0, 6);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={[tint + '99', colors.bg]} style={StyleSheet.absoluteFill} start={{ x: 0.3, y: 0 }} end={{ x: 0.6, y: 0.42 }} pointerEvents="none" />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 170 }} showsVerticalScrollIndicator={false}>
        <FadeIn style={s.head}>
          <View style={{ flex: 1 }}>
            <Text style={type.label}>{greeting()}</Text>
            <Text style={[type.h1, { marginTop: 2 }]} numberOfLines={1}>{user?.name || 'Oyente'}</Text>
          </View>
          <Press onPress={() => router.push('/(tabs)/profile')} style={s.avatar} accessibilityLabel="Perfil"><Text style={s.avatarTxt}>{(user?.name || '?')[0].toUpperCase()}</Text></Press>
        </FadeIn>

        <View style={s.chips}>
          {FILTERS.map((f) => (
            <Press key={f} onPress={() => setFilter(f)} scale={0.94} style={[s.chip, filter === f && s.chipOn]}>
              <Text style={[s.chipTxt, filter === f && { color: colors.onLime }]}>{f}</Text>
            </Press>
          ))}
        </View>

        {filter === 'Todo' && (
          <FadeIn delay={80} style={s.grid}>
            {quick.map((q) => (
              <Press key={q.id} onPress={q.go} scale={0.97} style={s.quick}>
                <Cover band={q} size={56} radius={0} style={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }} />
                {q.icon && <Ionicons name={q.icon} size={22} color="#fff" style={s.quickIcon} />}
                <Text style={s.quickTxt} numberOfLines={2}>{q.name}</Text>
              </Press>
            ))}
          </FadeIn>
        )}

        {filter !== 'Bandas' && (
          <Section title="Hecho para ti">
            <Shelf>
              {PLAYLISTS.map((l) => <Card key={l.id} item={l} title={l.name} subtitle={l.desc} onPress={() => router.push(`/playlist/${l.id}`)} seed={l.id} />)}
            </Shelf>
          </Section>
        )}

        {!premium && filter === 'Todo' && <View style={{ paddingHorizontal: 20, marginTop: 28 }}><AdCard ad={ADS[0]} /></View>}

        {filter !== 'Música' && (
          <Section title="Bandas populares">
            <Shelf>
              {BANDS.map((b) => <Card key={b.id} item={b} round title={b.name} subtitle="Banda" onPress={() => router.push(`/band/${b.id}`)} />)}
            </Shelf>
          </Section>
        )}

        {filter !== 'Bandas' && (
          <Section title="Recién grabadas">
            <Shelf>
              {fresh.map((song) => <Card key={song.id} item={bandById(song.bandId)} title={song.title} subtitle={bandById(song.bandId).name} seed={song.id} onPress={() => play(song.id, fresh.map((x) => x.id), 'Recién grabadas')} />)}
            </Shelf>
          </Section>
        )}

        {filter !== 'Bandas' && (
          <Section title="Top de la semana">
            <View style={{ paddingHorizontal: 20 }}>
              {top.slice(0, 5).map((song, i) => <SongRow key={song.id} song={song} index={i} list={top.map((x) => x.id)} context="Top de la semana" />)}
            </View>
          </Section>
        )}

        {recent.length > 0 && filter === 'Todo' && (
          <Section title="Escuchado recientemente">
            <View style={{ paddingHorizontal: 20 }}>
              {recent.slice(0, 4).map((id) => <SongRow key={id} song={songById(id)} list={recent} context="Recientes" />)}
            </View>
          </Section>
        )}

        <FadeIn style={{ paddingHorizontal: 20, marginTop: 28 }}>
          <View style={s.impact}>
            <View style={{ flex: 1 }}>
              <Text style={type.label}>Tu impacto</Text>
              <Text style={[type.h2, { marginTop: 4 }]}>{plays} reproducciones válidas</Text>
              <Text style={type.small}>${plays} MXN acreditados a bandas · {favorites.length} favoritas</Text>
            </View>
            <Ionicons name="sparkles" size={28} color={colors.lime} />
          </View>
        </FadeIn>
        {!premium && <View style={{ paddingHorizontal: 20, marginTop: 20 }}><AdCard ad={ADS[1]} compact /></View>}
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: colors.onLime, fontWeight: '900', fontSize: 16 },
  chips: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginTop: 16 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.1)' },
  chipOn: { backgroundColor: colors.lime },
  chipTxt: { color: colors.text, fontWeight: '700', fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, marginTop: 16 },
  quick: { width: '48.6%', height: 56, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.09)', borderRadius: 8, overflow: 'hidden' },
  quickIcon: { position: 'absolute', left: 17 },
  quickTxt: { flex: 1, color: colors.text, fontWeight: '700', fontSize: 12.5, paddingRight: 8 },
  impact: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.line },
});
