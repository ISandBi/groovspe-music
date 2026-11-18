import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

// Pressable con rebote de escala: la base de toda interacción táctil.
export default function Press({ children, style, onPress, scale = 0.96, ...rest }) {
  const v = useRef(new Animated.Value(1)).current;
  const to = (x) => Animated.spring(v, { toValue: x, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  return (
    <Pressable onPress={onPress} onPressIn={() => to(scale)} onPressOut={() => to(1)} {...rest}>
      <Animated.View style={[style, { transform: [{ scale: v }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
