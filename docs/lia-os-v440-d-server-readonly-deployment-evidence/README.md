# LÍA O.S. v4.4.0-D — Server Read-Only Deployment Evidence

## Estado

CERRADO EN SERVIDOR.

## Objetivo

Desplegar el primer backend real de LÍA O.S. como servicio interno, separado del frontend, en modo read-only foundation.

No se activaron acciones reales.

## Base usada

Repo: Codex13-OSS/executive-platform-demo  
Rama base: polish/lia-os-cinematic-compact-v085  
HEAD servidor usado: 4d4e48b  
Tag base: v4.4.0-c-lia-os-backend-local-health-check

## Servidor

Contabo VPS: 38.242.222.25  
Ruta frontend: /opt/executive-platform-demo  
Ruta backend interno: /opt/lia-agent-backend  
PM2 backend: lia-agent-backend  
Puerto backend: 127.0.0.1:3014  
Frontend público: http://38.242.222.25:3004

## Resultado

El backend `lia-agent-backend` quedó online en PM2 escuchando únicamente en localhost.

Health local respondió correctamente:

- ok: true
- service: lia-agent-backend
- mode: read_only_foundation
- version: v4.4.0-b
- realActionsEnabled: false
- voiceEnabled: false
- whatsappEnabled: false
- memoryWriteEnabled: false
- externalModelsEnabled: false
- transport: local_http_only
- frontendConnected: false
- secretsLoaded: false

## Validaciones ejecutadas

### Preflight

- Node disponible: v22.20.0
- npm disponible: 10.9.3
- PM2 disponible
- puerto 3014 libre
- /opt/lia-agent-backend no existía
- frontend 3004 vivo
- html-demo 3020 vivo

### Backend local en servidor

Desde `/opt/executive-platform-demo`:

- `npm --prefix backend/lia-agent run self-check` OK
- `npm --prefix backend/lia-agent run local-health-check` OK

Evidencia local health-check:

- host: 127.0.0.1
- port: 3014
- healthOk: true
- postStatus: 405
- notFoundStatus: 404
- shutdownVerified: true

### Deploy interno

Se copió backend versionado desde:

`/opt/executive-platform-demo/backend/lia-agent`

hacia:

`/opt/lia-agent-backend`

Se arrancó PM2 con:

`LIA_AGENT_HOST=127.0.0.1 LIA_AGENT_PORT=3014 pm2 start server.mjs --name lia-agent-backend --interpreter node`

### Validación final

- `GET http://127.0.0.1:3014/health` OK
- `POST http://127.0.0.1:3014/health` devolvió 405
- `GET http://127.0.0.1:3014/not-found` devolvió 404
- `curl http://38.242.222.25:3014` falló con connection refused
- `ss -tulpn` confirmó `127.0.0.1:3014`
- frontend 3004 siguió respondiendo 200 OK
- PM2 save OK

## Servicios que no se tocaron

- No se tocó Nginx.
- No se tocó ADEIN.
- No se tocó LÍA pagaré.
- No se tocó html-demo.
- No se tocó base de datos.
- No se abrió 3014 públicamente.
- No se conectó el frontend al backend.
- No se cargaron secretos.
- No se activó voz real.
- No se activó WhatsApp real.
- No se activaron modelos externos.
- No se activaron acciones reales.

## Estado final

LÍA O.S. ya tiene un primer backend real vivo, pero seguro:

- interno,
- read-only,
- sin secretos,
- sin acciones reales,
- sin exposición pública,
- separado del frontend.

## Siguiente fase recomendada

v4.4.0-E — Backend Service Evidence + Repo Alignment

Documentar y preparar scripts controlados para repetir el deploy interno sin comandos manuales peligrosos.
