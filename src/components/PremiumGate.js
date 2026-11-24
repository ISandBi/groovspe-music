import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Press from './Press';
import { useTheme } from '../theme';

// Muro de Premium: se muestra donde una función exige el plan.
export default function PremiumGate({ feature = 'Esta función' }) {
  const { colors, type } = useTheme();
  const router = useRouter();
  return (
    <View style={st.wrap}>
      <LinearGradient colors={['#ff4f8b', '#8b5cff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.icon}><Ionicons name="lock-closed" size={30} color="#fff" /></LinearGradient>
      <Text style={[type.h1, { textAlign: 'center', marginTop: 18 }]}>{feature} es Premium</Text>
      <Text style={[type.body, { textAlign: 'center', marginTop: 8 }]}>Con GrooveSpace Premium aprendes a tocar tus canciones favoritas de las bandas, con acordes, tempo y metrónomo, y escuchas sin anuncios.</Text>
      <Press onPress={() => router.push('/premium')} style={[st.btn, { backgroundColor: colors.accent }]}><Text style={st.btnTxt}>Ver Premium</Text></Press>
    </View>
  );
}
const st = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  icon: { width: 72, height: 72, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  btn: { marginTop: 24, borderRadius: 14, paddingVertical: 15, paddingHorizontal: 40 },
  btnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
