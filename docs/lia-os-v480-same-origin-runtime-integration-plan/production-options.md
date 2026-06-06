# Production Options

## Resumen

Hay tres rutas viables para llevar `/api/lia-agent/health` a produccion sin abrir `3014`.

La recomendacion general es avanzar por etapas: primero scaffold sin activacion, luego validacion local en servidor, luego preview temporal, y solo despues considerar el reemplazo gradual de `executive-demo-frontend`.

## Opcion A - Mantener serve frontend/dist y agregar proxy web controlado

### Ventajas

- Conserva el modelo actual del frontend publico.
- Menor cambio sobre el proceso Node que ya sirve assets.
- La ruta API se podria delegar a una capa de proxy web existente.
- Rollback potencialmente simple si el proxy se desactiva.

### Riesgos

- El proxy web se vuelve parte critica de seguridad.
- Una regla mal aplicada podria exponer mas rutas de las necesarias.
- Requiere extrema precision para permitir solo `GET /api/lia-agent/health`.
- Puede mezclar configuracion de infraestructura con logica de sanitizacion.

### Impacto operacional

- Cambios sobre configuracion de proxy web.
- Requiere validacion cuidadosa de headers, metodos y rutas.
- Requiere respaldo previo de configuracion actual.

### Complejidad

Media. La parte tecnica puede ser corta, pero el riesgo esta en la frontera de red.

### Rollback

Volver a la configuracion previa del proxy web y conservar `executive-demo-frontend` como estaba.

### Recomendacion

No usar como primer paso estable. Puede ser util mas adelante si se decide que el proxy web es la capa oficial de same-origin, pero antes debe existir rehearsal completo y rollback probado.

## Opcion B - Reemplazar serve frontend/dist por runtime Node same-origin propio

### Ventajas

- Une frontend y `/api/lia-agent/health` en un solo origen controlado.
- Permite versionar la logica de sanitizacion junto al repo.
- Reduce dependencia de reglas externas para la ruta API.
- Replica directamente lo validado en v4.7.1.

### Riesgos

- Cambia el proceso que sirve la demo publica.
- Requiere pruebas de assets, cache, rutas SPA y fallback.
- Si se activa sin shadow validation, podria afectar la interfaz publica.

### Impacto operacional

- Requiere nuevo runtime productivo versionado.
- Requiere candidato de reemplazo gradual para `executive-demo-frontend`.
- Requiere monitoreo del proceso y rollback claro.

### Complejidad

Media-alta. Es la ruta mas coherente con el rehearsal, pero debe activarse con fases.

### Rollback

Detener el nuevo runtime y restaurar el proceso actual `executive-demo-frontend` apuntando al servicio anterior en `3004`.

### Recomendacion

Opcion preferida, siempre que se implemente primero en puerto alterno de staging local y despues como shadow runtime antes de reemplazar `3004`.

## Opcion C - Mantener frontend en 3004 y exponer segundo servicio interno detras de ruta controlada

### Ventajas

- Mantiene el frontend publico actual con pocos cambios.
- Aisla el status read en un servicio interno dedicado.
- Permite validar el servicio interno sin tocar el frontend publico.

### Riesgos

- Todavia se necesita una capa que una el segundo servicio con la ruta same-origin.
- Puede derivar en dos procesos y una frontera operacional mas compleja.
- Si se expone el segundo servicio directamente, se pierde el objetivo de same-origin seguro.

### Impacto operacional

- Nuevo proceso interno.
- Nueva validacion de listeners.
- Mas piezas que monitorear.

### Complejidad

Media. Facil de ensayar, pero puede volverse mas dificil de operar.

### Rollback

Detener solo el segundo servicio interno y conservar frontend `3004` sin cambios.

### Recomendacion

Buena opcion de transicion o shadow validation. No debe ser la arquitectura final si obliga a mantener demasiadas piezas.

## Recomendacion final

Avanzar con la opcion B como destino preferido, usando la opcion C como paso de transicion si se necesita validar internamente antes de sustituir `executive-demo-frontend`.

La opcion A queda como alternativa solo si se decide que el proxy web sera la frontera oficial de same-origin.
