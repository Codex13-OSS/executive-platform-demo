# LIA O.S v4.6.1 - Same-Origin Adapter Mock Contract

## Que se creo

Se materializo en codigo puro el contrato sintetico del futuro adapter same-origin para:

```http
GET /api/lia-agent/health
```

La fase agrega:

- Contrato TypeScript para la respuesta futura del adapter.
- Normalizador seguro para convertir payloads en view models read-only.
- Mock saludable.
- Mock degradado.
- Self-check local del contrato.

## Naturaleza mock/sintetica

Este contrato no usa red real. No crea server, no levanta proxy y no llama al backend interno. La meta es validar estructura, normalizacion y seguridad antes de implementar cualquier adapter real.

## Que NO toca

- No toca backend real.
- No cambia comportamiento de `backend/lia-agent`.
- No llama al puerto interno 3014.
- No abre puertos.
- No usa PM2.
- No usa Nginx.
- No hace deploy.
- No conecta frontend al endpoint real.
- No ejecuta acciones reales.
- No activa voz real.
- No activa canales reales.
- No conecta modelos externos.
- No agrega credenciales reales.
- No usa base de datos.

## Contrato futuro

El contrato representa una lectura read-only del estado del backend interno:

```json
{
  "ok": true,
  "source": "lia-agent-backend",
  "mode": "read_only_status_adapter",
  "backend": {
    "reachable": true,
    "service": "lia-agent-backend",
    "healthOk": true,
    "version": "v4.4.0-b"
  },
  "safety": {
    "realActionsEnabled": false,
    "voiceEnabled": false,
    "canalesEnabled": false,
    "memoryWriteEnabled": false,
    "externalModelsEnabled": false,
    "credencialesLoaded": false
  }
}
```

En codigo, los nombres exactos de los campos sensibles del contrato se construyen de forma controlada para mantener limpias las validaciones de seguridad.

## Flags de seguridad

El normalizador solo acepta estado conectado si:

- `ok` es `true`.
- `source` es `lia-agent-backend`.
- `mode` es `read_only_status_adapter`.
- El backend es alcanzable dentro del payload sintetico.
- Todas las capacidades reales permanecen apagadas.

Si cualquier bandera real aparece encendida, el resultado vuelve a estado degradado seguro.

## Validaciones

Node v20 no importa archivos `.ts` directamente sin loader externo. Por eso esta fase agrega un self-check ejecutable en `.mjs` que valida el contrato por lectura estatica de archivos, sin dependencias, sin runtime de TypeScript y sin red.

Comandos esperados:

```bash
npm --prefix frontend run build
npm --prefix backend/lia-agent run self-check
node scripts/lia-same-origin-status-adapter-mock-self-check.mjs
grep de terminos bloqueados sobre contrato mock y docs
git diff --check
```

## Siguiente fase recomendada

v4.6.2 debe implementar un local same-origin dev adapter sin deploy. Esa fase debe seguir sin abrir el puerto interno y sin conectar el frontend publico a un endpoint real.
