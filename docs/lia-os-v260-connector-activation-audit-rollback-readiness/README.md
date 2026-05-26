# LÍA O.S. v2.6.0 — Connector Activation Audit & Rollback Readiness

v2.6.0 agrega una tarjeta visible para cerrar la etapa de seguridad previa a una activación real de conector externo read-only.

## Objetivo

Mostrar que antes de activar una fuente real, LÍA O.S. ya tiene preparada evidencia de auditoría y plan de reversa.

## Estado visible

- Audit ready
- Rollback ready
- Activation locked
- Real source off
- Writes blocked
- Credentials not loaded
- Human approval required

## Qué NO hace

- No conecta APIs reales.
- No configura fuente real.
- No carga credenciales.
- No agrega backend.
- No escribe datos.
- No ejecuta rollback real.
- No agrega IA real.
