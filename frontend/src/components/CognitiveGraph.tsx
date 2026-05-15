import { useMemo, useState } from 'react';

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  depth: number;
  context: string;
  actions: string[];
};

const nodes: Node[] = [
  { id: 'agenda', label: 'Agenda', x: 50, y: 12, depth: 0.9, context: '5 reuniones enlazadas a prioridades activas.', actions: ['Generar briefing', 'Ver espacios', 'Crear recordatorio'] },
  { id: 'riesgos', label: 'Riesgos', x: 76, y: 24, depth: 1, context: '2 frentes con probabilidad alta de impacto.', actions: ['Crear alerta', 'Validar', 'Escalar'] },
  { id: 'contexto', label: 'Contexto', x: 88, y: 50, depth: 0.75, context: 'Contexto operativo actualizado hace 7 minutos.', actions: ['Consolidar contexto', 'Enviar resumen'] },
  { id: 'decisiones', label: 'Decisiones', x: 72, y: 78, depth: 0.94, context: '3 decisiones pendientes de validación humana.', actions: ['Preparar recomendación', 'Solicitar aprobación'] },
  { id: 'operacion', label: 'Operación', x: 50, y: 90, depth: 0.76, context: 'Cadencia estable al 87% con foco en ejecución.', actions: ['Actualizar avance', 'Notificar responsable'] },
  { id: 'documentos', label: 'Documentos', x: 26, y: 78, depth: 1, context: '4 documentos estratégicos abiertos.', actions: ['Generar documento', 'Revisar pendiente'] },
  { id: 'seguimiento', label: 'Seguimiento', x: 12, y: 50, depth: 0.78, context: '8 acciones en seguimiento activo.', actions: ['Actualizar avance', 'Notificar responsable'] },
  { id: 'finanzas', label: 'Finanzas', x: 24, y: 24, depth: 0.92, context: 'KPIs financieros con variación moderada.', actions: ['Revisar desvíos', 'Emitir reporte'] },
  { id: 'prioridades', label: 'Prioridades', x: 38, y: 8, depth: 0.85, context: '3 prioridades recalibradas por LÍA Core.', actions: ['Actualizar foco', 'Compartir prioridad'] },
  { id: 'clientes', label: 'Clientes', x: 64, y: 8, depth: 0.88, context: '2 cuentas clave requieren seguimiento ejecutivo.', actions: ['Preparar contacto', 'Escalar seguimiento'] },
];

export default function CognitiveGraph() {
  const [selectedId, setSelectedId] = useState<string>('agenda');
  const selected = useMemo(() => nodes.find((n) => n.id === selectedId) ?? nodes[0], [selectedId]);

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
            <ellipse cx="50" cy="50" rx="36" ry="21" className="ring ring-far" />
            <ellipse cx="50" cy="50" rx="29" ry="16" className="ring ring-mid" />
            <ellipse cx="50" cy="50" rx="23" ry="12" className="ring ring-near" />
            {Array.from({ length: 22 }).map((_, i) => (
              <circle key={`p-${i}`} cx={12 + ((i * 37) % 78)} cy={12 + ((i * 23) % 76)} r={0.35 + (i % 3) * 0.12} className="cognitive-speck" />
            ))}

            {nodes.map((n, idx) => {
              const active = selectedId === n.id;
              return (
                <g key={`link-${n.id}`} className={active ? 'active-link' : ''}>
                  <path d={`M50 50 C ${(50 + n.x) / 2} ${(38 + n.y) / 2}, ${(50 + n.x) / 2} ${(42 + n.y) / 2}, ${n.x} ${n.y}`} className="curve-link" />
                  <circle r={active ? 0.95 : 0.75} className="curve-pulse">
                    <animateMotion dur={`${2.2 + (idx % 4) * 0.9}s`} repeatCount="indefinite" path={`M50 50 C ${(50 + n.x) / 2} ${(38 + n.y) / 2}, ${(50 + n.x) / 2} ${(42 + n.y) / 2}, ${n.x} ${n.y}`} />
                  </circle>
                </g>
              );
            })}

            <g className="node-core" transform="translate(50 50)">
              <circle r="11.5" fill="url(#cognitiveCoreGlow)" />
              <circle r="6.8" className="core-inner" />
              <text y="1">LÍA Core</text>
            </g>

            {nodes.map((n) => {
              const active = selectedId === n.id;
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x} ${n.y})`}
                  className={`orbit-node ${active ? 'active' : ''}`}
                  style={{ opacity: n.depth, transform: `scale(${0.84 + n.depth * 0.24})` }}
                  onClick={() => setSelectedId(n.id)}
                  onMouseEnter={() => setSelectedId(n.id)}
                >
                  <circle r={3.2 + n.depth} />
                  <text y={8.2}>{n.label}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <aside className="cognitive-insights-v2">
          <p className="insight-head">Nodo activo: <strong>{selected.label}</strong></p>
          <p>{selected.context}</p>
          <div className="insight-actions">{selected.actions.map((action) => <button key={action} type="button">{action}</button>)}</div>
          <p>Relaciones activas resaltadas en el grafo cognitivo.</p>
        </aside>
      </div>
    </section>
  );
}
