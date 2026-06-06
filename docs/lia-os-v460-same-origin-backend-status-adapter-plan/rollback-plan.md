# Rollback Plan

## Volver a v4.5.1

Como v4.6.0 es solo documental, volver a v4.5.1 significa no aplicar ningun adapter futuro y conservar la tarjeta actual con fallback seguro.

Acciones:

- No modificar frontend.
- No modificar backend.
- No crear rutas same-origin.
- No abrir puerto 3014.
- Mantener `lia-agent-backend` como servicio interno read-only.

## Si existiera un adapter futuro

Para detenerlo en una fase posterior:

- Detener solo el proceso o ruta del adapter.
- No detener `lia-agent-backend` salvo que el rollback lo indique explicitamente.
- No borrar `/opt/lia-agent-backend`.
- No tocar otros procesos PM2.
- Confirmar que el frontend vuelve a fallback seguro.

## Verificar que 3014 sigue cerrado

Comandos futuros de validacion:

```bash
ss -ltnp | grep 3014
curl -i http://127.0.0.1:3014/health
curl -i http://38.242.222.25:3014/health
```

Resultado esperado:

- `ss` muestra 3014 solo en `127.0.0.1`.
- Health interno responde desde el servidor.
- Health publico por `38.242.222.25:3014` falla o no conecta.

## Conservar backend interno actual

El rollback no debe cambiar:

- `backend/lia-agent/server.mjs`.
- `backend/lia-agent/health.mjs`.
- PM2 `lia-agent-backend`.
- Host local del backend.
- Puerto interno.
- Flags de seguridad apagados.

## Validaciones futuras recomendadas

```bash
npm --prefix frontend run build
npm --prefix backend/lia-agent run self-check
node scripts/lia-agent-backend-verify-internal.mjs
curl -i http://127.0.0.1:3004/api/lia-agent/health
```

La ruta same-origin debe responder solo estado sanitizado. Si no existe o falla, la UI debe conservar fallback seguro.
