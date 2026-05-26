# LÍA O.S. v2.7.0 — Read-Only Connector Real Preparation

v2.7.0 inicia la transición desde preparación visual/controlada hacia preparación realista del primer conector externo read-only de agenda.

## Objetivo

Preparar perfil de conector, esquema de lectura, frontera de adapter, normalización y auditoría sin activar fuente real.

## Estado visible

- Connector profile ready
- Read schema ready
- Adapter boundary ready
- Normalization ready
- Audit boundary ready
- Endpoint locked
- Credentials locked
- Writes blocked

## Qué NO hace

- No conecta APIs reales.
- No configura endpoint real.
- No carga credenciales.
- No agrega backend.
- No escribe datos.
- No ejecuta acciones reales.
- No agrega IA real.
