import React from 'react';
import { Text, View } from 'react-native';
import Press from './Press';
import Cover from './Cover';
import { type } from '../theme';

// Tarjeta de estantería (lista, banda o canción): carátula + título + subtítulo.
export default function Card({ item, size = 142, round, title, subtitle, onPress, seed }) {
  return (
    <Press onPress={onPress} style={{ width: size }} accessibilityRole="button" accessibilityLabel={title}>
      <Cover band={item} size={size} radius={round ? size / 2 : 14} seed={seed} />
      <Text numberOfLines={1} style={[type.h3, { marginTop: 8, textAlign: round ? 'center' : 'left' }]}>{title}</Text>
      {!!subtitle && <Text numberOfLines={2} style={[type.small, { textAlign: round ? 'center' : 'left' }]}>{subtitle}</Text>}
    </Press>
  );
}
