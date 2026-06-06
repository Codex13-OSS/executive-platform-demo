# Rollback Plan

## Volver a v4.7.1

v4.8.0 es documental. Volver a v4.7.1 significa no aplicar runtime estable de produccion y conservar solo el rehearsal temporal validado.

Acciones:

- No activar runtime permanente.
- No modificar `executive-demo-frontend`.
- No modificar `lia-agent-backend`.
- No cambiar PM2.
- No cambiar Nginx.
- No abrir `3014`.

## Conservar servicio actual 3004

El servicio publico actual debe permanecer como fuente estable mientras no exista switch aprobado.

Validaciones futuras / no ejecutar en v4.8.0:

```bash
pm2 status executive-demo-frontend
curl -i http://127.0.0.1:3004/
```

Resultado esperado:

- Proceso actual online.
- Frontend responde 200.

## Detener runtime nuevo si existiera

Futuro / no ejecutar en v4.8.0:

```bash
pm2 status
pm2 stop <runtime-candidato>
```

Reglas:

- Detener solo el runtime candidato.
- No detener `lia-agent-backend`.
- No borrar artefactos sin evidencia.
- Confirmar que `3004` sigue respondiendo.

## Verificar que 3014 sigue cerrado

Futuro / no ejecutar en v4.8.0:

```bash
ss -ltnp | grep ':3014' || true
curl -i http://127.0.0.1:3014/health
curl -i http://38.242.222.25:3014/health
```

Resultado esperado:

- `3014` solo aparece en localhost.
- Health interno responde desde servidor.
- Acceso publico por `3014` falla o no conecta.

## Validar PM2 previo

Futuro / no ejecutar en v4.8.0:

```bash
pm2 describe executive-demo-frontend
pm2 describe lia-agent-backend
pm2 logs executive-demo-frontend --lines 50
```

Objetivo:

- Confirmar comandos actuales.
- Confirmar variables visibles no sensibles.
- Confirmar estabilidad antes de cualquier cambio.

## Validacion posterior al rollback

Futuro / no ejecutar en v4.8.0:

```bash
curl -i http://127.0.0.1:3004/
curl -i http://127.0.0.1:3004/api/lia-agent/health
ss -ltnp | grep ':3014' || true
```

Resultado esperado:

- Frontend publico local responde.
- Si la ruta same-origin no existe, la UI conserva fallback seguro.
- `3014` sigue cerrado al exterior.
