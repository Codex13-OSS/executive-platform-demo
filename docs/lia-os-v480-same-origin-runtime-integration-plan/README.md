# LIA O.S v4.8.0 - Same-Origin Runtime Integration Plan

## Problema que resuelve

v4.8.0 define como convertir el rehearsal same-origin en una integracion estable de produccion sin ejecutar el cambio todavia.

El problema actual es claro: la tarjeta "Nucleo operativo de LIA" ya intenta leer `/api/lia-agent/health` por ruta relativa, pero el servicio publico actual del frontend todavia no sirve esa ruta. Al mismo tiempo, el backend interno en `127.0.0.1:3014` debe seguir cerrado.

Esta fase documenta la arquitectura, gates, rollout, rollback y checklist para hacer ese cambio con control operacional.

## Lo que ya se logro

- v4.5.0 agrego la tarjeta visual de estado del nucleo operativo.
- v4.5.1 pulio copy y jerarquia visual.
- v4.6.0 documento la frontera same-origin.
- v4.6.1 creo contrato mock y self-check.
- v4.6.2 creo un adapter local de desarrollo.
- v4.6.3 ensayo un adapter interno temporal.
- v4.6.4 preparo lectura controlada y sanitizada del health interno.
- v4.7.0 preparo el frontend para consumir `/api/lia-agent/health` con fallback seguro.
- v4.7.1 valido un runtime temporal que sirve `frontend/dist` y la API same-origin en localhost.

## Por que no activar produccion permanente todavia

Todavia falta decidir el modelo operacional estable:

- Si se conserva el servicio publico actual en `3004`.
- Si se sustituye por un runtime Node propio.
- Si se introduce una capa controlada entre frontend y backend interno.
- Como se hara rollback sin interrumpir la demo publica.
- Como se validara que `3014` siga cerrado.
- Como se evitara exponer payloads internos del backend.

Activar produccion sin estos pasos aumentaria riesgo de exposicion, regresion visual y rollback confuso.

## Que significa same-origin runtime

En terminos simples, un same-origin runtime es un servidor que entrega dos cosas bajo el mismo origen:

- El frontend estatico de LIA.
- La ruta `/api/lia-agent/health`.

El navegador llama al mismo host y puerto donde carga la interfaz. Ese runtime consulta internamente el estado del backend y devuelve solo una respuesta sanitizada.

## Que NO se implementa en esta fase

- No se cambia frontend.
- No se cambia backend.
- No se crea runtime permanente.
- No se cambia PM2.
- No se cambia Nginx.
- No se hace deploy.
- No se abren puertos.
- No se agregan credenciales.
- No se habilitan acciones reales.
- No se habilita voz real.
- No se habilita mensajeria real.
- No se conectan modelos externos.
- No se agrega base de datos.

## Siguiente paso recomendado

v4.8.1 debe crear un scaffold productivo del runtime same-origin sin activarlo. Debe quedar versionado, validable y reversible, pero sin reemplazar el servicio actual `executive-demo-frontend`.
