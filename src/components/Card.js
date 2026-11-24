import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Press from './Press';
import Cover from './Cover';
import { useTheme } from '../theme';

// Tarjeta de estantería: portada + título + subtítulo.
export default function Card({ item, size = 150, round, title, subtitle, onPress, seed }) {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  return (
    <Press onPress={onPress} style={{ width: size }} accessibilityRole="button" accessibilityLabel={title}>
      <Cover band={item} size={size} radius={round ? size / 2 : 10} seed={seed} elevated />
      <Text numberOfLines={1} style={[s.title, round && { textAlign: 'center' }]}>{title}</Text>
      {!!subtitle && <Text numberOfLines={2} style={[s.sub, round && { textAlign: 'center' }]}>{subtitle}</Text>}
    </Press>
  );
}

// Tarjeta grande de "Escuchar ahora": etiqueta, título, subtítulo y portada amplia.
export function FeatureCard({ label, title, subtitle, item, onPress, width = 300, seed }) {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  return (
    <Press onPress={onPress} style={{ width }} accessibilityRole="button" accessibilityLabel={title}>
      <Text style={type.label}>{label}</Text>
      <Text numberOfLines={1} style={s.fTitle}>{title}</Text>
      <Text numberOfLines={1} style={s.fSub}>{subtitle}</Text>
      <View style={{ marginTop: 10 }}><Cover band={item} size={width} radius={12} seed={seed} elevated /></View>
    </Press>
  );
}
const makeS = (colors, type) => StyleSheet.create({
  title: { marginTop: 8, fontSize: 14, fontWeight: '600', color: colors.text },
  sub: { fontSize: 13, color: colors.muted, marginTop: 1 },
  fTitle: { fontSize: 20, fontWeight: '600', color: colors.text, marginTop: 2 },
  fSub: { fontSize: 18, color: colors.muted, marginTop: 1 },
});
