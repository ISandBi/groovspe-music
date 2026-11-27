import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Press from './Press';
import Cover from './Cover';
import EqBars from './EqBars';
import { useTheme } from '../theme';
import { bandById } from '../data';
import { clock, compact } from '../lib/format';
import { useApp } from '../store';

// Fila de canción con separador fino que empieza en el texto (estilo Apple).
export default function SongRow({ song, list, index, context, showPlays = true }) {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  const { current, playing, play, openSheet } = useApp();
  const band = bandById(song.bandId);
  const active = current?.id === song.id;
  return (
    <Press onPress={() => play(song.id, list, context)} onLongPress={() => openSheet(song.id)} scale={0.99} style={s.row} accessibilityRole="button" accessibilityLabel={`Reproducir ${song.title} de ${band.name}`}>
      {index != null && <View style={s.idxBox}>{active ? <EqBars active={playing} /> : <Text style={s.idx}>{index + 1}</Text>}</View>}
      <View>
        <Cover band={band} size={48} radius={6} seed={song.id} cover={song.cover} />
        {active && index == null && <View style={s.over}><EqBars active={playing} color="#fff" height={14} /></View>}
      </View>
      <View style={s.text}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={[s.title, active && { color: colors.accent }]}>{song.title}</Text>
          <Text numberOfLines={1} style={s.sub}>{band.name}{showPlays ? ` · ${compact(song.plays)} reprod.` : ` · ${clock(song.duration)}`}</Text>
        </View>
        <Press onPress={() => openSheet(song.id)} scale={0.8} hitSlop={12} accessibilityLabel="Más opciones">
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.muted} />
        </Press>
      </View>
    </Press>
  );
}
const makeS = (colors, type) => StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 0 },
  idxBox: { width: 20, alignItems: 'center' },
  idx: { color: colors.muted, fontWeight: '600', fontSize: 15 },
  over: { ...StyleSheet.absoluteFillObject, borderRadius: 6, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 60, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  title: { fontSize: 16, fontWeight: '500', color: colors.text },
  sub: { fontSize: 14, color: colors.muted, marginTop: 1 },
});
