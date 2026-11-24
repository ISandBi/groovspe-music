# Seguridad de pagos · GrooveSpace Music
Alcance: suscripción **Premium** ($49 MXN/mes) pagada con tarjeta. Marco: **PCI DSS v4.0.1** y **NIST CSF 2.0**.

> Ser "compatible con PCI DSS" es una condición de la organización y de su entorno completo, no de una pantalla. Esta app implementa el diseño que **reduce el alcance** (SAQ A) y los controles que le corresponden. El modo actual es **demostración**: no cobra nada y solo acepta tarjetas de prueba.

## Decisión de arquitectura (reducción de alcance)
1. La app **nunca envía, guarda ni registra** el PAN completo, el CVV ni la fecha. Solo conserva `marca` y `últimos 4`.
2. En producción, la captura la hace el SDK de un proveedor certificado PCI DSS Nivel 1 (p. ej. Stripe PaymentSheet / Mercado Pago). Devuelve un **token**; el backend de GrooveSpace cobra con ese token (clave secreta solo en el servidor).
3. `src/lib/payments.js` define el adaptador. `MODE = 'demo'` simula la pasarela; para `live` se sustituye `payPlan()` por el SDK y el endpoint del backend.

## PCI DSS v4.0.1 → implementación
| Requisito | Qué se hizo |
|---|---|
| 3.3.1 / 3.3.2 No conservar datos sensibles de autenticación (CVV) tras la autorización | El CVV solo vive en el estado de la pantalla; se borra tras cada intento y al salir. Nunca se persiste. |
| 3.4.1 Enmascarar el PAN al mostrarlo | Solo se muestra `•••• 4242` (últimos 4). |
| 3.5.1 PAN ilegible donde se almacene | No se almacena. |
| 4.2.1 Criptografía fuerte en tránsito | Toda llamada al backend/pasarela va por HTTPS (TLS ≥ 1.2). La excepción `http://` solo existe para desarrollo local. |
| 6.2 / 6.3 Desarrollo seguro | Validación de entradas (Luhn, fecha, CVV por marca), sin `console.log` de datos de pago, dependencias fijadas. |
| 6.4 / 11.3 Pruebas de seguridad | Pendiente para producción: análisis de dependencias y pruebas de penetración. |
| 8.3.4 Bloqueo por intentos fallidos | 3 intentos fallidos → bloqueo de 5 min (también frena *card testing*). |
| 10.2 Registro de eventos | Bitácora local sin datos sensibles (`pago_iniciado/aprobado/rechazado/bloqueado`, marca, últimos 4). En producción, enviar al SIEM del servidor. |
| 12.10 Respuesta a incidentes | Ver RS abajo. |
| 12.8 Proveedores de servicio | El proveedor de pagos debe entregar su Attestation of Compliance (AOC) vigente. |

## NIST CSF 2.0 → implementación
| Función | Categoría | Control en el proyecto |
|---|---|---|
| **Govern (GV)** | GV.OC, GV.RM, GV.SC | Este documento define alcance y riesgo; el proveedor de pagos es un tercero evaluado (AOC). |
| **Identify (ID)** | ID.AM, ID.RA | Activos: token de pago, últimos 4, bitácora. Riesgos: robo de PAN, *card testing*, doble cobro. |
| **Protect (PR)** | PR.AA, PR.DS, PR.PS | Bloqueo por intentos; no almacenar PAN/CVV; TLS; el CVV con campo oculto; clave del proveedor solo en servidor; llave de idempotencia por intento. |
| **Detect (DE)** | DE.CM, DE.AE | Bitácora de eventos de pago; patrón de varios rechazos seguidos dispara bloqueo. |
| **Respond (RS)** | RS.MA, RS.CO | Mensajes de error sin detalles internos; ante sospecha: revocar token, notificar al proveedor y al usuario. |
| **Recover (RC)** | RC.RP | El usuario puede cancelar la suscripción desde la app; reembolsos y reversos los hace el proveedor. |

## Pendiente para producción
- Backend con endpoint `POST /api/payments/subscribe` (autenticado, TLS, rate-limit, idempotencia, webhooks firmados).
- SDK del proveedor (3-D Secure / SCA) y almacenamiento del token del cliente solo en el servidor.
- `expo-secure-store` para cualquier secreto local; bloqueo de capturas de pantalla en el formulario.
- Evidencia: AOC del proveedor, SAQ A firmado, pruebas de penetración, política de privacidad y retención.
