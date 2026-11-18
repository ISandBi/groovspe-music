import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Press from '../src/components/Press';
import FadeIn from '../src/components/FadeIn';
import { colors, type } from '../src/theme';
import { useApp } from '../src/store';
import { loginBand } from '../src/lib/api';

export default function Auth() {
  const { mode: m } = useLocalSearchParams();
  const [mode, setMode] = useState(m === 'login' ? 'login' : 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { setUser } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reg = mode === 'register';

  const submit = async () => {
    if (reg && name.trim().length < 2) return setError('Escribe tu nombre.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Escribe un correo válido.');
    if (pass.length < 6) return setError('La contraseña necesita al menos 6 caracteres.');
    setError(''); setBusy(true);
    try {
      // 1) Si el correo y la contraseña son de una banda registrada en GrooveSpace, entra como banda.
      const band = await loginBand(email.trim().toLowerCase(), pass);
      if (band) {
        setUser({ role: 'band', name: band.band.leaderName || band.band.name, bandName: band.band.bandName || band.band.name, bandId: band.band._id, logoPath: band.band.logoPath, email, token: band.accessToken });
        return router.replace('/(band)/panel');
      }
      // 2) Si no es banda, es oyente.
      setUser({ role: 'listener', name: reg ? name.trim() : email.split('@')[0], email });
      router.replace('/(tabs)/home');
    } catch (e) {
      setError(e.message || 'No se pudo conectar con GrooveSpace. Revisa tu conexión.');
    } finally { setBusy(false); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }} keyboardShouldPersistTaps="handled">
        <Press onPress={() => router.back()} style={s.back} accessibilityLabel="Volver"><Ionicons name="chevron-back" size={22} color={colors.text} /></Press>
        <FadeIn><Text style={[type.h1, { marginTop: 24 }]}>{reg ? 'Crea tu cuenta de oyente' : 'Bienvenido de vuelta'}</Text></FadeIn>
        <FadeIn delay={100}><Text style={[type.body, { marginTop: 8 }]}>{reg ? 'Registrarte hace que tus reproducciones válidas cuenten para las bandas. Si tu banda ya está en GrooveSpace, usa su mismo correo y contraseña.' : 'Entra con tu cuenta de GrooveSpace. Si eres banda, verás tu panel de banda.'}</Text></FadeIn>
        <FadeIn delay={200} style={{ marginTop: 28, gap: 14 }}>
          {reg && <Field label="Nombre" value={name} onChangeText={setName} placeholder="Tu nombre" autoCapitalize="words" />}
          <Field label="Correo" value={email} onChangeText={setEmail} placeholder="tu@correo.com" keyboardType="email-address" autoCapitalize="none" />
          <Field label="Contraseña" value={pass} onChangeText={setPass} placeholder="Mínimo 6 caracteres" secureTextEntry />
          {!!error && <Text style={{ color: colors.pink, fontWeight: '600' }}>{error}</Text>}
          <Press onPress={busy ? undefined : submit} style={[s.primary, busy && { opacity: 0.7 }]}>
            {busy ? <ActivityIndicator color={colors.onLime} /> : <Text style={s.primaryTxt}>{reg ? 'Registrarme' : 'Entrar'}</Text>}
          </Press>
          <Press onPress={() => { setError(''); setMode(reg ? 'login' : 'register'); }} style={{ alignItems: 'center', padding: 8 }}>
            <Text style={{ color: colors.muted }}>{reg ? '¿Ya tienes cuenta? ' : '¿Aún no tienes cuenta? '}<Text style={{ color: colors.lime, fontWeight: '700' }}>{reg ? 'Entrar' : 'Registrarme'}</Text></Text>
          </Press>
        </FadeIn>
        {reg && <Text style={[type.small, { marginTop: 20, textAlign: 'center' }]}>Al registrarte aceptas los Términos y el Aviso de Privacidad de GrooveSpace.</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
function Field({ label, ...p }) {
  const [focus, setFocus] = useState(false);
  return (
    <View>
      <Text style={[type.label, { marginBottom: 6 }]}>{label}</Text>
      <TextInput {...p} placeholderTextColor={colors.muted} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={[s.input, focus && { borderColor: colors.lime }]} />
    </View>
  );
}
const s = StyleSheet.create({
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  input: { backgroundColor: colors.surface, color: colors.text, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, borderWidth: 1.5, borderColor: colors.line },
  primary: { backgroundColor: colors.lime, borderRadius: 999, paddingVertical: 16, alignItems: 'center', marginTop: 6 },
  primaryTxt: { color: colors.onLime, fontWeight: '800', fontSize: 16 },
});
