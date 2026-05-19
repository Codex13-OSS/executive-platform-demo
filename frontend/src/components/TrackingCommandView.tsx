import { useMemo, useState } from 'react';

type TrackingCommandViewProps = {
  legacyTracking?: unknown[];
};

const executionLanes = [
  {
    id: 'contratos',
    name: 'Contratos ejecutivos',
    progress: 78,
    status: 'En tiempo',
    deadline: 'Hoy 18:00',
    owner: 'Legal / Dirección',
    risk: 'Bajo',
    next: 'Validar cláusulas críticas y cerrar versión final.',
    commitments: ['Revisión legal', 'Validación de monto', 'Firma programada'],
  },
  {
    id: 'recordatorios',
    name: 'Confirmaciones ejecutivas',
    progress: 62,
    status: 'En riesgo',
    deadline: 'Hoy 14:00',
    owner: 'LÍA / Operación',
    risk: 'Medio',
    next: 'Confirmar responsables antes de la próxima junta.',
    commitments: ['2 recordatorios sin confirmar', '1 responsable pendiente', 'Seguimiento hoy'],
  },
  {
    id: 'dashboard',
    name: 'Panel comercial',
    progress: 91,
    status: 'En tiempo',
    deadline: 'Lun 10:00',
    owner: 'Comercial',
    risk: 'Bajo',
    next: 'Preparar lectura ejecutiva de oportunidades.',
    commitments: ['Pipeline actualizado', 'Métricas listas', 'Próximo corte semanal'],
  },
  {
    id: 'documentos',
    name: 'Documentos en validación',
    progress: 44,
    status: 'Retrasado',
    deadline: 'Hoy 12:30',
    owner: 'Documentos / LÍA',
    risk: 'Alto',
    next: 'Revisar documentos pendientes antes de la reunión de dirección.',
    commitments: ['2 borradores activos', '1 propuesta pendiente', '1 acta sin validar'],
  },
];

const recentCommitments = [
  ['09:00', 'Briefing ejecutivo preparado', 'Listo'],
  ['11:30', 'Proceso crítico requiere validación', 'Atención'],
  ['14:00', 'Seguimiento con dirección sin confirmar', 'Riesgo'],
  ['17:30', 'Cierre operativo requiere bitácora', 'Pendiente'],
];

const nextActions = [
  'Confirmar responsables de proceso crítico.',
  'Generar resumen ejecutivo antes de junta de dirección.',
  'Validar documento comercial pendiente.',
  'Bloquear espacio de revisión estratégica.',
];

export function TrackingCommandView({ legacyTracking = [] }: TrackingCommandViewProps) {
  const [selectedId, setSelectedId] = useState('recordatorios');

  const selectedLane = useMemo(
    () => executionLanes.find((lane) => lane.id === selectedId) ?? executionLanes[0],
    [selectedId]
  );

  const globalProgress = Math.round(
    executionLanes.reduce((sum, lane) => sum + lane.progress, 0) / executionLanes.length
  );

  return (
    <section className="tracking-command-shell tracking-control-room-v087">
      <div className="panel tracking-hero-panel">
        <div>
          <p className="eyebrow">EJECUCIÓN OPERATIVA · CONTROL VIVO</p>
          <h3>Procesos, responsables y decisiones bajo control ejecutivo</h3>
          <p className="muted">
            Avance, responsables, riesgos y próximos movimientos organizados para decisión.
          </p>
        </div>

        <div className="tracking-orb-status">
          <div className="tracking-mini-orb">
            <span />
            <strong>{globalProgress}%</strong>
          </div>
          <em>Avance general</em>
        </div>
      </div>

      <div className="tracking-live-grid">
        {executionLanes.map((lane) => (
          <button
            key={lane.id}
            type="button"
            className={`tracking-lane-card ${selectedId === lane.id ? 'active' : ''} risk-${lane.risk.toLowerCase()}`}
            onClick={() => setSelectedId(lane.id)}
          >
            <div className="tracking-lane-top">
              <span>{lane.name}</span>
              <strong>{lane.status}</strong>
            </div>

            <div className="tracking-percent-row">
              <strong>{lane.progress}%</strong>
              <em>{lane.risk}</em>
            </div>

            <div className="tracking-progress-track">
              <span style={{ width: `${lane.progress}%` }} />
            </div>

            <p>{lane.next}</p>
          </button>
        ))}
      </div>

      <div className="tracking-command-layout">
        <section className="panel tracking-detail-panel">
          <div className="tracking-detail-head">
            <div>
              <p className="eyebrow">FRENTE SELECCIONADO</p>
              <h4>{selectedLane.name}</h4>
            </div>
            <span className={`tracking-risk-chip risk-${selectedLane.risk.toLowerCase()}`}>
              Riesgo {selectedLane.risk}
            </span>
          </div>

          <div className="tracking-detail-metrics">
            <div>
              <span>Avance</span>
              <strong>{selectedLane.progress}%</strong>
            </div>
            <div>
              <span>Estado</span>
              <strong>{selectedLane.status}</strong>
            </div>
            <div>
              <span>Responsable</span>
              <strong>{selectedLane.owner}</strong>
            </div>
          <div className="tracking-deadline-card">
            <span>Deadline / hito</span>
            <strong>{selectedLane.deadline ?? 'Hoy 18:00'}</strong>
          </div>
          </div>

          <div className="tracking-commitments">
            <p className="eyebrow">COMPROMISOS POR CERRAR</p>
            {selectedLane.commitments.map((commitment) => (
              <article key={commitment}>
                <span />
                <strong>{commitment}</strong>
              </article>
            ))}
          </div>

          <div className="tracking-next-action">
            <span>Movimiento recomendado</span>
            <strong>{selectedLane.next}</strong>
          </div>
        </section>

        <aside className="tracking-side-stack">
          <section className="panel tracking-timeline-panel">
            <p className="eyebrow">BITÁCORA OPERATIVA</p>
            {recentCommitments.map(([time, title, status], index) => (
              <article key={`${time}-${title}`}>
              <i style={{ width: `${42 + index * 15}%` }} />
                <span>{time}</span>
                <strong>{title}</strong>
                <em>{status}</em>
              </article>
            ))}
          </section>

          <section className="panel tracking-actions-panel">
            <p className="eyebrow">MOVIMIENTOS RECOMENDADOS</p>
            {nextActions.map((action) => (
              <button key={action} type="button">
                {action}
              </button>
            ))}
          </section>
        </aside>
      </div>

      {legacyTracking.length > 0 ? (
        <div className="tracking-legacy-signal" aria-hidden="true">
          {legacyTracking.length} señales operativas sincronizadas
        </div>
      ) : null}
    </section>
  );
}
