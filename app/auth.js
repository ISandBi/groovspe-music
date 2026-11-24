import React, { useState, useMemo } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Press from '../src/components/Press';
import FadeIn from '../src/components/FadeIn';
import { useTheme } from '../src/theme';
import { useApp } from '../src/store';
import { loginBand } from '../src/lib/api';

export default function Auth() {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
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
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 6, paddingHorizontal: 10 }}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={s.back} accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={26} color={colors.accent} />
          <Text style={s.backTxt}>Atrás</Text>
        </Pressable>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingBottom: insets.bottom + 24 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={s.card}>
            <FadeIn style={{ alignItems: 'center' }}>
              <LinearGradient colors={['#ff4f8b', '#8b5cff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.icon}><Ionicons name="musical-notes" size={32} color="#fff" /></LinearGradient>
              <Text style={s.title}>{reg ? 'Crea tu cuenta' : 'Bienvenido de vuelta'}</Text>
              <Text style={s.sub}>{reg ? 'Tus reproducciones válidas cuentan para las bandas. Si tu banda ya está en GrooveSpace, entra con su mismo correo y contraseña.' : 'Entra con tu cuenta de GrooveSpace. Si eres banda, verás tu panel de banda.'}</Text>
            </FadeIn>
            <FadeIn delay={150} style={{ marginTop: 26, gap: 14 }}>
              <View style={s.group}>
                {reg && <Field label="Nombre" value={name} onChangeText={setName} placeholder="Nombre" autoCapitalize="words" />}
                <Field label="Correo" value={email} onChangeText={setEmail} placeholder="Correo electrónico" keyboardType="email-address" autoCapitalize="none" />
                <Field label="Contraseña" value={pass} onChangeText={setPass} placeholder="Contraseña (mínimo 6)" secureTextEntry last />
              </View>
              {!!error && <Text style={s.error}>{error}</Text>}
              <Press onPress={busy ? undefined : submit} style={[s.primary, busy && { opacity: 0.7 }]}>
                {busy ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryTxt}>{reg ? 'Registrarme' : 'Entrar'}</Text>}
              </Press>
              <Press onPress={() => { setError(''); setMode(reg ? 'login' : 'register'); }} style={{ alignItems: 'center', padding: 6 }}>
                <Text style={{ color: colors.muted, fontSize: 15 }}>{reg ? '¿Ya tienes cuenta? ' : '¿Aún no tienes cuenta? '}<Text style={{ color: colors.accent, fontWeight: '600' }}>{reg ? 'Entrar' : 'Registrarme'}</Text></Text>
              </Press>
            </FadeIn>
            {reg && <Text style={[type.small, { marginTop: 18, textAlign: 'center' }]}>Al registrarte aceptas los Términos y el Aviso de Privacidad de GrooveSpace.</Text>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
function Field({ label, last, ...p }) {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  return (
    <View style={[s.field, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line }]}>
      <TextInput {...p} accessibilityLabel={label} placeholderTextColor={colors.muted} selectionColor={colors.accent} style={s.input} />
    </View>
  );
}
const makeS = (colors, type) => StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 6 },
  backTxt: { color: colors.accent, fontSize: 17 },
  card: { width: '100%', maxWidth: 440, alignSelf: 'center' },
  icon: { width: 68, height: 68, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 30, fontWeight: '800', color: colors.text, textAlign: 'center', letterSpacing: -0.7, marginTop: 16 },
  sub: { fontSize: 15, lineHeight: 22, color: colors.muted, textAlign: 'center', marginTop: 8 },
  group: { backgroundColor: colors.surface, borderRadius: 12, overflow: 'hidden' },
  field: { paddingHorizontal: 16 },
  input: { color: colors.text, fontSize: 17, paddingVertical: 14 },
  error: { color: colors.accent, fontWeight: '600', textAlign: 'center' },
  primary: { backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  primaryTxt: { color: '#fff', fontWeight: '700', fontSize: 17 },
});
