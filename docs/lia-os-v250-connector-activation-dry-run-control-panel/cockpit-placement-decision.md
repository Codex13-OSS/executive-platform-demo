# Cockpit Placement Decision

## Ubicación

La tarjeta Connector Dry-Run Control se coloca después de Connector Permission Gate.

## Motivo

Connector Permission Gate muestra que la activación está bloqueada por permisos. Connector Dry-Run Control muestra el siguiente paso seguro: ensayar la activación sin activar nada real.

## Principio

Preparar operación real con simulación controlada, manteniendo fuente real, credenciales, backend y escritura apagados.
