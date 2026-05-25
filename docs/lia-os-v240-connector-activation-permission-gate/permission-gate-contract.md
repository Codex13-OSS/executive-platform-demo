# Permission Gate Contract

El permission gate representa la revisión previa de permisos antes de activar un conector externo read-only.

## Dominio inicial

- Agenda ejecutiva

## Modo

- permission gate only
- activation blocked
- approvals pending

## Capacidades permitidas

- read events
- read availability
- read metadata

## Capacidades bloqueadas

- write events
- change events
- remove events
- send invitations

## Guardrails

- credentials locked
- real source off
- human approval required
- rollback approval required
- security approval required
