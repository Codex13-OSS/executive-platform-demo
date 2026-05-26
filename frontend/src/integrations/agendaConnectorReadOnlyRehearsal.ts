export type AgendaEventStatus = 'revisado' | 'pendiente' | 'preparado';

export type AgendaFollowUpActionId = 'confirmar-responsable' | 'preparar-seguimiento' | 'cerrar-agenda';

export const agendaEventStatusOptions: Array<{ id: AgendaEventStatus; label: string }> = [
  { id: 'revisado', label: 'Revisado' },
  { id: 'pendiente', label: 'Pendiente' },
  { id: 'preparado', label: 'Preparado' },
];

export const agendaFollowUpActions: Record<
  AgendaFollowUpActionId,
  { label: string; message: string }
> = {
  'confirmar-responsable': {
    label: 'Confirmar responsable',
    message: 'Hay puntos pendientes que requieren dueño antes del cierre.',
  },
  'preparar-seguimiento': {
    label: 'Preparar seguimiento',
    message: 'La agenda está lista para preparar el siguiente paso.',
  },
  'cerrar-agenda': {
    label: 'Cerrar agenda',
    message: 'El resumen está listo para cierre ejecutivo.',
  },
};

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
  followUpActionLog: 'Acción marcada en modo seguro.',
  executiveClosureLog: 'Cierre marcado en modo seguro.',
  audit: [
    'Ensayo ejecutado en modo seguro.',
    'Sin credenciales cargadas.',
    'Sin escritura ni conexión real.',
    'Interacciones ejecutadas solo en modo local.',
    'Resumen preparado solo de forma local.',
    'Acciones de seguimiento ejecutadas solo de forma local.',
    'Cierre ejecutivo marcado solo de forma local.',
  ],
};
