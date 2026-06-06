# LIA O.S v4.5.0 - Frontend Read-Only Backend Status Bridge

## Que se agrego

Se agrego una lectura visual segura para mostrar el estado del backend interno dentro del cockpit de LIA.

Incluye:

- Contrato TypeScript para snapshot de salud y view model seguro.
- Cliente frontend que usa una URL runtime opcional desde `globalThis.__LIA_AGENT_BACKEND_HEALTH_URL__`.
- Fallback seguro cuando no hay URL runtime o la lectura falla.
- Self-check local de contrato sin red real.
- Tarjeta compacta "Nucleo operativo de LIA" junto al puente operativo existente.

## Como funciona el fallback

Por defecto no se intenta conectar a ningun servicio. La tarjeta muestra:

- Estado preparado.
- Lectura local.
- Backend interno no enlazado en esta vista.
- Acciones reales apagadas.
- Voz apagada.
- Mensajeria apagada.
- Escritura de memoria apagada.
- Modelos externos apagados.

Si la URL runtime existe y responde con un snapshot seguro, la tarjeta cambia a estado conectado. Si falla o algun flag real llega encendido, regresa a estado seguro sin mostrar errores tecnicos al usuario final.

## Configuracion runtime futura

Una fase posterior podra inyectar la URL con:

```js
globalThis.__LIA_AGENT_BACKEND_HEALTH_URL__ = '/ruta-interna-controlada/health';
```

La URL debe venir del entorno runtime y no debe quedar hardcodeada en el bundle de frontend.

## Que NO hace

- No conecta el frontend a un puerto publico.
- No hardcodea host local con el puerto del backend.
- No conecta directo al servicio interno desde navegador publico.
- No ejecuta acciones reales.
- No activa voz.
- No activa mensajeria real.
- No conecta modelos externos.
- No expone credenciales.
- No cambia comportamiento del backend.
- No usa PM2, deploy ni Nginx.

## Por que no se conecta directo al puerto publico

El backend interno debe permanecer en una frontera privada y controlada. La UI solo puede leer un estado preparado mediante una URL runtime segura. Para exposicion real se requiere una capa same-origin o adaptador interno con permisos, auditoria y bloqueo por defecto.

## Siguiente fase recomendada

v4.5.1 deberia preparar un same-origin proxy interno controlado o un server status adapter read-only, sin habilitar acciones reales ni escribir memoria.
