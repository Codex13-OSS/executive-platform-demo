# Normalized Read Events

Los eventos del rehearsal se normalizan con campos internos seguros:

- `id`
- `sourceEventId`
- `normalizedTitle`
- `normalizedTimeWindow`
- `normalizedLocation`
- `cognitiveRiskHint`
- `readOperation`
- `runtimeState: read_rehearsed`

Ningún evento normalizado contiene endpoint, credential, token o datos de escritura.
