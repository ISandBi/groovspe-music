import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Press from '../../src/components/Press';
import FadeIn from '../../src/components/FadeIn';
import Header, { Hairline } from '../../src/components/Header';
import Section from '../../src/components/Section';
import SongRow from '../../src/components/SongRow';
import AdCard from '../../src/components/AdCard';
import Card, { FeatureCard } from '../../src/components/Card';
import Shelf from '../../src/components/Shelf';
import { useTheme } from '../../src/theme';
import { ADS, BANDS, PLAYLISTS as ALL_LISTS, SONGS, bandById, songById } from '../../src/data';
import { useApp } from '../../src/store';

const PLAYLISTS = [...ALL_LISTS].sort((a, b) => (b.id === 'e7') - (a.id === 'e7'));
const REAL = SONGS.filter((x) => x.yt);
const OWN = SONGS.filter((x) => !x.yt);
const dateLabel = () => new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });

export default function Home() {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  const { user, premium, plays, recent, play } = useApp();
  const router = useRouter();
  const top = [...SONGS].sort((a, b) => b.plays - a.plays);
  const fresh = [...OWN].reverse().slice(0, 8);
  const features = [
    { label: 'HECHO PARA TI', item: PLAYLISTS[0], sub: PLAYLISTS[0].desc },
    { label: 'DESTACADO', item: PLAYLISTS[1], sub: PLAYLISTS[1].desc },
    { label: 'NUEVO EN GROOVESPACE', item: PLAYLISTS[2], sub: PLAYLISTS[2].desc },
  ];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 190 }} showsVerticalScrollIndicator={false}>
      <Header caption={dateLabel()} title="Escuchar ahora" right={
        <Press onPress={() => router.push('/(tabs)/profile')} style={s.avatar} accessibilityLabel="Cuenta"><Text style={s.avatarTxt}>{(user?.name || '?')[0].toUpperCase()}</Text></Press>
      } />
      <Hairline style={{ marginHorizontal: 20, marginTop: 8 }} />

      <View style={{ marginTop: 18 }}>
        <Shelf gap={16}>
          {features.map((f) => <FeatureCard key={f.item.id} label={f.label} title={f.item.name} subtitle={f.sub} item={f.item} seed={f.item.id} onPress={() => router.push(`/playlist/${f.item.id}`)} />)}
        </Shelf>
      </View>

      {!premium && <View style={{ paddingHorizontal: 20, marginTop: 22 }}><AdCard ad={ADS[0]} /></View>}

      <Section title="Hecho para ti" onPress={() => router.push('/(tabs)/library')}>
        <Shelf>
          {PLAYLISTS.map((l) => <Card key={l.id} item={l} title={l.name} subtitle="GrooveSpace" onPress={() => router.push(`/playlist/${l.id}`)} seed={l.id} />)}
        </Shelf>
      </Section>

      <Section title="Aprende a tocar · Premium">
        <Shelf>
          {OWN.slice(0, 8).map((song) => <Card key={song.id} item={bandById(song.bandId)} title={song.title} subtitle={premium ? 'Acordes y tempo' : 'Premium'} seed={song.id} onPress={() => router.push(`/learn/${song.id}`)} />)}
        </Shelf>
      </Section>

      <Section title="Con audio y video">
        <Shelf>
          {REAL.map((song) => <Card key={song.id} item={bandById(song.bandId)} title={song.title} subtitle={bandById(song.bandId).name} seed={song.id} onPress={() => play(song.id, REAL.map((x) => x.id), 'Con audio y video')} />)}
        </Shelf>
      </Section>

      <Section title="Bandas populares">
        <Shelf>
          {[...BANDS].sort((a, b) => b.listeners - a.listeners).map((b) => <Card key={b.id} item={b} round size={128} title={b.name} onPress={() => router.push(`/band/${b.id}`)} />)}
        </Shelf>
      </Section>

      <Section title="Recién grabadas">
        <Shelf>
          {fresh.map((song) => <Card key={song.id} item={bandById(song.bandId)} title={song.title} subtitle={bandById(song.bandId).name} seed={song.id} onPress={() => play(song.id, fresh.map((x) => x.id), 'Recién grabadas')} />)}
        </Shelf>
      </Section>

      <Section title="Top de la semana">
        <View style={{ paddingHorizontal: 20 }}>
          {top.slice(0, 6).map((song, i) => <SongRow key={song.id} song={song} index={i} list={top.map((x) => x.id)} context="Top de la semana" />)}
        </View>
      </Section>

      {recent.length > 0 && (
        <Section title="Reproducido recientemente">
          <View style={{ paddingHorizontal: 20 }}>
            {recent.slice(0, 4).map((id) => <SongRow key={id} song={songById(id)} list={recent} context="Recientes" />)}
          </View>
        </Section>
      )}

      <Section title="Tu impacto">
        <View style={s.impact}>
          <View style={s.impactIcon}><Ionicons name="heart" size={22} color="#fff" /></View>
          <View style={{ flex: 1 }}>
            <Text style={type.h3}>{plays} reproducciones válidas</Text>
            <Text style={type.small}>${plays} MXN acreditados a bandas de GrooveSpace</Text>
          </View>
        </View>
      </Section>

      {!premium && <View style={{ paddingHorizontal: 20, marginTop: 18 }}><AdCard ad={ADS[1]} compact /></View>}
    </ScrollView>
  );
}
const makeS = (colors, type) => StyleSheet.create({
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  avatarTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
  impact: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 20, backgroundColor: colors.surface, borderRadius: 14, padding: 14 },
  impactIcon: { width: 44, height: 44, borderRadius: 10, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});
