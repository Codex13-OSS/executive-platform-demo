export type ExecutiveRouteSimulation = {
  id: string;
  label: string;
  departure: string;
  etaMinutes: number;
  arrivalRisk: 'bajo' | 'medio' | 'alto';
  recommendation: string;
};

export const executiveRouteSimulationMock: ExecutiveRouteSimulation[] = [
  {
    id: 'leave-now',
    label: 'Salir ahora',
    departure: 'Ahora',
    etaMinutes: 44,
    arrivalRisk: 'bajo',
    recommendation: 'Llegada dentro de margen operativo.',
  },
  {
    id: 'leave-10',
    label: 'Salir en 10 min',
    departure: '+10 min',
    etaMinutes: 51,
    arrivalRisk: 'medio',
    recommendation: 'Mantener alerta por tráfico acumulado.',
  },
  {
    id: 'leave-30',
    label: 'Salir en 30 min',
    departure: '+30 min',
    etaMinutes: 68,
    arrivalRisk: 'alto',
    recommendation: 'Preparar aviso o reprogramación preventiva.',
  },
];
