import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Press from './Press';
import { getLyrics } from '../lib/lyrics';

// Letra al ritmo de la canción: la línea actual se resalta y la lista se desplaza sola. Toca una línea para saltar ahí.
// Siempre se dibuja sobre el fondo oscuro del reproductor, por eso usa blanco.
export default function Lyrics({ song, band, currentTime, onSeek, height }) {
  const [data, setData] = useState(undefined); // undefined = cargando, null = sin letra
  const ref = useRef(null);
  const ys = useRef({});

  useEffect(() => {
    let on = true;
    setData(undefined); ys.current = {};
    getLyrics(song, band).then((d) => { if (on) setData(d); });
    return () => { on = false; };
  }, [song.id]); // eslint-disable-line

  const lines = data ? data.lines : [];
  let active = -1;
  if (data && data.synced) {
    for (let i = 0; i < lines.length; i += 1) { if (lines[i].t <= currentTime + 0.25) active = i; else break; }
  }
  useEffect(() => {
    if (active >= 0 && ys.current[active] != null) ref.current?.scrollTo({ y: Math.max(0, ys.current[active] - height * 0.32), animated: true });
  }, [active]); // eslint-disable-line

  if (data === undefined) return <View style={[s.center, { height }]}><ActivityIndicator color="#fff" /><Text style={s.hint}>Buscando la letra…</Text></View>;
  if (data === null) return (
    <View style={[s.center, { height }]}>
      <Ionicons name="chatbubble-ellipses-outline" size={34} color="rgba(255,255,255,0.7)" />
      <Text style={s.hint}>Esta canción no tiene letra disponible.</Text>
    </View>
  );
  return (
    <View style={{ height, width: '100%' }}>
      <ScrollView ref={ref} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: height * 0.3, paddingBottom: height * 0.6 }}>
        {lines.map((l, i) => (
          <View key={i} onLayout={(e) => { ys.current[i] = e.nativeEvent.layout.y; }}>
            <Press onPress={data.synced ? () => onSeek(l.t) : undefined} scale={0.99}>
              <Text style={[s.line, data.synced ? { opacity: i === active ? 1 : 0.38 } : { opacity: 0.92 }]}>{l.text}</Text>
            </Press>
          </View>
        ))}
        <Text style={s.src}>Letra: {data.source}</Text>
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 24 },
  hint: { color: 'rgba(255,255,255,0.8)', fontSize: 15, textAlign: 'center' },
  line: { color: '#fff', fontSize: 26, fontWeight: '800', lineHeight: 34, letterSpacing: -0.4, paddingVertical: 6 },
  src: { color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 18 },
});
