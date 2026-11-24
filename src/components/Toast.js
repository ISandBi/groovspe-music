import React, { useEffect, useRef, useMemo } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { useApp } from '../store';

// Aviso flotante oscuro (pill) para confirmaciones y reproducciones válidas.
export default function Toast() {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  const { toast } = useApp();
  const insets = useSafeAreaInsets();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!toast) return;
    Animated.sequence([
      Animated.spring(v, { toValue: 1, useNativeDriver: true, bounciness: 8 }),
      Animated.delay(2200),
      Animated.timing(v, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
  }, [toast?.id]); // eslint-disable-line
  if (!toast) return null;
  return (
    <Animated.View pointerEvents="none" style={[s.wrap, { backgroundColor: colors.toast, top: insets.top + 8, opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }] }]}>
      <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
      <Text style={s.txt}>{toast.msg}</Text>
    </Animated.View>
  );
}
const makeS = (colors, type) => StyleSheet.create({
  wrap: { position: 'absolute', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 11, borderRadius: 999, zIndex: 50 },
  txt: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
