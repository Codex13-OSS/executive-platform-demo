# QA Checklist v1.7.0

## Scope

- [ ] Capa `readOnlyDataAdapters` creada.
- [ ] Tarjeta compacta actualizada con estados.
- [ ] Integración con `readOnlyFoundation` sin romper contratos previos.
- [ ] Estilos mínimos añadidos.
- [ ] Documentación de fase creada.

## Seguridad

- [ ] Sin APIs reales.
- [ ] Sin credenciales.
- [ ] Sin escritura.
- [ ] Sin backend.

## Validación

- [ ] `npm --prefix frontend run build` OK.
- [ ] Grep de marcas prohibidas limpio.
- [ ] Grep de fetch/axios/endpoints limpio.
- [ ] `git status --short` revisado.

## Siguiente fase sugerida v1.8.0

- Definir contratos de lectura real por conector, manteniendo read-only lock y degradación segura.
