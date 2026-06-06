# LIA O.S v4.6.4 - Controlled Same-Origin Status Read

## Que se creo

Esta fase agrega un adapter temporal de lectura controlada para consultar el health interno de LIA y devolver solo una respuesta normalizada.

El server temporal es:

```bash
node scripts/lia-controlled-same-origin-status-read-server.mjs
```

El self-check es:

```bash
node scripts/lia-controlled-same-origin-status-read-self-check.mjs
```

## Alcance

El adapter escucha por defecto en `127.0.0.1:3224` y consulta solo `GET /health` del backend interno en `127.0.0.1:3014`.

La ruta expuesta por el adapter temporal es:

```http
GET /api/lia-agent/health
```

No permite escritura. Cualquier metodo distinto a `GET` responde 405.

## Seguridad

- No expone `3014`.
- No abre puerto publico.
- No conecta el frontend publico.
- No cambia el backend real.
- No usa gestor de procesos permanente.
- No toca proxy web.
- No hace publicacion.
- No activa acciones reales.
- No activa voz real.
- No activa canales reales.
- No conecta modelos externos.
- No carga credenciales reales.
- No usa base de datos.

## Normalizacion

Si el backend interno responde `ok: true` y todas las banderas de seguridad estan apagadas, el adapter devuelve:

```json
{
  "ok": true,
  "source": "lia-agent-backend",
  "mode": "controlled_same_origin_status_read",
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

Si el backend no responde, responde mal o alguna bandera aparece insegura, el adapter devuelve un fallback degradado seguro. No filtra el payload crudo del backend.

## Validacion

Comando recomendado:

```bash
node scripts/lia-controlled-same-origin-status-read-self-check.mjs
```

El self-check valida:

- Modo sin backend disponible, con fallback degradado seguro.
- Modo con backend fake temporal si `3014` esta libre.
- Sanitizacion cuando `3014` ya esta ocupado.
- `POST /api/lia-agent/health` con 405.
- Ruta desconocida con 404.
- Listener local-only.
- Cleanup del proceso temporal.

## Siguiente fase recomendada

v4.7.0 debe permitir que el frontend consuma el adapter same-origin con fallback seguro, aun sin acciones reales.
