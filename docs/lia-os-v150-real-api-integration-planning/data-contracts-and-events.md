# Data Contracts and Events

Este documento define contratos conceptuales. No contiene implementación TypeScript.

## ExecutiveEvent

Campos sugeridos:
- id
- title
- startAt
- endAt
- location
- participants
- priority
- source
- status
- requiresAction

Origen: agenda, CRM, operación.  
Destino: timeline, briefing, motor predictivo.  
Seguridad: no exponer detalles sensibles sin permisos.

## ExecutiveContact

Campos sugeridos:
- id
- displayName
- role
- organization
- channels
- relationshipContext
- source

Origen: contactos, CRM, equipo.  
Destino: seguimiento, agenda, comunicación.  
Seguridad: respetar permisos por canal.

## ExecutiveMessage

Campos sugeridos:
- id
- channel
- direction
- sender
- recipients
- summary
- suggestedReply
- status
- relatedEntityId

Origen: canales autorizados.  
Destino: Dynamic Command Layer, seguimiento.  
Seguridad: enviar solo con confirmación.

## ExecutiveDocument

Campos sugeridos:
- id
- type
- title
- owner
- status
- relatedClient
- version
- source
- nextAction

Origen: documentos internos.  
Destino: panel documental, comandos.  
Seguridad: no emitir ni compartir sin aprobación.

## ExecutiveTask

Campos sugeridos:
- id
- title
- owner
- dueAt
- priority
- status
- source
- riskLevel

Origen: agenda, CRM, operación.  
Destino: seguimiento, alertas, briefing.  
Seguridad: cambios con trazabilidad.

## ExecutiveDecision

Campos sugeridos:
- id
- decision
- context
- options
- selectedOption
- decidedBy
- decidedAt
- auditId

Origen: usuario o comité.  
Destino: bitácora, historial, seguimiento.  
Seguridad: conservar motivo y evidencia.

## ExecutiveRisk

Campos sugeridos:
- id
- title
- severity
- probability
- impact
- source
- mitigation
- owner
- status

Origen: CRM, agenda, operación, IA.  
Destino: panel predictivo y acciones recomendadas.  
Seguridad: no alarmar sin contexto validado.

## AuditEvent

Campos sugeridos:
- id
- actor
- action
- target
- beforeState
- afterState
- confirmationRequired
- confirmationStatus
- timestamp
- source

Origen: toda acción importante.  
Destino: auditoría y rollback lógico.  
Seguridad: inmutable en fases productivas.
