# LIA O.S v4.6.3 - Server Internal Adapter Rehearsal

## Que se creo

Esta fase agrega un rehearsal temporal para ensayar el adapter same-origin dentro del servidor usando el adapter local de v4.6.2 como proceso hijo.

El script principal es:

```bash
node scripts/lia-same-origin-server-internal-adapter-rehearsal.mjs
```

El self-check estatico es:

```bash
node scripts/lia-same-origin-server-internal-adapter-rehearsal-self-check.mjs
```

## Naturaleza temporal

El rehearsal arranca el adapter solo durante la prueba, valida el contrato y apaga el proceso al final. No crea servicio permanente, no cambia configuracion del servidor y no modifica archivos durante la ejecucion.

## Limites de seguridad

- Usa `127.0.0.1`.
- Usa `3124` por defecto.
- No abre puerto publico.
- No conecta el frontend publico.
- No conecta el backend real todavia.
- No llama al puerto interno del backend real.
- No usa gestor de procesos permanente.
- No toca proxy web.
- No ejecuta acciones reales.
- No activa voz real.
- No activa canales reales.
- No conecta modelos externos.
- No carga credenciales reales.
- No usa base de datos.

## Que valida

- `GET /health` responde OK.
- `GET /api/lia-agent/health` responde el contrato mock seguro.
- Todas las banderas de seguridad permanecen apagadas.
- `POST /api/lia-agent/health` responde 405.
- Ruta desconocida responde 404.
- El listener temporal queda limitado a localhost.
- La exposicion por interfaces no locales queda cerrada.
- El frontend local en `3004` queda estable si existe.
- El backend interno en `3014` se revisa solo por listener.
- El puerto temporal queda libre despues del apagado.

## Validacion en servidor

Comando recomendado:

```bash
node scripts/lia-same-origin-server-internal-adapter-rehearsal.mjs
```

El resultado esperado es JSON con:

```json
{
  "ok": true,
  "mode": "server_internal_adapter_rehearsal"
}
```

Para confirmar que el puerto temporal quedo libre:

```bash
ss -ltn | grep ':3124' || true
```

La salida esperada es vacia.

## Siguiente fase recomendada

v4.6.4 debe implementar controlled same-origin status read, solo GET, todavia sin acciones reales.
