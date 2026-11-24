# GrooveSpace Music

App móvil (iOS y Android) de **GrooveSpace**: los oyentes se registran y escuchan a bandas grabadas por los ingenieros de GrooveSpace. Cada **reproducción válida** acredita saldo virtual (no retirable) a la banda, que lo usa en salas, equipo o ingenieros dentro de la plataforma web. La versión gratuita muestra anuncios propios de GrooveSpace (eventos, bandas nuevas, renta de salas).

Hecha con **React Native + Expo (Expo Router)**. Proyecto académico.

## Funciones

Inicio con accesos rápidos y estanterías, buscador con tiles por género, biblioteca (listas propias, favoritas, bandas que sigues), listas editoriales de GrooveSpace, perfil de banda con *Seguir*, cola, aleatorio, repetir (todo/una), menú “⋯” por canción (favorita, añadir a lista, añadir a la cola), reproductor con fondo degradado según la banda y mini-reproductor. Interfaz separada para cuentas de banda.

## Contenido provisional (audio y video)

Las bandas marcadas como *referencia* (Café Tacvba, Zoé, Joy Division, Los Ángeles Azules, Daft Punk, Tool, Queen, Nirvana, Coldplay) se reproducen con el **reproductor oficial incrustado de YouTube**: no se descargan ni se alojan archivos. Sirven solo para probar el audio/video del reproductor (selector **Audio | Video**); **no acreditan saldo**. Algunos videos pueden bloquear la reproducción incrustada; en ese caso la app ofrece abrirlos en YouTube. Antes de publicar, sustituye este contenido por los masters grabados en GrooveSpace (`src/data.js`) o por material con licencia.

## Diseño

Interfaz clara y limpia al estilo de un reproductor moderno (títulos grandes, portadas con sombra, barras con efecto cristal y reproductor con fondo dinámico), con la paleta de GrooveSpace: rosa como acento principal, violeta e índigo como apoyo. Usa `expo-blur`; si falta: `npx expo install expo-blur`.

## Qué necesitas instalar

1. **Node.js LTS** (https://nodejs.org) — incluye `npm`.
2. **Git**.
3. En tu teléfono, la app **Expo Go** (App Store / Google Play). Es la forma más rápida de probar.
4. Opcional: **Android Studio** (emulador Android) o **Xcode** (simulador iOS, solo macOS).

No hace falta instalar React Native ni Expo globalmente: se usan con `npx`.

## Abrir la app (modo desarrollo)

```bash
git clone https://github.com/ISandBi/groovspe-music.git
cd groovspe-music
npm install
npx expo install --fix     # alinea todas las dependencias con la versión de Expo instalada
npx expo start
```

- Escanea el **código QR** con la cámara (iPhone) o desde Expo Go (Android). Teléfono y computadora deben estar en la misma red Wi-Fi; si falla, usa `npx expo start --tunnel`.
- Presiona `a` para el emulador Android, `i` para el simulador iOS.
- Si algo falla: `npx expo-doctor`.

## Cuentas de banda y de oyente

- Entra con el **mismo correo y contraseña** que usaste para registrar tu banda en el sitio de GrooveSpace: la app te muestra el **panel de banda** (demos, cuenta).
- Cualquier otra cuenta es de **oyente**. Para que la app hable con tu backend, define la URL en `.env` (no `localhost`):
  `EXPO_PUBLIC_API_URL=http://192.168.1.86:4000` (usa la IP de tu computadora y el puerto de tu backend), y reinicia con `npx expo start -c`.

## Pantalla de bloqueo y audio en segundo plano

Expo Go no incluye el servicio nativo de `expo-audio` para esto. Para activarlo, crea un *development build*:
`eas build --profile development --platform android`, instala el APK y usa `EXPO_PUBLIC_LOCK_SCREEN=1`.

## Compilar para instalar (EAS Build)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview   # genera un .apk instalable
eas build --platform ios --profile preview       # requiere cuenta Apple Developer (~US$99/año)
```

Para publicar en tiendas: `eas build --profile production` y `eas submit`. Google Play cobra US$25 una sola vez; Apple, US$99 al año. Las compilaciones de iOS se hacen en la nube de Expo, no necesitas una Mac.

## Estructura

```
app/                 Rutas (Expo Router)
  welcome.js, auth.js        Bienvenida y registro / inicio de sesión
  (tabs)/                    Inicio, Explorar, Biblioteca, Perfil
  band/[id].js               Perfil de banda
  player.js                  Reproductor a pantalla completa
src/
  theme.js                   Paleta, tipografía y espaciado (misma marca que la web)
  store.js                   Estado global: sesión, favoritos, reproductor, reproducciones válidas
  data.js                    Datos de demostración y reglas de acreditación
  lib/api.js                 Capa de datos (cambiar por el backend con EXPO_PUBLIC_API_URL)
  components/                Press, Cover, EqBars, MiniPlayer, SongRow, AdCard, Toast…
```

## Reglas de acreditación (configurables en `src/data.js`)

| Regla | Valor |
|---|---|
| Reproducción válida | ≥ 30 s, oyente registrado, 1 pagada por canción por día |
| Crédito | $1 MXN por reproducción válida (las primeras 100 de la banda valen el doble) |
| Tope | $1,500 MXN al mes por banda |
| Uso del saldo | hasta 50 % de una reserva; no retirable; caduca a los 12 meses |

> Esta versión valida en el dispositivo y usa canciones de muestra (SoundHelix). En producción la validación debe hacerse **en el servidor** (antifraude) y las canciones deben venir de los masters grabados en GrooveSpace.

## Siguientes pasos

- Conectar `src/lib/api.js` con el backend MERN de GrooveSpace (sesión de oyente, catálogo, reproducciones, saldo).
- Añadir icono y splash definitivos (`assets/`) y revisar el Aviso de Privacidad y los Términos antes de publicar.


## Novedades

- **Cuenta**: pestaña propia con editar nombre, apariencia (claro/oscuro/automático), Premium y cerrar sesión.
- **Portadas reales** de las canciones de referencia vía iTunes Search API (con caché); las canciones de GrooveSpace usan portada generada.
- **Letras**: propias para las canciones de GrooveSpace; LRCLIB (con respaldo lyrics.ovh) para las demás.
- **Premium · Aprende a tocar**: acordes, diagramas, tempo, metrónomo y letra con acordes. Solo con Premium (activable en modo demostración) y solo para canciones de GrooveSpace.
- **Pagos con tarjeta (demo)** con controles PCI DSS 4.0.1 y NIST CSF 2.0: ver `docs/SEGURIDAD-PAGOS.md`. Tarjeta de prueba: 4242 4242 4242 4242.
- **Rendimiento**: el progreso de reproducción tiene su propio contexto; para medir la velocidad real usa `npx expo start --no-dev --minify`.
