import React, { useState, useMemo } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Cover from '../../src/components/Cover';
import Press from '../../src/components/Press';
import FadeIn from '../../src/components/FadeIn';
import Header from '../../src/components/Header';
import SongRow from '../../src/components/SongRow';
import { useTheme } from '../../src/theme';
import { PLAYLISTS as ALL_LISTS, BANDS, SONGS, bandById, songById } from '../../src/data';
import { useApp } from '../../src/store';

const PLAYLISTS = [...ALL_LISTS].sort((a, b) => (b.id === 'e7') - (a.id === 'e7'));
const TOP = [...BANDS].sort((a, b) => b.listeners - a.listeners);

export default function Library() {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  const { favorites, playlists, followed, recent, createPlaylist } = useApp();
  const router = useRouter();
  const [view, setView] = useState(null); // null | listas | bandas | canciones
  const [asking, setAsking] = useState(false);
  const [name, setName] = useState('');

  const rows = [
    ['listas', 'musical-notes-outline', 'Listas', playlists.length + PLAYLISTS.length],
    ['bandas', 'people-outline', 'Bandas', followed.length || TOP.length],
    ['canciones', 'musical-note-outline', 'Canciones', SONGS.length],
  ];
  const Row = ({ cover, title, sub, onPress }) => (
    <Press onPress={onPress} scale={0.99} style={s.row}>
      {cover}
      <View style={s.rowText}><View style={{ flex: 1 }}><Text style={type.h3} numberOfLines={1}>{title}</Text><Text style={type.small} numberOfLines={1}>{sub}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.muted} /></View>
    </Press>
  );
  const heartCover = <View style={s.heart}><Ionicons name="heart" size={24} color="#fff" /></View>;
  const grid = (recent.length ? recent.map(songById).map((x) => bandById(x.bandId)) : TOP).filter((b, i, a) => a.indexOf(b) === i).slice(0, 6);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 190 }} showsVerticalScrollIndicator={false}>
        {view ? (
          <View style={{ paddingTop: 54 }}>
            <Press onPress={() => setView(null)} style={s.back}><Ionicons name="chevron-back" size={22} color={colors.accent} /><Text style={{ color: colors.accent, fontSize: 17 }}>Biblioteca</Text></Press>
            <Header title={rows.find((r) => r[0] === view)[2]} />
          </View>
        ) : (
          <Header title="Biblioteca" right={<Press onPress={() => setAsking(true)} hitSlop={10} accessibilityLabel="Crear lista"><Text style={s.edit}>Nueva lista</Text></Press>} />
        )}

        {!view && (
          <FadeIn>
            <Press onPress={() => router.push('/playlist/fav')} scale={0.99} style={[s.rowPlain, { marginTop: 4 }]}>
              <View style={s.favIcon}><Ionicons name="heart" size={18} color={colors.accent} /></View>
              <View style={s.rowText}><Text style={[type.h3, { flex: 1, fontWeight: '400', fontSize: 20 }]}>Favoritas</Text><Text style={type.small}>{favorites.length}</Text><Ionicons name="chevron-forward" size={18} color={colors.muted} /></View>
            </Press>
            {rows.map(([k, icon, label, n]) => (
              <Press key={k} onPress={() => setView(k)} scale={0.99} style={s.rowPlain}>
                <View style={s.favIcon}><Ionicons name={icon} size={18} color={colors.accent} /></View>
                <View style={s.rowText}><Text style={[type.h3, { flex: 1, fontWeight: '400', fontSize: 20 }]}>{label}</Text><Text style={type.small}>{n}</Text><Ionicons name="chevron-forward" size={18} color={colors.muted} /></View>
              </Press>
            ))}
            <Text style={[type.h2, { paddingHorizontal: 20, marginTop: 26, marginBottom: 12 }]}>Agregado recientemente</Text>
            <View style={s.grid}>
              {grid.map((b) => (
                <Press key={b.id} onPress={() => router.push(`/band/${b.id}`)} style={{ width: '47.5%' }}>
                  <Cover band={b} size={150} radius={10} elevated style={{ width: '100%', height: undefined, aspectRatio: 1 }} />
                  <Text style={s.gTitle} numberOfLines={1}>{b.name}</Text><Text style={type.small}>{b.genre}</Text>
                </Press>
              ))}
            </View>
          </FadeIn>
        )}

        {view === 'listas' && (
          <View>
            <Row onPress={() => router.push('/playlist/fav')} title="Favoritas" sub={`${favorites.length} canciones`} cover={heartCover} />
            {playlists.map((l) => <Row key={l.id} onPress={() => router.push(`/playlist/${l.id}`)} title={l.name} sub={`${l.songIds.length} canciones`} cover={<Cover band={l} size={56} radius={6} />} />)}
            {PLAYLISTS.map((l) => <Row key={l.id} onPress={() => router.push(`/playlist/${l.id}`)} title={l.name} sub="GrooveSpace" cover={<Cover band={l} size={56} radius={6} seed={l.id} />} />)}
          </View>
        )}
        {view === 'bandas' && (
          <View>
            {(followed.length ? followed.map(bandById) : TOP).map((b) => <Row key={b.id} onPress={() => router.push(`/band/${b.id}`)} title={b.name} sub={followed.includes(b.id) ? 'Siguiendo' : b.genre} cover={<Cover band={b} size={56} radius={28} />} />)}
          </View>
        )}
        {view === 'canciones' && (
          <View style={{ paddingHorizontal: 20 }}>{SONGS.map((song) => <SongRow key={song.id} song={song} list={SONGS.map((x) => x.id)} context="Canciones" />)}</View>
        )}
      </ScrollView>

      <Modal transparent visible={asking} animationType="fade" onRequestClose={() => setAsking(false)}>
        <Pressable style={s.backdrop} onPress={() => setAsking(false)} />
        <View style={s.dialog}>
          <Text style={type.h2}>Nueva lista</Text>
          <TextInput autoFocus value={name} onChangeText={setName} placeholder="Ponle nombre" placeholderTextColor={colors.muted} style={s.input} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Press onPress={() => setAsking(false)} style={[s.btn, { backgroundColor: colors.surface, flex: 1 }]}><Text style={[s.btnTxt, { color: colors.text }]}>Cancelar</Text></Press>
            <Press onPress={() => { const id = createPlaylist(name); setName(''); setAsking(false); router.push(`/playlist/${id}`); }} style={[s.btn, { flex: 1 }]}><Text style={s.btnTxt}>Crear</Text></Press>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const makeS = (colors, type) => StyleSheet.create({
  edit: { color: colors.accent, fontSize: 17, marginBottom: 6 },
  back: { flexDirection: 'row', alignItems: 'center', paddingLeft: 12 },
  rowPlain: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingLeft: 20 },
  favIcon: { width: 26, alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 20 },
  rowText: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 20, minHeight: 56, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  heart: { width: 56, height: 56, borderRadius: 6, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, paddingHorizontal: 20 },
  gTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginTop: 8 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  dialog: { position: 'absolute', left: 28, right: 28, top: '30%', backgroundColor: colors.raised, borderRadius: 16, padding: 20, gap: 14 },
  input: { backgroundColor: colors.surface, color: colors.text, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 17 },
  btn: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
