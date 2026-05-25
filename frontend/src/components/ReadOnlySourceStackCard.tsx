const stackLayers = [
  { id: 'foundation', label: 'Foundation', state: 'safe' },
  { id: 'connector', label: 'Connector', state: 'locked' },
  { id: 'runtime', label: 'Runtime', state: 'rehearsal' },
  { id: 'handshake', label: 'Handshake', state: 'approval required' },
] as const;

const stackMetrics = [
  { label: 'layers', value: '4 prepared' },
  { label: 'writes', value: 'disabled' },
  { label: 'credentials', value: 'locked' },
  { label: 'endpoint', value: 'locked' },
] as const;

const stackSignals = [
  'reads prepared',
  'real source off',
  'no credentials',
  'no endpoint',
  'human approval required',
  'audit ready',
] as const;

export function ReadOnlySourceStackCard() {
  return (
    <section className="read-only-source-stack-card-v220">
      <div className="read-only-source-stack-head-v220">
        <div>
          <span>READ-ONLY SOURCE STACK</span>
          <p>External source pipeline · safe / locked</p>
        </div>
        <b>COMPOSED</b>
      </div>

      <div className="read-only-source-stack-metrics-v220">
        {stackMetrics.map((metric) => (
          <article key={metric.label}>
            <small>{metric.label}</small>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>

      <div className="read-only-source-stack-pipeline-v220" aria-label="Read-only source pipeline">
        {stackLayers.map((layer, index) => (
          <div className="read-only-source-stack-layer-wrap-v220" key={layer.id}>
            <article className="read-only-source-stack-layer-v220">
              <span>{layer.label}</span>
              <b>{layer.state}</b>
            </article>
            {index < stackLayers.length - 1 ? <i aria-hidden="true">→</i> : null}
          </div>
        ))}
      </div>

      <div className="read-only-source-stack-strip-v220">
        {stackSignals.map((signal) => (
          <span key={signal}>{signal}</span>
        ))}
      </div>
    </section>
  );
}
