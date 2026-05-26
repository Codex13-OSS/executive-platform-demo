import { useMemo, useState } from 'react';
import {
  agendaConnectorReadOnlyRehearsal,
  agendaEventStatusOptions,
  type AgendaEventStatus,
} from '../integrations/agendaConnectorReadOnlyRehearsal';

type EventStatusMap = Record<string, AgendaEventStatus>;

const initialEventStatuses = agendaConnectorReadOnlyRehearsal.events.reduce<EventStatusMap>((acc, event) => {
  acc[event.id] = event.initialStatus;
  return acc;
}, {});

export function PremiumAgendaConnectorCard() {
  const [showDetails, setShowDetails] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [eventStatuses, setEventStatuses] = useState<EventStatusMap>(initialEventStatuses);
  const [hasLocalInteraction, setHasLocalInteraction] = useState(false);
  const [handoffPrepared, setHandoffPrepared] = useState(false);

  const totals = useMemo(() => {
    return agendaConnectorReadOnlyRehearsal.events.reduce(
      (acc, event) => {
        acc[eventStatuses[event.id]] += 1;
        return acc;
      },
      { revisado: 0, pendiente: 0, preparado: 0 } as Record<AgendaEventStatus, number>,
    );
  }, [eventStatuses]);

  const summary = `${totals.revisado} revisado · ${totals.pendiente} pendiente · ${totals.preparado} preparado`;

  const executiveHandoff = useMemo(() => {
    if (totals.pendiente > 1) {
      return 'Agenda con pendientes: prioriza los puntos abiertos antes del cierre del día.';
    }

    if (totals.pendiente === 1) {
      return 'Agenda revisada: 1 pendiente requiere seguimiento antes del cierre.';
    }

    return 'Agenda lista: los eventos clave están preparados para seguimiento ejecutivo.';
  }, [totals.pendiente]);

  const updateEventStatus = (eventId: string, status: AgendaEventStatus) => {
    setEventStatuses((current) => ({ ...current, [eventId]: status }));
    setHasLocalInteraction(true);
    setHandoffPrepared(false);
  };

  return (
    <article className="panel premium-agenda-connector-card" aria-label="Conector de Agenda">
      <div className="premium-agenda-connector-head">
        <p className="eyebrow">CONECTOR DE AGENDA</p>
        <span className="premium-agenda-connector-status">{agendaConnectorReadOnlyRehearsal.status}</span>
      </div>

      <h3>Conector de Agenda</h3>
      <p className="premium-agenda-connector-summary">
        {agendaConnectorReadOnlyRehearsal.summary}
      </p>

      <ul className="premium-agenda-connector-indicators">
        {agendaConnectorReadOnlyRehearsal.indicators.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>

      <div className="premium-agenda-connector-actions">
        <button type="button" className="secondary" onClick={() => setShowDetails((prev) => !prev)}>
          {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
        </button>
        <button type="button" className="secondary" onClick={() => setShowAudit((prev) => !prev)}>
          {showAudit ? 'Ocultar auditoría' : 'Ver auditoría'}
        </button>
      </div>

      {showDetails ? (
        <section className="premium-agenda-connector-expand" aria-label="Detalles del conector">
          <p className="premium-agenda-interaction-summary">{summary}</p>

          <div className="premium-agenda-event-list">
            {agendaConnectorReadOnlyRehearsal.events.map((event) => (
              <article
                className={`premium-agenda-event premium-agenda-event-${eventStatuses[event.id]}`}
                key={event.id}
              >
                <p>
                  <strong>{event.time}</strong> · {event.title}
                </p>
                <div className="premium-agenda-event-actions" aria-label={`Estado de ${event.title}`}>
                  {agendaEventStatusOptions.map((option) => (
                    <button
                      type="button"
                      key={option.id}
                      className={eventStatuses[event.id] === option.id ? 'active' : ''}
                      onClick={() => updateEventStatus(event.id, option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <section className="premium-agenda-handoff" aria-label="Handoff ejecutivo">
            <span>Handoff ejecutivo</span>
            <p>{executiveHandoff}</p>
            <button type="button" className="secondary" onClick={() => setHandoffPrepared(true)}>
              Preparar resumen
            </button>
            {handoffPrepared ? (
              <p className="premium-agenda-local-log">{agendaConnectorReadOnlyRehearsal.handoffPreparedLog}</p>
            ) : null}
          </section>

          {hasLocalInteraction ? (
            <p className="premium-agenda-local-log">{agendaConnectorReadOnlyRehearsal.localLog}</p>
          ) : null}
        </section>
      ) : null}

      {showAudit ? (
        <section className="premium-agenda-connector-expand" aria-label="Auditoría del conector">
          {agendaConnectorReadOnlyRehearsal.audit.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </section>
      ) : null}
    </article>
  );
}
