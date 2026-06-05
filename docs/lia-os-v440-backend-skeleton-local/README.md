# LIA O.S v4.4.0-B - Backend Skeleton Local

## Que se agrego

Se agrego un backend local minimo en `backend/lia-agent` para preparar una base read-only antes de conectar el frontend o cualquier accion real.

Incluye:

- Servidor HTTP nativo de Node.
- Health check local en `GET /health`.
- Snapshot con acciones reales apagadas.
- Self-check local de seguridad.
- Configuracion de ejemplo sin claves.
- README operativo para ejecucion local.

## Que NO se hizo

- No deploy.
- No PM2.
- No Nginx.
- No puerto publico.
- No llamadas externas.
- No modelos externos.
- No mensajeria real.
- No voz real.
- No conexion con frontend.
- No escritura de archivos.
- No cambios en UI.

## Limites

El backend solo responde localmente y por defecto escucha en `127.0.0.1:3014`.

Si se intenta usar otro host, el arranque queda bloqueado salvo compuerta explicita. Esta fase no implementa autenticacion, persistencia, comandos reales ni integraciones externas.

## Validaciones

```bash
npm --prefix frontend run build
npm --prefix backend/lia-agent run self-check
node backend/lia-agent/server.mjs
curl -s http://127.0.0.1:3014/health
curl -i -X POST http://127.0.0.1:3014/health
curl -i http://127.0.0.1:3014/not-found
```

El resultado esperado es:

- Build frontend correcto.
- Self-check con `ok: true`.
- `/health` con `ok: true`.
- POST con estado 405.
- Ruta inexistente con estado 404.

## Siguiente fase v4.4.0-C

La siguiente fase debe agregar un health check local desde el lado de integracion, todavia sin conectar la UI productiva ni activar acciones reales.
