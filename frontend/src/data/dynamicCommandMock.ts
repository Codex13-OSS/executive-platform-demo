export type CommandStatus = 'ready' | 'waiting_confirmation' | 'prepared' | 'blocked';
export type CommandPriority = 'low' | 'medium' | 'high' | 'critical';
export type CommandType = 'resumen' | 'followup' | 'document' | 'agenda' | 'risk' | 'team';

export type DynamicCommand = {
  id: string;
  label: string;
  hint: string;
  status: CommandStatus;
  priority: CommandPriority;
  type: CommandType;
  requiresConfirmation: boolean;
  feedback: string;
};

export const dynamicCommandMock: DynamicCommand[] = [
  {
    id: 'prepare-resumen',
    label: 'Preparar resumen',
    hint: 'Junta de dirección · 09:30',
    status: 'ready',
    priority: 'high',
    type: 'resumen',
    requiresConfirmation: true,
    feedback: 'Listo para revisión',
  },
  {
    id: 'confirm-owner',
    label: 'Confirmar responsable',
    hint: 'Proceso crítico · Comercial',
    status: 'waiting_confirmation',
    priority: 'critical',
    type: 'team',
    requiresConfirmation: true,
    feedback: 'Requiere confirmación',
  },
  {
    id: 'validate-document',
    label: 'Validar documento',
    hint: 'Propuesta final pendiente',
    status: 'ready',
    priority: 'medium',
    type: 'document',
    requiresConfirmation: false,
    feedback: 'Preparado para revisión',
  },
  {
    id: 'sync-agenda',
    label: 'Sincronizar agenda',
    hint: 'Equipo núcleo · hoy',
    status: 'prepared',
    priority: 'low',
    type: 'agenda',
    requiresConfirmation: false,
    feedback: 'Listo para revisión',
  },
  {
    id: 'escalate-risk',
    label: 'Escalar riesgo',
    hint: 'Desvío operativo detectado',
    status: 'blocked',
    priority: 'critical',
    type: 'risk',
    requiresConfirmation: true,
    feedback: 'Requiere confirmación',
  },
  {
    id: 'generate-summary',
    label: 'Generar resumen ejecutivo',
    hint: 'Cierre de jornada',
    status: 'ready',
    priority: 'high',
    type: 'followup',
    requiresConfirmation: true,
    feedback: 'Preparado para revisión',
  },
];
