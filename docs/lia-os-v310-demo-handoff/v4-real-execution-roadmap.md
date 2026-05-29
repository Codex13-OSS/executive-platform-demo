# LÍA O.S. v4.0 — Real Execution Layer Roadmap

## Objetivo

Pasar de demo visual a sistema funcional.

La prioridad ya no es rediseñar.

La prioridad es que LÍA haga cosas reales.

## Módulo 1 — Agenda 24 horas real

Objetivo:

Representar el día completo en bloques de tiempo.

Debe permitir:

- Crear eventos.
- Ver horas libres.
- Ver horas ocupadas.
- Preparar contexto por evento.
- Recordar pendientes antes de cada evento.
- Marcar eventos como completados o no completados.

## Módulo 2 — Recordatorios y alertas reales

Objetivo:

Que LÍA pueda avisar cuando algo requiere atención.

Debe permitir:

- Recordatorios internos.
- Alertas por agenda.
- Alertas por pendiente vencido.
- Alertas por falta de confirmación.
- Futuro: avisos por WhatsApp o correo.

## Módulo 3 — Tareas y seguimiento

Objetivo:

Que LÍA recuerde responsables y avances.

Debe permitir:

- Crear tarea.
- Asignar responsable.
- Definir fecha.
- Registrar avance.
- Cerrar tarea.
- Mostrar riesgos abiertos.

## Módulo 4 — Documentos

Objetivo:

Preparar documentos ejecutivos y legales con contexto.

Debe permitir:

- Crear resumen.
- Preparar minuta.
- Preparar checklist.
- Preparar documento base.
- Futuro: exportar Word/PDF.

## Módulo 5 — Voz / asistente tipo Alexa

Objetivo:

Permitir interacción por voz cuando el usuario no quiere usar la interfaz.

Debe permitir en fases:

- Capturar comando de voz.
- Convertir voz a texto.
- Ejecutar intención segura.
- Confirmar antes de acciones críticas.
- Responder en voz.

## Módulo 6 — Conectores reales

Objetivo:

Conectar fuentes reales en modo seguro.

Posibles conectores:

- Calendario.
- Contactos.
- Correo.
- WhatsApp.
- Documentos.
- Obsidian o base de conocimiento.
- CRM.
- Sistemas internos.

## Regla de seguridad

Cada conector debe empezar en modo read-only.

Nada de escritura real sin aprobación humana.

## Orden recomendado

1. Agenda 24 horas local/mock funcional.
2. Persistencia local.
3. Recordatorios internos.
4. Tareas/seguimiento funcional.
5. Documentos/resúmenes.
6. Voz local controlada.
7. Conectores read-only.
8. Acciones reales con aprobación humana.
