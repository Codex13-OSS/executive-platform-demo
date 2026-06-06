# Implementation Roadmap

## v4.6.1 - Adapter mock/synthetic contract

Crear contrato sintetico sin red real.

Objetivo:

- Validar shape de `/api/lia-agent/health`.
- Validar sanitizacion.
- Validar fallback de frontend sin cambiar lectura productiva.
- Sin deploy.
- Sin PM2.
- Sin puerto nuevo.

Entregable:

- Datos sinteticos versionados.
- Self-check de contrato.
- Documentacion de criterios de seguridad.

## v4.6.2 - Local same-origin dev adapter

Crear rehearsal local para simular una ruta same-origin sin despliegue.

Objetivo:

- Probar comportamiento de GET.
- Confirmar que no hay POST ni comandos.
- Confirmar fallback cuando el backend no responde.
- Mantener 3014 cerrado.

Entregable:

- Adapter local de desarrollo.
- Prueba local automatizada.
- Sin cambios productivos.

## v4.6.3 - Server internal adapter rehearsal

Preparar rehearsal en servidor sin abrir puerto publico.

Objetivo:

- Validar que el adapter puede consultar `lia-agent-backend` por localhost.
- Validar respuesta sanitizada.
- Validar que el puerto 3014 siga privado.
- No conectar frontend publico todavia.

Entregable:

- Script de verificacion interna.
- Plan de rollback.
- Evidencia de frontera local-only.

## v4.6.4 - Controlled same-origin status read

Activar lectura controlada solo para estado.

Objetivo:

- Exponer `GET /api/lia-agent/health` bajo mismo origen.
- Mantener solo GET.
- Mantener backend interno cerrado.
- Conservar fallback seguro.

Entregable:

- Adapter read-only.
- Validacion de GET, 405 para POST y sanitizacion.
- Observabilidad minima sin datos sensibles.

## v4.7.0 - Frontend consume same-origin adapter

Conectar la tarjeta del cockpit al adapter same-origin.

Objetivo:

- Inyectar URL runtime segura.
- Mantener fallback.
- No activar acciones reales.
- No exponer errores tecnicos.

Entregable:

- UI de estado real read-only.
- Self-check frontend.
- Evidencia de que no hay acceso directo al puerto interno.
