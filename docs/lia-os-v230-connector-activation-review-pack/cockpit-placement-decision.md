# Cockpit Placement Decision

## Ubicación

La tarjeta Connector Activation Review se coloca después de Read-Only Source Stack.

## Motivo

Read-Only Source Stack resume el pipeline actual. Connector Activation Review muestra el siguiente paso controlado: preparar la revisión humana antes de cualquier activación real.

## Principio

Avanzar hacia integración real sin activar fuentes reales, credenciales, endpoints, backend o escritura.
