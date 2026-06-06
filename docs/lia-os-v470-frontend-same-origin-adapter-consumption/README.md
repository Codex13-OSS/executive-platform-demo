# LIA O.S v4.7.0 - Frontend Same-Origin Adapter Consumption

## Que se creo

Esta fase prepara la tarjeta visual "Nucleo operativo de LIA" para consumir una ruta same-origin futura:

```txt
/api/lia-agent/health
```

El frontend usa un cliente seguro en `frontend/src/integrations/liaSameOriginStatusAdapterClient.ts` y mantiene fallback inmediato si la ruta no existe, tarda demasiado, responde mal o no cumple contrato.

## Alcance

- La lectura usa solo ruta relativa same-origin.
- No llama directo al backend interno `3014`.
- No expone puertos en la interfaz.
- No muestra JSON crudo.
- No activa acciones reales.
- No activa voz real.
- No activa canales reales.
- No conecta modelos externos.
- No carga credenciales reales.
- No toca backend, publicacion, gestor de procesos ni proxy web.

## Fallback seguro

La tarjeta arranca siempre en "Lectura segura preparada". Si la ruta same-origin responde con contrato controlado y banderas seguras, muestra "Lectura interna verificada".

Si la ruta falla, no existe, excede el timeout o devuelve una bandera insegura, la tarjeta mantiene un estado protegido sin mostrar detalles tecnicos.

## Validacion

Comandos usados:

```bash
npm --prefix frontend run build
npm --prefix backend/lia-agent run self-check
node scripts/lia-same-origin-status-adapter-mock-self-check.mjs
node scripts/lia-same-origin-dev-adapter-self-check.mjs
node scripts/lia-same-origin-server-internal-adapter-rehearsal-self-check.mjs
node scripts/lia-controlled-same-origin-status-read-self-check.mjs
```

El self-check frontend queda compilado por el build:

```txt
frontend/src/integrations/liaSameOriginStatusAdapterRuntimeSelfCheck.ts
```

Node no ejecuta TypeScript directo sin loader externo en este proyecto, asi que la validacion principal del self-check frontend es `tsc -b` dentro del build.

## Siguiente fase recomendada

v4.7.1 debe ensayar la ruta same-origin en servidor de forma temporal y controlada, sin exponer el backend interno y todavia sin acciones reales.
