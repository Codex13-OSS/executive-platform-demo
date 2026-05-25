# Integration Layer Boundaries

## Boundary recomendado

Foundation debe definir el estado base readonly.

Adapters deben representar dominios y disponibilidad de fuentes.

Brain Bus debe traducir señales entre dominios y acciones sugeridas.

Connector Contract debe describir permisos, campos y operaciones permitidas.

Source Runtime debe normalizar lecturas ensayadas.

Source Handshake debe preparar gates, approval y compatibilidad futura.

## Regla clave

Las capas de integration no deben depender de componentes visuales.

Los componentes deben leer snapshots ya preparados y solo representar estado.

## Mantener

- Sin escritura.
- Sin credenciales.
- Sin conexión real.
- Sin endpoints activos.
- Sin lógica de proveedor específico.
