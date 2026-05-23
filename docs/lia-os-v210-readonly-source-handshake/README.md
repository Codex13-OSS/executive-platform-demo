# LÍA O.S. v2.1.0 — Read-Only Source Handshake

v2.1.0 prepara el handshake controlado para una fuente externa read-only, sin activar conexiones reales.

## Qué hace

- Prepara permission envelope.
- Mantiene credential gate bloqueado.
- Mantiene endpoint gate bloqueado.
- Requiere aprobación humana para activación futura.
- Verifica compatibilidad con Source Runtime.
- Expone audit readiness.

## Qué NO hace

- No conecta APIs reales.
- No configura endpoints.
- No carga credenciales.
- No agrega backend.
- No escribe datos.
- No agrega IA real.
