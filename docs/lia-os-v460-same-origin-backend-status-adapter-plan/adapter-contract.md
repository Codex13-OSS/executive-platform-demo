# Adapter Contract

## Endpoint futuro sugerido

```http
GET /api/lia-agent/health
```

## Metodo permitido

Solo `GET`.

No se permite `POST`, `PUT`, `PATCH`, `DELETE` ni ningun metodo que pueda representar comando, escritura o accion.

## Respuesta futura esperada

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
    "whatsappEnabled": false,
    "memoryWriteEnabled": false,
    "externalModelsEnabled": false,
    "secretsLoaded": false
  }
}
```

## Reglas del contrato

- Solo lectura de estado.
- Sin comandos.
- Sin acciones reales.
- Sin escritura de memoria.
- Sin activacion de voz.
- Sin mensajeria real.
- Sin modelos externos.
- Sin credenciales al navegador.
- Sin datos sensibles.
- Sin exponer el puerto interno.

## Comportamiento ante falla

Si el backend interno no responde, el adapter debe devolver una respuesta segura y sanitizada. El frontend debe conservar fallback seguro y no mostrar error tecnico al usuario final.

Ejemplo conceptual:

```json
{
  "ok": false,
  "source": "lia-agent-backend",
  "mode": "read_only_status_adapter",
  "backend": {
    "reachable": false,
    "service": "lia-agent-backend",
    "healthOk": false,
    "version": null
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

## Prohibiciones explicitas

El adapter no debe convertirse en puerta de comandos. No debe recibir instrucciones del usuario, no debe tocar agenda, no debe escribir memoria, no debe ejecutar integraciones y no debe pasar credenciales al cliente.
