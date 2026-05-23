import {
  getReadOnlyConnectorRehearsalSnapshot,
  validateReadOnlyConnectorRehearsalSnapshot,
  type ReadOnlyConnectorAllowedOperation,
} from './readOnlyConnectorContract';

export type ReadOnlySourceRuntimeMode = 'readonly_source_runtime_rehearsal';
export type ReadOnlySourceRuntimeStatus = 'runtime_rehearsal_ready' | 'runtime_rehearsal_warning';

export type NormalizedRuntimeReadEvent = {
  id: string;
  sourceEventId: string;
  normalizedTitle: string;
  normalizedTimeWindow: string;
  normalizedLocation: string;
  cognitiveRiskHint: 'low' | 'medium' | 'high';
  readOperation: ReadOnlyConnectorAllowedOperation;
  runtimeState: 'read_rehearsed';
};

export type ReadOnlySourceRuntimeBrainImpact = {
  id: string;
  from: string;
  to: string;
  signal: string;
};

export type ReadOnlySourceRuntimeAuditPreview = {
  readAttempted: true;
  writeAttempted: false;
  credentialsTouched: false;
  endpointTouched: false;
  approvalRequiredForFutureWrite: true;
};

export type ReadOnlySourceRuntimeSnapshot = {
  generatedAt: string;
  mode: ReadOnlySourceRuntimeMode;
  status: ReadOnlySourceRuntimeStatus;
  sourceDomain: 'agenda';
  readsEnabled: true;
  writesEnabled: false;
  realConnectionActive: false;
  credentialsLoaded: false;
  endpointConfigured: false;
  normalizedReadEvents: NormalizedRuntimeReadEvent[];
  brainBusImpact: ReadOnlySourceRuntimeBrainImpact[];
  priorityPreview: Array<{ id: string; sourceEventId: string; priority: 'low' | 'medium' | 'high'; reason: string }>;
  commandSuggestionPreview: Array<{ id: string; sourceEventId: string; suggestion: string; requiresHumanApproval: true }>;
  auditPreview: ReadOnlySourceRuntimeAuditPreview;
  safeToRender: boolean;
  handshakePrepared: true;
  handshakeGateState: 'locked';
  approvalRequiredForHandshake: true;
  nextEvolutionStep: string;
};

export type ReadOnlySourceRuntimeValidation = {
  status: 'safe' | 'warning';
  checkedAt: string;
  checks: Array<{ id: string; passed: boolean; detail: string }>;
};

export function getReadOnlySourceRuntimeRehearsalSnapshot(): ReadOnlySourceRuntimeSnapshot {
  const connectorSnapshot = getReadOnlyConnectorRehearsalSnapshot();
  const connectorValidation = validateReadOnlyConnectorRehearsalSnapshot(connectorSnapshot);

  const normalizedReadEvents: NormalizedRuntimeReadEvent[] = connectorSnapshot.rehearsalEvents.map((event) => ({
    id: `runtime-${event.id}`,
    sourceEventId: event.sourceEventId,
    normalizedTitle: event.title,
    normalizedTimeWindow: `${event.startTime}–${event.endTime}`,
    normalizedLocation: event.location,
    cognitiveRiskHint: event.cognitiveRiskHint,
    readOperation: event.operation,
    runtimeState: 'read_rehearsed',
  }));

  const brainBusImpact: ReadOnlySourceRuntimeBrainImpact[] = [
    { id: 'runtime-impact-event-brain', from: 'read event', to: 'brain bus', signal: 'agenda context' },
    { id: 'runtime-impact-normalize-priority', from: 'normalize', to: 'priority', signal: 'decision window' },
    { id: 'runtime-impact-risk-command', from: 'risk hint', to: 'command preview', signal: 'human confirmation' },
  ];

  const priorityPreview = normalizedReadEvents.map((event) => ({
    id: `priority-${event.id}`,
    sourceEventId: event.sourceEventId,
    priority: event.cognitiveRiskHint,
    reason: event.cognitiveRiskHint === 'high' ? 'Riesgo alto detectado en lectura ensayada.' : 'Lectura disponible para priorización ejecutiva.',
  }));

  const commandSuggestionPreview = normalizedReadEvents
    .filter((event) => event.cognitiveRiskHint !== 'low')
    .map((event) => ({
      id: `command-${event.id}`,
      sourceEventId: event.sourceEventId,
      suggestion: event.cognitiveRiskHint === 'high' ? 'Preparar seguimiento crítico' : 'Preparar briefing de contexto',
      requiresHumanApproval: true as const,
    }));

  return {
    generatedAt: new Date().toISOString(),
    mode: 'readonly_source_runtime_rehearsal',
    status: connectorValidation.status === 'safe' ? 'runtime_rehearsal_ready' : 'runtime_rehearsal_warning',
    sourceDomain: 'agenda',
    readsEnabled: true,
    writesEnabled: false,
    realConnectionActive: false,
    credentialsLoaded: false,
    endpointConfigured: false,
    normalizedReadEvents,
    brainBusImpact,
    priorityPreview,
    commandSuggestionPreview,
    auditPreview: {
      readAttempted: true,
      writeAttempted: false,
      credentialsTouched: false,
      endpointTouched: false,
      approvalRequiredForFutureWrite: true,
    },
    safeToRender: connectorValidation.status === 'safe',
    handshakePrepared: true,
    handshakeGateState: 'locked',
    approvalRequiredForHandshake: true,
    nextEvolutionStep: 'Prepare controlled read-only source handshake without enabling real endpoints.',
  };
}

export function validateReadOnlySourceRuntimeRehearsalSnapshot(
  snapshot: ReadOnlySourceRuntimeSnapshot = getReadOnlySourceRuntimeRehearsalSnapshot(),
): ReadOnlySourceRuntimeValidation {
  const checks = [
    { id: 'writes-disabled', passed: snapshot.writesEnabled === false, detail: 'Runtime writes remain locked.' },
    { id: 'real-connection-off', passed: snapshot.realConnectionActive === false, detail: 'No real source connection is active.' },
    { id: 'credentials-off', passed: snapshot.credentialsLoaded === false, detail: 'No credentials are loaded.' },
    { id: 'endpoint-off', passed: snapshot.endpointConfigured === false, detail: 'No endpoint is configured.' },
    { id: 'domain-agenda', passed: snapshot.sourceDomain === 'agenda', detail: 'Runtime domain is agenda.' },
    {
      id: 'events-safe-shape',
      passed: snapshot.normalizedReadEvents.every((event) => !('endpoint' in event) && !('credentials' in event) && !('token' in event)),
      detail: 'Normalized events expose no endpoint, credential or token fields.',
    },
    { id: 'audit-no-write', passed: snapshot.auditPreview.writeAttempted === false, detail: 'Audit confirms no write attempt.' },
    { id: 'audit-no-credentials', passed: snapshot.auditPreview.credentialsTouched === false, detail: 'Audit confirms credentials untouched.' },
    { id: 'audit-no-endpoint', passed: snapshot.auditPreview.endpointTouched === false, detail: 'Audit confirms endpoints untouched.' },
    { id: 'safe-render', passed: snapshot.safeToRender === true, detail: 'Snapshot is safe to render.' },
  ];

  return {
    status: checks.every((check) => check.passed) ? 'safe' : 'warning',
    checkedAt: new Date().toISOString(),
    checks,
  };
}
