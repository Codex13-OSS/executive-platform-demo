# LIA O.S v4.7.1 - Server Same-Origin Adapter Runtime Rehearsal

## Que se creo

Esta fase agrega un runtime rehearsal temporal que sirve el build estatico del frontend y expone, en el mismo origen local, la ruta:

```txt
GET /api/lia-agent/health
```

El runtime usa el controlled status read de v4.6.4 como proceso hijo temporal. La respuesta de la API queda sanitizada antes de entregarse al navegador.

## Naturaleza del rehearsal

Este flujo es solo una prueba controlada. No reemplaza produccion, no crea proceso permanente, no cambia configuracion del servidor y no modifica el frontend ni el backend real.

Por defecto escucha en:

```txt
127.0.0.1:3324
```

El adapter controlado hijo usa un puerto local separado, por defecto:

```txt
127.0.0.1:3224
```

## Limites de seguridad

- No usa gestor de procesos.
- No usa proxy web.
- No abre `3014`.
- No expone el backend interno.
- No activa acciones reales.
- No activa voz real.
- No activa canales reales.
- No conecta modelos externos.
- No carga credenciales reales.
- No usa base de datos.

## Comandos

Self-check completo:

```bash
node scripts/lia-server-same-origin-adapter-runtime-rehearsal-self-check.mjs
```

Rehearsal principal:

```bash
node scripts/lia-server-same-origin-adapter-runtime-rehearsal.mjs
```

## Validacion en servidor

Antes del rehearsal, generar el build:

```bash
npm --prefix frontend run build
```

Luego ejecutar:

```bash
node scripts/lia-server-same-origin-adapter-runtime-rehearsal.mjs
```

El resultado esperado es JSON con:

```json
{
  "ok": true,
  "mode": "server_same_origin_adapter_runtime_rehearsal"
}
```

Para confirmar que el puerto temporal quedo libre:

```bash
ss -ltn | grep ':3324' || true
```

La salida esperada es vacia.

## Siguiente fase recomendada

v4.7.2 puede preparar una preview temporal controlada de ruta publica, sin cambiar produccion permanente.

v4.8.0 puede documentar el plan de integracion same-origin estable para produccion.
