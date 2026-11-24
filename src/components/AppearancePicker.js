import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Press from './Press';
import { useTheme } from '../theme';
import { useApp } from '../store';

// Selector de apariencia: Automático (sigue al teléfono) · Claro · Oscuro.
const OPTIONS = [['system', 'Automático'], ['light', 'Claro'], ['dark', 'Oscuro']];

export default function AppearancePicker() {
  const { colors, type } = useTheme();
  const { themeMode, setThemeMode } = useApp();
  return (
    <View style={{ padding: 14, gap: 10 }}>
      <Text style={type.h3}>Apariencia</Text>
      <View style={[st.seg, { backgroundColor: colors.bg }]}>
        {OPTIONS.map(([m, label]) => {
          const on = themeMode === m;
          return (
            <Press key={m} onPress={() => setThemeMode(m)} scale={0.97} style={[st.opt, on && { backgroundColor: colors.accent }]} accessibilityLabel={`Apariencia ${label}`}>
              <Text style={[st.txt, { color: on ? '#fff' : colors.text }]}>{label}</Text>
            </Press>
          );
        })}
      </View>
    </View>
  );
}
const st = StyleSheet.create({
  seg: { flexDirection: 'row', borderRadius: 10, padding: 3 },
  opt: { flex: 1, borderRadius: 8, paddingVertical: 9, alignItems: 'center' },
  txt: { fontSize: 14, fontWeight: '600' },
});
