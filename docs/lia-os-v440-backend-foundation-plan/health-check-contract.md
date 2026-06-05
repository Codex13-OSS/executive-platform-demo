# Health Check Contract

## Ruta futura

`GET /health`

## Respuesta esperada

El health check deberá responder un objeto seguro con:

- ok: true
- service: lia-agent-backend
- mode: read_only_foundation
- version: v4.4.0
- realActionsEnabled: false
- voiceEnabled: false
- whatsappEnabled: false
- memoryWriteEnabled: false
- externalModelsEnabled: false

## Reglas

- No debe requerir credenciales.
- No debe revelar secretos.
- No debe conectar servicios externos.
- No debe escribir datos.
- No debe depender del frontend.
- Debe responder localmente primero.

## Validación futura

Antes de conectarlo al frontend se debe validar:

- HTTP local OK.
- PM2 online.
- Logs sin secretos.
- Puerto correcto.
- No hay acciones reales activadas.
