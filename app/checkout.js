import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Press from '../src/components/Press';
import { useTheme } from '../src/theme';
import { useApp } from '../src/store';
import { BRAND_NAME, MODE, PLAN, TEST_CARDS, detectBrand, formatExpiry, formatPan, getLock, payPlan, validateCard } from '../src/lib/payments';

// Pago con tarjeta. Los datos viven solo en el estado de esta pantalla y se borran al terminar o salir.
export default function Checkout() {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  const { subscribe, showToast } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [pan, setPan] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [, tick] = useState(0);
  const cvvRef = useRef(null); const expRef = useRef(null);
  const brand = detectBrand(pan);

  useEffect(() => { getLock().then((l) => setLockedUntil(l.until)); return () => { setPan(''); setCvv(''); setExpiry(''); setName(''); }; }, []);
  useEffect(() => { if (lockedUntil > Date.now()) { const h = setInterval(() => tick((n) => n + 1), 1000); return () => clearInterval(h); } return undefined; }, [lockedUntil]);
  const locked = lockedUntil > Date.now();
  const left = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));

  const pay = async () => {
    if (busy || locked) return;
    const e = validateCard({ name, pan, expiry, cvv });
    if (!agree) e.agree = 'Acepta el cobro mensual para continuar.';
    setErrors(e); setFormError('');
    if (Object.keys(e).length) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {}); return; }
    setBusy(true);
    try {
      const res = await payPlan({ name, pan, expiry, cvv });
      setPan(''); setCvv(''); setExpiry(''); setName(''); // se borran de memoria (PCI DSS 3.3.1)
      subscribe({ brand: res.brand, last4: res.last4 });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      showToast('¡Bienvenido a Premium!');
      router.replace('/premium');
    } catch (err) {
      setCvv(''); // el CVV nunca se conserva tras un intento
      setFormError(err.message || 'No se pudo procesar el pago.');
      getLock().then((l) => setLockedUntil(l.until));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    } finally { setBusy(false); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 6, paddingHorizontal: 10 }}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={s.back} accessibilityLabel="Volver"><Ionicons name="chevron-back" size={26} color={colors.accent} /><Text style={s.backTxt}>Atrás</Text></Pressable>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={type.h1}>Pagar Premium</Text>
          <View style={s.summary}>
            <View style={{ flex: 1 }}><Text style={type.h3}>{PLAN.name}</Text><Text style={type.small}>Cobro mensual · cancela cuando quieras</Text></View>
            <Text style={s.price}>${PLAN.amountMXN}.00 <Text style={type.small}>MXN</Text></Text>
          </View>

          {MODE === 'demo' && (
            <View style={s.demo}>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}><Ionicons name="flask-outline" size={18} color={colors.amber} /><Text style={[type.h3, { fontSize: 14 }]}>Modo demostración · no se cobra nada</Text></View>
              <Text style={[type.small, { marginTop: 4 }]}>No uses tu tarjeta real. Toca una tarjeta de prueba para llenar el número:</Text>
              <View style={s.testRow}>
                {TEST_CARDS.map((t) => (
                  <Press key={t.pan} onPress={() => { setPan(formatPan(t.pan)); if (!expiry) setExpiry('12/34'); if (!cvv) setCvv(detectBrand(t.pan) === 'amex' ? '1234' : '123'); if (!name) setName('TITULAR DE PRUEBA'); }} style={s.testChip}><Text style={s.testTxt}>{t.label}</Text></Press>
                ))}
              </View>
            </View>
          )}

          <Text style={s.cap}>DATOS DE LA TARJETA</Text>
          <View style={s.group}>
            <Field s={s} colors={colors} label="Nombre del titular" value={name} onChangeText={setName} placeholder="Nombre del titular" autoCapitalize="characters" autoComplete="cc-name" textContentType="creditCardName" returnKeyType="next" error={errors.name} />
            <Field s={s} colors={colors} label="Número de tarjeta" value={pan} onChangeText={(v) => setPan(formatPan(v))} placeholder="Número de tarjeta" keyboardType="number-pad" autoComplete="cc-number" textContentType="creditCardNumber" maxLength={23} error={errors.pan}
              right={<Text style={s.brand}>{brand !== 'unknown' ? BRAND_NAME[brand] : ''}</Text>} />
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}><Field s={s} colors={colors} label="Vencimiento" inputRef={expRef} value={expiry} onChangeText={(v) => setExpiry(formatExpiry(v))} placeholder="MM/AA" keyboardType="number-pad" autoComplete="cc-exp" maxLength={5} error={errors.expiry} last /></View>
              <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: colors.line }} />
              <View style={{ flex: 1 }}><Field s={s} colors={colors} label="Código de seguridad" inputRef={cvvRef} value={cvv} onChangeText={(v) => setCvv(v.replace(/\D/g, '').slice(0, 4))} placeholder="CVV" keyboardType="number-pad" secureTextEntry autoComplete="cc-csc" maxLength={4} error={errors.cvv} last /></View>
            </View>
          </View>

          <Pressable onPress={() => setAgree((a) => !a)} style={s.agree} accessibilityRole="checkbox" accessibilityState={{ checked: agree }}>
            <Ionicons name={agree ? 'checkbox' : 'square-outline'} size={24} color={agree ? colors.accent : colors.muted} />
            <Text style={[type.body, { flex: 1, fontSize: 14, lineHeight: 20 }]}>Acepto el cobro mensual de ${PLAN.amountMXN}.00 MXN hasta que cancele mi suscripción.</Text>
          </Pressable>
          {!!errors.agree && <Text style={s.err}>{errors.agree}</Text>}
          {!!formError && <View style={s.errBox}><Ionicons name="alert-circle" size={18} color={colors.accent} /><Text style={[s.err, { flex: 1, marginTop: 0 }]}>{formError}</Text></View>}
          {locked && <Text style={s.err}>Pago bloqueado por seguridad. Intenta de nuevo en {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}.</Text>}

          <Press onPress={pay} style={[s.pay, (busy || locked) && { opacity: 0.55 }]} accessibilityLabel="Pagar">
            {busy ? <ActivityIndicator color="#fff" /> : <><Ionicons name="lock-closed" size={18} color="#fff" /><Text style={s.payTxt}>Pagar ${PLAN.amountMXN}.00 MXN</Text></>}
          </Press>

          <View style={s.sec}>
            {[
              ['shield-checkmark-outline', 'Conexión cifrada (TLS 1.2 o superior) con la pasarela de pago.'],
              ['eye-off-outline', 'GrooveSpace no guarda tu número completo ni tu CVV; solo la marca y los últimos 4 dígitos.'],
              ['card-outline', 'En producción el cobro lo procesa un proveedor certificado PCI DSS Nivel 1 mediante un token.'],
              ['alert-circle-outline', 'Tras 3 intentos fallidos el pago se bloquea 5 minutos para evitar fraude.'],
            ].map(([ic, t]) => (
              <View key={t} style={{ flexDirection: 'row', gap: 10 }}><Ionicons name={ic} size={18} color={colors.green} style={{ marginTop: 1 }} /><Text style={[type.small, { flex: 1 }]}>{t}</Text></View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({ s, colors, label, last, error, right, inputRef, ...p }) {
  return (
    <View style={[s.field, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput ref={inputRef} {...p} accessibilityLabel={label} placeholderTextColor={colors.muted} selectionColor={colors.accent} importantForAutofill="no" autoCorrect={false} style={s.input} />
        {right}
      </View>
      {!!error && <Text style={s.fieldErr}>{error}</Text>}
    </View>
  );
}

const makeS = (colors, type) => StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 6 },
  backTxt: { color: colors.accent, fontSize: 17 },
  summary: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginTop: 14 },
  price: { fontSize: 22, fontWeight: '800', color: colors.text },
  demo: { backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginTop: 12 },
  testRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  testChip: { backgroundColor: colors.bg, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  testTxt: { color: colors.text, fontSize: 12, fontWeight: '600' },
  cap: { ...type.label, marginTop: 22, marginBottom: 8 },
  group: { backgroundColor: colors.surface, borderRadius: 12, overflow: 'hidden' },
  field: { paddingHorizontal: 16 },
  input: { flex: 1, color: colors.text, fontSize: 17, paddingVertical: 14 },
  brand: { color: colors.accent, fontWeight: '700', fontSize: 13 },
  fieldErr: { color: colors.accent, fontSize: 12, paddingBottom: 8, marginTop: -4 },
  agree: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginTop: 16 },
  err: { color: colors.accent, fontWeight: '600', marginTop: 8 },
  errBox: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', backgroundColor: colors.accentSoft, borderRadius: 10, padding: 12, marginTop: 12 },
  pay: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 16, marginTop: 18 },
  payTxt: { color: '#fff', fontWeight: '700', fontSize: 17 },
  sec: { gap: 10, marginTop: 22, padding: 14, borderRadius: 12, backgroundColor: colors.surface },
});
