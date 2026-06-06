import { useEffect, useState } from 'react';
import {
  createSafeSameOriginStatusAdapterFallback,
  type LiaSameOriginStatusAdapterViewModel,
} from '../integrations/liaSameOriginStatusAdapterContract';
import { readLiaSameOriginStatusAdapter } from '../integrations/liaSameOriginStatusAdapterClient';

const safetyRows = [
  'Acciones protegidas',
  'Voz en espera',
  'Canales en espera',
  'Memoria protegida',
  'Modelos apagados',
];

export function LiaAgentBackendStatusCard() {
  const [status, setStatus] = useState<LiaSameOriginStatusAdapterViewModel>(() => createSafeSameOriginStatusAdapterFallback());
  const statusCopy: Record<LiaSameOriginStatusAdapterViewModel['state'], string> = {
    fallback_safe: 'Lectura segura preparada',
    connected_safe: 'Lectura interna verificada',
    degraded_safe: 'En espera segura',
  };
  const sourceCopy: Record<LiaSameOriginStatusAdapterViewModel['state'], string> = {
    fallback_safe: 'Lectura protegida',
    connected_safe: 'Estado interno verificado',
    degraded_safe: 'Lectura protegida',
  };
  const detailCopy: Record<LiaSameOriginStatusAdapterViewModel['state'], string> = {
    fallback_safe: 'Centro interno preparado para lectura ejecutiva',
    connected_safe: 'Centro interno verificado para lectura ejecutiva',
    degraded_safe: 'Centro interno protegido para lectura ejecutiva',
  };

  useEffect(() => {
    let mounted = true;

    readLiaSameOriginStatusAdapter().then((nextStatus) => {
      if (mounted) {
        setStatus(nextStatus);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className={`panel lia-agent-backend-status-card-v450 is-${status.state}`} aria-label="Núcleo operativo de LÍA">
      <div className="lia-agent-backend-status-head-v450">
        <div>
          <p className="eyebrow">NÚCLEO INTERNO</p>
          <h3>Núcleo operativo de LÍA</h3>
          <span>Lectura segura · acciones protegidas</span>
        </div>
        <strong>{statusCopy[status.state]}</strong>
      </div>

      <div className="lia-agent-backend-status-main-v450">
        <div>
          <span>{sourceCopy[status.state]}</span>
          <b>{detailCopy[status.state]}</b>
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
