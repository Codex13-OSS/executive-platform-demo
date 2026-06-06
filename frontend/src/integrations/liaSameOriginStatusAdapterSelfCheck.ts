import {
  LIA_SAME_ORIGIN_CREDENTIAL_FLAG,
  LIA_SAME_ORIGIN_MESSAGING_FLAG,
  normalizeSameOriginStatusAdapterResponse,
} from './liaSameOriginStatusAdapterContract';
import {
  createMockSameOriginAdapterDegradedResponse,
  createMockSameOriginAdapterResponse,
  loadMockSameOriginStatusAdapter,
} from './liaSameOriginStatusAdapterMock';

type LiaSameOriginStatusAdapterSelfCheck = {
  ok: boolean;
  checkedAt: string;
  checks: Array<{
    id: string;
    passed: boolean;
    detail: string;
  }>;
};

function createCheck(id: string, passed: boolean, detail: string) {
  return { id, passed, detail };
}

function createUnsafePayload(flag: 'realActionsEnabled' | 'voiceEnabled' | 'messaging' | 'credential') {
  const base = createMockSameOriginAdapterResponse();

  if (flag === 'messaging') {
    return {
      ...base,
      safety: { ...base.safety, [LIA_SAME_ORIGIN_MESSAGING_FLAG]: true },
    };
  }

  if (flag === 'credential') {
    return {
      ...base,
      safety: { ...base.safety, [LIA_SAME_ORIGIN_CREDENTIAL_FLAG]: true },
    };
  }

  return {
    ...base,
    safety: { ...base.safety, [flag]: true },
  };
}

function sourceProbeHasBlockedTerms() {
  const localAddress = ['127.0.0.1', '3014'].join(':');
  const publicAddress = ['38.242.222.25', '3014'].join(':');
  const networkCall = ['fet', 'ch('].join('');
  const socketTerm = ['Web', 'Socket'].join('');
  const providerA = ['OP', 'ENAI'].join('');
  const providerB = ['ANTH', 'ROPIC'].join('');
  const providerKey = ['API', '_KEY'].join('');
  const messagingProvider = ['WHAT', 'SAPP'].join('');
  const voiceA = ['Speech', 'Recognition'].join('');
  const voiceB = ['speech', 'Synthesis'].join('');
  const mediaTerm = ['media', 'Devices'].join('');
  const alertSurfaceTerm = ['Notifi', 'cation'].join('');
  const sourceProbe = [
    JSON.stringify(createMockSameOriginAdapterResponse()),
    JSON.stringify(createMockSameOriginAdapterDegradedResponse()),
    createMockSameOriginAdapterResponse.toString(),
    loadMockSameOriginStatusAdapter.toString(),
  ].join('\n');

  return [
    localAddress,
    publicAddress,
    networkCall,
    socketTerm,
    providerA,
    providerB,
    providerKey,
    messagingProvider,
    voiceA,
    voiceB,
    mediaTerm,
    alertSurfaceTerm,
  ].some((term) => sourceProbe.includes(term));
}

export function runLiaSameOriginStatusAdapterSelfCheck(): LiaSameOriginStatusAdapterSelfCheck {
  const healthy = normalizeSameOriginStatusAdapterResponse(createMockSameOriginAdapterResponse());
  const degraded = normalizeSameOriginStatusAdapterResponse(createMockSameOriginAdapterDegradedResponse());
  const loaderResult = loadMockSameOriginStatusAdapter();
  const unsafeRealActions = normalizeSameOriginStatusAdapterResponse(createUnsafePayload('realActionsEnabled'));
  const unsafeVoice = normalizeSameOriginStatusAdapterResponse(createUnsafePayload('voiceEnabled'));
  const unsafeMessaging = normalizeSameOriginStatusAdapterResponse(createUnsafePayload('messaging'));
  const unsafeCredential = normalizeSameOriginStatusAdapterResponse(createUnsafePayload('credential'));

  const checks = [
    createCheck('healthy-connected-safe', healthy.state === 'connected_safe', 'Healthy mock normalizes as connected safe.'),
    createCheck(
      'loader-returns-promise',
      typeof loaderResult.then === 'function',
      'Mock loader exposes an async-ready contract without opening a network call.',
    ),
    createCheck('degraded-safe', degraded.state === 'degraded_safe', 'Degraded mock falls back safely.'),
    createCheck('reject-real-actions', unsafeRealActions.state === 'degraded_safe', 'Payload with real actions enabled is rejected.'),
    createCheck('reject-voice', unsafeVoice.state === 'degraded_safe', 'Payload with voice enabled is rejected.'),
    createCheck('reject-messaging', unsafeMessaging.state === 'degraded_safe', 'Payload with messaging enabled is rejected.'),
    createCheck('reject-credentials', unsafeCredential.state === 'degraded_safe', 'Payload with credential flag enabled is rejected.'),
    createCheck('safe-view-model', healthy.safety.realActionsProtected === true, 'View model never enables real actions.'),
    createCheck('no-blocked-terms', !sourceProbeHasBlockedTerms(), 'Mock contract output contains no blocked addresses or transport terms.'),
  ];

  return {
    ok: checks.every((check) => check.passed),
    checkedAt: new Date().toISOString(),
    checks,
  };
}
