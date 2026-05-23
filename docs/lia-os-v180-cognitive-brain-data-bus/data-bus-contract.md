# Data Bus Contract

Snapshot principal:

- `generatedAt`
- `mode: mock_cognitive_bus`
- `writesEnabled: false`
- `realApisConnected: false`
- `sourceDomains`
- `brainSignals`
- `prioritySignals`
- `commandSuggestions`
- `graphPulse`
- `degradedDomains`
- `safeToRender`
- `nextEvolutionStep`

Validación:

- `validateExecutiveCognitiveBrainDataBusSnapshot()` confirma guardrails read-only y consistencia de dominios/señales.
