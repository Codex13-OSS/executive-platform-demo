export type AgendaEventStatus = 'revisado' | 'pendiente' | 'preparado';

export const agendaEventStatusOptions: Array<{ id: AgendaEventStatus; label: string }> = [
  { id: 'revisado', label: 'Revisado' },
  { id: 'pendiente', label: 'Pendiente' },
  { id: 'preparado', label: 'Preparado' },
];

export const agendaConnectorReadOnlyRehearsal = {
  status: 'Ensayo de lectura listo',
  summary:
    'La agenda puede ensayar lectura de eventos sin conectarse todavía a una fuente real.',
  indicators: ['Lectura ensayada', 'Eventos preparados', 'Sin conexión real', 'Aprobación pendiente'],
  events: [
    { id: 'briefing-directivo', time: '09:00', title: 'Briefing directivo', initialStatus: 'pendiente' as AgendaEventStatus },
    { id: 'mesa-resolucion', time: '11:30', title: 'Mesa de resolución operativa', initialStatus: 'revisado' as AgendaEventStatus },
    { id: 'cierre-ejecutivo', time: '17:30', title: 'Cierre ejecutivo del día', initialStatus: 'preparado' as AgendaEventStatus },
  ],
  localLog: 'Evento actualizado en modo seguro.',
  handoffPreparedLog: 'Resumen ejecutivo preparado en modo seguro.',
  audit: [
    'Ensayo ejecutado en modo seguro.',
    'Sin credenciales cargadas.',
    'Sin escritura ni conexión real.',
    'Interacciones ejecutadas solo en modo local.',
    'Resumen preparado solo de forma local.',
  ],
};
