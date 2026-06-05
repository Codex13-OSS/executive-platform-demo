# LIA Agent Backend Skeleton Local

Este directorio contiene el esqueleto local del backend de LIA O.S para v4.4.0-B.

El servicio esta aislado del frontend, usa solo Node nativo y arranca en modo read-only. Su objetivo es exponer una base local observable antes de conectar cualquier flujo real.

## Limites actuales

- Sin deploy.
- Sin PM2.
- Sin puerto publico.
- Sin acciones reales.
- Sin escritura de memoria.
- Sin voz activa.
- Sin mensajeria real.
- Sin modelos externos.
- Sin claves reales.
- Sin conexion con frontend.

## Scripts

```bash
npm run self-check
npm run start
npm run health
```

## Validacion local

Desde este directorio:

```bash
npm run self-check
npm run start
```

En otra terminal:

```bash
curl http://127.0.0.1:3014/health
```

La respuesta debe indicar `ok: true`, `mode: read_only_foundation`, `transport: local_http_only` y todas las capacidades reales apagadas.

## Nota de seguridad

Este skeleton no esta listo para produccion ni para exposicion publica. Cualquier host distinto a `127.0.0.1` o `localhost` queda bloqueado salvo que se defina una compuerta explicita de seguridad.
