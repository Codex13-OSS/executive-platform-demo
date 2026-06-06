# Rollout Plan

## v4.8.1 - Production runtime scaffold, no activation

### Objetivo

Crear el scaffold del runtime productivo same-origin sin arrancarlo como servicio permanente.

### Archivos probables

- Nuevo runtime versionado en `scripts/` o carpeta dedicada.
- Documentacion operacional.
- Self-check estatico y local.

### Validaciones

- Build frontend.
- Self-check backend.
- Self-check same-origin runtime.
- Grep de terminos prohibidos.
- Diff check.

### Rollback

Eliminar o ignorar el scaffold. No hay cambio productivo.

### Que NO se toca

- No se toca `executive-demo-frontend`.
- No se toca PM2.
- No se toca Nginx.
- No se abre `3014`.

## v4.8.2 - Controlled local server validation on Contabo, no public switch

### Objetivo

Ejecutar el runtime en el servidor solo en localhost y validar contrato same-origin contra el entorno real interno.

### Archivos probables

- Script de validacion servidor.
- Checklist de evidencia.

### Validaciones

- Runtime local responde 200.
- `/api/lia-agent/health` responde sanitizado.
- POST devuelve 405.
- API desconocida devuelve 404.
- `3014` sigue localhost.

### Rollback

Apagar el proceso temporal. No se toca produccion.

### Que NO se toca

- No se reemplaza `3004`.
- No se modifica proxy web.
- No se cambia PM2 permanente.

## v4.8.3 - Temporary public preview port, gated, no replacing 3004

### Objetivo

Probar una preview temporal controlada sin reemplazar el frontend publico actual.

### Archivos probables

- Script de preview temporal.
- Gate explicito.
- Docs de validacion.

### Validaciones

- Preview responde.
- Same-origin API responde sanitizada.
- `3004` sigue intacto.
- `3014` sigue cerrado.
- Rollback probado.

### Rollback

Detener preview temporal y confirmar que `3004` sigue respondiendo.

### Que NO se toca

- No se reemplaza `executive-demo-frontend`.
- No se habilitan acciones reales.
- No se agregan credenciales.

## v4.8.4 - Shadow validation against current 3004

### Objetivo

Comparar runtime candidato contra el servicio actual sin cambiar trafico principal.

### Archivos probables

- Script de comparacion.
- Checklist de assets y health.

### Validaciones

- Root HTML comparable.
- Assets principales OK.
- Tarjeta de nucleo mantiene fallback.
- API same-origin candidato OK.
- No hay errores visibles.

### Rollback

Apagar runtime shadow. No hay switch productivo.

### Que NO se toca

- No se corta trafico.
- No se modifica backend.
- No se abre `3014`.

## v4.9.0 - Controlled switch candidate for executive-demo-frontend

### Objetivo

Preparar candidato de cambio controlado para que `executive-demo-frontend` use el runtime same-origin.

### Archivos probables

- Script de switch con gate.
- Script de rollback.
- Evidencia pre/post.

### Validaciones

- Estado actual respaldado.
- Runtime candidato OK.
- API same-origin OK.
- `3004` responde despues del cambio.
- Rollback ensayado.

### Rollback

Restaurar `executive-demo-frontend` al comando anterior y confirmar UI publica.

### Que NO se toca

- No se habilitan acciones reales.
- No se agregan modelos externos.
- No se cambia backend real.

## v5.0.0 - Executive Preview / no-beta release candidate

### Objetivo

Cerrar candidato de release ejecutivo con same-origin estable y sin lenguaje beta.

### Archivos probables

- Docs de release.
- Checklist final.
- Evidencia de seguridad.

### Validaciones

- UI publica.
- API same-origin.
- Fallback.
- Rollback.
- Puertos.
- Logs sin datos sensibles.

### Rollback

Volver al runtime estable anterior o al servicio estatico previo.

### Que NO se toca

- No se agregan acciones reales.
- No se abren canales reales.
- No se habilita escritura.
