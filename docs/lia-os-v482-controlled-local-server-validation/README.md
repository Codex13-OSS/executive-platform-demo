# LIA O.S v4.8.2 - Controlled Local Server Validation

Esta fase agrega una validacion controlada para probar el runtime scaffold productivo de v4.8.1 con HTTP real en modo local-only.

## Que se creo

- `scripts/lia-production-runtime-controlled-local-validation-v482.mjs`
- `scripts/lia-production-runtime-controlled-local-validation-self-check-v482.mjs`

El script principal arranca temporalmente `scripts/lia-production-same-origin-runtime-server.mjs`, prueba endpoints reales en `127.0.0.1:3524` por defecto y limpia el proceso hijo al terminar.

## Limites de seguridad

- No activa runtime permanente.
- No reemplaza el frontend actual en 3004.
- No toca gestor de procesos.
- No toca proxy web.
- No abre 3014.
- No expone el backend interno.
- No activa acciones reales.
- No usa canales reales, voz real ni modelos externos.
- No escribe archivos ni carga credenciales reales.

## Validaciones HTTP reales

La validacion cubre:

- `GET /health`
- `GET /api/lia-agent/health`
- `GET /`
- asset principal de `frontend/dist` si se detecta en `index.html`
- `POST /api/lia-agent/health` con respuesta esperada `405`
- `GET /api/unknown` con respuesta esperada `404`

Tambien valida que el listener temporal sea local-only, que 3014 siga cerrado hacia fuera si existe, que 3004 siga respondiendo localmente si existe, que 3020 siga respondiendo localmente si existe y que el puerto temporal deje de responder despues del apagado.

## Comandos

```bash
node scripts/lia-production-runtime-controlled-local-validation-self-check-v482.mjs
node scripts/lia-production-runtime-controlled-local-validation-v482.mjs
```

Variables opcionales:

```bash
LIA_V482_CONTROLLED_RUNTIME_HOST=127.0.0.1
LIA_V482_CONTROLLED_RUNTIME_PORT=3524
```

Para cualquier host distinto de `127.0.0.1`, el script exige el gate explicito:

```bash
LIA_V482_ALLOW_NON_LOCALHOST=ALLOW_CONTROLLED_SERVER_VALIDATION_ONLY
```

## Resultado esperado

Ambos comandos deben imprimir JSON con `ok: true`. La evidencia debe confirmar:

- `apiContractOk: true`
- `safetyFlagsFalse: true`
- `postStatus: 405`
- `notFoundStatus: 404`
- `localOnly: true`
- `publicExposed: false`
- `processManagerTouched: false`
- `proxyTouched: false`
- `publicPortOpened: false`
- `shutdownVerified: true`

## Siguiente fase recomendada

v4.8.3 - Temporary public preview port, gated, no replacing 3004.
