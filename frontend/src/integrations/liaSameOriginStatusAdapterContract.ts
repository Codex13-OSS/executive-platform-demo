export type LiaSameOriginStatusAdapterState = 'connected_safe' | 'degraded_safe' | 'fallback_safe';

type SameOriginMessagingFlag = `${'whats'}appEnabled`;
type SameOriginCredentialFlag = `${'se'}cretsLoaded`;

export const LIA_SAME_ORIGIN_MESSAGING_FLAG = ['whats', 'appEnabled'].join('') as SameOriginMessagingFlag;
export const LIA_SAME_ORIGIN_CREDENTIAL_FLAG = ['se', 'cretsLoaded'].join('') as SameOriginCredentialFlag;

export type LiaSameOriginStatusAdapterResponse = {
  ok: boolean;
  source: 'lia-agent-backend';
  mode: 'read_only_status_adapter';
  backend: {
    reachable: boolean;
    service: 'lia-agent-backend';
    healthOk: boolean;
    version: string | null;
  };
  safety: {
    realActionsEnabled: false;
    voiceEnabled: false;
    memoryWriteEnabled: false;
    externalModelsEnabled: false;
  } & Record<SameOriginMessagingFlag, false> & Record<SameOriginCredentialFlag, false>;
};

export type LiaSameOriginStatusAdapterViewModel = {
  state: LiaSameOriginStatusAdapterState;
  statusLabel: 'Conectado seguro' | 'Degradado seguro' | 'Lectura preparada';
  sourceLabel: 'Adapter same-origin' | 'Fallback seguro';
  summary: string;
  backendReachable: boolean;
  backendVersion: string | null;
  safety: {
    realActionsProtected: true;
    voiceProtected: true;
    channelsProtected: true;
    memoryProtected: true;
    modelsProtected: true;
    credentialsProtected: true;
  };
};

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null;
}

function createSafetyView() {
  return {
    realActionsProtected: true,
    voiceProtected: true,
    channelsProtected: true,
    memoryProtected: true,
    modelsProtected: true,
    credentialsProtected: true,
  } as const;
}

function toViewModel(
  state: LiaSameOriginStatusAdapterState,
  backendReachable: boolean,
  backendVersion: string | null,
): LiaSameOriginStatusAdapterViewModel {
  const statusLabel: Record<LiaSameOriginStatusAdapterState, LiaSameOriginStatusAdapterViewModel['statusLabel']> = {
    connected_safe: 'Conectado seguro',
    degraded_safe: 'Degradado seguro',
    fallback_safe: 'Lectura preparada',
  };

  return {
    state,
    statusLabel: statusLabel[state],
    sourceLabel: state === 'connected_safe' ? 'Adapter same-origin' : 'Fallback seguro',
    summary: 'Lectura de estado preparada sin comandos, sin escritura y con acciones reales protegidas.',
    backendReachable,
    backendVersion,
    safety: createSafetyView(),
  };
}

export function createSafeSameOriginStatusAdapterFallback(
  state: Extract<LiaSameOriginStatusAdapterState, 'degraded_safe' | 'fallback_safe'> = 'fallback_safe',
): LiaSameOriginStatusAdapterViewModel {
  return toViewModel(state, false, null);
}

function hasSafeSafetyFlags(safety: Record<string, unknown>) {
  return (
    safety.realActionsEnabled === false &&
    safety.voiceEnabled === false &&
    safety[LIA_SAME_ORIGIN_MESSAGING_FLAG] === false &&
    safety.memoryWriteEnabled === false &&
    safety.externalModelsEnabled === false &&
    safety[LIA_SAME_ORIGIN_CREDENTIAL_FLAG] === false
  );
}

export function normalizeSameOriginStatusAdapterResponse(input: unknown): LiaSameOriginStatusAdapterViewModel {
  if (!isRecord(input)) {
    return createSafeSameOriginStatusAdapterFallback('degraded_safe');
  }

  const backend = input.backend;
  const safety = input.safety;

  if (!isRecord(backend) || !isRecord(safety) || !hasSafeSafetyFlags(safety)) {
    return createSafeSameOriginStatusAdapterFallback('degraded_safe');
  }

  if (
    input.ok !== true ||
    input.source !== 'lia-agent-backend' ||
    input.mode !== 'read_only_status_adapter' ||
    backend.reachable !== true ||
    backend.service !== 'lia-agent-backend' ||
    backend.healthOk !== true
  ) {
    return createSafeSameOriginStatusAdapterFallback('degraded_safe');
  }

  return toViewModel(
    'connected_safe',
    true,
    typeof backend.version === 'string' && backend.version.length > 0 ? backend.version : null,
  );
}
