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
  const { play, followed, toggleFollow, toggleShuffle, shuffle } = useApp();
  if (!band) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  const songs = songsOfBand(band.id);
  const ids = songs.map((x) => x.id);
  const following = followed.includes(band.id);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 170 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={band.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: 360 }}>
          <LinearGradient colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.55)']} locations={[0, 0.4, 1]} style={[StyleSheet.absoluteFill, { paddingTop: insets.top + 8, paddingHorizontal: 16, justifyContent: 'space-between', paddingBottom: 18 }]}>
            <View style={s.top}>
              <Press onPress={() => router.back()} style={s.round} accessibilityLabel="Volver"><Ionicons name="chevron-back" size={22} color="#fff" /></Press>
              <Press onPress={() => toggleFollow(band.id)} style={s.follow}><Text style={s.followTxt}>{following ? 'Siguiendo' : 'Seguir'}</Text></Press>
            </View>
            <FadeIn>
              <Text style={s.name}>{band.name}</Text>
              <Text style={s.meta}>{band.genre} · {compact(band.listeners)} oyentes al mes</Text>
            </FadeIn>
          </LinearGradient>
        </LinearGradient>

        <FadeIn delay={100} style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: 16 }}>
          <Press onPress={() => { if (shuffle) toggleShuffle(); play(ids[0], ids, band.name); }} style={s.pill}><Ionicons name="play" size={20} color={colors.accent} /><Text style={s.pillTxt}>Reproducir</Text></Press>
          <Press onPress={() => { if (!shuffle) toggleShuffle(); play(ids[Math.floor(Math.random() * ids.length)], ids, band.name); }} style={s.pill}><Ionicons name="shuffle" size={20} color={colors.accent} /><Text style={s.pillTxt}>Aleatorio</Text></Press>
        </FadeIn>

        <FadeIn delay={180} style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Text style={type.h2}>Canciones populares</Text>
          <View style={{ marginTop: 6 }}>{songs.map((song, i) => <SongRow key={song.id} song={song} index={i} list={ids} context={band.name} />)}</View>
        </FadeIn>

        <FadeIn delay={260} style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Text style={type.h2}>Acerca de</Text>
          <Text style={[type.body, { marginTop: 8 }]}>{band.bio}</Text>
          {band.provisional ? (
            <View style={s.note}><Ionicons name="information-circle" size={20} color={colors.muted} /><Text style={[type.small, { flex: 1 }]}>Contenido de prueba (YouTube). No acredita saldo.</Text></View>
          ) : (
            <View style={s.note}><Ionicons name="shield-checkmark" size={20} color={colors.green} /><Text style={[type.small, { flex: 1 }]}>Grabada en {band.recorded} por {band.engineer} bajo contrato con GrooveSpace. Tus reproducciones válidas suman saldo a esta banda.</Text></View>
          )}
        </FadeIn>
      </ScrollView>
      <MiniPlayer bottom={insets.bottom + 10} />
    </View>
  );
}
const s = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  round: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  follow: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  followTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  name: { color: '#fff', fontSize: 40, fontWeight: '800', letterSpacing: -1.2 },
  meta: { color: 'rgba(255,255,255,0.9)', fontSize: 15, marginTop: 2 },
  pill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.surface, borderRadius: 12, paddingVertical: 14 },
  pillTxt: { color: colors.accent, fontSize: 17, fontWeight: '600' },
  note: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 14, backgroundColor: colors.surface, borderRadius: 12, padding: 14 },
});
