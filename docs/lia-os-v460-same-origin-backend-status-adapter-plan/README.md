# LIA O.S v4.6.0 - Same-Origin Backend Status Adapter Plan

## Problema que resuelve

LIA ya muestra en el cockpit una tarjeta read-only del nucleo operativo. Hoy esa tarjeta funciona con fallback seguro y no consume estado real del backend desde el navegador publico.

El problema a resolver en una fase futura es permitir que el frontend lea el estado del backend interno sin exponer el servicio interno ni abrir el puerto 3014 al exterior.

## Por que no se debe abrir 3014 publicamente

El backend `lia-agent-backend` vive como servicio interno y debe permanecer cerrado. Abrir 3014 al publico aumentaria superficie de exposicion, permitiria llamadas directas fuera del control del frontend y romperia la frontera de seguridad definida en v4.4.0.

La lectura de salud debe ocurrir mediante una capa controlada, no por acceso directo al proceso interno.

## Que es un same-origin adapter

Un same-origin adapter es una capa pequena que vive bajo el mismo origen del frontend, por ejemplo una ruta como `/api/lia-agent/health`.

En terminos simples:

- El navegador llama al mismo origen que ya usa la interfaz.
- El adapter consulta internamente el backend cerrado.
- El adapter devuelve una respuesta sanitizada.
- El navegador nunca ve credenciales ni puertos internos.

## Estado actual

- Frontend publico: `http://38.242.222.25:3004`.
- Backend interno: `127.0.0.1:3014`, proceso PM2 `lia-agent-backend`.
- Backend cerrado al publico.
- Tarjeta "Nucleo operativo de LIA" con fallback read-only.
- No hay consumo real de estado backend desde navegador publico.

## Estado futuro esperado

- El frontend llamara a una ruta same-origin controlada.
- La ruta expondra solo estado read-only sanitizado.
- El puerto interno seguira cerrado.
- Si el backend falla, el frontend mantendra fallback seguro.
- No se habilitaran acciones reales.

## Que NO se implementa en esta fase

- No se crea proxy real.
- No se crea servidor nuevo.
- No se modifica frontend.
- No se modifica backend.
- No se toca PM2.
- No se toca Nginx.
- No se abren puertos.
- No se agregan credenciales.
- No se habilitan comandos, voz, mensajeria real, modelos externos ni escritura.

## Siguiente fase recomendada

v4.6.1 debe crear un adapter mock/synthetic contract sin red real, para validar forma de respuesta, fallback y sanitizacion antes de cualquier integracion de servidor.
