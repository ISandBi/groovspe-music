import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Cover from '../../src/components/Cover';
import Press from '../../src/components/Press';
import FadeIn from '../../src/components/FadeIn';
import SongRow from '../../src/components/SongRow';
import MiniPlayer from '../../src/components/MiniPlayer';
import { colors, type } from '../../src/theme';
import { songById } from '../../src/data';
import { clock } from '../../src/lib/format';
import { useApp } from '../../src/store';

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams();
  const { getPlaylist, favorites, play, toggleShuffle, shuffle, deletePlaylist } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isFav = id === 'fav';
  const pl = isFav ? { id: 'fav', name: 'Canciones que te gustan', desc: 'Tus favoritas de GrooveSpace.', colors: [colors.pink, '#6a2cff'], songIds: favorites } : getPlaylist(id);
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
        <LinearGradient colors={[pl.colors[0], pl.colors[1] + 'cc', colors.bg]} locations={[0, 0.6, 1]} style={{ paddingTop: insets.top + 12, alignItems: 'center', paddingBottom: 24 }}>
          <View style={s.bar}>
            <Press onPress={() => router.back()} style={s.round} accessibilityLabel="Volver"><Ionicons name="chevron-back" size={22} color="#fff" /></Press>
            {mine && <Press onPress={() => Alert.alert('Eliminar lista', `¿Eliminar “${pl.name}”?`, [{ text: 'Cancelar' }, { text: 'Eliminar', style: 'destructive', onPress: () => { deletePlaylist(pl.id); router.back(); } }])} style={s.round} accessibilityLabel="Eliminar lista"><Ionicons name="trash-outline" size={20} color="#fff" /></Press>}
          </View>
          <FadeIn y={24}>{isFav ? <View style={[s.favArt]}><Ionicons name="heart" size={90} color="#fff" /></View> : <Cover band={pl} size={190} radius={14} seed={String(id)} />}</FadeIn>
        </LinearGradient>

        <FadeIn delay={100} style={{ paddingHorizontal: 20 }}>
          <Text style={[type.h1, { fontSize: 30 }]}>{pl.name}</Text>
          {!!pl.desc && <Text style={[type.body, { marginTop: 4, color: colors.muted }]}>{pl.desc}</Text>}
          <Text style={[type.small, { marginTop: 8 }]}>{songs.length} canciones · {Math.round(total / 60)} min</Text>
          <View style={s.actions}>
            <Press onPress={() => startPlay(true)} style={[s.round2, shuffle && { backgroundColor: colors.limeSoft }]} accessibilityLabel="Aleatorio"><Ionicons name="shuffle" size={24} color={colors.lime} /></Press>
            <View style={{ flex: 1 }} />
            <Press onPress={() => startPlay(false)} scale={0.92} style={s.big} accessibilityLabel="Reproducir"><Ionicons name="play" size={30} color={colors.onLime} style={{ marginLeft: 3 }} /></Press>
          </View>
        </FadeIn>

        <View style={{ paddingHorizontal: 20, marginTop: 4 }}>
          {songs.map((song) => <SongRow key={song.id} song={song} list={pl.songIds} context={pl.name} showPlays={false} />)}
          {songs.length === 0 && <Text style={[type.body, { textAlign: 'center', marginTop: 30 }]}>Esta lista está vacía. Usa “⋯ → Añadir a una lista” en cualquier canción.</Text>}
        </View>
      </ScrollView>
      <MiniPlayer bottom={insets.bottom + 10} />
    </View>
  );
}
const s = StyleSheet.create({
  bar: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 12 },
  round: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(16,13,23,0.5)', alignItems: 'center', justifyContent: 'center' },
  favArt: { width: 190, height: 190, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 6 },
  round2: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  big: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' },
});
