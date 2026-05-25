# CSS Debt and Style Consolidation

## Estado actual

global.css ha crecido con bloques específicos por versión y por tarjeta. Esto ha permitido avanzar rápido sin romper visuales previos.

## Riesgo

Si se siguen agregando tarjetas con estilos completos independientes, el archivo global puede volverse difícil de mantener.

## Recomendación gradual

1. No refactorizar estilos masivamente todavía.
2. Identificar patrones comunes:
   - card shell
   - head
   - grid metrics
   - chip strip
   - mini flow
   - locked glow
3. Crear una capa visual compartida en una fase específica.
4. Mantener clases legacy hasta verificar visualmente.

## Próximo paso sugerido

En v2.2.0, usar composición y clases compartidas ligeras para el Read-Only Source Stack sin reescribir todo el CSS existente.
