# LÍA O.S. v3.2.0 — Agenda Connector Follow-up Actions Layer

## Objetivo

Agregar una siguiente acción sugerida dentro del **Handoff ejecutivo** del Conector de Agenda.

## Qué ve el usuario

Dentro de **Ver detalles**, el bloque Handoff ejecutivo muestra:

- Siguiente acción sugerida
- Mensaje humano breve
- Botón de acción local
- Confirmación local

## Reglas de sugerencia

- Si hay pendientes: `Confirmar responsable`
- Si no hay pendientes y el resumen no está preparado: `Preparar seguimiento`
- Si no hay pendientes y el resumen ya fue preparado: `Cerrar agenda`

## Confirmación

Al marcar la acción:

> Acción marcada en modo seguro.

## Auditoría

Se agrega una línea humana:

- Acciones de seguimiento ejecutadas solo de forma local.

## Límites

- Sin conexión externa
- Sin credenciales reales
- Sin backend nuevo
- Sin escritura real
- Sin persistencia real
- Sin acciones reales
- Sin tarjeta técnica adicional
- Sin tablas
- Sin JSON visible
