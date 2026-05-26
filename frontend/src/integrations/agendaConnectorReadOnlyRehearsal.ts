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
    message: 'Confirmar dueño.',
  },
  'preparar-seguimiento': {
    label: 'Preparar seguimiento',
    message: 'Preparar seguimiento.',
  },
  'cerrar-agenda': {
    label: 'Cerrar agenda',
    message: 'Cerrar agenda.',
  },
};

export const agendaConnectorReadOnlyRehearsal = {
  status: 'Lista',
  summary: 'Agenda lista para revisión.',
  indicators: ['Lectura OK', '3 eventos', 'Sin conexión real', 'Pendiente aprobación'],
  events: [
    { id: 'resumen-directivo', time: '09:00', title: 'Resumen directivo', initialStatus: 'pendiente' as AgendaEventStatus },
    { id: 'mesa-resolucion', time: '11:30', title: 'Mesa de resolución operativa', initialStatus: 'revisado' as AgendaEventStatus },
    { id: 'cierre-ejecutivo', time: '17:30', title: 'Cierre ejecutivo del día', initialStatus: 'preparado' as AgendaEventStatus },
  ],
  localLog: 'Evento listo.',
  handoffPreparedLog: 'Resumen listo.',
  followUpActionLog: 'Acción lista.',
  executiveClosureLog: 'Cierre listo.',
  briefingMarkedLog: 'Resumen listo.',
  audit: [
    'Ensayo seguro.',
    'Sin credenciales.',
    'Sin conexión real.',
    'Interacción local.',
    'Resumen local.',
    'Acción local.',
    'Cierre local.',
    'Resumen local.',
  ],
};
