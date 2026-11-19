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
  const { queue, current, context } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const i = current ? queue.indexOf(current.id) : -1;
  const next = queue.slice(i + 1).concat(queue.slice(0, Math.max(0, i)));
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }}>
        <View style={s.top}>
          <Press onPress={() => router.back()} style={s.round}><Ionicons name="chevron-down" size={22} color={colors.text} /></Press>
          <Text style={type.h2}>Cola</Text>
          <View style={{ width: 40 }} />
        </View>
        {current && (<>
          <Text style={[type.label, { marginTop: 24, marginBottom: 6 }]}>Reproduciendo ahora</Text>
          <SongRow song={current} list={queue} context={context} showPlays={false} />
        </>)}
        <Text style={[type.label, { marginTop: 24, marginBottom: 6 }]}>A continuación · {context}</Text>
        {next.map((id) => <SongRow key={id} song={songById(id)} list={queue} context={context} showPlays={false} />)}
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  round: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
});
