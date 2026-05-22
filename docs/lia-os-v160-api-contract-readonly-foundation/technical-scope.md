# Technical Scope

v1.6.0 prepara el puente entre los mocks premium actuales y una futura capa de lectura real.

## Archivos principales

- `frontend/src/integrations/readOnlyFoundation.ts`
- `frontend/src/components/ReadOnlyFoundationCard.tsx`
- `frontend/src/App.tsx`
- `frontend/src/styles/global.css`

## Contratos

Incluye contratos para:

- ExecutiveReadOnlySnapshot
- ExecutiveReadOnlySource
- ExecutiveReadOnlyHealth
- ExecutiveReadOnlyEvent
- ExecutiveReadOnlyContact
- ExecutiveReadOnlyTask
- ExecutiveReadOnlyDocument
- ExecutiveReadOnlyRisk
- ExecutiveReadOnlyAuditEvent

## Adapter

`getExecutiveReadOnlySnapshot()` devuelve datos mock en formato compatible con futuras lecturas reales.

## Self-check

`validateExecutiveReadOnlySnapshot()` confirma que la capa sigue segura antes de avanzar a fases posteriores.
