# Cockpit Placement Decision

## Ubicación

La tarjeta Read-Only Real Connector Prep se coloca después de Connector Audit + Rollback.

## Motivo

Audit + Rollback cerró la cadena de seguridad visual. Esta fase empieza la preparación realista del primer conector read-only, todavía sin conexión real.

## Principio

Pasar de maqueta técnica a preparación real controlada sin habilitar endpoints, credenciales, backend, escritura o acciones reales.
