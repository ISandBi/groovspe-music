// URL del backend de GrooveSpace. En el teléfono usa la IP de tu computadora, no "localhost":
// EXPO_PUBLIC_API_URL=http://192.168.1.86:4000  (ajusta el puerto a tu backend)
export const API_URL = process.env.EXPO_PUBLIC_API_URL || null;

// Pantalla de bloqueo y reproducción en segundo plano requieren un "development build"
// (eas build --profile development). En Expo Go están desactivadas para evitar errores de expo-audio.
export const LOCK_SCREEN = process.env.EXPO_PUBLIC_LOCK_SCREEN === '1';
