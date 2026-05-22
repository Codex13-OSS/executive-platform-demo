export type CognitiveNode = {
  id: string;
  label: string;
  domain: 'agenda' | 'risk' | 'ops' | 'finance' | 'people';
  score: number;
  status: 'stable' | 'attention' | 'critical';
};

export const cognitiveSpaceNodes: CognitiveNode[] = [
  { id: 'agenda', label: 'Agenda estratégica', domain: 'agenda', score: 91, status: 'stable' },
  { id: 'risk', label: 'Riesgo comercial', domain: 'risk', score: 74, status: 'attention' },
  { id: 'ops', label: 'Ejecución operativa', domain: 'ops', score: 88, status: 'stable' },
  { id: 'finance', label: 'Flujo financiero', domain: 'finance', score: 69, status: 'attention' },
  { id: 'people', label: 'Capacidad de equipos', domain: 'people', score: 64, status: 'critical' },
];
