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

const dateLabel = () => new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });

export default function Home() {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  const { user, premium, plays, recent, play, catalogStatus, refreshCatalog } = useApp();
  const router = useRouter();
  // El catálogo viene del sitio web y cambia en caliente: se calcula en cada render.
  const lists = [...ALL_LISTS].sort((a, b) => (b.id === 'e7') - (a.id === 'e7'));
  const REAL = SONGS.filter((x) => x.yt);
  const OWN = SONGS.filter((x) => !x.yt);
  const top = [...SONGS].sort((a, b) => b.plays - a.plays);
  const fresh = [...OWN].reverse().slice(0, 8);
  const labels = ['HECHO PARA TI', 'DESTACADO', 'NUEVO EN GROOVESPACE'];
  const features = lists.slice(0, 3).map((item, i) => ({ label: labels[i], item, sub: item.desc }));
  const recentSongs = recent.filter((id) => songById(id));
  const empty = SONGS.length === 0;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 190 }} showsVerticalScrollIndicator={false}>
      <Header caption={dateLabel()} title="Escuchar ahora" right={
        <Press onPress={() => router.push('/(tabs)/profile')} style={s.avatar} accessibilityLabel="Cuenta"><Text style={s.avatarTxt}>{(user?.name || '?')[0].toUpperCase()}</Text></Press>
      } />
      <Hairline style={{ marginHorizontal: 20, marginTop: 8 }} />

      {empty && (
        <View style={s.empty}>
          <Ionicons name={catalogStatus === 'loading' ? 'cloud-download-outline' : catalogStatus === 'offline' ? 'cloud-offline-outline' : 'musical-notes-outline'} size={40} color={colors.accent} />
          <Text style={type.h3}>{catalogStatus === 'loading' ? 'Cargando música de GrooveSpace…' : catalogStatus === 'offline' ? 'No pudimos conectar con GrooveSpace' : 'Aún no hay música publicada'}</Text>
          <Text style={[type.small, { textAlign: 'center' }]}>{catalogStatus === 'offline' ? 'Revisa tu internet e inténtalo de nuevo.' : 'Las bandas publican sus demos desde el sitio web. Cuando lo hagan, aparecerán aquí.'}</Text>
          {catalogStatus !== 'loading' && <Press onPress={refreshCatalog} style={s.retry}><Text style={s.retryTxt}>Actualizar</Text></Press>}
        </View>
      )}

      {features.length > 0 && (
        <View style={{ marginTop: 18 }}>
          <Shelf gap={16}>
            {features.map((f) => <FeatureCard key={f.item.id} label={f.label} title={f.item.name} subtitle={f.sub} item={f.item} seed={f.item.id} onPress={() => router.push(`/playlist/${f.item.id}`)} />)}
          </Shelf>
        </View>
      )}

      {!premium && ADS.length > 0 && <View style={{ paddingHorizontal: 20, marginTop: 22 }}><AdCard ad={ADS[0]} /></View>}

      {lists.length > 0 && (
        <Section title="Hecho para ti" onPress={() => router.push('/(tabs)/library')}>
          <Shelf>
            {lists.map((l) => <Card key={l.id} item={l} title={l.name} subtitle="GrooveSpace" onPress={() => router.push(`/playlist/${l.id}`)} seed={l.id} />)}
          </Shelf>
        </Section>
      )}

      {OWN.length > 0 && (
        <Section title="Aprende a tocar · Premium">
          <Shelf>
            {OWN.slice(0, 8).map((song) => <Card key={song.id} item={bandById(song.bandId)} title={song.title} subtitle={premium ? 'Acordes y tempo' : 'Premium'} seed={song.id} onPress={() => router.push(`/learn/${song.id}`)} />)}
          </Shelf>
        </Section>
      )}

      {REAL.length > 0 && (
        <Section title="Con audio y video">
          <Shelf>
            {REAL.map((song) => <Card key={song.id} item={bandById(song.bandId)} title={song.title} subtitle={bandById(song.bandId).name} seed={song.id} onPress={() => play(song.id, REAL.map((x) => x.id), 'Con audio y video')} />)}
          </Shelf>
        </Section>
      )}

      {BANDS.length > 0 && (
        <Section title="Bandas de GrooveSpace">
          <Shelf>
            {[...BANDS].sort((a, b) => b.listeners - a.listeners).map((b) => <Card key={b.id} item={b} round size={128} title={b.name} onPress={() => router.push(`/band/${b.id}`)} />)}
          </Shelf>
        </Section>
      )}

      {fresh.length > 0 && (
        <Section title="Recién publicadas">
          <Shelf>
            {fresh.map((song) => <Card key={song.id} item={bandById(song.bandId)} title={song.title} subtitle={bandById(song.bandId).name} seed={song.id} onPress={() => play(song.id, fresh.map((x) => x.id), 'Recién publicadas')} />)}
          </Shelf>
        </Section>
      )}

      {top.length > 0 && (
        <Section title="Top de la semana">
          <View style={{ paddingHorizontal: 20 }}>
            {top.slice(0, 6).map((song, i) => <SongRow key={song.id} song={song} index={i} list={top.map((x) => x.id)} context="Top de la semana" />)}
          </View>
        </Section>
      )}

      {recentSongs.length > 0 && (
        <Section title="Reproducido recientemente">
          <View style={{ paddingHorizontal: 20 }}>
            {recentSongs.slice(0, 4).map((id) => <SongRow key={id} song={songById(id)} list={recentSongs} context="Recientes" />)}
          </View>
        </Section>
      )}

      <Section title="Tu impacto">
        <View style={s.impact}>
          <View style={s.impactIcon}><Ionicons name="heart" size={22} color="#fff" /></View>
          <View style={{ flex: 1 }}>
            <Text style={type.h3}>{plays} reproducciones válidas</Text>
            <Text style={type.small}>Tus reproducciones suman saldo a las bandas de GrooveSpace</Text>
          </View>
        </View>
      </Section>

      {!premium && ADS.length > 1 && <View style={{ paddingHorizontal: 20, marginTop: 18 }}><AdCard ad={ADS[1]} compact /></View>}
    </ScrollView>
  );
}
const makeS = (colors, type) => StyleSheet.create({
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  empty: { alignItems: 'center', gap: 10, marginHorizontal: 20, marginTop: 28, padding: 24, backgroundColor: colors.surface, borderRadius: 16 },
  retry: { marginTop: 6, alignSelf: 'center', borderWidth: 1, borderColor: colors.accent, borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8 },
  retryTxt: { color: colors.accent, fontWeight: '700', fontSize: 14 },
  avatarTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
  impact: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 20, backgroundColor: colors.surface, borderRadius: 14, padding: 14 },
  impactIcon: { width: 44, height: 44, borderRadius: 10, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});
