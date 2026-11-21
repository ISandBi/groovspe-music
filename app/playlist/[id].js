import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Cover from '../../src/components/Cover';
import Press from '../../src/components/Press';
import FadeIn from '../../src/components/FadeIn';
import SongRow from '../../src/components/SongRow';
import MiniPlayer from '../../src/components/MiniPlayer';
import { colors, type } from '../../src/theme';
import { songById } from '../../src/data';
import { useApp } from '../../src/store';

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams();
  const { getPlaylist, favorites, play, toggleShuffle, shuffle, deletePlaylist } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isFav = id === 'fav';
  const pl = isFav ? { id: 'fav', name: 'Favoritas', desc: 'Tus canciones favoritas de GrooveSpace.', colors: [colors.accent, '#8b5cff'], songIds: favorites } : getPlaylist(id);
  if (!pl) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  const songs = pl.songIds.map(songById).filter(Boolean);
  const total = songs.reduce((n, x) => n + x.duration, 0);
  const mine = String(id).startsWith('u');

  const startPlay = (sh) => {
    if (!songs.length) return;
    if (sh !== shuffle) toggleShuffle();
    play(songs[sh ? Math.floor(Math.random() * songs.length) : 0].id, pl.songIds, pl.name);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 170 }} showsVerticalScrollIndicator={false}>
        <View style={[s.bar, { paddingTop: insets.top + 8 }]}>
          <Press onPress={() => router.back()} style={s.round} accessibilityLabel="Volver"><Ionicons name="chevron-back" size={22} color={colors.accent} /></Press>
          {mine && <Press onPress={() => Alert.alert('Eliminar lista', `¿Eliminar “${pl.name}”?`, [{ text: 'Cancelar' }, { text: 'Eliminar', style: 'destructive', onPress: () => { deletePlaylist(pl.id); router.back(); } }])} style={s.round} accessibilityLabel="Eliminar lista"><Ionicons name="trash-outline" size={20} color={colors.accent} /></Press>}
        </View>

        <FadeIn y={20} style={{ alignItems: 'center', marginTop: 4 }}>
          {isFav
            ? <View style={[s.favArt, { backgroundColor: colors.accent }]}><Ionicons name="heart" size={90} color="#fff" /></View>
            : <Cover band={pl} size={250} radius={12} seed={String(id)} elevated />}
        </FadeIn>

        <FadeIn delay={100} style={{ alignItems: 'center', paddingHorizontal: 24, marginTop: 20 }}>
          <Text style={s.title} numberOfLines={2}>{pl.name}</Text>
          <Text style={s.curator}>{isFav ? 'Tu biblioteca' : String(id).startsWith('u') ? 'Tu lista' : 'GrooveSpace'}</Text>
          {!!pl.desc && <Text style={[type.small, { textAlign: 'center', marginTop: 6 }]}>{pl.desc}</Text>}
          <View style={s.buttons}>
            <Press onPress={() => startPlay(false)} style={s.pill}><Ionicons name="play" size={20} color={colors.accent} /><Text style={s.pillTxt}>Reproducir</Text></Press>
            <Press onPress={() => startPlay(true)} style={s.pill}><Ionicons name="shuffle" size={20} color={colors.accent} /><Text style={s.pillTxt}>Aleatorio</Text></Press>
          </View>
        </FadeIn>

        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View style={s.hair} />
          {songs.map((song) => <SongRow key={song.id} song={song} list={pl.songIds} context={pl.name} showPlays={false} />)}
          {songs.length === 0 && <Text style={[type.body, { textAlign: 'center', marginTop: 30 }]}>Esta lista está vacía. Usa “⋯ → Añadir a una lista” en cualquier canción.</Text>}
          {songs.length > 0 && <Text style={[type.small, { marginTop: 14 }]}>{songs.length} canciones, {Math.round(total / 60)} minutos</Text>}
        </View>
      </ScrollView>
      <MiniPlayer bottom={insets.bottom + 10} />
    </View>
  );
}
const s = StyleSheet.create({
  bar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
  round: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  favArt: { width: 250, height: 250, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center', letterSpacing: -0.4 },
  curator: { fontSize: 20, color: colors.accent, marginTop: 2 },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 18, width: '100%' },
  pill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.surface, borderRadius: 12, paddingVertical: 14 },
  pillTxt: { color: colors.accent, fontSize: 17, fontWeight: '600' },
  hair: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
});
