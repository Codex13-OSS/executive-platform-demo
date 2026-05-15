const nodes = [
  { id: 'agenda', label: 'Agenda', x: 50, y: 16, depth: 0.9 },
  { id: 'seguimiento', label: 'Seguimiento', x: 77, y: 26, depth: 1 },
  { id: 'documentos', label: 'Documentos', x: 85, y: 52, depth: 0.7 },
  { id: 'alertas', label: 'Alertas', x: 70, y: 78, depth: 0.95 },
  { id: 'decisiones', label: 'Decisiones', x: 48, y: 88, depth: 0.75 },
  { id: 'contexto', label: 'Contexto', x: 24, y: 76, depth: 1 },
  { id: 'riesgos', label: 'Riesgos', x: 13, y: 50, depth: 0.7 },
  { id: 'reportes', label: 'Reportes', x: 24, y: 24, depth: 0.9 },
] as const;

export default function CognitiveGraph() {
  return (
    <section className="cognitive-panel-v2 cognitive-3d-panel" aria-label="Mapa Cognitivo Ejecutivo">
      <header className="cognitive-title-row">
        <div>
          <p className="eyebrow">MAPA COGNITIVO EJECUTIVO</p>
          <h3>Núcleo de decisión contextual</h3>
          <p className="muted">LÍA Core correlaciona agenda, riesgo, alertas y ejecución en tiempo real.</p>
        </div>
        <span className="cognitive-badge">Sincronía 98%</span>
      </header>

      <div className="cognitive-body-v2">
        <div className="cognitive-viewport cognitive-orbital-stage">
          <svg className="cognitive-svg" viewBox="0 0 100 100" role="img" aria-label="LIA Core enlazando contexto ejecutivo">
            <defs>
              <radialGradient id="cognitiveCoreGlow" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="rgba(224,242,254,0.95)" />
                <stop offset="40%" stopColor="rgba(56,189,248,0.9)" />
                <stop offset="100%" stopColor="rgba(2,6,23,0)" />
              </radialGradient>
            </defs>

            <ellipse cx="50" cy="50" rx="35" ry="20" className="ring ring-far" />
            <ellipse cx="50" cy="50" rx="28" ry="15" className="ring ring-mid" />
            <ellipse cx="50" cy="50" rx="23" ry="12" className="ring ring-near" />

            {nodes.map((n, idx) => (
              <g key={`link-${n.id}`}>
                <path d={`M50 50 Q ${(50 + n.x) / 2} ${(40 + n.y) / 2} ${n.x} ${n.y}`} className="curve-link" />
                <circle r="0.75" className="curve-pulse">
                  <animateMotion
                    dur={`${2.2 + (idx % 4) * 0.9}s`}
                    repeatCount="indefinite"
                    path={`M50 50 Q ${(50 + n.x) / 2} ${(40 + n.y) / 2} ${n.x} ${n.y}`}
                  />
                </circle>
              </g>
            ))}

            <g className="node-core" transform="translate(50 50)">
              <circle r="11" fill="url(#cognitiveCoreGlow)" />
              <circle r="6.5" className="core-inner" />
              <text y="1">LÍA Core</text>
            </g>

            {nodes.map((n) => (
              <g key={n.id} transform={`translate(${n.x} ${n.y})`} className="orbit-node" style={{ opacity: n.depth, transform: `scale(${0.84 + n.depth * 0.24})` }}>
                <circle r={3.2 + n.depth} />
                <text y={8.2}>{n.label}</text>
              </g>
            ))}
          </svg>
        </div>

        <aside className="cognitive-insights-v2">
          <p>3 nodos críticos requieren validación ejecutiva.</p>
          <p>2 reuniones comparten contexto con documentos activos.</p>
          <p>1 alerta se conecta con seguimiento operativo.</p>
          <p>LÍA prioriza agenda, riesgo y reportes de cierre.</p>
        </aside>
      </div>
    </section>
  );
}
