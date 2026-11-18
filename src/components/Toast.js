import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useApp } from '../store';

// Aviso flotante cuando una reproducción válida acredita saldo a la banda.
export default function Toast() {
  const { toast } = useApp();
  const insets = useSafeAreaInsets();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!toast) return;
    Animated.sequence([
      Animated.spring(v, { toValue: 1, useNativeDriver: true, bounciness: 10 }),
      Animated.delay(2200),
      Animated.timing(v, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
  }, [toast?.id]); // eslint-disable-line
  if (!toast) return null;
  return (
    <Animated.View pointerEvents="none" style={[s.wrap, { top: insets.top + 8, opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }] }]}>
      <Ionicons name="sparkles" size={16} color={colors.onLime} />
      <Text style={s.txt}>{toast.msg}</Text>
    </Animated.View>
  );
}
const s = StyleSheet.create({
  wrap: { position: 'absolute', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.lime, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, zIndex: 50 },
  txt: { color: colors.onLime, fontWeight: '800', fontSize: 13 },
});
