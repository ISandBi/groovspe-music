import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Press from '../../src/components/Press';
import FadeIn from '../../src/components/FadeIn';
import SongRow from '../../src/components/SongRow';
import MiniPlayer from '../../src/components/MiniPlayer';
import { colors, type } from '../../src/theme';
import { bandById, songsOfBand } from '../../src/data';
import { compact } from '../../src/lib/format';
import { useApp } from '../../src/store';

export default function BandScreen() {
  const { id } = useLocalSearchParams();
  const band = bandById(id);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { play, followed, toggleFollow } = useApp();
  if (!band) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  const songs = songsOfBand(band.id);
  const ids = songs.map((x) => x.id);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 160 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[band.colors[0], band.colors[1], colors.bg]} locations={[0, 0.55, 1]} style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 28, minHeight: 300, justifyContent: 'space-between' }}>
          <Press onPress={() => router.back()} style={s.back} accessibilityLabel="Volver"><Ionicons name="chevron-back" size={22} color="#fff" /></Press>
          <FadeIn>
            <Text style={s.kicker}>BANDA · {band.genre.toUpperCase()}</Text>
            <Text style={s.name}>{band.name}</Text>
            <Text style={s.meta}>{band.city} · {compact(band.listeners)} oyentes al mes</Text>
          </FadeIn>
        </LinearGradient>

        <FadeIn delay={120} style={{ paddingHorizontal: 20, marginTop: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Press onPress={() => toggleFollow(band.id)} scale={0.94} style={[s.follow, followed.includes(band.id) && { borderColor: colors.lime }]}>
              <Text style={[s.followTxt, followed.includes(band.id) && { color: colors.lime }]}>{followed.includes(band.id) ? 'Siguiendo' : 'Seguir'}</Text>
            </Press>
            <View style={{ flex: 1 }} />
            <Press onPress={() => play(ids[0], ids, band.name)} scale={0.92} style={s.bigPlay} accessibilityLabel="Reproducir"><Ionicons name="play" size={28} color={colors.onLime} style={{ marginLeft: 3 }} /></Press>
          </View>
        </FadeIn>

        <FadeIn delay={200} style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Text style={type.h2}>Populares</Text>
          <View style={{ marginTop: 8 }}>{songs.map((song, i) => <SongRow key={song.id} song={song} index={i} list={ids} context={band.name} />)}</View>
        </FadeIn>

        <FadeIn delay={280} style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Text style={type.h2}>Sobre la banda</Text>
          <Text style={[type.body, { marginTop: 8 }]}>{band.bio}</Text>
          <View style={s.credit}>
            <Ionicons name="shield-checkmark" size={20} color={colors.lime} />
            <Text style={[type.body, { flex: 1, fontSize: 13, lineHeight: 19 }]}>Grabada en {band.recorded} por {band.engineer} bajo contrato con GrooveSpace. Tus reproducciones válidas suman saldo a esta banda.</Text>
          </View>
        </FadeIn>
      </ScrollView>
      <MiniPlayer bottom={insets.bottom + 10} />
    </View>
  );
}
const s = StyleSheet.create({
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(16,13,23,0.5)', alignItems: 'center', justifyContent: 'center' },
  kicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  name: { color: '#fff', fontSize: 40, fontWeight: '900', letterSpacing: -1.5, marginTop: 4 },
  meta: { color: 'rgba(255,255,255,0.9)', marginTop: 4, fontSize: 14 },
  follow: { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 999, borderWidth: 1.5, borderColor: colors.muted },
  followTxt: { color: colors.text, fontWeight: '700', fontSize: 13 },
  bigPlay: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' },
  playAll: { flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', gap: 8, backgroundColor: colors.lime, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 999 },
  playAllTxt: { color: colors.onLime, fontWeight: '800', fontSize: 15 },
  credit: { flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 16, backgroundColor: colors.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.line },
});
