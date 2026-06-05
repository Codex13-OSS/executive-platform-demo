# LÍA O.S v4.3.0 - Agent Bridge Contract

v4.3.0 agrega el contrato local del puente operativo de LÍA. La fase prepara tipos, estado, permisos y revisión interna para que el producto pueda crecer hacia un backend futuro sin activar acciones reales hoy.

## Qué se agregó

- Contratos TypeScript para modos, estado, permisos, intenciones, riesgo, comandos, respuestas y snapshot del puente.
- Runtime local bloqueado con estado fijo en `local_locked`.
- Revisión interna que confirma que transporte, backend, voz, WhatsApp, acciones reales y escritura de memoria siguen apagados.
- Tarjeta compacta en el cockpit con estado humano y checklist de seguridad.

## Por qué no conecta backend todavía

Esta versión solo deja preparado el acuerdo de datos entre la interfaz y una capa futura. Mantenerlo bloqueado evita activar efectos reales antes de tener aprobaciones humanas, control de permisos, auditoría y reglas de salida.

## Qué queda preparado

- Lectura segura de agenda.
- Sugerencias de agenda sin ejecución real.
- Lectura y preparación de memoria.
- Preparación de WhatsApp y voz.
- Lectura de estado operativo.
- Validaciones locales para asegurar que el puente no salga de modo bloqueado.

## Que sigue en v4.4.0

- Definir compuertas humanas por intención.
- Separar permisos por rol ejecutivo.
- Agregar bitácora local visible para acciones preparadas.
- Diseñar el contrato de salida para un backend futuro, manteniendo bloqueo por defecto.

## Reglas de seguridad

- Sin transporte real.
- Sin acciones reales.
- Sin escritura de memoria.
- Sin voz activa.
- Sin WhatsApp activo.
- Sin credenciales en frontend.
- Toda acción futura debe requerir confirmación humana.
