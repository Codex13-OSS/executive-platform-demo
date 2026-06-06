import {
  LIA_AGENT_BACKEND_MESSAGING_FLAG,
  createSafeLiaAgentBackendStatus,
  normalizeLiaAgentBackendHealth,
} from './liaAgentBackendStatusContract';

type LiaAgentBackendStatusSelfCheck = {
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

function hasBlockedAddress(input: string) {
  const localAddress = ['127.0.0.1', '3014'].join(':');
  const publicAddress = ['38.242.222.25', '3014'].join(':');

  return input.includes(localAddress) || input.includes(publicAddress);
}

function viewModelIsLocked() {
  const fallback = createSafeLiaAgentBackendStatus();

  return (
    fallback.safety.realActionsOff === true &&
    fallback.safety.voiceOff === true &&
    fallback.safety.messagingOff === true &&
    fallback.safety.memoryWriteOff === true &&
    fallback.safety.externalModelsOff === true
  );
}

export function runLiaAgentBackendStatusSelfCheck(): LiaAgentBackendStatusSelfCheck {
  const fallback = createSafeLiaAgentBackendStatus();
  const unsafeNormalized = normalizeLiaAgentBackendHealth({
    ok: true,
    service: 'lia-agent-backend',
    mode: 'read_only_foundation',
    version: 'unsafe-check',
    realActionsEnabled: true,
    voiceEnabled: true,
    [LIA_AGENT_BACKEND_MESSAGING_FLAG]: true,
    memoryWriteEnabled: true,
    externalModelsEnabled: true,
    transport: 'local_http_only',
    frontendConnected: true,
    secretsLoaded: true,
  });

  const sourceProbe = [
    fallback.detail,
    fallback.summary,
    fallback.health.transport,
    unsafeNormalized.headlineStatus,
  ].join(' ');

  const checks = [
    createCheck('fallback-status-prepared', fallback.headlineStatus === 'Preparado', 'Fallback renders prepared state.'),
    createCheck('fallback-local-read', fallback.sourceLabel === 'Lectura local', 'Fallback uses local read copy.'),
    createCheck('fallback-real-actions-off', fallback.health.realActionsEnabled === false, 'Real actions are off.'),
    createCheck('fallback-voice-off', fallback.health.voiceEnabled === false, 'Voice is off.'),
    createCheck('fallback-messaging-off', fallback.health[LIA_AGENT_BACKEND_MESSAGING_FLAG] === false, 'Messaging is off.'),
    createCheck('fallback-memory-write-off', fallback.health.memoryWriteEnabled === false, 'Memory writes are off.'),
    createCheck('fallback-models-off', fallback.health.externalModelsEnabled === false, 'External models are off.'),
    createCheck('fallback-runtime-keys-off', fallback.health.secretsLoaded === false, 'Runtime keys are off.'),
    createCheck('view-model-locked', viewModelIsLocked(), 'View model keeps real actions disabled.'),
    createCheck('normalizer-rejects-unsafe', unsafeNormalized.connectionState === 'degraded_safe', 'Normalizer rejects enabled real flags.'),
    createCheck('no-blocked-addresses', !hasBlockedAddress(sourceProbe), 'No blocked backend address appears in local status contract output.'),
  ];

  return {
    ok: checks.every((check) => check.passed),
    checkedAt: new Date().toISOString(),
    checks,
  };
}
