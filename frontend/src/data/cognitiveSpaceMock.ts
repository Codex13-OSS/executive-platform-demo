export type CognitiveNodeStatus = 'stable' | 'attention' | 'critical' | 'active';

export type CognitiveNode = {
  id: string;
  label: string;
  domain: string;
  status: Exclude<CognitiveNodeStatus, 'active'>;
  score: number;
  x: number;
  y: number;
  pulse: number;
  context: string;
};

export const cognitiveSpaceNodes: CognitiveNode[] = [
  { id: 'agenda', label: 'Agenda', domain: 'Agenda', status: 'stable', score: 92, x: 50, y: 15, pulse: 1.4, context: 'Ritmo del día alineado.' },
  { id: 'riesgo', label: 'Riesgo', domain: 'Riesgo', status: 'critical', score: 63, x: 76, y: 24, pulse: 1.8, context: 'Señal alta, requiere decisión corta.' },
  { id: 'movilidad', label: 'Movilidad', domain: 'Movilidad', status: 'attention', score: 74, x: 86, y: 50, pulse: 1.6, context: 'Tránsito operativo con variación moderada.' },
  { id: 'documentos', label: 'Documentos', domain: 'Documentos', status: 'stable', score: 87, x: 76, y: 76, pulse: 1.3, context: 'Flujo documental en ventana de control.' },
  { id: 'seguimiento', label: 'Seguimiento', domain: 'Seguimiento', status: 'attention', score: 71, x: 50, y: 85, pulse: 1.7, context: 'Cierres pendientes en segundo frente.' },
  { id: 'decisiones', label: 'Decisiones', domain: 'Decisiones', status: 'critical', score: 66, x: 24, y: 76, pulse: 1.9, context: 'Dos decisiones con impacto cruzado.' },
  { id: 'equipo', label: 'Equipo', domain: 'Equipo', status: 'stable', score: 83, x: 14, y: 50, pulse: 1.45, context: 'Capacidad estable con foco táctico.' },
  { id: 'operacion', label: 'Operación', domain: 'Operación', status: 'attention', score: 78, x: 24, y: 24, pulse: 1.55, context: 'Ejecución firme con microajustes.' },
];
