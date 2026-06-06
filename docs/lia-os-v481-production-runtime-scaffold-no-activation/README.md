# LIA O.S v4.8.1 - Production Runtime Scaffold, no activation

## Que se creo

Esta fase agrega un scaffold production-ready para servir en un mismo origen:

- `frontend/dist`
- `GET /api/lia-agent/health`

El runtime vive en:

```bash
scripts/lia-production-same-origin-runtime-server.mjs
```

Su self-check vive en:

```bash
scripts/lia-production-same-origin-runtime-self-check.mjs
```

## Naturaleza del scaffold

Este runtime no se activa automaticamente. Es manual-only y se valida como proceso temporal.

Por defecto escucha solo en:

```txt
127.0.0.1:3424
```

No reemplaza el servicio actual en `3004`. No cambia procesos existentes. No modifica el backend interno.

## Limites de seguridad

- No toca gestor de procesos.
- No toca proxy web.
- No reemplaza `3004`.
- No abre `3014`.
- No expone el backend interno.
- No activa acciones reales.
- No activa voz real.
- No activa canales reales.
- No conecta modelos externos.
- No carga credenciales reales.
- No usa base de datos.
- No escribe archivos runtime.

## API same-origin

La ruta expuesta por el scaffold es:

```txt
GET /api/lia-agent/health
```

La API es solo GET, devuelve JSON sanitizado y usa `Cache-Control: no-store`.

Si se intenta otro metodo sobre esa ruta, responde 405. Si se consulta una ruta API desconocida, responde 404.

## Frontend

El runtime sirve `frontend/dist`. Si el build no existe, `/` responde 503 con JSON claro.

La tarjeta del frontend ya tiene fallback seguro desde v4.7.0, asi que si la API no existe o falla mantiene estado protegido.

## Comandos de validacion

Self-check completo:

```bash
node scripts/lia-production-same-origin-runtime-self-check.mjs
```

Arranque manual del scaffold:

```bash
node scripts/lia-production-same-origin-runtime-server.mjs
```

Al iniciar imprime JSON con:

```json
{
  "ok": true,
  "mode": "production_same_origin_runtime_scaffold",
  "activation": "manual_only",
  "replacesCurrentFrontend": false,
  "processManagerTouched": false,
  "proxyTouched": false,
  "publicPortOpened": false
}
```

## Siguiente fase recomendada

v4.8.2 debe validar este scaffold en Contabo como servidor local controlado, sin public switch y sin reemplazar `3004`.
