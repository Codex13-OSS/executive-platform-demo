# Connector Contract

Primer contrato preparado:

- `domain: agenda`
- `sourceType: external_calendar`
- `mode: contract_only`
- `status: rehearsal_ready`
- `readsEnabled: true`
- `writesEnabled: false`
- `realConnectionActive: false`
- `credentialsLoaded: false`
- `endpointConfigured: false`

Operaciones permitidas:

- `read_events`
- `read_availability`
- `read_metadata`

Operaciones bloqueadas:

- `create_event`
- `update_event`
- `delete_event`
- `send_invite`
- `write_metadata`
