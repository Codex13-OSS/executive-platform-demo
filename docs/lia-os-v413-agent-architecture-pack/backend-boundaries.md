# Backend Boundaries — LÍA O.S.

## Principio

El backend no debe vivir dentro del frontend.

LÍA O.S. debe ser la experiencia visual ejecutiva. El backend debe ser un servicio separado, seguro y auditable.

## Qué no debe hacer el frontend

- Guardar secretos.
- Llamar directo a APIs sensibles.
- Ejecutar acciones reales sin backend.
- Conectarse directo a bases de datos.
- Controlar PM2, servidor, archivos o sistemas externos.
- Manejar tokens de proveedores.
- Ser responsable de auditoría.

## Qué sí debe hacer el frontend

- Mostrar estado ejecutivo.
- Capturar intención del usuario.
- Mostrar confirmaciones.
- Presentar respuestas limpias.
- Mostrar seguimiento, agenda y alertas.
- Operar en modo local cuando el backend no exista.

## Qué deberá hacer el backend futuro

- Recibir comandos.
- Preparar contexto.
- Ejecutar acciones permitidas.
- Pedir aprobación humana cuando aplique.
- Registrar auditoría.
- Mantener memoria operativa.
- Conectarse a WhatsApp, calendario, documentos y agentes.
- Proteger credenciales.

## Regla de seguridad

Toda acción real debe pasar por permisos, logs y confirmación humana si puede afectar a terceros, datos, dinero, agenda real, documentos, mensajes o servidores.
