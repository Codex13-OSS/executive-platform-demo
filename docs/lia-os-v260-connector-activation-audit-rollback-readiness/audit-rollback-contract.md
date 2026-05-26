# Audit & Rollback Readiness Contract

La capa Audit & Rollback Readiness representa el último control visual antes de cualquier activación real.

## Dominio inicial

- Agenda ejecutiva

## Modo

- audit rollback readiness only
- activation locked
- evidence preview only
- rollback prepared but not executed

## Acciones permitidas

- preview audit
- validate rollback
- review evidence
- prepare activation note

## Acciones bloqueadas

- activate source
- load credentials
- enable writes
- emit real event
- skip rollback

## Guardrails

- real source off
- credentials not loaded
- writes disabled
- human approval required
- dry-run required
- no real activation event emitted
- rollback prepared but not executed
