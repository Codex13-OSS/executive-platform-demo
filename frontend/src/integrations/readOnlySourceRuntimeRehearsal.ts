import {
  getReadOnlyConnectorRehearsalSnapshot,
  validateReadOnlyConnectorRehearsalSnapshot,
} from './readOnlyConnectorContract';

export type ReadOnlySourceRuntimeMode = 'readonly_source_runtime_rehearsal';
export type ReadOnlySourceRuntimeStatus = 'runtime_rehearsal_ready';

export type NormalizedRuntimeReadEvent = {
  id: string;
  sourceEventId: string;
  normalizedTitle: string;
  normalizedTimeWindow: string;
  normalizedLocation: string;
  cognitiveRiskHint: 'low' | 'medium' | 'high';
  readOperation: 'agenda_event_read' | 'availability_read' | 'event_risk_read';
  runtimeState: 'read_rehearsed';
};

export type ReadOnlySourceRuntimeAuditPreview = {
  readAttempted: true;
  writeAttempted: false;
  credentialsTouched: false;
  endpointTouched: false;
  approvalRequiredForFutureWrite: true;
};

export type ReadOnlySourceRuntimeBrainImpact = {
  sourceRead: string;
  brainSignal: string;
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
  priorityPreview: string[];
  commandSuggestionPreview: string[];
  auditPreview: ReadOnlySourceRuntimeAuditPreview;
  safeToRender: true;
  nextEvolutionStep: string;
};

export type ReadOnlySourceRuntimeValidation = {
  safe: boolean;
  checkedAt: string;
  checks: Array<{ id: string; passed: boolean }>;
};

export function getReadOnlySourceRuntimeRehearsalSnapshot(): ReadOnlySourceRuntimeSnapshot {
  const connector = getReadOnlyConnectorRehearsalSnapshot();

  const normalizedReadEvents: NormalizedRuntimeReadEvent[] = connector.events.map((event, index) => ({
    id: `runtime-read-${index + 1}`,
    sourceEventId: event.id,
    normalizedTitle: event.title,
    normalizedTimeWindow: event.timeWindow,
    normalizedLocation: event.location,
    cognitiveRiskHint: event.riskHint,
    readOperation: event.readOperation,
    runtimeState: 'read_rehearsed',
  }));

  return {
    generatedAt: new Date().toISOString(),
    mode: 'readonly_source_runtime_rehearsal',
    status: 'runtime_rehearsal_ready',
    sourceDomain: 'agenda',
    readsEnabled: true,
    writesEnabled: false,
    realConnectionActive: false,
    credentialsLoaded: false,
    endpointConfigured: false,
    normalizedReadEvents,
    brainBusImpact: [
      { sourceRead: 'agenda event read', brainSignal: 'brain bus signal' },
      { sourceRead: 'availability read', brainSignal: 'priority preview' },
      { sourceRead: 'event risk read', brainSignal: 'command suggestion preview' },
    ],
    priorityPreview: ['Critical steering alignment', 'Validation window before 12:00'],
    commandSuggestionPreview: ['Confirm owner for risk sync', 'Prepare compact briefing packet'],
    auditPreview: {
      readAttempted: true,
      writeAttempted: false,
      credentialsTouched: false,
      endpointTouched: false,
      approvalRequiredForFutureWrite: true,
    },
    safeToRender: true,
    nextEvolutionStep: 'Prepare guarded source runtime handshake without external calls.',
  };
}

export function validateReadOnlySourceRuntimeRehearsalSnapshot(
  snapshot: ReadOnlySourceRuntimeSnapshot = getReadOnlySourceRuntimeRehearsalSnapshot(),
): ReadOnlySourceRuntimeValidation {
  const connectorValidation = validateReadOnlyConnectorRehearsalSnapshot();
  const checks = [
    { id: 'connector-contract-safe', passed: connectorValidation.safe },
    { id: 'writes-disabled', passed: snapshot.writesEnabled === false },
    { id: 'real-connection-off', passed: snapshot.realConnectionActive === false },
    { id: 'credentials-off', passed: snapshot.credentialsLoaded === false },
    { id: 'endpoint-off', passed: snapshot.endpointConfigured === false },
    { id: 'normalized-events-no-sensitive-fields', passed: snapshot.normalizedReadEvents.every((event) => !('endpoint' in event) && !('credential' in event)) },
    { id: 'audit-write-not-attempted', passed: snapshot.auditPreview.writeAttempted === false },
    { id: 'audit-credentials-untouched', passed: snapshot.auditPreview.credentialsTouched === false },
    { id: 'audit-endpoint-untouched', passed: snapshot.auditPreview.endpointTouched === false },
    { id: 'source-domain-agenda', passed: snapshot.sourceDomain === 'agenda' },
    { id: 'safe-to-render', passed: snapshot.safeToRender === true },
  ];

  return { safe: checks.every((check) => check.passed), checkedAt: new Date().toISOString(), checks };
}
