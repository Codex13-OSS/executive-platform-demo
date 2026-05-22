export type CognitiveNodeState = 'stable' | 'attention' | 'critical' | 'active';

export type CognitiveSpaceNode = {
  id: string;
  label: string;
  short: string;
  x: number;
  y: number;
  depth: 'front' | 'mid' | 'back';
  state: CognitiveNodeState;
  metric: string;
};

export const cognitiveSpaceNodes: CognitiveSpaceNode[] = [
  { id: 'agenda', label: 'Agenda', short: 'AG', x: 19, y: 30, depth: 'mid', state: 'active', metric: '4 hitos' },
  { id: 'riesgo', label: 'Riesgo', short: 'RI', x: 34, y: 17, depth: 'front', state: 'critical', metric: '2 señales' },
  { id: 'movilidad', label: 'Movilidad', short: 'MV', x: 59, y: 15, depth: 'back', state: 'attention', metric: 'ETA 11m' },
  { id: 'documentos', label: 'Documentos', short: 'DO', x: 80, y: 30, depth: 'mid', state: 'attention', metric: '5 revisión' },
  { id: 'seguimientos', label: 'Seguimiento', short: 'SE', x: 83, y: 58, depth: 'front', state: 'active', metric: '7 activos' },
  { id: 'decisiones', label: 'Decisiones', short: 'DE', x: 66, y: 79, depth: 'front', state: 'critical', metric: '3 prioridad' },
  { id: 'equipo', label: 'Equipo', short: 'EQ', x: 39, y: 83, depth: 'mid', state: 'stable', metric: '9 sincron.' },
  { id: 'operacion', label: 'Operación', short: 'OP', x: 17, y: 64, depth: 'back', state: 'stable', metric: 'Cadencia 88%' },
];

export const cognitiveSpaceLinks = [
  ['agenda', 'riesgo'],
  ['agenda', 'movilidad'],
  ['riesgo', 'decisiones'],
  ['movilidad', 'documentos'],
  ['documentos', 'seguimientos'],
  ['seguimientos', 'decisiones'],
  ['decisiones', 'equipo'],
  ['equipo', 'operacion'],
  ['operacion', 'agenda'],
  ['operacion', 'seguimientos'],
] as const;
