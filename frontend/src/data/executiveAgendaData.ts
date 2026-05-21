export type ExecutiveEventStatus =
  | 'confirmado'
  | 'pendiente'
  | 'critico'
  | 'seguimiento'
  | 'libre';

export type ExecutiveEventPriority =
  | 'alta'
  | 'media'
  | 'baja';

export type ExecutiveEventType =
  | 'reunion'
  | 'comida'
  | 'llamada'
  | 'traslado'
  | 'briefing'
  | 'seguimiento';

export type ExecutiveAgendaEvent = {
  id: string;
  dayId: string;

  title: string;
  type: ExecutiveEventType;

  startTime: string;
  endTime: string;

  location: string;
  address: string;

  responsible: string;

  priority: ExecutiveEventPriority;
  status: ExecutiveEventStatus;

  topic: string;
  expectedOutcome: string;

  followUpRequired: boolean;
  reminderBeforeMinutes: number;

  escalationTarget: string;

  mobilityRisk: 'bajo' | 'medio' | 'alto';

  etaMinutes: number;
  recommendedDeparture: string;

  trafficLevel: 'fluido' | 'moderado' | 'alto';

  weather: string;

  notes: string;
};

export const executiveAgendaTimeline: ExecutiveAgendaEvent[] = [
  {
    id: 'texon-breakfast',
    dayId: 'mie',

    title: 'Desayuno con socios',
    type: 'reunion',

    startTime: '10:00',
    endTime: '12:00',

    location: 'Santa Fe',
    address: 'Corporativo ejecutivo',

    responsible: 'Dirección',

    priority: 'alta',
    status: 'confirmado',

    topic: 'Cierres operativos y expansión',
    expectedOutcome: 'Definir responsables y próximos acuerdos.',

    followUpRequired: true,
    reminderBeforeMinutes: 40,

    escalationTarget: 'Equipo operativo',

    mobilityRisk: 'medio',

    etaMinutes: 58,
    recommendedDeparture: '08:47',

    trafficLevel: 'alto',

    weather: 'Lluvia ligera',

    notes: 'LÍA detectó tráfico elevado en corredor corporativo.',
  },

  {
    id: 'executive-gap',
    dayId: 'mie',

    title: 'Ventana libre estratégica',
    type: 'seguimiento',

    startTime: '12:00',
    endTime: '14:00',

    location: 'Disponible',
    address: '',

    responsible: 'LÍA',

    priority: 'baja',
    status: 'libre',

    topic: 'Espacio útil para seguimiento',
    expectedOutcome: 'Resolver pendientes ejecutivos.',

    followUpRequired: false,
    reminderBeforeMinutes: 0,

    escalationTarget: '',

    mobilityRisk: 'bajo',

    etaMinutes: 0,
    recommendedDeparture: '--:--',

    trafficLevel: 'fluido',

    weather: 'Parcialmente nublado',

    notes: 'LÍA recomienda usar este bloque para llamadas críticas.',
  },

  {
    id: 'systems-meeting',
    dayId: 'mie',

    title: 'Reunión con sistemas',
    type: 'reunion',

    startTime: '15:00',
    endTime: '18:00',

    location: 'Centro operativo',
    address: 'Sala Nexus',

    responsible: 'Tecnología',

    priority: 'alta',
    status: 'seguimiento',

    topic: 'Infraestructura y automatización',
    expectedOutcome: 'Definir prioridades técnicas.',

    followUpRequired: true,
    reminderBeforeMinutes: 30,

    escalationTarget: 'Equipo TI',

    mobilityRisk: 'alto',

    etaMinutes: 44,
    recommendedDeparture: '14:02',

    trafficLevel: 'alto',

    weather: 'Lluvia intensa',

    notes: 'Riesgo elevado de retraso después de las 14:20.',
  },

  {
    id: 'executive-dinner',
    dayId: 'mie',

    title: 'Comida ejecutiva',
    type: 'comida',

    startTime: '18:00',
    endTime: '20:00',

    location: 'Polanco',
    address: 'Zona corporativa',

    responsible: 'Dirección',

    priority: 'media',
    status: 'pendiente',

    topic: 'Networking estratégico',
    expectedOutcome: 'Mantener relación comercial.',

    followUpRequired: false,
    reminderBeforeMinutes: 20,

    escalationTarget: '',

    mobilityRisk: 'medio',

    etaMinutes: 32,
    recommendedDeparture: '17:08',

    trafficLevel: 'moderado',

    weather: 'Nublado',

    notes: 'Posible saturación vial moderada.',
  },

  {
    id: 'texon-call',
    dayId: 'mie',

    title: 'Llamada con grupo Texon',
    type: 'llamada',

    startTime: '20:00',
    endTime: '23:30',

    location: 'Videollamada',
    address: '',

    responsible: 'Dirección / Operación',

    priority: 'alta',
    status: 'critico',

    topic: 'Seguimiento operativo y decisiones pendientes',
    expectedOutcome: 'Definir responsables y próximos cierres.',

    followUpRequired: true,
    reminderBeforeMinutes: 30,

    escalationTarget: 'Equipo operativo',

    mobilityRisk: 'bajo',

    etaMinutes: 0,
    recommendedDeparture: '--:--',

    trafficLevel: 'fluido',

    weather: 'Noche despejada',

    notes: 'LÍA recomienda briefing previo antes de iniciar.',
  },
];
