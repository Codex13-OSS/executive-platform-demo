import type { ExecutiveAgendaEvent } from '../data/executiveAgendaData';
import { ExecutiveMobilityCard } from './ExecutiveMobilityCard';

type ExecutiveAgendaEventCardProps = {
  event: ExecutiveAgendaEvent;
};

export function ExecutiveAgendaEventCard({
  event,
}: ExecutiveAgendaEventCardProps) {
  return (
    <article
      className={`executive-event-card priority-${event.priority} status-${event.status}`}
    >
      <div className="executive-event-time">
        <strong>{event.startTime}</strong>
        <span>{event.endTime}</span>
      </div>

      <div className="executive-event-content">
        <div className="executive-event-head">
          <div>
            <p>{event.type}</p>
            <h4>{event.title}</h4>
          </div>

          <div className={`executive-event-status status-${event.status}`}>
            {event.status}
          </div>
        </div>

        <div className="executive-event-tags">
          <span>{event.location}</span>
          <span>{event.responsible}</span>
          <span>{event.priority}</span>
        </div>

        <div className="executive-event-topic">
          <strong>{event.topic}</strong>
          <p>{event.expectedOutcome}</p>
        </div>

        <ExecutiveMobilityCard
          etaMinutes={event.etaMinutes}
          trafficLevel={event.trafficLevel}
          mobilityRisk={event.mobilityRisk}
          recommendedDeparture={event.recommendedDeparture}
          weather={event.weather}
        />

        <div className="executive-event-footer">
          <div className="executive-followup">
            <span>Seguimiento</span>
            <strong>
              {event.followUpRequired ? 'Requerido' : 'No requerido'}
            </strong>
          </div>

          <div className="executive-reminder">
            <span>Recordatorio</span>
            <strong>
              {event.reminderBeforeMinutes > 0
                ? `${event.reminderBeforeMinutes} min antes`
                : 'Sin alerta'}
            </strong>
          </div>

          <button type="button">
            Preparar acción
          </button>
        </div>
      </div>
    </article>
  );
}
