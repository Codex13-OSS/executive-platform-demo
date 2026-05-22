# Risk Register and Rollout

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Credenciales expuestas | Crítico | No guardar credenciales en repo, usar vault o entorno seguro |
| Permisos excesivos | Alto | Principio de mínimo privilegio |
| Escritura accidental | Crítico | Read-only primero, write gate y confirmación |
| Error de IA | Alto | IA propone, humano aprueba |
| Datos sensibles | Alto | Redacción, permisos y trazabilidad |
| Dependencia de APIs externas | Medio | Fallbacks, estados degradados y mensajes claros |
| Indisponibilidad | Medio | Cache controlado y modo demo seguro |
| Costos variables | Medio | Monitoreo de uso y límites |
| Rate limits | Medio | Colas, reintentos y backoff |
| Seguridad operativa | Alto | Auditoría, roles y revisión periódica |

## Rollout recomendado

1. Documentación.
2. Contratos.
3. Read-only interno.
4. Read-only cliente.
5. Escritura simulada.
6. Escritura controlada.
7. Automatización supervisada.

## Regla de seguridad

Ninguna fase debe avanzar si no existe build OK, revisión de secretos, permisos definidos y rollback lógico.
