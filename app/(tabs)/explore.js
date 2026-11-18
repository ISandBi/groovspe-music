import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Cover from '../../src/components/Cover';
import Press from '../../src/components/Press';
import FadeIn from '../../src/components/FadeIn';
import SongRow from '../../src/components/SongRow';
import { colors, type } from '../../src/theme';
import { BANDS, GENRES, SONGS, bandById } from '../../src/data';

export default function Explore() {
  const [q, setQ] = useState('');
  const [genre, setGenre] = useState('Todo');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const term = q.trim().toLowerCase();

  const bands = useMemo(() => BANDS.filter((b) => (genre === 'Todo' || b.genre === genre) && (!term || b.name.toLowerCase().includes(term) || b.genre.toLowerCase().includes(term))), [genre, term]);
  const songs = useMemo(() => SONGS.filter((s) => {
    const b = bandById(s.bandId);
    return (genre === 'Todo' || b.genre === genre) && (!term || s.title.toLowerCase().includes(term) || b.name.toLowerCase().includes(term));
  }), [genre, term]);

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 170 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <FadeIn style={{ paddingHorizontal: 20 }}>
        <Text style={type.h1}>Explorar</Text>
        <View style={s.search}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput value={q} onChangeText={setQ} placeholder="Bandas, canciones o géneros" placeholderTextColor={colors.muted} style={s.input} returnKeyType="search" />
          {!!q && <Press onPress={() => setQ('')} hitSlop={10}><Ionicons name="close-circle" size={18} color={colors.muted} /></Press>}
        </View>
      </FadeIn>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, marginTop: 16 }}>
        {GENRES.map((g) => (
          <Press key={g} onPress={() => setGenre(g)} scale={0.94} style={[s.chip, genre === g && s.chipOn]}>
            <Text style={[s.chipTxt, genre === g && { color: colors.onLime }]}>{g}</Text>
          </Press>
        ))}
      </ScrollView>

      {bands.length > 0 && (
        <View style={{ marginTop: 24 }}>
          <Text style={[type.h2, { paddingHorizontal: 20, marginBottom: 12 }]}>Bandas</Text>
          {bands.map((b) => (
            <Press key={b.id} onPress={() => router.push(`/band/${b.id}`)} scale={0.985} style={s.band}>
              <Cover band={b} size={60} radius={14} />
              <View style={{ flex: 1 }}>
                <Text style={type.h3}>{b.name}</Text>
                <Text style={type.small}>{b.genre} · {b.city}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </Press>
          ))}
        </View>
      )}

      <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
        <Text style={[type.h2, { marginBottom: 8 }]}>Canciones</Text>
        {songs.map((song) => <SongRow key={song.id} song={song} list={songs.map((x) => x.id)} />)}
        {songs.length === 0 && bands.length === 0 && <Text style={[type.body, { textAlign: 'center', marginTop: 40 }]}>Sin resultados para “{q}”.</Text>}
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14, backgroundColor: colors.surface, borderRadius: 16, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.line },
  input: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 13 },
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  chipOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  chipTxt: { color: colors.text, fontWeight: '700', fontSize: 13 },
  band: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingVertical: 8 },
});
