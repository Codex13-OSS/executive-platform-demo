import type {
  LiaAgentBridgeCommand,
  LiaAgentBridgeResponse,
  LiaAgentBridgeSnapshot,
  LiaAgentCommandIntent,
  LiaAgentPermissionScope,
} from './liaAgentBridgeContract';

const SAFE_LOCAL_SCOPES: LiaAgentPermissionScope[] = [
  'agenda_read',
  'agenda_suggest',
  'memory_read',
  'memory_prepare',
  'whatsapp_prepare',
  'voice_prepare',
  'ops_status_read',
];

const SUPPORTED_INTENTS: LiaAgentCommandIntent[] = [
  'briefing',
  'agenda_review',
  'risk_review',
  'followup_prepare',
  'memory_prepare',
  'whatsapp_prepare',
  'voice_prepare',
  'ops_status',
];

const COMMAND_SCOPE_MAP: Record<LiaAgentCommandIntent, LiaAgentPermissionScope[]> = {
  briefing: ['agenda_read', 'memory_read', 'ops_status_read'],
  agenda_review: ['agenda_read', 'agenda_suggest'],
  risk_review: ['agenda_read', 'ops_status_read'],
  followup_prepare: ['agenda_read', 'memory_prepare'],
  memory_prepare: ['memory_read', 'memory_prepare'],
  whatsapp_prepare: ['whatsapp_prepare'],
  voice_prepare: ['voice_prepare'],
  ops_status: ['ops_status_read'],
};

const BLOCKED_REASONS = [
  'Backend aún no activado',
  'Acciones reales requieren gates humanos',
  'Voz y WhatsApp permanecen en preparación',
];

export function createLockedLiaAgentBridgeSnapshot(): LiaAgentBridgeSnapshot {
  return {
    version: '4.3.0',
    mode: 'local_locked',
    connectionStatus: 'locked',
    transportEnabled: false,
    backendConnected: false,
    realActionsEnabled: false,
    voiceEnabled: false,
    whatsappEnabled: false,
    memoryWriteEnabled: false,
    allowedScopes: SAFE_LOCAL_SCOPES,
    blockedReasons: BLOCKED_REASONS,
    supportedIntents: SUPPORTED_INTENTS,
    safetyNotice: 'Contrato local: prepara intenciones sin ejecutar acciones reales ni abrir transporte real.',
  };
}

export function prepareLocalLiaAgentCommand(intent: LiaAgentCommandIntent): LiaAgentBridgeCommand {
  return {
    id: `lia-agent-local-${intent}-v430`,
    intent,
    mode: 'local_locked',
    requestedScopes: COMMAND_SCOPE_MAP[intent],
    risk: intent === 'briefing' || intent === 'ops_status' ? 'safe' : 'needs_confirmation',
    humanConfirmationRequired: true,
    executionEnabled: false,
    realActionEnabled: false,
    preparedOnly: true,
    blockedReason: 'Puente local bloqueado hasta activar compuertas humanas y backend.',
  };
}

export function getLiaAgentBridgeStatus(): LiaAgentBridgeResponse {
  const command = prepareLocalLiaAgentCommand('ops_status');

  return {
    id: 'lia-agent-status-v430',
    commandId: command.id,
    status: 'blocked',
    mode: 'local_locked',
    risk: 'blocked',
    message: 'Puente preparado para lectura y preparación local; toda acción real sigue bloqueada.',
    executionEnabled: false,
    transportEnabled: false,
    realActionEnabled: false,
    requiresHumanGate: true,
  };
}
