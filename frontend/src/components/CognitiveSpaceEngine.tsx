import { useMemo, useState } from 'react';
import { cognitiveSpaceNodes, type CognitiveNodeStatus } from '../data/cognitiveSpaceMock';

const statusLabel: Record<CognitiveNodeStatus, string> = {
  stable: 'Stable',
  attention: 'Attention',
  critical: 'Critical',
  active: 'Active',
};

export function CognitiveSpaceEngine() {
  const [activeNodeId, setActiveNodeId] = useState(cognitiveSpaceNodes[0]?.id ?? '');

  const activeNode = useMemo(
    () => cognitiveSpaceNodes.find((node) => node.id === activeNodeId) ?? cognitiveSpaceNodes[0],
    [activeNodeId]
  );

  const coreScore = Math.round(cognitiveSpaceNodes.reduce((acc, node) => acc + node.score, 0) / cognitiveSpaceNodes.length);

  return (
    <section className="cognitive-space-engine-v130" aria-label="Mapa ejecutivo v1.3.0">
      <div className="cse-orbital-v130" role="presentation">
        <div className="cse-depth-glow-v130" aria-hidden="true" />
        <div className="cse-core-v130" aria-label="Centro ejecutivo" role="img">
          <small>Centro ejecutivo</small>
          <strong>{coreScore}%</strong>
          <em>{statusLabel.active}</em>
        </div>

        <svg className="cse-links-v130" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {cognitiveSpaceNodes.map((node) => {
            const active = node.id === activeNode?.id;
            return (
              <line
                key={`link-${node.id}`}
                x1="50"
                y1="50"
                x2={node.x}
                y2={node.y}
                className={active ? 'active' : node.status}
              />
            );
          })}
        </svg>

        {cognitiveSpaceNodes.map((node) => {
          const active = node.id === activeNode?.id;
          const visualStatus: CognitiveNodeStatus = active ? 'active' : node.status;
          return (
            <button
              key={node.id}
              type="button"
              className={`cse-node-v130 ${visualStatus}`}
              style={{ left: `${node.x}%`, top: `${node.y}%`, animationDuration: `${node.pulse + 3.2}s` }}
              onClick={() => setActiveNodeId(node.id)}
              aria-pressed={active}
              aria-label={`${node.domain}: ${statusLabel[visualStatus]} ${node.score}%`}
            >
              <span>{node.label}</span>
              <b>{node.score}%</b>
            </button>
          );
        })}
      </div>

      {activeNode && (
        <aside className={`cse-context-v130 ${activeNode.status}`}>
          <p>{activeNode.domain}</p>
          <strong>{statusLabel[activeNode.status]}</strong>
          <span>{activeNode.context}</span>
        </aside>
      )}
    </section>
  );
}
