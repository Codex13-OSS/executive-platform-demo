import { useState } from 'react';
import { agendaConnectorReadOnlyRehearsal } from '../integrations/agendaConnectorReadOnlyRehearsal';

export function PremiumAgendaConnectorCard() {
  const [showDetails, setShowDetails] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

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
          {agendaConnectorReadOnlyRehearsal.events.map((event) => (
            <p key={`${event.time}-${event.title}`}>
              <strong>{event.time}</strong> · {event.title}
            </p>
          ))}
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
