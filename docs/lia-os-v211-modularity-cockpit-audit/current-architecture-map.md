# Current Architecture Map

## Capas actuales

1. Read-Only Foundation
   - Base de seguridad, modo readonly, fuentes mock y writes disabled.

2. Read-Only Data Adapter Simulation
   - Simulación por dominios, estados de fuente y preparación de adapters.

3. Cognitive Brain Data Bus
   - Malla interna de señales, dominios conectados, riesgo y comandos sugeridos.

4. Read-Only Connector Contract
   - Contrato de conector externo de agenda, permisos de lectura y operaciones bloqueadas.

5. Source Runtime Rehearsal
   - Ensayo de runtime, normalización de lecturas, impactos al Brain Bus y audit safe.

6. Source Handshake
   - Preparación de handshake, permission envelope, gates bloqueados y aprobación requerida.

## Lectura arquitectónica

La separación por archivos de integración y componentes indica una evolución modular correcta. El problema emergente es la presentación simultánea de todas las capas en el cockpit.
