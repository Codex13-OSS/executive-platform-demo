export type DailySummaryCard = {
  id: string;
  title: string;
  value: string;
  note: string;
};

export const mockDashboardCards: DailySummaryCard[] = [
  {
    id: 'prioridades',
    title: 'Prioridades activas',
    value: '8',
    note: '2 requieren seguimiento inmediato',
  },
  {
    id: 'reuniones',
    title: 'Reuniones clave hoy',
    value: '5',
    note: 'Primera sesión 09:30 AM',
  },
  {
    id: 'conversiones',
    title: 'Acciones convertidas',
    value: '14',
    note: '85% dentro del SLA esperado',
  },
];
