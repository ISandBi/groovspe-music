import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Animated, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Cover from './Cover';
import Press from './Press';
import { useTheme } from '../theme';
import { bandById, songById } from '../data';
import { useApp } from '../store';

const H = Dimensions.get('window').height;

// Menú contextual de canción (estilo hoja de acciones): favorita, añadir a lista, cola, ir a la banda.
export default function SongSheet() {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  const { sheetSong, closeSheet, favorites, toggleFav, enqueueNext, playlists, addToPlaylist, createPlaylist } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const y = useRef(new Animated.Value(H)).current;
  const [mode, setMode] = useState('menu');
  const [name, setName] = useState('');
  const song = sheetSong ? songById(sheetSong) : null;

  useEffect(() => {
    if (song) { setMode('menu'); setName(''); Animated.spring(y, { toValue: 0, useNativeDriver: true, bounciness: 3 }).start(); }
    else y.setValue(H);
  }, [sheetSong]); // eslint-disable-line

  const close = () => Animated.timing(y, { toValue: H, duration: 180, useNativeDriver: true }).start(closeSheet);
  if (!song) return null;
  const band = bandById(song.bandId);
  const fav = favorites.includes(song.id);

  const Item = ({ icon, label, onPress, tint }) => (
    <Press onPress={onPress} scale={0.99} style={s.item}>
      <Text style={[s.itemTxt, tint && { color: tint }]}>{label}</Text>
      <Ionicons name={icon} size={22} color={tint || colors.text} />
    </Press>
  );

  return (
    <Modal transparent visible animationType="fade" onRequestClose={close} statusBarTranslucent>
      <Pressable style={s.backdrop} onPress={close} />
      <Animated.View style={[s.sheet, { paddingBottom: insets.bottom + 12, transform: [{ translateY: y }] }]}>
        <View style={s.grab} />
        <View style={s.head}>
          <Cover band={band} size={52} radius={8} seed={song.id} />
          <View style={{ flex: 1 }}>
            <Text style={s.title} numberOfLines={1}>{song.title}</Text>
            <Text style={s.sub} numberOfLines={1}>{band.name}</Text>
          </View>
        </View>
        {mode === 'menu' && (
          <View>
            <Item icon={fav ? 'heart' : 'heart-outline'} tint={fav ? colors.accent : undefined} label={fav ? 'Quitar de favoritas' : 'Añadir a favoritas'} onPress={() => { toggleFav(song.id); close(); }} />
            <Item icon="add-circle-outline" label="Añadir a una lista" onPress={() => setMode('lists')} />
            <Item icon="list" label="Añadir a la cola" onPress={() => { enqueueNext(song.id); close(); }} />
            <Item icon="person-outline" label="Ir a la banda" onPress={() => { close(); router.push(`/band/${band.id}`); }} />
          </View>
        )}
        {mode === 'lists' && (
          <ScrollView style={{ maxHeight: H * 0.4 }}>
            <Item icon="add" label="Nueva lista" onPress={() => setMode('new')} tint={colors.accent} />
            {playlists.map((l) => <Item key={l.id} icon={l.songIds.includes(song.id) ? 'checkmark-circle' : 'musical-notes-outline'} label={l.name} onPress={() => { addToPlaylist(l.id, song.id); close(); }} />)}
          </ScrollView>
        )}
        {mode === 'new' && (
          <View style={{ paddingHorizontal: 20, paddingTop: 10, gap: 12 }}>
            <TextInput autoFocus value={name} onChangeText={setName} placeholder="Nombre de tu lista" placeholderTextColor={colors.muted} style={s.input} />
            <Press onPress={() => { createPlaylist(name, [song.id]); close(); }} style={s.primary}><Text style={s.primaryTxt}>Crear y añadir</Text></Press>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
}
const makeS = (colors, type) => StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingTop: 8 },
  grab: { alignSelf: 'center', width: 36, height: 5, borderRadius: 3, backgroundColor: 'rgba(26,19,37,0.2)', marginBottom: 12 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  title: { fontSize: 16, fontWeight: '600', color: colors.text },
  sub: { fontSize: 14, color: colors.muted },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  itemTxt: { fontSize: 17, color: colors.text },
  input: { backgroundColor: colors.surface, color: colors.text, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 17 },
  primary: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
