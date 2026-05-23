# Read-Only Guardrails v1.8.0

Reglas obligatorias:

- `writesEnabled` permanece en `false`.
- `realApisConnected` permanece en `false`.
- No se cargan credenciales.
- No se declaran endpoints reales.
- El bus solo sintetiza señales internas mock.

Preparación v1.9.0:

- Contratos por conector read-only controlado.
- Trazabilidad de degradación por dominio.
- Confirmación humana para cualquier ejecución.
