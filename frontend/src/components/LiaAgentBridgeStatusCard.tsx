import {
  createLockedLiaAgentBridgeSnapshot,
  getLiaAgentBridgeStatus,
} from '../integrations/liaAgentBridgeRuntime';
import { validateLiaAgentBridgeSnapshot } from '../integrations/liaAgentBridgeSelfCheck';

export function LiaAgentBridgeStatusCard() {
  const snapshot = createLockedLiaAgentBridgeSnapshot();
  const bridgeStatus = getLiaAgentBridgeStatus();
  const selfCheck = validateLiaAgentBridgeSnapshot(snapshot);

  const statusRows = [
    {
      label: 'Estado',
      value: bridgeStatus.status === 'blocked' ? 'Preparado, bloqueado' : 'Revisar',
    },
    {
      label: 'Conexión real',
      value: snapshot.backendConnected ? 'Activa' : 'Inactiva',
    },
    {
      label: 'Voz',
      value: snapshot.voiceEnabled ? 'Activa' : 'Preparación',
    },
    {
      label: 'WhatsApp',
      value: snapshot.whatsappEnabled ? 'Activo' : 'Preparación',
    },
    {
      label: 'Memoria',
      value: snapshot.memoryWriteEnabled ? 'Escritura activa' : 'Solo lectura preparada',
    },
    {
      label: 'Acciones reales',
      value: snapshot.realActionsEnabled ? 'Activas' : 'Bloqueadas',
    },
  ];

  const internalChecklist = [
    { label: 'Sin conexión externa', passed: snapshot.transportEnabled === false },
    { label: 'Sin acciones reales', passed: snapshot.realActionsEnabled === false },
    { label: 'Permisos preparados', passed: snapshot.allowedScopes.length > 0 },
    { label: 'Confirmación humana requerida', passed: selfCheck.status === 'safe' },
  ];

  return (
    <section className="panel lia-agent-bridge-card-v430" aria-label="Puente operativo de LÍA">
      <div className="lia-agent-bridge-head-v430">
        <div>
          <p className="eyebrow">PUENTE SEGURO</p>
          <h3>Puente operativo de LÍA</h3>
        </div>
        <span className="lia-agent-bridge-pill-v430">Bloqueado</span>
      </div>

      <div className="lia-agent-bridge-grid-v430">
        {statusRows.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>

      <div className="lia-agent-bridge-checks-v430">
        <p>Checklist interno</p>
        <div>
          {internalChecklist.map((item) => (
            <span className={item.passed ? 'is-ready' : 'is-warning'} key={item.label}>
              <i aria-hidden="true" />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
