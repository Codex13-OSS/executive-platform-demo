import { useEffect, useState } from 'react';
import { createSafeLiaAgentBackendStatus, type LiaAgentBackendStatusViewModel } from '../integrations/liaAgentBackendStatusContract';
import { loadLiaAgentBackendStatus } from '../integrations/liaAgentBackendStatusClient';

const safetyRows = [
  'Acciones protegidas',
  'Voz en espera',
  'Canales en espera',
  'Memoria protegida',
  'Modelos apagados',
];

export function LiaAgentBackendStatusCard() {
  const [status, setStatus] = useState<LiaAgentBackendStatusViewModel>(() => createSafeLiaAgentBackendStatus());
  const statusCopy: Record<LiaAgentBackendStatusViewModel['connectionState'], string> = {
    fallback_safe: 'Lectura segura preparada',
    connected_safe: 'Lectura segura activa',
    degraded_safe: 'Lectura protegida',
  };

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
          <p className="eyebrow">NÚCLEO INTERNO</p>
          <h3>Núcleo operativo de LÍA</h3>
          <span>Lectura segura · acciones protegidas</span>
        </div>
        <strong>{statusCopy[status.connectionState]}</strong>
      </div>

      <div className="lia-agent-backend-status-main-v450">
        <div>
          <span>{status.sourceLabel}</span>
          <b>Centro interno preparado para lectura ejecutiva</b>
        </div>
        <p>LÍA ya cuenta con un núcleo interno seguro para lectura de estado. Las acciones reales siguen protegidas.</p>
      </div>

      <div className="lia-agent-backend-status-chips-v450">
        {safetyRows.map((label) => (
          <span key={label}>
            <i aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
