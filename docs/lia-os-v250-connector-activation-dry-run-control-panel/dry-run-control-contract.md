# Dry-Run Control Contract

El dry-run control panel representa un ensayo seguro antes de activar un conector externo read-only.

## Dominio inicial

- Agenda ejecutiva

## Modo

- dry-run control only
- activation locked
- read simulation only

## Acciones permitidas

- simulate read
- validate permissions
- preview audit
- prepare rollout note

## Acciones bloqueadas

- activate source
- load credentials
- enable writes
- emit real event

## Guardrails

- activation locked
- real source off
- credentials not loaded
- writes disabled
- human approval required
- permission gate required
- rollback plan required
