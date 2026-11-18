import React from 'react';
import { Text, View } from 'react-native';
import { type } from '../theme';

export default function Section({ title, action, children, style }) {
  return (
    <View style={[{ marginTop: 28 }, style]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 20, marginBottom: 12 }}>
        <Text style={type.h2}>{title}</Text>
        {action}
      </View>
      {children}
    </View>
  );
}
