# Read-Only Guardrails

## Reglas obligatorias

- `writesEnabled` debe permanecer en `false`.
- `realApisConnected` debe permanecer en `false`.
- `credentialsRequired` debe permanecer en `false`.
- Las fuentes no deben declarar endpoints reales.
- La UI solo debe mostrar estado, no ejecutar acciones externas.

## Camino futuro

La siguiente fase podrá preparar adapters de lectura controlada, pero deberá mantener:

1. permisos mínimos,
2. sin escritura,
3. auditoría,
4. degradación segura,
5. validación visual clara.
