import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, type } from '../theme';

// Encabezado de título grande (estilo Apple). `right` = botón o avatar a la derecha.
export default function Header({ title, right, caption }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 20, paddingBottom: 8, flexDirection: 'row', alignItems: 'flex-end' }}>
      <View style={{ flex: 1 }}>
        {!!caption && <Text style={[type.label, { marginBottom: 2 }]}>{caption}</Text>}
        <Text style={type.largeTitle} numberOfLines={1}>{title}</Text>
      </View>
      {right}
    </View>
  );
}
export const Hairline = ({ style }) => <View style={[{ height: 0.5, backgroundColor: colors.line }, style]} />;
