import React, { useEffect, useState, useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FadeIn from '../../src/components/FadeIn';
import Press from '../../src/components/Press';
import { useTheme } from '../../src/theme';
import { useApp } from '../../src/store';
import { bandFetch, publishDemo } from '../../src/lib/api';

// La app sólo soporta el inicio de sesión de la banda (líder); el backend acepta líder o tesorero,
// pero el tesorero inicia sesión como integrante y esta versión de la app aún no tiene esa pantalla.
const canManage = (user) => user?.role === 'band';

function PublishRow({ item, user, colors, type, s, onChanged }) {
  const [lyrics, setLyrics] = useState(item.lyrics || '');
  const [busy, setBusy] = useState(false);
  const manager = canManage(user);
  const dirty = lyrics !== (item.lyrics || '');
  const save = async (published) => {
    setBusy(true);
    try {
      const r = await publishDemo(user.token, item._id || item.id, { published, lyrics });
      onChanged(item._id || item.id, r);
    } catch (e) { /* se queda como estaba; el usuario puede reintentar */ }
    setBusy(false);
  };
  if (!manager) return null;
  return (
    <View style={{ marginTop: 10, gap: 8 }}>
      <View style={s.publishRow}>
        <Ionicons name={item.published ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={item.published ? colors.green : colors.muted} />
        <Text style={[type.small, { flex: 1 }]}>{item.published ? 'Visible en la app móvil' : 'No publicado en la app'}</Text>
        {busy ? <ActivityIndicator size="small" color={colors.accent} /> : (
          <Press onPress={() => save(!item.published)} style={s.publishBtn}><Text style={s.publishBtnTxt}>{item.published ? 'Retirar' : 'Publicar'}</Text></Press>
        )}
      </View>
      <TextInput
        value={lyrics} onChangeText={setLyrics} multiline numberOfLines={3} maxLength={8000}
        placeholder="Letra (se muestra sincronizada en la app)" placeholderTextColor={colors.muted}
        style={s.lyrics}
      />
      {dirty && !busy && <Press onPress={() => save(undefined)} style={[s.publishBtn, { alignSelf: 'flex-start' }]}><Text style={s.publishBtnTxt}>Guardar letra</Text></Press>}
    </View>
  );
}

export default function Demos() {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  const { user } = useApp();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    bandFetch('/api/demos/mine', user.token).then((d) => setItems(Array.isArray(d) ? d : [])).catch((e) => setError(e.message));
  }, []); // eslint-disable-line
  const onChanged = (id, patch) => setItems((list) => list.map((d) => ((d._id || d.id) === id ? { ...d, ...patch } : d)));
  return (
    <FlatList
      data={items}
      keyExtractor={(d, i) => d._id || d.id || String(i)}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 130, paddingHorizontal: 20, flexGrow: 1 }}
      ListHeaderComponent={<FadeIn><Text style={type.h1}>Demos</Text><Text style={[type.small, { marginTop: 4, marginBottom: 16 }]}>Versiones que tus ingenieros están revisando. Las aprobadas puedes publicarlas en la app móvil.</Text></FadeIn>}
      ListEmptyComponent={<Text style={[type.body, { textAlign: 'center', marginTop: 60 }]}>{error || 'Todavía no tienes demos enviados.'}</Text>}
      renderItem={({ item, index }) => (
        <FadeIn delay={index * 60} style={s.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={s.icon}><Ionicons name="musical-notes" size={18} color={colors.onLime} /></View>
            <View style={{ flex: 1 }}>
              <Text style={type.h3} numberOfLines={1}>{item.title || 'Demo sin título'}</Text>
              <Text style={type.small}>{item.status || 'En revisión'}{item.createdAt ? ` · ${new Date(item.createdAt).toLocaleDateString('es-MX')}` : ''}</Text>
            </View>
          </View>
          <PublishRow item={item} user={user} colors={colors} type={type} s={s} onChanged={onChanged} />
        </FadeIn>
      )}
    />
  );
}
const makeS = (colors, type) => StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: colors.line },
  icon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.pink, alignItems: 'center', justifyContent: 'center' },
  publishRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  publishBtn: { backgroundColor: colors.accentSoft, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6 },
  publishBtnTxt: { color: colors.accent, fontWeight: '700', fontSize: 13 },
  lyrics: { color: colors.text, fontSize: 13, backgroundColor: colors.groupBg, borderRadius: 10, padding: 10, minHeight: 60, textAlignVertical: 'top' },
});
