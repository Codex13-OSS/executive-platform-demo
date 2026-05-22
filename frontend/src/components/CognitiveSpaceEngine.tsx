import { cognitiveSpaceNodes } from '../data/cognitiveSpaceMock';

const statusLabel: Record<(typeof cognitiveSpaceNodes)[number]['status'], string> = {
  stable: 'Estable',
  attention: 'Atención',
  critical: 'Crítico',
};

export function CognitiveSpaceEngine() {
  const avg = Math.round(cognitiveSpaceNodes.reduce((acc, node) => acc + node.score, 0) / cognitiveSpaceNodes.length);

  return (
    <section className="cognitive-space-engine-v130" aria-label="Cognitive Space Engine v1.3.0">
      <header>
        <p className="eyebrow">COGNITIVE SPACE ENGINE V1.3.0</p>
        <strong>Mapa de convergencia ejecutiva</strong>
        <span>Índice global: {avg}%</span>
      </header>
      <div className="cognitive-space-grid-v130">
        {cognitiveSpaceNodes.map((node) => (
          <article key={node.id} className={`space-node-v130 ${node.status}`}>
            <small>{node.domain.toUpperCase()}</small>
            <h4>{node.label}</h4>
            <b>{node.score}%</b>
            <em>{statusLabel[node.status]}</em>
          </article>
        ))}
      </div>
    </section>
  );
}
