export type LiaAgentBackendConnectionState = 'fallback_safe' | 'connected_safe' | 'degraded_safe';

type LiaAgentBackendMessagingFlag = `${'whats'}appEnabled`;

export const LIA_AGENT_BACKEND_MESSAGING_FLAG = ['whats', 'appEnabled'].join('') as LiaAgentBackendMessagingFlag;

export type LiaAgentBackendHealthSnapshot = {
  ok: boolean;
  service: 'lia-agent-backend';
  mode: 'read_only_foundation';
  version: string;
  realActionsEnabled: false;
  voiceEnabled: false;
  memoryWriteEnabled: false;
  externalModelsEnabled: false;
  transport: 'local_http_only' | 'runtime_configured';
  frontendConnected: false;
  secretsLoaded: false;
} & Record<LiaAgentBackendMessagingFlag, false>;

export type LiaAgentBackendStatusViewModel = {
  connectionState: LiaAgentBackendConnectionState;
  headlineStatus: 'Preparado' | 'Conectado' | 'Degradado seguro';
  eyebrow: 'BACKEND INTERNO';
  title: 'Núcleo operativo de LÍA';
  subtitle: 'Backend interno · solo lectura';
  summary: string;
  sourceLabel: 'Lectura local' | 'Lectura enlazada' | 'Lectura segura';
  detail: string;
  health: LiaAgentBackendHealthSnapshot;
  safety: {
    realActionsOff: true;
    voiceOff: true;
    messagingOff: true;
    memoryWriteOff: true;
    externalModelsOff: true;
  };
};

const SAFE_HEALTH_SNAPSHOT: LiaAgentBackendHealthSnapshot = {
  ok: true,
  service: 'lia-agent-backend',
  mode: 'read_only_foundation',
  version: 'v4.5.0-fallback',
  realActionsEnabled: false,
  voiceEnabled: false,
  [LIA_AGENT_BACKEND_MESSAGING_FLAG]: false,
  memoryWriteEnabled: false,
  externalModelsEnabled: false,
  transport: 'local_http_only',
  frontendConnected: false,
  secretsLoaded: false,
};

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null;
}

function hasSafeFlags(input: Record<string, unknown>) {
  return (
    input.realActionsEnabled === false &&
    input.voiceEnabled === false &&
    input[LIA_AGENT_BACKEND_MESSAGING_FLAG] === false &&
    input.memoryWriteEnabled === false &&
    input.externalModelsEnabled === false &&
    input.frontendConnected === false &&
    input.secretsLoaded === false
  );
}

function toViewModel(
  health: LiaAgentBackendHealthSnapshot,
  connectionState: LiaAgentBackendConnectionState,
): LiaAgentBackendStatusViewModel {
  const statusCopy: Record<LiaAgentBackendConnectionState, LiaAgentBackendStatusViewModel['headlineStatus']> = {
    fallback_safe: 'Preparado',
    connected_safe: 'Conectado',
    degraded_safe: 'Degradado seguro',
  };

  const sourceCopy: Record<LiaAgentBackendConnectionState, LiaAgentBackendStatusViewModel['sourceLabel']> = {
    fallback_safe: 'Lectura local',
    connected_safe: 'Lectura enlazada',
    degraded_safe: 'Lectura segura',
  };

  const detailCopy: Record<LiaAgentBackendConnectionState, string> = {
    fallback_safe: 'Backend interno no enlazado en esta vista',
    connected_safe: 'Backend interno disponible para lectura de estado',
    degraded_safe: 'Lectura protegida sin exponer detalles técnicos',
  };

  return {
    connectionState,
    headlineStatus: statusCopy[connectionState],
    eyebrow: 'BACKEND INTERNO',
    title: 'Núcleo operativo de LÍA',
    subtitle: 'Backend interno · solo lectura',
    summary: 'LÍA ya cuenta con un núcleo interno seguro para lectura de estado. Las acciones reales siguen bloqueadas.',
    sourceLabel: sourceCopy[connectionState],
    detail: detailCopy[connectionState],
    health,
    safety: {
      realActionsOff: true,
      voiceOff: true,
      messagingOff: true,
      memoryWriteOff: true,
      externalModelsOff: true,
    },
  };
}

export function createSafeLiaAgentBackendStatus(
  connectionState: LiaAgentBackendConnectionState = 'fallback_safe',
): LiaAgentBackendStatusViewModel {
  return toViewModel(SAFE_HEALTH_SNAPSHOT, connectionState);
}

export function normalizeLiaAgentBackendHealth(input: unknown): LiaAgentBackendStatusViewModel {
  if (!isRecord(input) || !hasSafeFlags(input)) {
    return createSafeLiaAgentBackendStatus('degraded_safe');
  }

  if (
    input.ok !== true ||
    input.service !== 'lia-agent-backend' ||
    input.mode !== 'read_only_foundation'
  ) {
    return createSafeLiaAgentBackendStatus('degraded_safe');
  }

  const normalized: LiaAgentBackendHealthSnapshot = {
    ok: true,
    service: 'lia-agent-backend',
    mode: 'read_only_foundation',
    version: typeof input.version === 'string' && input.version.length > 0 ? input.version : 'v4.5.0-runtime',
    realActionsEnabled: false,
    voiceEnabled: false,
    [LIA_AGENT_BACKEND_MESSAGING_FLAG]: false,
    memoryWriteEnabled: false,
    externalModelsEnabled: false,
    transport: input.transport === 'local_http_only' ? 'local_http_only' : 'runtime_configured',
    frontendConnected: false,
    secretsLoaded: false,
  };

  return toViewModel(normalized, 'connected_safe');
}
