# Validation Checklist

## Validaciones locales

Ejecutar antes de cualquier cambio futuro:

```bash
npm --prefix frontend run build
npm --prefix backend/lia-agent run self-check
node scripts/lia-same-origin-status-adapter-mock-self-check.mjs
node scripts/lia-same-origin-dev-adapter-self-check.mjs
node scripts/lia-same-origin-server-internal-adapter-rehearsal-self-check.mjs
node scripts/lia-controlled-same-origin-status-read-self-check.mjs
node scripts/lia-server-same-origin-adapter-runtime-rehearsal-self-check.mjs
```

Resultado esperado:

- Todos devuelven OK.
- No quedan procesos temporales vivos.
- No hay puertos temporales abiertos.

## Validaciones de servidor

Futuro / no ejecutar en v4.8.0:

```bash
git status --short
npm --prefix frontend run build
npm --prefix backend/lia-agent run self-check
node scripts/lia-server-same-origin-adapter-runtime-rehearsal-self-check.mjs
```

Resultado esperado:

- Git limpio antes del cambio.
- Build OK.
- Backend self-check OK.
- Runtime rehearsal OK.

## Checks HTTP

Futuro / no ejecutar en v4.8.0:

```bash
curl -i http://127.0.0.1:3004/
curl -i http://127.0.0.1:3324/
curl -i http://127.0.0.1:3324/api/lia-agent/health
curl -i -X POST http://127.0.0.1:3324/api/lia-agent/health
curl -i http://127.0.0.1:3324/api/not-found
```

Resultado esperado:

- Frontend actual responde 200.
- Runtime candidato responde 200.
- API same-origin responde 200 con JSON sanitizado.
- POST responde 405.
- API desconocida responde 404.

## Checks de assets

Futuro / no ejecutar en v4.8.0:

```bash
find frontend/dist/assets -maxdepth 1 -type f | sort
curl -i http://127.0.0.1:3324/assets/<asset-principal>
```

Resultado esperado:

- Existe asset JS principal.
- Existe asset CSS principal.
- Assets responden 200 desde el runtime candidato.

## Checks de puerto 3014

Futuro / no ejecutar en v4.8.0:

```bash
ss -ltnp | grep ':3014' || true
curl -i http://127.0.0.1:3014/health
curl -i http://38.242.222.25:3014/health
```

Resultado esperado:

- `3014` escucha solo en localhost.
- Health interno responde desde servidor.
- Acceso publico por `3014` falla o no conecta.

## Checks de API same-origin

Validar que `/api/lia-agent/health`:

- Acepta solo GET.
- Devuelve `Cache-Control: no-store`.
- Devuelve `Content-Type: application/json`.
- No devuelve payload raw completo.
- Mantiene safety flags en `false`.
- No incluye stack trace.
- No incluye rutas internas extra.
- No incluye credenciales.

## Checks de fallback visual

Validar manualmente:

- Con API disponible, la tarjeta muestra lectura verificada.
- Con API no disponible, la tarjeta muestra fallback seguro.
- No se muestran URLs.
- No se muestran puertos.
- No se muestra JSON.
- No aparecen controles de acciones reales.

## Checks de rollback

Futuro / no ejecutar en v4.8.0:

```bash
pm2 status executive-demo-frontend
pm2 status lia-agent-backend
curl -i http://127.0.0.1:3004/
ss -ltnp | grep ':3014' || true
```

Resultado esperado:

- Servicio frontend actual online.
- Backend interno online.
- Frontend responde 200.
- `3014` sigue local-only.
