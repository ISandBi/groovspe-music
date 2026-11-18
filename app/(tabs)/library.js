import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SongRow from '../../src/components/SongRow';
import FadeIn from '../../src/components/FadeIn';
import { colors, type } from '../../src/theme';
import { songById } from '../../src/data';
import { useApp } from '../../src/store';

export default function Library() {
  const { favorites } = useApp();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 170, paddingHorizontal: 20, flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <FadeIn><Text style={type.h1}>Tu biblioteca</Text><Text style={[type.small, { marginTop: 4 }]}>{favorites.length} canciones favoritas</Text></FadeIn>
      {favorites.length === 0 ? (
        <FadeIn delay={150} style={{ alignItems: 'center', marginTop: 80 }}>
          <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="heart-outline" size={38} color={colors.pink} />
          </View>
          <Text style={[type.h2, { marginTop: 18 }]}>Aún no tienes favoritas</Text>
          <Text style={[type.body, { textAlign: 'center', marginTop: 6, maxWidth: 260 }]}>Toca el corazón en cualquier canción para guardarla aquí.</Text>
        </FadeIn>
      ) : (
        <View style={{ marginTop: 16 }}>
          {favorites.map((id) => <SongRow key={id} song={songById(id)} list={favorites} />)}
        </View>
      )}
    </ScrollView>
  );
}
