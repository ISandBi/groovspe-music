import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Press from '../src/components/Press';
import { useTheme } from '../src/theme';
import { useApp } from '../src/store';
import { BRAND_NAME, PLAN, getLog, logEvent } from '../src/lib/payments';

const PERKS = [
  ['school', 'Aprende a tocar', 'Acordes, diagramas de guitarra, tempo, metrónomo y letra con acordes sincronizada con la canción.'],
  ['ban', 'Sin anuncios', 'Escucha sin los anuncios de GrooveSpace.'],
  ['play-circle', 'Reproducción en segundo plano', 'Sigue escuchando con la pantalla apagada o con otras apps abiertas (próximamente).'],
  ['notifications', 'Notificaciones', 'Avisos de canciones nuevas y eventos de GrooveSpace (próximamente).'],
  ['cloud-download', 'Descargas', 'Guarda la música para escucharla sin conexión (próximamente).'],
  ['heart', 'Apoya a las bandas', 'Tus reproducciones válidas siguen sumando saldo para las bandas, igual que en el plan gratuito.'],
];
const EVENT = { pago_iniciado: 'Pago iniciado', pago_aprobado: 'Pago aprobado', pago_rechazado: 'Pago rechazado', pago_bloqueado: 'Pago bloqueado', suscripcion_cancelada: 'Suscripción cancelada' };

export default function Premium() {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  const { premium, card, cancelPremium, showToast } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [log, setLog] = useState([]);
  useEffect(() => { getLog().then(setLog); }, [premium]);
  const cancel = async () => { await logEvent('suscripcion_cancelada', { ok: true, brand: card?.brand, last4: card?.last4 }); cancelPremium(); showToast('Suscripción cancelada'); getLog().then(setLog); };
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 40 }} showsVerticalScrollIndicator={false}>
        <View style={[s.hero, { paddingTop: insets.top + 12 }]}>
          <LinearGradient colors={['#ff4f8b', '#8b5cff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <Pressable onPress={() => router.back()} hitSlop={12} style={s.back}><Ionicons name="chevron-back" size={26} color="#fff" /><Text style={s.backTxt}>Atrás</Text></Pressable>
          <Text style={s.kicker}>GROOVESPACE</Text>
          <Text style={s.title}>Premium</Text>
          <Text style={s.price}>${PLAN.amountMXN} MXN / {PLAN.interval}</Text>
        </View>
        <View style={{ padding: 20, gap: 16 }}>
          {PERKS.map(([icon, t, d]) => (
            <View key={t} style={s.perk}>
              <View style={s.perkIcon}><Ionicons name={icon} size={22} color={colors.accent} /></View>
              <View style={{ flex: 1 }}><Text style={type.h3}>{t}</Text><Text style={[type.body, { fontSize: 14 }]}>{d}</Text></View>
            </View>
          ))}
          {premium ? (
            <>
              <View style={s.active}>
                <Ionicons name="checkmark-circle" size={22} color={colors.green} />
                <View style={{ flex: 1 }}>
                  <Text style={type.h3}>Premium activo</Text>
                  <Text style={type.small}>{card ? `${BRAND_NAME[card.brand] || 'Tarjeta'} •••• ${card.last4}` : 'Plan activo'}</Text>
                </View>
              </View>
              <Press onPress={cancel} style={s.cancel}><Text style={s.cancelTxt}>Cancelar suscripción</Text></Press>
            </>
          ) : (
            <Press onPress={() => router.push('/checkout')} style={s.cta}><Ionicons name="card" size={20} color="#fff" /><Text style={s.ctaTxt}>Suscribirme con tarjeta</Text></Press>
          )}
          {log.length > 0 && (
            <View style={{ marginTop: 6 }}>
              <Text style={type.label}>ACTIVIDAD DE PAGO</Text>
              {log.slice(0, 5).map((e, i) => (
                <View key={i} style={s.logRow}>
                  <Text style={[type.small, { color: colors.text, flex: 1 }]}>{EVENT[e.type] || e.type}{e.last4 ? ` · •••• ${e.last4}` : ''}</Text>
                  <Text style={type.small}>{new Date(e.t).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
              ))}
            </View>
          )}
          <Text style={[type.small, { textAlign: 'center' }]}>Cobro de demostración: no se realiza ningún cargo real.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
const makeS = (colors, type) => StyleSheet.create({
  hero: { paddingHorizontal: 20, paddingBottom: 32, overflow: 'hidden' },
  back: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 6 },
  backTxt: { color: '#fff', fontSize: 17 },
  kicker: { color: 'rgba(255,255,255,0.85)', fontWeight: '800', letterSpacing: 1.4, marginTop: 18, fontSize: 12 },
  title: { color: '#fff', fontSize: 44, fontWeight: '900', letterSpacing: -1.2 },
  price: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 6 },
  perk: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  perkIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  cta: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 16, marginTop: 8 },
  ctaTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  active: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginTop: 8 },
  cancel: { alignItems: 'center', borderRadius: 14, borderWidth: 1, borderColor: colors.line, paddingVertical: 14 },
  cancelTxt: { color: colors.accent, fontWeight: '700', fontSize: 15 },
  logRow: { flexDirection: 'row', gap: 8, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
});
