import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Cover from '../../src/components/Cover';
import Press from '../../src/components/Press';
import FadeIn from '../../src/components/FadeIn';
import { colors, type } from '../../src/theme';
import { PLAYLISTS as ALL_LISTS, BANDS, bandById } from '../../src/data';

// Lista de referencia (audio y video) primero.
const PLAYLISTS = [...ALL_LISTS].sort((a, b) => (b.id === 'e7') - (a.id === 'e7'));
const SUGGESTED = [...BANDS].sort((a, b) => b.listeners - a.listeners).slice(0, 6);
import { useApp } from '../../src/store';

const FILTERS = ['Todo', 'Listas', 'Bandas'];

export default function Library() {
  const { favorites, playlists, followed, createPlaylist } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('Todo');
  const [asking, setAsking] = useState(false);
  const [name, setName] = useState('');

  const Row = ({ cover, title, sub, onPress, round }) => (
    <Press onPress={onPress} scale={0.985} style={s.row}>
      {cover}
      <View style={{ flex: 1 }}><Text style={type.h3} numberOfLines={1}>{title}</Text><Text style={type.small} numberOfLines={1}>{sub}</Text></View>
    </Press>
  );
  const showLists = filter !== 'Bandas';
  const showBands = filter !== 'Listas';

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 170, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
        <FadeIn style={s.head}>
          <Text style={[type.h1, { flex: 1 }]}>Tu biblioteca</Text>
          <Press onPress={() => setAsking(true)} scale={0.88} style={s.add} accessibilityLabel="Crear lista"><Ionicons name="add" size={24} color={colors.text} /></Press>
        </FadeIn>
        <View style={s.chips}>
          {FILTERS.map((f) => (
            <Press key={f} onPress={() => setFilter(f)} scale={0.94} style={[s.chip, filter === f && s.chipOn]}>
              <Text style={[s.chipTxt, filter === f && { color: colors.onLime }]}>{f}</Text>
            </Press>
          ))}
        </View>

        {showLists && (
          <View style={{ marginTop: 12 }}>
            <Row onPress={() => router.push('/playlist/fav')} title="Canciones que te gustan" sub={`Lista · ${favorites.length} canciones`}
              cover={<LinearGradient colors={[colors.pink, '#8b5cff']} style={s.heart}><Ionicons name="heart" size={26} color="#fff" /></LinearGradient>} />
            {playlists.map((l) => <Row key={l.id} onPress={() => router.push(`/playlist/${l.id}`)} title={l.name} sub={`Lista · ${l.songIds.length} canciones`} cover={<Cover band={l} size={60} radius={8} />} />)}
            {PLAYLISTS.slice(0, 4).map((l) => <Row key={l.id} onPress={() => router.push(`/playlist/${l.id}`)} title={l.name} sub="Lista · GrooveSpace" cover={<Cover band={l} size={60} radius={8} seed={l.id} />} />)}
          </View>
        )}
        {showBands && (
          <View style={{ marginTop: 12 }}>
            {followed.map((id) => { const b = bandById(id); return <Row key={id} onPress={() => router.push(`/band/${id}`)} title={b.name} sub="Banda · Siguiendo" cover={<Cover band={b} size={60} radius={30} />} />; })}
            <Text style={[type.h2, { marginTop: 18, marginBottom: 6 }]}>{followed.length ? 'Descubre más bandas' : 'Bandas para seguir'}</Text>
            {SUGGESTED.filter((b) => !followed.includes(b.id)).map((b) => (
              <Row key={b.id} onPress={() => router.push(`/band/${b.id}`)} title={b.name} sub={b.provisional ? `${b.genre} · Audio y video` : b.genre} cover={<Cover band={b} size={60} radius={30} />} />
            ))}
          </View>
        )}
      </ScrollView>

      <Modal transparent visible={asking} animationType="fade" onRequestClose={() => setAsking(false)}>
        <Pressable style={s.backdrop} onPress={() => setAsking(false)} />
        <View style={s.dialog}>
          <Text style={type.h2}>Nueva lista</Text>
          <TextInput autoFocus value={name} onChangeText={setName} placeholder="Ponle nombre" placeholderTextColor={colors.muted} style={s.input} />
          <Press onPress={() => { const id = createPlaylist(name); setName(''); setAsking(false); router.push(`/playlist/${id}`); }} style={s.primary}><Text style={s.primaryTxt}>Crear</Text></Press>
        </View>
      </Modal>
    </View>
  );
}
const s = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center' },
  add: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  chips: { flexDirection: 'row', gap: 8, marginTop: 16 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.surface },
  chipOn: { backgroundColor: colors.lime },
  chipTxt: { color: colors.text, fontWeight: '700', fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 8 },
  heart: { width: 60, height: 60, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  dialog: { position: 'absolute', left: 24, right: 24, top: '30%', backgroundColor: colors.raised, borderRadius: 24, padding: 22, gap: 14 },
  input: { backgroundColor: colors.surface, color: colors.text, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, borderWidth: 1.5, borderColor: colors.lime },
  primary: { backgroundColor: colors.lime, borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  primaryTxt: { color: colors.onLime, fontWeight: '800', fontSize: 15 },
});
