import type { ExecutiveAgendaEvent } from '../data/executiveAgendaData';

type ExecutiveNextMoveCardProps = {
  event?: ExecutiveAgendaEvent;
};

export function ExecutiveNextMoveCard({ event }: ExecutiveNextMoveCardProps) {
  if (!event) {
    return (
      <section className="executive-next-move-card is-empty">
        <div>
          <p className="eyebrow">PRÓXIMO MOVIMIENTO</p>
          <h3>Día abierto para enfoque ejecutivo</h3>
          <span>LÍA no detecta bloques críticos en esta fecha.</span>
        </div>
      </section>
    );
  }

  const action =
    event.mobilityRisk === 'alto'
      ? 'Salir antes o avisar posible retraso'
      : event.followUpRequired
        ? 'Preparar briefing y confirmar responsable'
        : 'Mantener agenda bajo observación';

  return (
    <section className={`executive-next-move-card risk-${event.mobilityRisk}`}>
      <div className="executive-next-copy">
        <p className="eyebrow">PRÓXIMO MOVIMIENTO EJECUTIVO</p>
        <h3>{event.title}</h3>
        <span>
          {event.startTime}–{event.endTime} · {event.location} · {event.responsible}
        </span>
      </div>

      <div className="executive-next-signal">
        <article>
          <span>ETA</span>
          <strong>{event.etaMinutes === 0 ? 'Remoto' : `${event.etaMinutes} min`}</strong>
        </article>

        <article>
          <span>Salida</span>
          <strong>{event.recommendedDeparture}</strong>
        </article>

        <article>
          <span>Riesgo</span>
          <strong>{event.mobilityRisk}</strong>
        </article>
      </div>

      <div className="executive-next-action">
        <span>Acción sugerida</span>
        <strong>{action}</strong>
        <button type="button">Preparar confirmación</button>
      </div>
    </section>
  );
}
