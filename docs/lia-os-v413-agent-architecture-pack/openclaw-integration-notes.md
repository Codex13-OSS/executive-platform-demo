# OpenClaw Integration Notes

## Posición conceptual

OpenClaw puede evaluarse como posible sistema nervioso ejecutor para LÍA O.S.

LÍA O.S. mantiene la interfaz ejecutiva. OpenClaw o un motor equivalente podría actuar como agente de ejecución separado.

## Reglas antes de integrar

- No instalar en producción sin fase de prueba.
- No exponer credenciales en frontend.
- No abrir puertos públicos sin autorización.
- No conectar WhatsApp real sin gates.
- No habilitar acciones de sistema sin sandbox.
- No ejecutar comandos reales sin auditoría.

## Evaluación futura

Antes de cualquier implementación real se debe documentar:

- Instalación aislada.
- Puertos.
- PM2 separado.
- Logs.
- Health check.
- Permisos.
- Rollback.
- Riesgos.
- Relación con Soluciones Informáticas OPS.

## Estado en v4.1.3

Solo arquitectura documental. Cero implementación.
