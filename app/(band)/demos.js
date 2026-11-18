import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FadeIn from '../../src/components/FadeIn';
import { colors, type } from '../../src/theme';
import { useApp } from '../../src/store';
import { bandFetch } from '../../src/lib/api';

export default function Demos() {
  const { user } = useApp();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    bandFetch('/api/demos/mine', user.token).then((d) => setItems(Array.isArray(d) ? d : [])).catch((e) => setError(e.message));
  }, []); // eslint-disable-line
  return (
    <FlatList
      data={items}
      keyExtractor={(d, i) => d._id || d.id || String(i)}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 130, paddingHorizontal: 20, flexGrow: 1 }}
      ListHeaderComponent={<FadeIn><Text style={type.h1}>Demos</Text><Text style={[type.small, { marginTop: 4, marginBottom: 16 }]}>Versiones que tus ingenieros están revisando</Text></FadeIn>}
      ListEmptyComponent={<Text style={[type.body, { textAlign: 'center', marginTop: 60 }]}>{error || 'Todavía no tienes demos enviados.'}</Text>}
      renderItem={({ item, index }) => (
        <FadeIn delay={index * 60} style={s.card}>
          <View style={s.icon}><Ionicons name="musical-notes" size={18} color={colors.onLime} /></View>
          <View style={{ flex: 1 }}>
            <Text style={type.h3} numberOfLines={1}>{item.title || 'Demo sin título'}</Text>
            <Text style={type.small}>{item.status || 'En revisión'}{item.createdAt ? ` · ${new Date(item.createdAt).toLocaleDateString('es-MX')}` : ''}</Text>
          </View>
        </FadeIn>
      )}
    />
  );
}
const s = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderRadius: 18, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: colors.line },
  icon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.pink, alignItems: 'center', justifyContent: 'center' },
});
