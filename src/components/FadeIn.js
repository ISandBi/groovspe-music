import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

// Entrada suave (fade + desplazamiento) con retraso para listas escalonadas.
export default function FadeIn({ children, delay = 0, y = 8, style }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 240, delay: Math.min(delay, 120) * 0.4, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, []); // eslint-disable-line
  return (
    <Animated.View style={[style, { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [y, 0] }) }] }]}>
      {children}
    </Animated.View>
  );
}
