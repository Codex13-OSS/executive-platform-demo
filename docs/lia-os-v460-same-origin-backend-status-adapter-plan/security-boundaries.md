# Security Boundaries

## Frontera del backend interno

El servicio `lia-agent-backend` debe permanecer escuchando solo en `127.0.0.1:3014`.

Ese puerto es interno. No debe abrirse al publico ni usarse como destino directo desde el navegador.

## Frontera del navegador

El navegador nunca debe llamar directo a:

- `127.0.0.1:3014`
- `38.242.222.25:3014`

La primera direccion representa el equipo del usuario cuando se evalua desde navegador, no el servidor. La segunda expondria un puerto interno al exterior.

## Frontera del adapter

El adapter debe vivir en el mismo origen del frontend o en un servicio interno controlado que no exponga el puerto 3014.

La ruta publica del adapter debe ser una fachada de lectura, no una ventana al proceso interno.

## Sanitizacion de respuesta

La respuesta del adapter debe ser sanitizada:

- Solo estado de salud.
- Solo flags seguros.
- Sin stack traces.
- Sin rutas internas.
- Sin logs.
- Sin credenciales.
- Sin cabeceras sensibles.
- Sin payloads de usuario.

## Falla segura

Si el backend interno falla:

- El adapter debe reportar estado degradado sin detalles tecnicos.
- El frontend debe usar fallback seguro.
- Las acciones reales deben seguir apagadas.
- La UI no debe bloquearse.

## Capacidades bloqueadas

- No hay acciones reales.
- No hay escritura.
- No hay credenciales.
- No hay modelos externos.
- No hay voz real.
- No hay mensajeria real.
- No hay base de datos.

## Validacion de frontera

En fases futuras se debe validar:

```bash
ss -ltnp | grep 3014
curl -s http://127.0.0.1:3014/health
curl -s http://38.242.222.25:3014/health
curl -s http://127.0.0.1:3004/api/lia-agent/health
```

Resultado esperado:

- `ss` muestra 3014 solo en localhost.
- Health interno responde solo desde servidor.
- Health publico por 3014 no conecta.
- Adapter same-origin responde solo con estado sanitizado.
