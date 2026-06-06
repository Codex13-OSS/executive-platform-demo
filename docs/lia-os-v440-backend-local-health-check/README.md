# LIA O.S v4.4.0-C - Backend Local Health Check

## Que se probo

Se agrego una prueba automatizada local para el backend skeleton de LIA O.S.

La prueba:

- Arranca `backend/lia-agent/server.mjs` como proceso hijo.
- Usa `127.0.0.1` y puerto `3014` por defecto.
- Espera a que `/health` responda.
- Valida `GET /health`.
- Valida `GET /`.
- Valida que `POST /health` responda 405.
- Valida que una ruta desconocida responda 404.
- Valida que las capacidades reales sigan apagadas.
- Apaga el proceso hijo.
- Confirma que el puerto local ya no responde despues del apagado.

## Alcance

Esta fase fue local-only.

No hubo deploy. No se toco PM2. No se abrio puerto publico. No se conecto frontend. No hubo acciones reales, voz real, mensajeria real, modelos externos ni credenciales reales.

## Comando

```bash
npm --prefix backend/lia-agent run local-health-check
```

## Resultado esperado

La salida debe ser JSON:

```json
{
  "ok": true,
  "checks": [],
  "evidence": {
    "host": "127.0.0.1",
    "port": 3014,
    "healthOk": true,
    "postStatus": 405,
    "notFoundStatus": 404,
    "shutdownVerified": true
  }
}
```

## Siguiente fase v4.4.0-D

La siguiente fase sera Server Read-Only Deployment, manteniendo el servicio en modo read-only y con compuertas explicitas antes de cualquier exposicion o integracion real.
