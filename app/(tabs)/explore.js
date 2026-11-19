import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Cover from '../../src/components/Cover';
import Press from '../../src/components/Press';
import FadeIn from '../../src/components/FadeIn';
import SongRow from '../../src/components/SongRow';
import { colors, type } from '../../src/theme';
import { BANDS, GENRES, SONGS, bandById } from '../../src/data';

const genreColors = (g) => BANDS.find((b) => b.genre === g)?.colors || [colors.pink, '#8b5cff'];

export default function Search() {
  const [q, setQ] = useState('');
  const [genre, setGenre] = useState(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const term = q.trim().toLowerCase();
  const browsing = !term && !genre;

  const bands = useMemo(() => BANDS.filter((b) => (!genre || b.genre === genre) && (!term || b.name.toLowerCase().includes(term) || b.genre.toLowerCase().includes(term))), [genre, term]);
  const songs = useMemo(() => SONGS.filter((s) => { const b = bandById(s.bandId); return (!genre || b.genre === genre) && (!term || s.title.toLowerCase().includes(term) || b.name.toLowerCase().includes(term)); }), [genre, term]);

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 170 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <FadeIn style={{ paddingHorizontal: 20 }}>
        <Text style={type.h1}>Buscar</Text>
        <View style={s.search}>
          <Ionicons name="search" size={20} color={colors.onLime} />
          <TextInput value={q} onChangeText={setQ} placeholder="¿Qué quieres escuchar?" placeholderTextColor="#5b5265" style={s.input} returnKeyType="search" />
          {(!!q || !!genre) && <Press onPress={() => { setQ(''); setGenre(null); }} hitSlop={10}><Ionicons name="close-circle" size={20} color="#5b5265" /></Press>}
        </View>
      </FadeIn>

      {browsing ? (
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Text style={[type.h2, { marginBottom: 14 }]}>Explorar todo</Text>
          <View style={s.tiles}>
            {GENRES.filter((g) => g !== 'Todo').map((g, i) => (
              <FadeIn key={g} delay={i * 50} style={s.tileWrap}>
                <Press onPress={() => setGenre(g)} scale={0.96}>
                  <LinearGradient colors={genreColors(g)} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.tile}>
                    <Text style={s.tileTxt}>{g}</Text>
                    <View style={s.tileArt}><Cover band={{ name: g, colors: genreColors(g).slice().reverse() }} size={64} radius={8} seed={i} /></View>
                  </LinearGradient>
                </Press>
              </FadeIn>
            ))}
          </View>
        </View>
      ) : (
        <View>
          {genre && <Text style={[type.h2, { paddingHorizontal: 20, marginTop: 22 }]}>{genre}</Text>}
          {bands.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={[type.h2, { paddingHorizontal: 20, marginBottom: 10 }]}>Bandas</Text>
              {bands.map((b) => (
                <Press key={b.id} onPress={() => router.push(`/band/${b.id}`)} scale={0.985} style={s.band}>
                  <Cover band={b} size={58} radius={29} />
                  <View style={{ flex: 1 }}><Text style={type.h3}>{b.name}</Text><Text style={type.small}>Banda · {b.genre}</Text></View>
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                </Press>
              ))}
            </View>
          )}
          <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
            <Text style={[type.h2, { marginBottom: 8 }]}>Canciones</Text>
            {songs.map((song) => <SongRow key={song.id} song={song} list={songs.map((x) => x.id)} context={`Búsqueda${genre ? ` · ${genre}` : ''}`} />)}
            {songs.length === 0 && bands.length === 0 && <Text style={[type.body, { textAlign: 'center', marginTop: 40 }]}>Sin resultados para “{q}”. Prueba con otro nombre o género.</Text>}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
const s = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14, backgroundColor: '#fff8ff', borderRadius: 10, paddingHorizontal: 14 },
  input: { flex: 1, color: colors.onLime, fontSize: 16, fontWeight: '600', paddingVertical: 13 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tileWrap: { width: '48%' },
  tile: { height: 100, borderRadius: 12, padding: 12, overflow: 'hidden' },
  tileTxt: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: -0.3, maxWidth: '75%' },
  tileArt: { position: 'absolute', right: -10, bottom: -6, transform: [{ rotate: '24deg' }] },
  band: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingVertical: 8 },
});
