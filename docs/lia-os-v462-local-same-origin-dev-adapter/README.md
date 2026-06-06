# LIA O.S v4.6.2 - Local Same-Origin Dev Adapter

## Que se creo

Esta fase agrega un adapter HTTP local de desarrollo para ensayar la ruta futura:

```http
GET /api/lia-agent/health
```

El adapter vive en `scripts/lia-same-origin-dev-adapter-server.mjs` y responde un contrato mock seguro, compatible con la preparacion de v4.6.1.

Tambien se agrega `scripts/lia-same-origin-dev-adapter-self-check.mjs`, una prueba automatizada que levanta el adapter como proceso hijo, valida el contrato y apaga el proceso al final.

## Alcance local/dev

Este adapter es solo para desarrollo local. No hace deploy, no usa PM2, no usa Nginx, no abre puerto publico y no modifica el frontend.

No conecta con el backend real. La respuesta es sintetica y read-only.

## Limites de seguridad

- No usa el puerto interno del backend real.
- No llama direcciones internas del backend real.
- No llama direcciones publicas del servidor.
- No ejecuta acciones reales.
- No activa voz real.
- No activa canales reales.
- No conecta modelos externos.
- No lee ni carga credenciales reales.
- No usa base de datos.
- No crea archivos durante ejecucion.

## Como correr el server local

```bash
node scripts/lia-same-origin-dev-adapter-server.mjs
```

Por defecto escucha en:

```txt
127.0.0.1:3024
```

Variables opcionales de desarrollo:

```bash
LIA_SAME_ORIGIN_DEV_ADAPTER_HOST=127.0.0.1
LIA_SAME_ORIGIN_DEV_ADAPTER_PORT=3024
```

Cualquier host distinto requiere el gate explicito:

```bash
LIA_SAME_ORIGIN_DEV_ADAPTER_ALLOW_NON_LOCALHOST=ALLOW_LOCAL_DEV_ONLY
```

## Como correr el self-check

```bash
node scripts/lia-same-origin-dev-adapter-self-check.mjs
```

El self-check:

- Arranca el adapter local como proceso hijo.
- Usa `3024` o un puerto local alterno si esta ocupado.
- Valida `GET /api/lia-agent/health`.
- Valida `GET /health`.
- Valida `POST /api/lia-agent/health` con 405.
- Valida ruta desconocida con 404.
- Valida que el puerto quede libre despues del apagado.
- Valida por lectura estatica que el server no incluya transporte, proveedores o APIs prohibidas.

## Contrato mock

Respuesta esperada de `GET /api/lia-agent/health`:

```json
{
  "ok": true,
  "source": "lia-agent-backend",
  "mode": "read_only_status_adapter_mock",
  "backend": {
    "reachable": true,
    "service": "lia-agent-backend",
    "healthOk": true,
    "version": "v4.4.0-b"
  },
  "safety": {
    "realActionsEnabled": false,
    "voiceEnabled": false,
    "whatsappEnabled": false,
    "memoryWriteEnabled": false,
    "externalModelsEnabled": false,
    "secretsLoaded": false
  }
}
```

## Que NO se hizo

- No se conecto el frontend.
- No se cambio UI.
- No se toco `backend/lia-agent`.
- No se modifico el backend real.
- No se uso PM2.
- No se hizo deploy.
- No se agregaron dependencias.

## Siguiente fase recomendada

v4.6.3 debe preparar un server internal adapter rehearsal, sin abrir puerto publico y todavia sin conectar acciones reales.
