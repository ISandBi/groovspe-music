import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { colors } from '../theme';

// Ecualizador animado. active=false lo congela en reposo.
export default function EqBars({ active = true, color = colors.accent, height = 16 }) {
  const bars = useRef([0, 1, 2, 3].map(() => new Animated.Value(0.3))).current;
  useEffect(() => {
    const loops = bars.map((v, i) => {
      const seq = Animated.loop(Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 420 + i * 90, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0.25, duration: 380 + i * 70, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]));
      if (active) seq.start(); else v.setValue(0.3);
      return seq;
    });
    return () => loops.forEach((l) => l.stop());
  }, [active]); // eslint-disable-line
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height, gap: 2 }}>
      {bars.map((v, i) => (
        <Animated.View key={i} style={{ width: 3, height, borderRadius: 2, backgroundColor: color, transform: [{ translateY: height / 2 }, { scaleY: v }, { translateY: -height / 2 }] }} />
      ))}
    </View>
  );
}
