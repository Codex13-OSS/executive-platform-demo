# LÍA O.S. v2.4.0 — Connector Activation Permission Gate

v2.4.0 agrega una capa visible de permission gate para preparar la activación futura del conector externo read-only de agenda.

## Objetivo

Mostrar que antes de cualquier activación real existe una compuerta de permisos, aprobaciones y bloqueos.

## Estado visible

- Permission Gate Ready
- Activation Blocked
- Reads allowed
- Writes blocked
- Human approval required
- Credentials locked
- Real connection off

## Qué NO hace

- No conecta APIs reales.
- No configura fuente real.
- No carga credenciales.
- No agrega backend.
- No escribe datos.
- No agrega IA real.
