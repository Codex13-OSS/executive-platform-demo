import { useState } from 'react';

const indicators = ['Lectura lista', 'Escritura desactivada', 'Credenciales protegidas', 'Aprobación pendiente'];

export function PremiumAgendaConnectorCard() {
  const [showDetails, setShowDetails] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

  return (
    <article className="panel premium-agenda-connector-card" aria-label="Conector de Agenda">
      <div className="premium-agenda-connector-head">
        <p className="eyebrow">CONECTOR DE AGENDA</p>
        <span className="premium-agenda-connector-status">Preparado de forma segura</span>
      </div>

      <h3>Conector de Agenda</h3>
      <p className="premium-agenda-connector-summary">
        La agenda está lista para conectarse en modo lectura. La escritura y las credenciales siguen protegidas hasta autorización.
      </p>

      <ul className="premium-agenda-connector-indicators">
        {indicators.map((label) => (
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
          <p>Agenda lista para conexión segura.</p>
          <p>Lectura preparada y conexión real aún protegida.</p>
        </section>
      ) : null}

      {showAudit ? (
        <section className="premium-agenda-connector-expand" aria-label="Auditoría del conector">
          <p>Auditoría disponible con trazabilidad de activación y controles aplicados.</p>
          <p>Reversa preparada en modo preventivo, sin acciones reales de escritura.</p>
        </section>
      ) : null}
    </article>
  );
}
