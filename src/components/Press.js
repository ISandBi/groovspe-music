import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

// Propiedades de layout: van al contenedor exterior (Pressable) para que tamaño, flex y márgenes funcionen.
const OUTER = new Set(['flex', 'flexGrow', 'flexShrink', 'flexBasis', 'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
  'alignSelf', 'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginHorizontal', 'marginVertical',
  'position', 'left', 'right', 'top', 'bottom', 'zIndex']);

// Pressable con rebote de escala: la base de toda interacción táctil.
export default function Press({ children, style, onPress, scale = 0.96, ...rest }) {
  const v = useRef(new Animated.Value(1)).current;
  const to = (x) => Animated.spring(v, { toValue: x, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  const flat = StyleSheet.flatten(style) || {};
  const outer = {}; const inner = {};
  Object.keys(flat).forEach((k) => { (OUTER.has(k) ? outer : inner)[k] = flat[k]; });
  return (
    <Pressable onPress={onPress} onPressIn={() => to(scale)} onPressOut={() => to(1)} style={outer} {...rest}>
      <Animated.View style={[inner, { flexGrow: 1, transform: [{ scale: v }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
