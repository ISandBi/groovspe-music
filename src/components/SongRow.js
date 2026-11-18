import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Press from './Press';
import Cover from './Cover';
import EqBars from './EqBars';
import { colors, type } from '../theme';
import { bandById } from '../data';
import { clock, compact } from '../lib/format';
import { useApp } from '../store';

export default function SongRow({ song, list, index }) {
  const { current, status, play, favorites, toggleFav } = useApp();
  const band = bandById(song.bandId);
  const active = current?.id === song.id;
  const fav = favorites.includes(song.id);
  return (
    <Press onPress={() => play(song.id, list)} scale={0.98} style={s.row} accessibilityRole="button" accessibilityLabel={`Reproducir ${song.title} de ${band.name}`}>
      {index != null && !active && <Text style={s.idx}>{index + 1}</Text>}
      {active && <View style={s.idxBox}><EqBars active={status.playing} /></View>}
      <Cover band={band} size={48} radius={10} />
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={[type.h3, active && { color: colors.lime }]}>{song.title}</Text>
        <Text numberOfLines={1} style={type.small}>{band.name} · {clock(song.duration)} · {compact(song.plays)} reprod.</Text>
      </View>
      <Press onPress={() => toggleFav(song.id)} scale={0.8} hitSlop={10} accessibilityLabel="Favorito">
        <Ionicons name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? colors.pink : colors.muted} />
      </Press>
    </Press>
  );
}
const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  idx: { width: 18, textAlign: 'center', color: colors.muted, fontWeight: '700' },
  idxBox: { width: 18, alignItems: 'center' },
});
