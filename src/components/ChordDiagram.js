import React from 'react';
import { Text, View } from 'react-native';
import { CHORDS } from '../learn';
import { useTheme } from '../theme';

// Diagrama de acorde de guitarra (6 cuerdas, 5 trastes).
export default function ChordDiagram({ name, size = 84, active }) {
  const { colors } = useTheme();
  const shape = CHORDS[name];
  if (!shape) return null;
  const frets = shape.split('').map((c) => (c === 'x' ? -1 : Number(c)));
  const pressed = frets.filter((f) => f > 0);
  const base = pressed.length && Math.max(...pressed) > 4 ? Math.min(...pressed) : 1;
  const W = size; const H = size * 1.15; const padX = 10; const padT = 20;
  const gx = (W - padX * 2) / 5; const gy = (H - padT - 6) / 5;
  return (
    <View style={{ width: W, alignItems: 'center' }}>
      <Text style={{ color: active ? colors.accent : colors.text, fontWeight: '800', fontSize: 15, marginBottom: 2 }}>{name}</Text>
      <View style={{ width: W, height: H - 8 }}>
        {frets.map((f, i) => (
          <Text key={`m${i}`} style={{ position: 'absolute', top: 0, left: padX + i * gx - 5, width: 10, textAlign: 'center', fontSize: 9, color: colors.muted }}>{f === -1 ? '×' : f === 0 ? '○' : ''}</Text>
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => <View key={`s${i}`} style={{ position: 'absolute', left: padX + i * gx, top: padT, width: 1, height: gy * 5, backgroundColor: colors.muted, opacity: 0.7 }} />)}
        {[0, 1, 2, 3, 4, 5].map((i) => <View key={`f${i}`} style={{ position: 'absolute', top: padT + i * gy, left: padX, width: gx * 5, height: i === 0 && base === 1 ? 3 : 1, backgroundColor: colors.muted, opacity: i === 0 && base === 1 ? 1 : 0.5 }} />)}
        {base > 1 && <Text style={{ position: 'absolute', left: -2, top: padT + 2, fontSize: 9, color: colors.muted }}>{base}</Text>}
        {frets.map((f, i) => f > 0 && (
          <View key={`d${i}`} style={{ position: 'absolute', left: padX + i * gx - 5, top: padT + (f - base) * gy + gy / 2 - 5, width: 10, height: 10, borderRadius: 5, backgroundColor: active ? colors.accent : colors.text }} />
        ))}
      </View>
    </View>
  );
}
