# Integration Scope

## Principio base

Primero lectura. Después escritura simulada. Finalmente escritura real con confirmación humana, permisos y auditoría.

| Dominio | Prioridad | Valor ejecutivo | Riesgo | Dependencia | Confirmación |
|---|---:|---|---|---|---|
| Agenda ejecutiva | P0 | Contexto diario, próximos movimientos, conflictos | Medio | Calendarios autorizados | Sí para crear/modificar |
| Correo y contactos | P0 | Preparación de contexto y seguimiento | Medio | Permisos de lectura | Sí para enviar |
| Canales de comunicación | P1 | Seguimiento operativo y mensajes sugeridos | Alto | Proveedor autorizado | Sí siempre |
| Documentos | P1 | Propuestas, contratos y entregables | Alto | Repositorio documental | Sí para emitir/enviar |
| CRM y seguimientos | P1 | Trazabilidad comercial y pipeline | Medio | Modelo de datos confiable | Sí para escritura |
| Base operativa | P0/P1 | Métricas reales y tableros vivos | Alto | DB/API intermedia | Sí para cambios |
| Notificaciones | P1 | Alertas ejecutivas oportunas | Medio | Canales configurados | Sí en alertas externas |
| Auditoría | P0 | Control, trazabilidad y confianza | Bajo | Modelo de eventos | No para lectura |

## Alcance inicial recomendado

1. Lectura de agenda.
2. Lectura de datos operativos.
3. Lectura de CRM.
4. Generación de recomendaciones sin ejecución.
5. Escritura simulada.
6. Escritura real con confirmación.
