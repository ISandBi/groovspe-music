import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Cover from '../../src/components/Cover';
import Press from '../../src/components/Press';
import FadeIn from '../../src/components/FadeIn';
import Section from '../../src/components/Section';
import SongRow from '../../src/components/SongRow';
import AdCard from '../../src/components/AdCard';
import { colors, type } from '../../src/theme';
import { ADS, BANDS, SONGS, songById, RULES } from '../../src/data';
import { useApp } from '../../src/store';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
}

export default function Home() {
  const { user, premium, plays, recent, play } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const top = [...SONGS].sort((a, b) => b.plays - a.plays).slice(0, 5);
  const all = SONGS.map((s) => s.id);
  const hero = SONGS[6];
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 170 }} showsVerticalScrollIndicator={false}>
      <FadeIn style={{ paddingHorizontal: 20 }}>
        <Text style={type.label}>{greeting()}</Text>
        <Text style={[type.h1, { marginTop: 2 }]}>{user ? user.name : 'Oyente'}</Text>
      </FadeIn>

      <FadeIn delay={120} style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <Press onPress={() => play(hero.id, all)} scale={0.98}>
          <LinearGradient colors={BANDS[3].colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.hero}>
            <Text style={s.heroTag}>LO MÁS ESCUCHADO</Text>
            <Text style={s.heroTitle}>{hero.title}</Text>
            <Text style={s.heroBand}>{BANDS[3].name}</Text>
            <View style={s.heroBtn}><Text style={s.heroBtnTxt}>▶  Escuchar ahora</Text></View>
          </LinearGradient>
        </Press>
      </FadeIn>

      <FadeIn delay={220} style={{ paddingHorizontal: 20, marginTop: 14 }}>
        <View style={s.impact}>
          <View style={{ flex: 1 }}>
            <Text style={type.label}>Tu impacto</Text>
            <Text style={[type.h2, { marginTop: 4 }]}>{plays} reproducciones válidas</Text>
            <Text style={type.small}>${plays * RULES.creditPerPlay} MXN acreditados a bandas</Text>
          </View>
          <Text style={{ fontSize: 28 }}>🎸</Text>
        </View>
      </FadeIn>

      <Section title="Bandas para ti">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
          {BANDS.map((b, i) => (
            <FadeIn key={b.id} delay={260 + i * 60}>
              <Press onPress={() => router.push(`/band/${b.id}`)} style={{ width: 140 }} accessibilityLabel={`Ver banda ${b.name}`}>
                <Cover band={b} size={140} radius={20} />
                <Text numberOfLines={1} style={[type.h3, { marginTop: 8 }]}>{b.name}</Text>
                <Text numberOfLines={1} style={type.small}>{b.genre}</Text>
              </Press>
            </FadeIn>
          ))}
        </ScrollView>
      </Section>

      {!premium && <View style={{ paddingHorizontal: 20, marginTop: 28 }}><AdCard ad={ADS[0]} /></View>}

      <Section title="Top de la semana">
        <View style={{ paddingHorizontal: 20 }}>
          {top.map((song, i) => <SongRow key={song.id} song={song} index={i} list={top.map((x) => x.id)} />)}
        </View>
      </Section>

      {recent.length > 0 && (
        <Section title="Escuchado recientemente">
          <View style={{ paddingHorizontal: 20 }}>
            {recent.slice(0, 4).map((id) => <SongRow key={id} song={songById(id)} list={recent} />)}
          </View>
        </Section>
      )}

      {!premium && <View style={{ paddingHorizontal: 20, marginTop: 24 }}><AdCard ad={ADS[1]} compact /></View>}
    </ScrollView>
  );
}
const s = StyleSheet.create({
  hero: { borderRadius: 26, padding: 22, minHeight: 190, justifyContent: 'flex-end', overflow: 'hidden' },
  heroTag: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  heroTitle: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: -1, marginTop: 6 },
  heroBand: { color: 'rgba(255,255,255,0.92)', fontSize: 15, fontWeight: '600', marginTop: 2 },
  heroBtn: { alignSelf: 'flex-start', marginTop: 16, backgroundColor: colors.bg, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 10 },
  heroBtnTxt: { color: colors.text, fontWeight: '800', fontSize: 14 },
  impact: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.line },
});
