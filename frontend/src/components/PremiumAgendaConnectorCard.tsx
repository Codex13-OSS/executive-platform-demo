import { useMemo, useState } from 'react';
import {
  agendaConnectorReadOnlyRehearsal,
  agendaEventStatusOptions,
  agendaFollowUpActions,
  type AgendaEventStatus,
  type AgendaFollowUpActionId,
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
  const [followUpMarked, setFollowUpMarked] = useState(false);
  const [executiveClosureMarked, setExecutiveClosureMarked] = useState(false);
  const [briefingMarked, setBriefingMarked] = useState(false);

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
    if (totals.pendiente > 0) {
      return 'Pendientes por dueño.';
    }

    return 'Agenda lista.';
  }, [totals.pendiente]);

  const suggestedActionId = useMemo<AgendaFollowUpActionId>(() => {
    if (totals.pendiente > 0) {
      return 'confirmar-responsable';
    }

    if (!handoffPrepared) {
      return 'preparar-seguimiento';
    }

    return 'cerrar-agenda';
  }, [handoffPrepared, totals.pendiente]);

  const suggestedAction = agendaFollowUpActions[suggestedActionId];
  const canShowExecutiveClosure = handoffPrepared && followUpMarked;
  const briefingPendingText = `Pendientes: ${totals.pendiente}`;

  const resetFinalFlow = () => {
    setHandoffPrepared(false);
    setFollowUpMarked(false);
    setExecutiveClosureMarked(false);
    setBriefingMarked(false);
  };

  const updateEventStatus = (eventId: string, status: AgendaEventStatus) => {
    setEventStatuses((current) => ({ ...current, [eventId]: status }));
    setHasLocalInteraction(true);
    resetFinalFlow();
  };

  const prepareHandoffSummary = () => {
    setHandoffPrepared(true);
    setFollowUpMarked(false);
    setExecutiveClosureMarked(false);
    setBriefingMarked(false);
  };

  const markFollowUpAction = () => {
    setFollowUpMarked(true);
    setExecutiveClosureMarked(false);
    setBriefingMarked(false);
  };

  const markExecutiveClosure = () => {
    setExecutiveClosureMarked(true);
    setBriefingMarked(false);
  };

  const markBriefingReady = () => {
    setBriefingMarked(true);
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
            <span>Handoff</span>
            <p>{executiveHandoff}</p>
            <button type="button" className="secondary" onClick={prepareHandoffSummary}>
              Preparar resumen
            </button>
            {handoffPrepared ? (
              <p className="premium-agenda-local-log">{agendaConnectorReadOnlyRehearsal.handoffPreparedLog}</p>
            ) : null}

            <div className="premium-agenda-followup" aria-label="Acción sugerida">
              <span>Acción</span>
              <p>{suggestedAction.message}</p>
              <button type="button" onClick={markFollowUpAction}>
                {suggestedAction.label}
              </button>
              {followUpMarked ? (
                <p className="premium-agenda-local-log">{agendaConnectorReadOnlyRehearsal.followUpActionLog}</p>
              ) : null}
            </div>

            {canShowExecutiveClosure ? (
              <div className="premium-agenda-executive-closure" aria-label="Cierre ejecutivo">
                <span>Cierre</span>
                <p>Listo para cierre.</p>
                <button type="button" onClick={markExecutiveClosure}>
                  Cerrar seguro
                </button>
                {executiveClosureMarked ? (
                  <p className="premium-agenda-local-log">{agendaConnectorReadOnlyRehearsal.executiveClosureLog}</p>
                ) : null}
              </div>
            ) : null}

            {executiveClosureMarked ? (
              <div className="premium-agenda-briefing-output" aria-label="Briefing ejecutivo">
                <span>Briefing</span>
                <h4>Briefing listo</h4>
                <p>Agenda revisada.</p>
                <p>{briefingPendingText}</p>
                <p>Cierre listo.</p>
                <button type="button" onClick={markBriefingReady}>
                  Marcar listo
                </button>
                {briefingMarked ? (
                  <p className="premium-agenda-local-log">{agendaConnectorReadOnlyRehearsal.briefingMarkedLog}</p>
                ) : null}
              </div>
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
