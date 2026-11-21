import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useApp } from '../store';

// Aviso flotante oscuro (pill) para confirmaciones y reproducciones válidas.
export default function Toast() {
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
    <Animated.View pointerEvents="none" style={[s.wrap, { top: insets.top + 8, opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }] }]}>
      <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
      <Text style={s.txt}>{toast.msg}</Text>
    </Animated.View>
  );
}
const s = StyleSheet.create({
  wrap: { position: 'absolute', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(26,19,37,0.94)', paddingHorizontal: 16, paddingVertical: 11, borderRadius: 999, zIndex: 50 },
  txt: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
