import AsyncStorage from '@react-native-async-storage/async-storage';

// Pagos con tarjeta · GrooveSpace Music
// Diseño para REDUCIR EL ALCANCE de PCI DSS: la app no envía, guarda ni registra el número completo ni el CVV.
// En producción la tarjeta la captura el SDK de un proveedor certificado PCI DSS Nivel 1 (p. ej. Stripe PaymentSheet) que
// devuelve un token; el servidor de GrooveSpace cobra con ese token. Aquí el "proveedor" es un adaptador de DEMOSTRACIÓN.
// Ver docs/SEGURIDAD-PAGOS.md para el mapeo con PCI DSS v4.0.1 y NIST CSF 2.0.

export const PLAN = { id: 'premium-mensual', name: 'GrooveSpace Premium', amountMXN: 49, interval: 'mes' };
export const MODE = 'demo'; // 'demo' | 'live' (live exige el SDK del proveedor y un backend con TLS)

// Tarjetas de prueba (solo modo demo). Se rechaza cualquier otro número para que nadie teclee una tarjeta real.
export const TEST_CARDS = [
  { pan: '4242424242424242', label: 'Visa · aprobada' },
  { pan: '5555555555554444', label: 'Mastercard · aprobada' },
  { pan: '378282246310005', label: 'Amex · aprobada' },
  { pan: '4000000000000002', label: 'Visa · rechazada' },
];

const onlyDigits = (v) => String(v || '').replace(/\D/g, '');

export function detectBrand(pan) {
  const n = onlyDigits(pan);
  if (/^4/.test(n)) return 'visa';
  if (/^(5[1-5]|2(2[2-9][1-9]|2[3-9]\d|[3-6]\d\d|7[01]\d|720))/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  return 'unknown';
}
export const BRAND_NAME = { visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express', unknown: 'Tarjeta' };

export function luhn(pan) {
  const n = onlyDigits(pan);
  if (n.length < 12) return false;
  let sum = 0; let alt = false;
  for (let i = n.length - 1; i >= 0; i -= 1) {
    let d = Number(n[i]);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d; alt = !alt;
  }
  return sum % 10 === 0;
}

export function formatPan(v) {
  const n = onlyDigits(v).slice(0, 19);
  if (detectBrand(n) === 'amex') return [n.slice(0, 4), n.slice(4, 10), n.slice(10, 15)].filter(Boolean).join(' ');
  return n.replace(/(.{4})/g, '$1 ').trim();
}
export function formatExpiry(v) {
  const n = onlyDigits(v).slice(0, 4);
  return n.length > 2 ? `${n.slice(0, 2)}/${n.slice(2)}` : n;
}

// Validación de campos (no revela más de lo necesario).
export function validateCard({ name, pan, expiry, cvv }) {
  const errors = {};
  const brand = detectBrand(pan);
  if (name.trim().length < 3) errors.name = 'Escribe el nombre como aparece en la tarjeta.';
  if (!luhn(pan)) errors.pan = 'El número de tarjeta no es válido.';
  const m = /^(\d{2})\/(\d{2})$/.exec(expiry);
  const now = new Date();
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) errors.expiry = 'Fecha inválida (MM/AA).';
  else if (2000 + Number(m[2]) < now.getFullYear() || (2000 + Number(m[2]) === now.getFullYear() && Number(m[1]) < now.getMonth() + 1)) errors.expiry = 'La tarjeta está vencida.';
  if (onlyDigits(cvv).length !== (brand === 'amex' ? 4 : 3)) errors.cvv = brand === 'amex' ? 'El código tiene 4 dígitos.' : 'El código tiene 3 dígitos.';
  return errors;
}

// ---- Protección contra "card testing" (PCI DSS 8.3.4-style lockout / NIST CSF PR.AA, DE.CM) ----
const LOCK_KEY = 'groovespace-pay-lock';
const MAX_FAILS = 3; const LOCK_MS = 5 * 60 * 1000;
export async function getLock() {
  try { const v = JSON.parse((await AsyncStorage.getItem(LOCK_KEY)) || '{}'); return { fails: v.fails || 0, until: v.until || 0 }; } catch (e) { return { fails: 0, until: 0 }; }
}
async function registerFail() {
  const l = await getLock();
  const fails = l.until && l.until < Date.now() ? 1 : l.fails + 1;
  const until = fails >= MAX_FAILS ? Date.now() + LOCK_MS : 0;
  await AsyncStorage.setItem(LOCK_KEY, JSON.stringify({ fails: until ? 0 : fails, until })).catch(() => {});
  return until;
}
const clearFails = () => AsyncStorage.removeItem(LOCK_KEY).catch(() => {});

// ---- Registro de eventos SIN datos sensibles (PCI DSS 10.2 · NIST CSF DE.AE) ----
const LOG_KEY = 'groovespace-pay-log';
export async function logEvent(type, meta = {}) {
  const safe = { t: Date.now(), type, ok: meta.ok, brand: meta.brand, last4: meta.last4, code: meta.code }; // nunca PAN/CVV/nombre
  try {
    const list = JSON.parse((await AsyncStorage.getItem(LOG_KEY)) || '[]');
    list.unshift(safe);
    await AsyncStorage.setItem(LOG_KEY, JSON.stringify(list.slice(0, 30)));
  } catch (e) { /* el registro nunca debe romper el pago */ }
}
export async function getLog() { try { return JSON.parse((await AsyncStorage.getItem(LOG_KEY)) || '[]'); } catch (e) { return []; } }

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const idem = () => `pay_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

// Cobra el plan. Recibe los datos de la tarjeta SOLO en memoria y devuelve únicamente { brand, last4, token }.
export async function payPlan(card) {
  const lock = await getLock();
  if (lock.until > Date.now()) {
    const min = Math.ceil((lock.until - Date.now()) / 60000);
    await logEvent('pago_bloqueado', { ok: false });
    throw new Error(`Demasiados intentos fallidos. Intenta de nuevo en ${min} min.`);
  }
  const pan = onlyDigits(card.pan);
  const brand = detectBrand(pan); const last4 = pan.slice(-4);
  await logEvent('pago_iniciado', { brand, last4 });
  if (MODE !== 'demo') throw new Error('Pagos reales no configurados: integra el SDK del proveedor (ver docs/SEGURIDAD-PAGOS.md).');
  await wait(900); // simula la llamada a la pasarela (TLS)
  const isTest = TEST_CARDS.some((t) => t.pan === pan);
  if (!isTest || pan === '4000000000000002') {
    const until = await registerFail();
    await logEvent('pago_rechazado', { ok: false, brand, last4, code: isTest ? 'card_declined' : 'demo_only_test_cards' });
    if (until) throw new Error('Demasiados intentos fallidos. El pago se bloqueó 5 min por seguridad.');
    throw new Error(isTest ? 'La tarjeta fue rechazada. Prueba con otra.' : 'En modo demostración solo se aceptan las tarjetas de prueba.');
  }
  await clearFails();
  const token = `tok_demo_${idem()}`; // en producción: token del proveedor, nunca la tarjeta
  await logEvent('pago_aprobado', { ok: true, brand, last4 });
  return { brand, last4, token };
}
