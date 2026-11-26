import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Cover from '../../src/components/Cover';
import Press from '../../src/components/Press';
import FadeIn from '../../src/components/FadeIn';
import Header from '../../src/components/Header';
import SongRow from '../../src/components/SongRow';
import { useTheme } from '../../src/theme';
import { BANDS, GENRES, SONGS, bandById } from '../../src/data';
import { useApp } from '../../src/store';

// Categorías con degradados sobrios de la paleta GrooveSpace.
const TILE = [
  ['#ff6b97', '#d6336c'], ['#9d7bff', '#5b3fd6'], ['#ff9a62', '#e8590c'], ['#3fc7b8', '#0b8a7f'],
  ['#5aa9ff', '#2f5fd0'], ['#f5c14f', '#d9831f'], ['#c77dff', '#7b2cbf'], ['#7ed39a', '#2b9a5d'], ['#ff8fab', '#c9184a'],
];

export default function Search() {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  const [q, setQ] = useState('');
  const [genre, setGenre] = useState(null);
  const router = useRouter();
  const term = q.trim().toLowerCase();
  const browsing = !term && !genre;

  const { catalogVersion } = useApp();
  // Se recalcula en cada render (y cuando cambia catalogVersion): el catálogo llega del sitio web después de abrir la app.
  const bands = useMemo(() => BANDS.filter((b) => (!genre || b.genre === genre) && (!term || b.name.toLowerCase().includes(term) || b.genre.toLowerCase().includes(term))), [genre, term, catalogVersion]);
  const songs = useMemo(() => SONGS.filter((s) => { const b = bandById(s.bandId); return (!genre || b.genre === genre) && (!term || s.title.toLowerCase().includes(term) || b.name.toLowerCase().includes(term)); }), [genre, term, catalogVersion]);
  const genres = useMemo(() => GENRES.filter((g) => g !== 'Todo'), [catalogVersion]);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 190 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <Header title={genre || 'Buscar'} />
      <View style={s.search}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput value={q} onChangeText={setQ} placeholder="Bandas, canciones y más" placeholderTextColor={colors.muted} style={s.input} returnKeyType="search" />
        {(!!q || !!genre) && <Press onPress={() => { setQ(''); setGenre(null); }} hitSlop={10}><Ionicons name="close-circle" size={18} color={colors.muted} /></Press>}
      </View>

      {browsing ? (
        <View style={{ paddingHorizontal: 20, marginTop: 22 }}>
          <Text style={[type.h2, { marginBottom: 12 }]}>Explorar por género</Text>
          <View style={s.tiles}>
            {genres.map((g, i) => (
              <FadeIn key={g} delay={i * 40} style={s.tileWrap}>
                <Press onPress={() => setGenre(g)} scale={0.97}>
                  <LinearGradient colors={TILE[i % TILE.length]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.tile}>
                    <Text style={s.tileTxt}>{g}</Text>
                    <View style={s.tileArt}><Cover band={{ name: g, colors: TILE[(i + 3) % TILE.length] }} size={62} radius={6} seed={i} /></View>
                  </LinearGradient>
                </Press>
              </FadeIn>
            ))}
          </View>
        </View>
      ) : (
        <View>
          {bands.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={[type.h2, { paddingHorizontal: 20, marginBottom: 6 }]}>Bandas</Text>
              {bands.map((b) => (
                <Press key={b.id} onPress={() => router.push(`/band/${b.id}`)} scale={0.99} style={s.band}>
                  <Cover band={b} size={56} radius={28} />
                  <View style={s.bandText}><View style={{ flex: 1 }}><Text style={type.h3}>{b.name}</Text><Text style={type.small}>{b.genre}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.muted} /></View>
                </Press>
              ))}
            </View>
          )}
          <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
            <Text style={[type.h2, { marginBottom: 6 }]}>Canciones</Text>
            {songs.map((song) => <SongRow key={song.id} song={song} list={songs.map((x) => x.id)} context={`Búsqueda${genre ? ` · ${genre}` : ''}`} />)}
            {songs.length === 0 && bands.length === 0 && <Text style={[type.body, { textAlign: 'center', marginTop: 40 }]}>Sin resultados para “{q}”.</Text>}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
const makeS = (colors, type) => StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20, marginTop: 6, backgroundColor: colors.surface, borderRadius: 10, paddingHorizontal: 10 },
  input: { flex: 1, color: colors.text, fontSize: 17, paddingVertical: 10 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tileWrap: { width: '47.8%' },
  tile: { height: 96, borderRadius: 10, padding: 12, overflow: 'hidden' },
  tileTxt: { color: '#fff', fontSize: 16, fontWeight: '700', maxWidth: '72%' },
  tileArt: { position: 'absolute', right: -8, bottom: -4, transform: [{ rotate: '22deg' }] },
  band: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 20 },
  bandText: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingRight: 20, minHeight: 68, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
});
