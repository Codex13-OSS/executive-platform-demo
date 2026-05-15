type Node = { id: string; label: string; x: number; y: number; layer: 1 | 2 };

const nodes: Node[] = [
  { id: 'agenda', label: 'Agenda', x: 50, y: 14, layer: 2 },
  { id: 'seguimiento', label: 'Seguimiento', x: 76, y: 24, layer: 1 },
  { id: 'documentos', label: 'Documentos', x: 86, y: 50, layer: 2 },
  { id: 'alertas', label: 'Alertas', x: 74, y: 78, layer: 1 },
  { id: 'decisiones', label: 'Decisiones', x: 50, y: 88, layer: 2 },
  { id: 'contexto', label: 'Contexto', x: 25, y: 76, layer: 1 },
  { id: 'riesgos', label: 'Riesgos', x: 14, y: 49, layer: 2 },
  { id: 'reportes', label: 'Reportes', x: 24, y: 24, layer: 1 },
];

export function CognitiveGraph() {
  return (
    <section className="cognitive-panel-v2" aria-label="Mapa Cognitivo Ejecutivo">
      <header className="cognitive-title-row">
        <div>
          <p className="eyebrow">MAPA COGNITIVO EJECUTIVO</p>
          <h3>Neural Command Graph</h3>
        </div>
        <span className="cognitive-badge">Núcleo en sincronía</span>
      </header>

      <div className="cognitive-body-v2">
        <div className="cognitive-viewport">
          <svg className="cognitive-svg" viewBox="0 0 100 100" role="img" aria-label="LIA Core conectando áreas ejecutivas">
            <defs>
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(224,242,254,0.95)" />
                <stop offset="45%" stopColor="rgba(56,189,248,0.8)" />
                <stop offset="100%" stopColor="rgba(2,6,23,0)" />
              </radialGradient>
            </defs>

            <ellipse cx="50" cy="50" rx="34" ry="19" className="ring ring-far" />
            <ellipse cx="50" cy="50" rx="28" ry="15" className="ring ring-mid" />

            {nodes.map((node, idx) => (
              <g key={node.id}>
                <path d={`M 50 50 Q ${(50 + node.x) / 2} ${(42 + node.y) / 2} ${node.x} ${node.y}`} className="curve-link" />
                <circle r="0.7" className="curve-pulse">
                  <animateMotion
                    dur={`${2.8 + (idx % 4) * 0.75}s`}
                    repeatCount="indefinite"
                    path={`M 50 50 Q ${(50 + node.x) / 2} ${(42 + node.y) / 2} ${node.x} ${node.y}`}
                  />
                </circle>
              </g>
            ))}

            <g className="node-core" transform="translate(50 50)">
              <circle r="10" fill="url(#coreGlow)" />
              <circle r="6.6" className="core-inner" />
              <text y="0.8">LÍA Core</text>
            </g>

            {nodes.map((node) => (
              <g key={`${node.id}-node`} transform={`translate(${node.x} ${node.y})`} className={`orbit-node l-${node.layer}`}>
                <circle r={node.layer === 1 ? 3.9 : 3.2} />
                <text y={node.layer === 1 ? 8 : 7.5}>{node.label}</text>
              </g>
            ))}
          </svg>
        </div>

        <aside className="cognitive-insights-v2">
          <p>3 nodos críticos requieren validación humana.</p>
          <p>2 reuniones comparten contexto con documentos activos.</p>
          <p>1 alerta correlacionada con seguimiento operativo.</p>
          <p>LÍA prioriza agenda, riesgo y reportes de cierre.</p>
        </aside>
      </div>
    </section>
  );
}

export default CognitiveGraph;
