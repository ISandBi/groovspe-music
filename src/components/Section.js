import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Press from './Press';
import { Hairline } from './Header';
import { colors, type } from '../theme';

// Sección con línea fina arriba y título con flecha (como "Hecho para ti ›").
export default function Section({ title, onPress, children, style, divider = true }) {
  const head = (
    <>
      <Text style={type.h2}>{title}</Text>
      {onPress && <Ionicons name="chevron-forward" size={18} color={colors.muted} style={{ marginLeft: 4, marginTop: 3 }} />}
    </>
  );
  return (
    <View style={[{ marginTop: 22 }, style]}>
      {divider && <Hairline style={{ marginHorizontal: 20, marginBottom: 14 }} />}
      {onPress
        ? <Press onPress={onPress} scale={0.99} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 }}>{head}</Press>
        : <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 }}>{head}</View>}
      {children}
    </View>
  );
}
