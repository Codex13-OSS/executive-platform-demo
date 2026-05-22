import type { ExecutiveAgendaEvent } from './executiveAgendaData';

export type ExecutivePredictionLevel = 'critico' | 'alto' | 'medio' | 'bajo';

export type ExecutivePrediction = {
  id: string;
  level: ExecutivePredictionLevel;
  title: string;
  signal: string;
  detail: string;
  recommendation: string;
  confirmationLabel: string;
  eventId?: string;
  eventTime?: string;
};

const levelWeight: Record<ExecutivePredictionLevel, number> = {
  critico: 4,
  alto: 3,
  medio: 2,
  bajo: 1,
};

const sortPredictions = (items: ExecutivePrediction[]) =>
  [...items].sort((a, b) => levelWeight[b.level] - levelWeight[a.level]);

export function buildExecutivePredictions(events: ExecutiveAgendaEvent[]): ExecutivePrediction[] {
  const predictions: ExecutivePrediction[] = [];
  const sortedEvents = [...events].sort((a, b) => a.startTime.localeCompare(b.startTime));
  const firstFreeWindow = sortedEvents.find((event) => event.status === 'libre');

  sortedEvents.forEach((event) => {
    if (event.mobilityRisk === 'alto') {
      predictions.push({
        id: `mobility-${event.id}`,
        level: 'alto',
        title: `Riesgo de traslado: ${event.title}`,
        signal: `${event.etaMinutes} min · salida ${event.recommendedDeparture}`,
        detail: `Tráfico ${event.trafficLevel} y clima ${event.weather.toLowerCase()} elevan riesgo operativo.`,
        recommendation: 'Preparar aviso preventivo o adelantar salida.',
        confirmationLabel: 'Preparar aviso',
        eventId: event.id,
        eventTime: event.startTime,
      });
    }

    if (event.status === 'critico') {
      predictions.push({
        id: `critical-${event.id}`,
        level: 'critico',
        title: `Decisión crítica: ${event.title}`,
        signal: `${event.startTime}–${event.endTime}`,
        detail: event.expectedOutcome,
        recommendation: 'Preparar briefing, responsables y criterio de cierre antes del bloque.',
        confirmationLabel: 'Preparar briefing',
        eventId: event.id,
        eventTime: event.startTime,
      });
    }

    if (event.followUpRequired && event.status !== 'confirmado') {
      predictions.push({
        id: `followup-${event.id}`,
        level: event.priority === 'alta' ? 'alto' : 'medio',
        title: `Seguimiento requerido: ${event.title}`,
        signal: `${event.responsible} · ${event.escalationTarget || 'sin escalamiento'}`,
        detail: event.topic,
        recommendation: 'Confirmar responsable y dejar mensaje preparado.',
        confirmationLabel: 'Confirmar responsable',
        eventId: event.id,
        eventTime: event.startTime,
      });
    }
  });

  if (firstFreeWindow) {
    predictions.push({
      id: `free-window-${firstFreeWindow.id}`,
      level: 'bajo',
      title: 'Ventana útil detectada',
      signal: `${firstFreeWindow.startTime}–${firstFreeWindow.endTime}`,
      detail: 'LÍA detecta espacio disponible para seguimiento, documentación o briefing.',
      recommendation: 'Reservar bloque para cerrar pendientes ejecutivos.',
      confirmationLabel: 'Reservar bloque',
      eventId: firstFreeWindow.id,
      eventTime: firstFreeWindow.startTime,
    });
  }

  return sortPredictions(predictions).slice(0, 5);
}

export function getPredictiveSummary(predictions: ExecutivePrediction[]) {
  return {
    critical: predictions.filter((prediction) => prediction.level === 'critico').length,
    high: predictions.filter((prediction) => prediction.level === 'alto').length,
    total: predictions.length,
  };
}
