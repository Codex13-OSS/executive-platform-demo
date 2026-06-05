# Server Boundaries

## Alcance permitido futuro

El backend inicial podrá responder health check, devolver estado read-only, mostrar versión, indicar que acciones reales están bloqueadas, registrar logs mínimos seguros y validar que no hay credenciales expuestas.

## Alcance bloqueado

El backend inicial NO debe enviar WhatsApp, activar voz, ejecutar comandos del sistema, escribir archivos de usuario, modificar agenda real, llamar modelos externos, cargar credenciales reales, tocar ADEIN, tocar LÍA pagaré, tocar otros servicios PM2, tocar Nginx ni tocar bases de datos.

## Separación

El backend debe vivir separado del frontend.

Ruta sugerida futura en servidor:

`/opt/lia-agent-backend`

PM2 sugerido futuro:

`lia-agent-backend`

Puerto sugerido futuro:

`3014`

El puerto debe validarse antes de usarse.
