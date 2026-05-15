type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  central?: boolean;
};

const nodes: GraphNode[] = [
  { id: 'lia-core', label: 'LÍA Core', x: 50, y: 48, central: true },
  { id: 'agenda', label: 'Agenda', x: 18, y: 24 },
  { id: 'seguimiento', label: 'Seguimiento', x: 26, y: 74 },
  { id: 'documentos', label: 'Documentos', x: 50, y: 86 },
  { id: 'alertas', label: 'Alertas', x: 80, y: 72 },
  { id: 'decisiones', label: 'Decisiones', x: 83, y: 29 },
  { id: 'contexto', label: 'Contexto', x: 62, y: 12 },
  { id: 'riesgos', label: 'Riesgos', x: 36, y: 12 },
  { id: 'reportes', label: 'Reportes', x: 12, y: 52 },
] as const;

const links = nodes.filter((node) => !node.central).map((node) => ({ from: 'lia-core', to: node.id }));

export function CognitiveGraph() {
  return (
    <section className="panel cognitive-panel">
      <div className="cognitive-header">
        <p className="eyebrow">MAPA COGNITIVO EJECUTIVO</p>
        <h3>Neural Command Graph</h3>
      </div>

      <div className="cognitive-layout">
        <div className="cognitive-graph-wrap" aria-hidden="true">
          <svg className="cognitive-graph" viewBox="0 0 100 100" role="img">
            <defs>
              <linearGradient id="liaLink" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(125,211,252,0.1)" />
                <stop offset="50%" stopColor="rgba(56,189,248,0.7)" />
                <stop offset="100%" stopColor="rgba(125,211,252,0.1)" />
              </linearGradient>
            </defs>

            {links.map(({ from, to }, index) => {
              const source = nodes.find((node) => node.id === from)!;
              const target = nodes.find((node) => node.id === to)!;

              return (
                <g key={`${from}-${to}`}>
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    className="cognitive-link"
                  />
                  <circle r="0.9" className="cognitive-pulse">
                    <animateMotion
                      dur={`${3.2 + (index % 3) * 0.8}s`}
                      repeatCount="indefinite"
                      path={`M ${source.x} ${source.y} L ${target.x} ${target.y}`}
                    />
                  </circle>
                </g>
              );
            })}

            {nodes.map((node) => (
              <g key={node.id} className={node.central ? 'cognitive-node core' : 'cognitive-node'} transform={`translate(${node.x} ${node.y})`}>
                <circle r={node.central ? 7.5 : 4.2} />
                <circle r={node.central ? 10.5 : 6.3} className="halo" />
                <text y={node.central ? 13.5 : 8.8}>{node.label}</text>
              </g>
            ))}
          </svg>
        </div>

        <div className="cognitive-insights">
          <p>3 nodos críticos requieren validación.</p>
          <p>2 reuniones comparten contexto con documentos pendientes.</p>
          <p>1 alerta vinculada a seguimiento operativo.</p>
          <p>Jarvis prioriza agenda, riesgos y documentos activos.</p>
        </div>
      </div>
    </section>
  );
}
