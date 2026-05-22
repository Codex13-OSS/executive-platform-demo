# Confirmation, Permissions and Audit

## Acciones que siempre requieren confirmación

- Enviar mensajes.
- Crear o modificar eventos.
- Compartir documentos.
- Cambiar estados comerciales.
- Marcar tareas críticas como completadas.
- Notificar a terceros.
- Ejecutar cualquier acción externa.

## Acciones permitidas en mock

- Simular comando.
- Mostrar recomendación.
- Preparar texto sugerido.
- Actualizar bitácora visual.
- Cambiar estado local de demo.

## Acciones read-only permitidas

- Leer agenda autorizada.
- Leer métricas.
- Leer estados de CRM.
- Leer documentos indexados.
- Leer historial de auditoría.

## Acciones prohibidas sin aprobación

- Escritura en sistemas externos.
- Envío automático a personas.
- Eliminación de datos.
- Cambios irreversibles.
- Uso de credenciales no autorizadas.
- Automatización sin bitácora.

## Roles futuros

- Owner ejecutivo.
- Operador autorizado.
- Revisor.
- Administrador técnico.
- Auditor.
- Integración de sistema.

## Auditoría mínima

Cada acción debe registrar:
- quién la pidió,
- qué se propuso,
- qué se confirmó,
- cuándo ocurrió,
- qué sistema fue afectado,
- resultado,
- posibilidad de rollback lógico.

## Rollback lógico

Cuando una acción no pueda revertirse físicamente, debe existir:
- evento compensatorio,
- nota de corrección,
- trazabilidad,
- responsable,
- motivo.
