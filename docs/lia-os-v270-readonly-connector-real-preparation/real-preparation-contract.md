# Read-Only Real Connector Preparation Contract

Esta fase prepara el primer conector externo read-only de agenda sin activar conexión real.

## Dominio inicial

- Agenda ejecutiva

## Modo

- real connector preparation only
- read-only schema prepared
- adapter boundary prepared
- connection locked

## Campos mínimos preparados

- event id
- title
- start time
- end time
- location
- attendees
- status
- source updated at

## Acciones permitidas

- prepare schema
- prepare adapter boundary
- prepare normalization
- prepare audit boundary

## Acciones bloqueadas

- connect real source
- load credentials
- configure endpoint
- enable writes
- mutate events

## Guardrails

- real source off
- credentials not loaded
- endpoint not configured
- writes disabled
- activation blocked
