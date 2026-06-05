export type LiaAgentBridgeMode = 'local_locked' | 'readonly_rehearsal' | 'ready_for_backend';

export type LiaAgentConnectionStatus = 'locked' | 'offline' | 'ready_local';

export type LiaAgentPermissionScope =
  | 'agenda_read'
  | 'agenda_suggest'
  | 'memory_read'
  | 'memory_prepare'
  | 'whatsapp_prepare'
  | 'voice_prepare'
  | 'ops_status_read';

export type LiaAgentCommandIntent =
  | 'briefing'
  | 'agenda_review'
  | 'risk_review'
  | 'followup_prepare'
  | 'memory_prepare'
  | 'whatsapp_prepare'
  | 'voice_prepare'
  | 'ops_status';

export type LiaAgentActionRisk = 'safe' | 'needs_confirmation' | 'blocked';

export type LiaAgentBridgeCommand = {
  id: string;
  intent: LiaAgentCommandIntent;
  mode: 'local_locked';
  requestedScopes: LiaAgentPermissionScope[];
  risk: LiaAgentActionRisk;
  humanConfirmationRequired: true;
  executionEnabled: false;
  realActionEnabled: false;
  preparedOnly: true;
  blockedReason: string;
};

export type LiaAgentBridgeResponse = {
  id: string;
  commandId: string;
  status: 'prepared' | 'blocked';
  mode: 'local_locked';
  risk: LiaAgentActionRisk;
  message: string;
  executionEnabled: false;
  transportEnabled: false;
  realActionEnabled: false;
  requiresHumanGate: true;
};

export type LiaAgentBridgeSnapshot = {
  version: '4.3.0';
  mode: LiaAgentBridgeMode;
  connectionStatus: LiaAgentConnectionStatus;
  transportEnabled: false;
  backendConnected: false;
  realActionsEnabled: false;
  voiceEnabled: false;
  whatsappEnabled: false;
  memoryWriteEnabled: false;
  allowedScopes: LiaAgentPermissionScope[];
  blockedReasons: string[];
  supportedIntents: LiaAgentCommandIntent[];
  safetyNotice: string;
};

export type LiaAgentBridgeSelfCheckResult = {
  status: 'safe' | 'warning';
  checkedAt: string;
  checks: Array<{
    id: string;
    passed: boolean;
    detail: string;
  }>;
};
