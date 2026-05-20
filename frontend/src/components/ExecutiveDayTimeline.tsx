import { executiveAgendaTimeline } from '../data/executiveAgendaData';
import { ExecutiveAgendaEventCard } from './ExecutiveAgendaEventCard';

type ExecutiveDayTimelineProps = {
  dayId: string;
  dayLabel: string;
};

const timeMarkers = [
  '06:00',
  '09:00',
  '12:00',
  '15:00',
  '18:00',
  '21:00',
  '24:00',
];

export function ExecutiveDayTimeline({
  dayId,
  dayLabel,
}: ExecutiveDayTimelineProps) {
  const events = executiveAgendaTimeline
    .filter((event) => event.dayId === dayId)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const criticalEvents = events.filter((event) => event.status === 'critico').length;
  const followUps = events.filter((event) => event.followUpRequired).length;
  const highMobilityRisk = events.filter((event) => event.mobilityRisk === 'alto').length;

  return (
    <section className="panel executive-day-timeline">
      <div className="executive-timeline-header">
        <div>
          <p className="eyebrow">Executive 24h Agenda</p>
          <h3>{dayLabel} · línea operativa</h3>
          <span>
            LÍA cruza eventos, movilidad, riesgo y seguimiento.
          </span>
        </div>

        <div className="executive-timeline-stats">
          <article>
            <span>Eventos</span>
            <strong>{events.length}</strong>
          </article>

          <article>
            <span>Seguimientos</span>
            <strong>{followUps}</strong>
          </article>

          <article className={criticalEvents > 0 ? 'is-critical' : ''}>
            <span>Críticos</span>
            <strong>{criticalEvents}</strong>
          </article>

          <article className={highMobilityRisk > 0 ? 'is-critical' : ''}>
            <span>Movilidad</span>
            <strong>{highMobilityRisk}</strong>
          </article>
        </div>
      </div>

      <div className="executive-time-ruler">
        {timeMarkers.map((time) => (
          <span key={time}>{time}</span>
        ))}
      </div>

      {events.length === 0 ? (
        <div className="executive-empty-day">
          <strong>Día sin bloques ejecutivos</strong>
          <span>
            LÍA puede convertir este espacio en seguimiento, briefing o preparación documental.
          </span>
        </div>
      ) : (
        <div className="executive-timeline-flow">
          {events.map((event) => (
            <ExecutiveAgendaEventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      <div className="executive-timeline-signal">
        <i />
        <span>
          Mock premium activo · sin APIs reales · acciones críticas requieren confirmación.
        </span>
      </div>
    </section>
  );
}
