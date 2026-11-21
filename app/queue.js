import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Press from '../src/components/Press';
import SongRow from '../src/components/SongRow';
import { colors, type } from '../src/theme';
import { songById } from '../src/data';
import { useApp } from '../src/store';

export default function Queue() {
  const { queue, current, context, shuffle, repeat, toggleShuffle, cycleRepeat } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const i = current ? queue.indexOf(current.id) : -1;
  const next = queue.slice(i + 1).concat(queue.slice(0, Math.max(0, i)));
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 14, paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }}>
        <View style={s.top}>
          <Text style={type.largeTitle}>A continuación</Text>
          <Press onPress={() => router.back()} style={s.close} accessibilityLabel="Cerrar"><Ionicons name="close" size={20} color={colors.muted} /></Press>
        </View>
        <View style={s.toggles}>
          <Press onPress={toggleShuffle} style={[s.chip, shuffle && s.chipOn]}><Ionicons name="shuffle" size={18} color={shuffle ? '#fff' : colors.text} /><Text style={[s.chipTxt, shuffle && { color: '#fff' }]}>Aleatorio</Text></Press>
          <Press onPress={cycleRepeat} style={[s.chip, repeat !== 'off' && s.chipOn]}><Ionicons name="repeat" size={18} color={repeat !== 'off' ? '#fff' : colors.text} /><Text style={[s.chipTxt, repeat !== 'off' && { color: '#fff' }]}>{repeat === 'one' ? 'Repetir una' : 'Repetir'}</Text></Press>
        </View>
        {current && (<>
          <Text style={[type.h2, { marginTop: 22, marginBottom: 6 }]}>Reproduciendo</Text>
          <SongRow song={current} list={queue} context={context} showPlays={false} />
        </>)}
        <Text style={[type.h2, { marginTop: 22, marginBottom: 6 }]}>Desde: {context}</Text>
        {next.map((id) => <SongRow key={id} song={songById(id)} list={queue} context={context} showPlays={false} />)}
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  close: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  toggles: { flexDirection: 'row', gap: 10, marginTop: 14 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999 },
  chipOn: { backgroundColor: colors.accent },
  chipTxt: { color: colors.text, fontWeight: '600', fontSize: 14 },
});
