# Cockpit Placement Decision

## Ubicación

La tarjeta Connector Audit + Rollback se coloca después de Connector Dry-Run Control.

## Motivo

Connector Dry-Run Control muestra el ensayo seguro. Connector Audit + Rollback Readiness cierra la etapa de seguridad mostrando evidencia, auditoría y reversa antes de cualquier activación real.

## Principio

No agregar más tarjetas técnicas después de esta fase. El siguiente avance debe pasar a utilidad real: primer conector read-only real o preparación real de agenda/documentos.
