# LIA O.S v4.4.0-E - Backend Service Alignment

## Proposito

Esta fase agrega scripts versionados para validar, repetir, verificar y detener el servicio interno `lia-agent-backend` en servidor, manteniendo el backend en modo read-only.

No conecta frontend, no abre el puerto 3014 publicamente y no activa acciones reales.

## Scripts agregados

```bash
node scripts/lia-agent-backend-preflight.mjs
node scripts/lia-agent-backend-deploy-internal.mjs
node scripts/lia-agent-backend-verify-internal.mjs
node scripts/lia-agent-backend-stop-internal.mjs
```

No se agregaron scripts npm de raiz porque este repo no tiene `package.json` raiz.

## Gates requeridos

Deploy interno:

```bash
LIA_AGENT_DEPLOY_INTERNAL_GATE=DEPLOY_LIA_AGENT_INTERNAL_READONLY_V440E node scripts/lia-agent-backend-deploy-internal.mjs
```

Stop interno:

```bash
LIA_AGENT_STOP_INTERNAL_GATE=STOP_LIA_AGENT_INTERNAL_V440E node scripts/lia-agent-backend-stop-internal.mjs
```

Sin gate, deploy y stop regresan `ok:false` y no modifican nada.

## Que valida cada script

`preflight` valida estructura local, backend disponible, Node, PM2, estado del puerto 3014 y ruta interna esperada en servidor.

`deploy-internal` copia `backend/lia-agent` a `/opt/lia-agent-backend`, ejecuta self-check, arranca o reinicia solo `lia-agent-backend` con host `127.0.0.1`, valida health local y confirma que `ss` no muestre exposicion publica. No ejecuta `pm2 save`.

`verify-internal` valida PM2 online, `GET /health`, `POST /health` 405, ruta desconocida 404, puerto publico sin respuesta, `ss` local-only, frontend local en 3004 y `html-demo` local en 3020 si existe.

`stop-internal` detiene solo `lia-agent-backend` si existe, valida que 3014 quede libre y conserva `/opt/lia-agent-backend`.

## Que NO hacen

- No conectan frontend.
- No tocan UI.
- No configuran Nginx.
- No abren puertos publicos.
- No crean `.env` real.
- No activan acciones reales.
- No activan voz real.
- No activan mensajeria real.
- No conectan modelos externos.
- No tocan base de datos.
- No tocan ADEIN.
- No tocan html-demo salvo verificacion local opcional.
- No tocan LIA pagare.
- No hacen commit ni push.

## Rollback seguro

Para detener solo el backend interno:

```bash
LIA_AGENT_STOP_INTERNAL_GATE=STOP_LIA_AGENT_INTERNAL_V440E node scripts/lia-agent-backend-stop-internal.mjs
```

Despues validar:

```bash
node scripts/lia-agent-backend-verify-internal.mjs
```

Si el stop fue intencional, el verify debe fallar en los checks del servicio backend y mantener intactos frontend y otros procesos.

## Siguiente fase recomendada

v4.4.0-F debe enfocarse en observabilidad read-only del servicio interno, con health check y logs operativos seguros antes de cualquier conexion con frontend.
