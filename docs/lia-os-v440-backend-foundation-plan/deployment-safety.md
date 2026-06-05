# Deployment Safety

## Antes de instalar

Verificar:

- Node disponible.
- npm disponible.
- PM2 disponible.
- puerto sugerido libre.
- ruta /opt/lia-agent-backend inexistente o controlada.
- servicios actuales vivos.
- sin cambios pendientes en /opt/executive-platform-demo.

## Reglas de deploy futuro

- No tocar executive-demo-frontend.
- No tocar puerto 3004.
- No tocar ADEIN.
- No tocar bases de datos.
- No tocar Nginx.
- No instalar credenciales.
- No abrir puertos públicos sin autorización.

## Rollback futuro

Si el servicio falla:

1. detener PM2 del backend nuevo,
2. conservar frontend 3004 intacto,
3. revisar logs,
4. no insistir con puertos públicos,
5. volver a modo frontend-only.

## Evidencia requerida

Cada fase futura debe registrar HEAD, tag, puerto, PM2 status, health check local, status git y servicios vivos.
