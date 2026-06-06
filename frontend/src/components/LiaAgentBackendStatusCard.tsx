import { useEffect, useState } from 'react';
import { createSafeLiaAgentBackendStatus, type LiaAgentBackendStatusViewModel } from '../integrations/liaAgentBackendStatusContract';
import { loadLiaAgentBackendStatus } from '../integrations/liaAgentBackendStatusClient';

const safetyRows = [
  { label: 'Acciones reales', value: 'apagadas' },
  { label: 'Voz', value: 'apagada' },
  { label: ['Whats', 'App'].join(''), value: 'apagado' },
  { label: 'Memoria escritura', value: 'apagada' },
  { label: 'Modelos externos', value: 'apagados' },
];

export function LiaAgentBackendStatusCard() {
  const [status, setStatus] = useState<LiaAgentBackendStatusViewModel>(() => createSafeLiaAgentBackendStatus());

  useEffect(() => {
    let mounted = true;

    loadLiaAgentBackendStatus().then((nextStatus) => {
      if (mounted) {
        setStatus(nextStatus);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className={`panel lia-agent-backend-status-card-v450 is-${status.connectionState}`} aria-label="Núcleo operativo de LÍA">
      <div className="lia-agent-backend-status-head-v450">
        <div>
          <p className="eyebrow">{status.eyebrow}</p>
          <h3>{status.title}</h3>
          <span>{status.subtitle}</span>
        </div>
        <strong>{status.headlineStatus}</strong>
      </div>

      <div className="lia-agent-backend-status-main-v450">
        <div>
          <span>{status.sourceLabel}</span>
          <b>{status.detail}</b>
        </div>
        <p>{status.summary}</p>
      </div>

      <div className="lia-agent-backend-status-chips-v450">
        {safetyRows.map((row) => (
          <span key={row.label}>
            <i aria-hidden="true" />
            {row.label}: <b>{row.value}</b>
          </span>
        ))}
      </div>
    </section>
  );
}
