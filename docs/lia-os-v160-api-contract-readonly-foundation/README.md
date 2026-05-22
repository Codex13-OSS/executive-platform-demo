# LÍA O.S. v1.6.0 — API Contract & Read-Only Integration Foundation

Esta fase agrega una base técnica interna para preparar futuras integraciones reales en modo seguro.

## Qué agrega

- Contratos TypeScript para snapshots ejecutivos read-only.
- Guardrails explícitos: escritura deshabilitada, APIs reales desconectadas y credenciales no requeridas.
- Adapter mock read-only.
- Self-check local.
- Tarjeta compacta visible en el cockpit.
- Documentación técnica y checklist QA.

## Límites

- No conecta APIs reales.
- No usa credenciales.
- No crea backend real.
- No ejecuta escritura.
- No modifica auth ni deploy.
