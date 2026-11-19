import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Cover from './Cover';
import Press from './Press';
import { colors, type } from '../theme';
import { bandById, songById } from '../data';
import { useApp } from '../store';

const H = Dimensions.get('window').height;

// Menú contextual de canción (equivalente al "⋯"): me gusta, añadir a lista, cola, ir a la banda.
export default function SongSheet() {
  const { sheetSong, closeSheet, favorites, toggleFav, enqueueNext, playlists, addToPlaylist, createPlaylist } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const y = useRef(new Animated.Value(H)).current;
  const [mode, setMode] = useState('menu'); // menu | lists | new
  const [name, setName] = useState('');
  const song = sheetSong ? songById(sheetSong) : null;

  useEffect(() => {
    if (song) { setMode('menu'); setName(''); Animated.spring(y, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start(); }
    else y.setValue(H);
  }, [sheetSong]); // eslint-disable-line

  const close = () => Animated.timing(y, { toValue: H, duration: 180, useNativeDriver: true }).start(closeSheet);
  if (!song) return null;
  const band = bandById(song.bandId);
  const fav = favorites.includes(song.id);

  const Item = ({ icon, label, onPress, tint }) => (
    <Press onPress={onPress} scale={0.98} style={s.item}>
      <Ionicons name={icon} size={22} color={tint || colors.text} />
      <Text style={[type.h3, { fontWeight: '600' }, tint && { color: tint }]}>{label}</Text>
    </Press>
  );

  return (
    <Modal transparent visible animationType="fade" onRequestClose={close} statusBarTranslucent>
      <Pressable style={s.backdrop} onPress={close} />
      <Animated.View style={[s.sheet, { paddingBottom: insets.bottom + 12, transform: [{ translateY: y }] }]}>
        <View style={s.grab} />
        <View style={s.head}>
          <Cover band={band} size={52} radius={10} />
          <View style={{ flex: 1 }}>
            <Text style={type.h3} numberOfLines={1}>{song.title}</Text>
            <Text style={type.small} numberOfLines={1}>{band.name}</Text>
          </View>
        </View>
        {mode === 'menu' && (
          <View>
            <Item icon={fav ? 'heart' : 'heart-outline'} tint={fav ? colors.pink : undefined} label={fav ? 'Quitar de tus favoritas' : 'Añadir a tus favoritas'} onPress={() => { toggleFav(song.id); close(); }} />
            <Item icon="add-circle-outline" label="Añadir a una lista" onPress={() => setMode('lists')} />
            <Item icon="list" label="Añadir a la cola" onPress={() => { enqueueNext(song.id); close(); }} />
            <Item icon="people-outline" label="Ir a la banda" onPress={() => { close(); router.push(`/band/${band.id}`); }} />
          </View>
        )}
        {mode === 'lists' && (
          <ScrollView style={{ maxHeight: H * 0.4 }}>
            <Item icon="add" label="Nueva lista" onPress={() => setMode('new')} tint={colors.lime} />
            {playlists.map((l) => <Item key={l.id} icon={l.songIds.includes(song.id) ? 'checkmark-circle' : 'musical-notes-outline'} label={l.name} onPress={() => { addToPlaylist(l.id, song.id); close(); }} />)}
          </ScrollView>
        )}
        {mode === 'new' && (
          <View style={{ paddingHorizontal: 20, paddingTop: 8, gap: 12 }}>
            <TextInput autoFocus value={name} onChangeText={setName} placeholder="Nombre de tu lista" placeholderTextColor={colors.muted} style={s.input} />
            <Press onPress={() => { createPlaylist(name, [song.id]); close(); }} style={s.primary}><Text style={s.primaryTxt}>Crear y añadir</Text></Press>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
}
const s = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.raised, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 8 },
  grab: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.25)', marginBottom: 12 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 14, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: colors.line },
  item: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 20, paddingVertical: 14 },
  input: { backgroundColor: colors.surface, color: colors.text, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, borderWidth: 1.5, borderColor: colors.lime },
  primary: { backgroundColor: colors.lime, borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  primaryTxt: { color: colors.onLime, fontWeight: '800', fontSize: 15 },
});
