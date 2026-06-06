# Recommended Architecture

## Decision

La arquitectura recomendada es crear un runtime same-origin controlado que sirva:

- `frontend/dist`
- `GET /api/lia-agent/health`

Ese runtime debe basarse en el rehearsal v4.7.1, empezar en un puerto alterno de staging local y solo despues de pasar validaciones reemplazar gradualmente `executive-demo-frontend`.

## Principios

- No abrir `3014`.
- Mantener `lia-agent-backend` en `127.0.0.1:3014`.
- El navegador nunca llama directo a `3014`.
- La API publica del runtime es solo `GET /api/lia-agent/health`.
- `POST /api/lia-agent/health` devuelve 405.
- Rutas API desconocidas devuelven 404.
- La respuesta es sanitizada.
- La respuesta usa `Cache-Control: no-store`.
- Los safety flags permanecen en `false`.
- El fallback del frontend sigue existiendo.

## Diagrama textual

```txt
Browser
  -> same-origin frontend/runtime
    -> controlled status read
      -> 127.0.0.1:3014 /health
```

## Flujo esperado

1. El navegador carga LIA desde el runtime same-origin.
2. La tarjeta "Nucleo operativo de LIA" llama `/api/lia-agent/health`.
3. El runtime llama internamente al controlled status read.
4. El controlled status read consulta `127.0.0.1:3014 /health`.
5. La respuesta se normaliza.
6. El navegador recibe solo estado sanitizado.
7. Si algo falla, el frontend conserva fallback seguro.

## Respuesta permitida

La respuesta al navegador debe contener solo:

- `ok`
- `source`
- `mode`
- `backend.reachable`
- `backend.service`
- `backend.healthOk`
- `backend.version`
- safety flags en `false`

No debe incluir:

- Payload raw completo del backend.
- Stack traces.
- Rutas internas adicionales.
- Logs.
- Cabeceras sensibles.
- Credenciales.
- Comandos.

## Activacion gradual

La integracion estable debe avanzar asi:

1. Scaffold productivo sin activacion.
2. Validacion local en servidor en puerto alterno.
3. Preview temporal controlada.
4. Shadow validation contra `3004`.
5. Candidato de switch para `executive-demo-frontend`.

## Condicion de salida

La arquitectura solo esta lista para produccion cuando:

- `frontend/dist` sirve assets correctos.
- `/api/lia-agent/health` responde 200 con contrato sanitizado.
- `POST` responde 405.
- API desconocida responde 404.
- `3014` sigue solo localhost.
- El servicio publico por `3014` no conecta.
- El rollback fue probado antes del switch.
