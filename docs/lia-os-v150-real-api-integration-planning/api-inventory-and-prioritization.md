# API Inventory and Prioritization

## P0 — Lectura / bajo riesgo

- Leer eventos de agenda.
- Leer contactos autorizados.
- Leer métricas operativas.
- Leer estados de CRM.
- Leer documentos indexados.
- Leer bitácora de acciones.

Objetivo: enriquecer el contexto sin modificar sistemas externos.

## P1 — Escritura controlada con confirmación

- Crear evento de agenda.
- Crear seguimiento.
- Preparar borrador de mensaje.
- Preparar documento.
- Registrar decisión.
- Programar notificación.

Regla: ninguna escritura P1 debe ejecutarse sin confirmación humana visible.

## P2 — Automatización avanzada

- Generar briefing diario.
- Detectar riesgos y proponer acciones.
- Sugerir cambios de agenda.
- Preparar respuestas.
- Escalar pendientes a responsables.

Regla: la IA propone, el usuario aprueba.

## P3 — Autonomía parcial futura

- Ejecutar rutinas de bajo riesgo.
- Enviar recordatorios internos aprobados.
- Cerrar tareas simples bajo reglas preaprobadas.
- Actualizar estados operativos no críticos.

Regla: autonomía limitada, reversible y auditada.

## Prioridad técnica

La secuencia recomendada es:

1. Read-only.
2. Contratos de datos.
3. Auditoría.
4. Simulación de escritura.
5. Confirmación humana.
6. Escritura real limitada.
7. Automatización supervisada.
