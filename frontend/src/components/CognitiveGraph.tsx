import { useMemo, useState } from 'react';

type GraphNode = {
  id: string;
  label: string;
  short: string;
  x: number;
  y: number;
  depth: 'front' | 'mid' | 'back';
  status: 'stable' | 'active' | 'risk' | 'priority';
  detail: string;
  actions: string[];
};

const nodes: GraphNode[] = [
  {
    id: 'agenda',
    label: 'Agenda',
    short: 'AG',
    x: 22,
    y: 38,
    depth: 'mid',
    status: 'active',
    detail: '2 reuniones requieren contexto previo y briefing ejecutivo.',
    actions: ['Generar briefing', 'Cruzar documentos', 'Preparar minuta'],
  },
  {
    id: 'riesgos',
    label: 'Riesgos',
    short: 'RI',
    x: 37,
    y: 22,
    depth: 'front',
    status: 'risk',
    detail: '3 señales requieren validación antes de ejecutar decisiones críticas.',
    actions: ['Priorizar alerta', 'Solicitar validación', 'Crear seguimiento'],
  },
  {
    id: 'contexto',
    label: 'Contexto',
    short: 'CX',
    x: 62,
    y: 20,
    depth: 'back',
    status: 'stable',
    detail: 'Información de operación, documentos y agenda enlazada al núcleo.',
    actions: ['Actualizar contexto', 'Ver dependencias', 'Recalcular prioridad'],
  },
  {
    id: 'decisiones',
    label: 'Decisiones',
    short: 'DE',
    x: 78,
    y: 39,
    depth: 'front',
    status: 'priority',
    detail: '4 decisiones dependen de agenda, riesgos y documentos activos.',
    actions: ['Preparar decisión', 'Ver responsables', 'Crear aprobación'],
  },
  {
    id: 'operacion',
    label: 'Operación',
    short: 'OP',
    x: 76,
    y: 68,
    depth: 'mid',
    status: 'active',
    detail: 'Cadencia operativa estable con actualización de actividad reciente.',
    actions: ['Ver estado', 'Medir avance', 'Abrir bitácora'],
  },
  {
    id: 'documentos',
    label: 'Documentos',
    short: 'DO',
    x: 54,
    y: 80,
    depth: 'front',
    status: 'active',
    detail: '12 documentos detectados; 4 generados por LÍA esta sesión.',
    actions: ['Generar documento', 'Revisar pendientes', 'Crear reporte'],
  },
  {
    id: 'seguimiento',
    label: 'Seguimiento',
    short: 'SE',
    x: 30,
    y: 72,
    depth: 'mid',
    status: 'stable',
    detail: 'Procesos activos con trazabilidad y avance visible para dirección.',
    actions: ['Abrir tareas', 'Actualizar avance', 'Notificar responsable'],
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    short: 'FI',
    x: 18,
    y: 63,
    depth: 'back',
    status: 'priority',
    detail: 'Indicadores financieros listos para correlación ejecutiva.',
    actions: ['Ver resumen', 'Cruzar operación', 'Preparar reporte'],
  },
];

const relatedLinks = [
  ['agenda', 'riesgos'],
  ['agenda', 'seguimiento'],
  ['riesgos', 'decisiones'],
  ['contexto', 'decisiones'],
  ['contexto', 'documentos'],
  ['decisiones', 'operacion'],
  ['operacion', 'documentos'],
  ['documentos', 'seguimiento'],
  ['seguimiento', 'finanzas'],
  ['finanzas', 'agenda'],
] as const;

const statusLabels = {
  stable: 'Estable',
  active: 'Activo',
  risk: 'Riesgo',
  priority: 'Prioridad',
};

export function CognitiveGraph() {
  const [activeId, setActiveId] = useState('riesgos');

  const activeNode = useMemo(
    () => nodes.find((node) => node.id === activeId) ?? nodes[0],
    [activeId]
  );

  const activeLinks = useMemo(
    () => relatedLinks.filter(([from, to]) => from === activeId || to === activeId),
    [activeId]
  );

  const isLinked = (id: string) =>
    id === activeId || activeLinks.some(([from, to]) => from === id || to === id);

  return (
    <section className="cognitive-premium-panel">
      <div className="cognitive-premium-head">
        <div>
          <p className="eyebrow">MAPA COGNITIVO EJECUTIVO</p>
          <h3>Núcleo de decisión vivo</h3>
        </div>
        <div className="cognitive-live-chip">
          <span />
          Sincronía activa
        </div>
      </div>

      <div className="cognitive-premium-body">
        <div className="cognitive-orbital-stage" aria-label="Mapa cognitivo interactivo">
          <div className="cognitive-depth-field" aria-hidden="true" />
          <div className="cognitive-orbit orbit-a" aria-hidden="true" />
          <div className="cognitive-orbit orbit-b" aria-hidden="true" />
          <div className="cognitive-orbit orbit-c" aria-hidden="true" />

          <svg className="cognitive-link-layer" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <linearGradient id="premiumLink" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(125,211,252,.08)" />
                <stop offset="50%" stopColor="rgba(125,211,252,.72)" />
                <stop offset="100%" stopColor="rgba(56,189,248,.08)" />
              </linearGradient>
              <filter id="linkGlow">
                <feGaussianBlur stdDeviation="0.55" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {relatedLinks.map(([from, to]) => {
              const a = nodes.find((node) => node.id === from)!;
              const b = nodes.find((node) => node.id === to)!;
              const active = from === activeId || to === activeId;
              const cx = (a.x + b.x) / 2 + (active ? 0 : 2);
              const cy = (a.y + b.y) / 2 - (active ? 10 : 4);

              return (
                <path
                  key={`${from}-${to}`}
                  d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
                  className={active ? 'premium-link active' : 'premium-link'}
                  filter={active ? 'url(#linkGlow)' : undefined}
                />
              );
            })}
          </svg>

          <button
            type="button"
            className="cognitive-core-orb"
            onClick={() => setActiveId('riesgos')}
            aria-label="LÍA Core"
          >
            <span className="core-inner-glow" />
            <strong>LÍA Core</strong>
            <small>active intelligence</small>
          </button>

          {nodes.map((node, index) => (
            <button
              key={node.id}
              type="button"
              className={[
                'cognitive-premium-node',
                `depth-${node.depth}`,
                `node-${node.status}`,
                activeId === node.id ? 'active' : '',
                isLinked(node.id) ? 'linked' : 'dimmed',
              ].join(' ')}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                animationDelay: `${index * 0.18}s`,
              }}
              onClick={() => setActiveId(node.id)}
            >
              <span className="node-ring" />
              <strong>{node.short}</strong>
              <em>{node.label}</em>
            </button>
          ))}
        </div>

        <aside className="cognitive-context-panel">
          <div className="context-head">
            <span className={`context-status ${activeNode.status}`}>
              {statusLabels[activeNode.status]}
            </span>
            <h4>{activeNode.label}</h4>
          </div>

          <p>{activeNode.detail}</p>

          <div className="context-metrics">
            <div>
              <span>Conexiones</span>
              <strong>{activeLinks.length}</strong>
            </div>
            <div>
              <span>Prioridad</span>
              <strong>{activeNode.status === 'risk' ? 'Alta' : 'Media'}</strong>
            </div>
          </div>

          <div className="context-actions">
            {activeNode.actions.map((action) => (
              <button type="button" key={action}>
                {action}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
