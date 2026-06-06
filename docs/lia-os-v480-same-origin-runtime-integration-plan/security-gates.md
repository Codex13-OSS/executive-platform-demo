# Security Gates

## Gates obligatorios antes de cualquier activacion

- Git limpio.
- `npm --prefix frontend run build` OK.
- `npm --prefix backend/lia-agent run self-check` OK.
- `node scripts/lia-same-origin-status-adapter-mock-self-check.mjs` OK.
- `node scripts/lia-same-origin-dev-adapter-self-check.mjs` OK.
- `node scripts/lia-same-origin-server-internal-adapter-rehearsal-self-check.mjs` OK.
- `node scripts/lia-controlled-same-origin-status-read-self-check.mjs` OK.
- `node scripts/lia-server-same-origin-adapter-runtime-rehearsal-self-check.mjs` OK.
- Backend internal verify OK.
- `3014` solo escucha en localhost.
- `3014` publico cerrado.
- `POST /api/lia-agent/health` devuelve 405.
- API desconocida devuelve 404.
- Respuesta de `/api/lia-agent/health` sanitizada.
- Frontend publico responde 200.
- Assets principales responden 200.
- PM2 actual respaldado antes de cualquier cambio futuro.
- Rollback probado antes del cambio.

## Gates de contrato

La respuesta same-origin debe cumplir:

- `source` igual a `lia-agent-backend`.
- `mode` controlado o degradado seguro.
- `backend.service` igual a `lia-agent-backend`.
- `backend.healthOk` booleano normalizado.
- `safety.realActionsEnabled` igual a `false`.
- `safety.voiceEnabled` igual a `false`.
- `safety.whatsappEnabled` igual a `false`.
- `safety.memoryWriteEnabled` igual a `false`.
- `safety.externalModelsEnabled` igual a `false`.
- `safety.secretsLoaded` igual a `false`.

## Gates de red

- El navegador llama solo al mismo origen.
- El navegador nunca llama directo a `127.0.0.1:3014`.
- El navegador nunca llama directo a `38.242.222.25:3014`.
- `ss -ltnp` debe mostrar `3014` solo en localhost.
- El puerto publico `3014` debe fallar o no conectar.

## Gates prohibidos

No se permite activar si aparece cualquiera de estas capacidades:

- Secretos.
- Modelos externos.
- Mensajeria real.
- Voz real.
- Escritura.
- Base de datos.
- Acciones reales.
- Comandos desde navegador.
- POST operativo hacia el backend interno.

## Gate de decision humana

Antes de reemplazar `executive-demo-frontend`, debe existir aprobacion explicita con:

- Evidencia de validacion.
- Plan de rollback.
- Estado actual de procesos.
- Confirmacion de que `3014` sigue cerrado.
- Ventana de cambio definida.
