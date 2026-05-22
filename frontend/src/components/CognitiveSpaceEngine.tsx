import { useMemo, useState } from 'react';
import { cognitiveSpaceLinks, cognitiveSpaceNodes, type CognitiveNodeState } from '../data/cognitiveSpaceMock';

const stateLabel: Record<CognitiveNodeState, string> = {
  stable: 'Estable',
  attention: 'Atención',
  critical: 'Prioridad',
  active: 'Activo',
};

export function CognitiveSpaceEngine() {
  const [activeId, setActiveId] = useState('decisiones');

  const activeNode = useMemo(
    () => cognitiveSpaceNodes.find((node) => node.id === activeId) ?? cognitiveSpaceNodes[0],
    [activeId]
  );

  const activeLinks = useMemo(
    () => cognitiveSpaceLinks.filter(([a, b]) => a === activeId || b === activeId),
    [activeId]
  );

  return (
    <section className="cognitive-space-engine-v130" aria-label="Cognitive Space Engine">
      <div className="cse-v130-head">
        <p className="eyebrow">COGNITIVE SPACE ENGINE</p>
        <span className="cse-v130-sync">Sincronizado</span>
      </div>

      <div className="cse-v130-stage">
        <div className="cse-v130-depth cse-v130-particles" aria-hidden="true" />
        <div className="cse-v130-depth cse-v130-grid" aria-hidden="true" />

        <svg className="cse-v130-links" viewBox="0 0 100 100" aria-hidden="true">
          {cognitiveSpaceLinks.map(([from, to]) => {
            const a = cognitiveSpaceNodes.find((node) => node.id === from)!;
            const b = cognitiveSpaceNodes.find((node) => node.id === to)!;
            const highlighted = from === activeId || to === activeId;
            const bendX = (a.x + b.x) / 2;
            const bendY = (a.y + b.y) / 2 - (highlighted ? 6 : 2);

            return (
              <path
                key={`${from}-${to}`}
                d={`M ${a.x} ${a.y} Q ${bendX} ${bendY} ${b.x} ${b.y}`}
                className={highlighted ? 'cse-v130-link active' : 'cse-v130-link'}
              />
            );
          })}
        </svg>

        <button className="cse-v130-core" type="button" onClick={() => setActiveId('decisiones')}>
          <strong>Executive Core</strong>
          <small>Atención activa</small>
        </button>

        {cognitiveSpaceNodes.map((node, index) => (
          <button
            key={node.id}
            type="button"
            className={`cse-v130-node depth-${node.depth} state-${node.state} ${activeId === node.id ? 'active' : ''}`}
            style={{ left: `${node.x}%`, top: `${node.y}%`, animationDelay: `${index * 0.15}s` }}
            onClick={() => setActiveId(node.id)}
          >
            <strong>{node.short}</strong>
            <em>{node.label}</em>
            <span>{node.metric}</span>
          </button>
        ))}
      </div>

      <div className="cse-v130-context">
        <span className={`cse-v130-state ${activeNode.state}`}>{stateLabel[activeNode.state]}</span>
        <strong>{activeNode.label}</strong>
        <small>{activeNode.metric} · {activeLinks.length} conexiones</small>
      </div>
    </section>
  );
}
