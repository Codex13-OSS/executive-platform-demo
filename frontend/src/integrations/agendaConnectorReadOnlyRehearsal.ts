export const agendaConnectorReadOnlyRehearsal = {
  status: 'Ensayo de lectura listo',
  summary:
    'La agenda puede ensayar lectura de eventos sin conectarse todavía a una fuente real.',
  indicators: ['Lectura ensayada', 'Eventos preparados', 'Sin conexión real', 'Aprobación pendiente'],
  events: [
    { time: '09:00', title: 'Briefing directivo' },
    { time: '11:30', title: 'Mesa de resolución operativa' },
    { time: '17:30', title: 'Cierre ejecutivo del día' },
  ],
  audit: [
    'Ensayo ejecutado en modo seguro.',
    'Sin credenciales cargadas.',
    'Sin escritura ni conexión real.',
  ],
};
