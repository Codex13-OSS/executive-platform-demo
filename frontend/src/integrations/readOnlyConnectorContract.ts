export type ReadOnlyConnectorDomain = 'agenda';
export type ReadOnlyConnectorStatus = 'draft' | 'rehearsal_ready' | 'blocked' | 'validated';
export type ReadOnlyConnectorMode = 'contract_only';
export type ReadOnlyConnectorPermissionState = 'read-only-locked';

export type ReadOnlyConnectorAllowedOperation = 'read_events' | 'read_availability' | 'read_metadata';
export type ReadOnlyConnectorBlockedOperation =
  | 'create_event'
  | 'update_event'
  | 'delete_event'
  | 'send_invite'
  | 'write_metadata';

export type ReadOnlyConnectorFieldMapping = {
  externalField: string;
  internalField: string;
  required: boolean;
  cognitiveUse: 'identity' | 'schedule' | 'context' | 'risk_hint' | 'metadata';
};

export type ReadOnlyConnectorContract = {
  id: string;
  domain: ReadOnlyConnectorDomain;
  sourceType: 'external_calendar';
  label: string;
  mode: ReadOnlyConnectorMode;
  status: ReadOnlyConnectorStatus;
  permissionState: ReadOnlyConnectorPermissionState;
  readsEnabled: true;
  writesEnabled: false;
  realConnectionActive: false;
  credentialsLoaded: false;
  endpointConfigured: false;
  requiresHumanApproval: true;
  allowedOperations: ReadOnlyConnectorAllowedOperation[];
  blockedOperations: ReadOnlyConnectorBlockedOperation[];
  fieldMappings: ReadOnlyConnectorFieldMapping[];
  freshnessPolicy: string;
  degradationPolicy: string;
  auditPolicy: string;
  nextStep: string;
};

export type ReadOnlyConnectorRehearsalEvent = {
  id: string;
  sourceEventId: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  participantsCount: number;
  cognitiveRiskHint: 'low' | 'medium' | 'high';
  operation: ReadOnlyConnectorAllowedOperation;
};

export type ReadOnlyConnectorRehearsalSnapshot = {
  generatedAt: string;
  mode: 'readonly_connector_rehearsal';
  contract: ReadOnlyConnectorContract;
  rehearsalEvents: ReadOnlyConnectorRehearsalEvent[];
  validationState: 'safe' | 'warning';
  brainBusImpactPreview: Array<{
    id: string;
    from: string;
    to: string;
    signal: string;
  }>;
  safeToRender: boolean;
};

export type ReadOnlyConnectorValidation = {
  status: 'safe' | 'warning';
  checkedAt: string;
  checks: Array<{ id: string; passed: boolean; detail: string }>;
};

export function getExecutiveCalendarReadOnlyConnectorContract(): ReadOnlyConnectorContract {
  return {
    id: 'readonly-calendar-contract-v190',
    domain: 'agenda',
    sourceType: 'external_calendar',
    label: 'Executive Calendar Read-Only Connector',
    mode: 'contract_only',
    status: 'rehearsal_ready',
    permissionState: 'read-only-locked',
    readsEnabled: true,
    writesEnabled: false,
    realConnectionActive: false,
    credentialsLoaded: false,
    endpointConfigured: false,
    requiresHumanApproval: true,
    allowedOperations: ['read_events', 'read_availability', 'read_metadata'],
    blockedOperations: ['create_event', 'update_event', 'delete_event', 'send_invite', 'write_metadata'],
    fieldMappings: [
      { externalField: 'external_id', internalField: 'sourceEventId', required: true, cognitiveUse: 'identity' },
      { externalField: 'title', internalField: 'title', required: true, cognitiveUse: 'context' },
      { externalField: 'starts_at', internalField: 'startTime', required: true, cognitiveUse: 'schedule' },
      { externalField: 'ends_at', internalField: 'endTime', required: true, cognitiveUse: 'schedule' },
      { externalField: 'location_label', internalField: 'location', required: false, cognitiveUse: 'context' },
      { externalField: 'participants_count', internalField: 'participantsCount', required: false, cognitiveUse: 'metadata' },
      { externalField: 'risk_hint', internalField: 'cognitiveRiskHint', required: false, cognitiveUse: 'risk_hint' },
    ],
    freshnessPolicy: 'Treat stale agenda reads as degraded signal, never as write trigger.',
    degradationPolicy: 'If unavailable, keep cockpit in safe mock mode and show rehearsal-only state.',
    auditPolicy: 'Every future read must be traceable without storing credentials in UI.',
    nextStep: 'Prepare controlled read-only source rehearsal with explicit approval gate.',
  };
}

export function getReadOnlyConnectorRehearsalSnapshot(): ReadOnlyConnectorRehearsalSnapshot {
  const contract = getExecutiveCalendarReadOnlyConnectorContract();

  const rehearsalEvents: ReadOnlyConnectorRehearsalEvent[] = [
    {
      id: 'rehearsal-agenda-briefing',
      sourceEventId: 'external-calendar-mock-001',
      title: 'Briefing directivo',
      startTime: '09:00',
      endTime: '09:30',
      location: 'Sala ejecutiva',
      participantsCount: 4,
      cognitiveRiskHint: 'medium',
      operation: 'read_events',
    },
    {
      id: 'rehearsal-availability-window',
      sourceEventId: 'external-calendar-mock-002',
      title: 'Ventana de disponibilidad',
      startTime: '11:30',
      endTime: '12:00',
      location: 'Agenda ejecutiva',
      participantsCount: 2,
      cognitiveRiskHint: 'low',
      operation: 'read_availability',
    },
    {
      id: 'rehearsal-risk-review',
      sourceEventId: 'external-calendar-mock-003',
      title: 'Revisión de riesgo operativo',
      startTime: '14:00',
      endTime: '14:45',
      location: 'Dirección',
      participantsCount: 5,
      cognitiveRiskHint: 'high',
      operation: 'read_metadata',
    },
  ];

  return {
    generatedAt: new Date().toISOString(),
    mode: 'readonly_connector_rehearsal',
    contract,
    rehearsalEvents,
    validationState: 'safe',
    brainBusImpactPreview: [
      { id: 'impact-agenda-brain', from: 'agenda', to: 'brain bus', signal: 'schedule context' },
      { id: 'impact-availability-priority', from: 'availability', to: 'priority', signal: 'decision window' },
      { id: 'impact-risk-command', from: 'event risk', to: 'command suggestion', signal: 'human confirmation' },
    ],
    safeToRender: true,
  };
}

export function validateReadOnlyConnectorRehearsalSnapshot(
  snapshot: ReadOnlyConnectorRehearsalSnapshot = getReadOnlyConnectorRehearsalSnapshot(),
): ReadOnlyConnectorValidation {
  const contract = snapshot.contract;

  const checks = [
    { id: 'writes-disabled', passed: contract.writesEnabled === false, detail: 'Connector writes remain locked.' },
    { id: 'real-connection-off', passed: contract.realConnectionActive === false, detail: 'No real source connection is active.' },
    { id: 'credentials-off', passed: contract.credentialsLoaded === false, detail: 'No credentials are loaded.' },
    { id: 'endpoint-off', passed: contract.endpointConfigured === false, detail: 'No endpoint is configured.' },
    { id: 'domain-agenda', passed: contract.domain === 'agenda', detail: 'First rehearsal domain is agenda.' },
    {
      id: 'allowed-read-only',
      passed: contract.allowedOperations.every((operation) => operation.startsWith('read_')),
      detail: 'Allowed operations are read-only.',
    },
    {
      id: 'blocked-writes-present',
      passed: ['create_event', 'update_event', 'delete_event', 'send_invite', 'write_metadata'].every((operation) =>
        contract.blockedOperations.includes(operation as ReadOnlyConnectorBlockedOperation),
      ),
      detail: 'Write-like operations are blocked.',
    },
    { id: 'safe-render', passed: snapshot.safeToRender === true, detail: 'Snapshot is safe to render.' },
  ];

  return {
    status: checks.every((check) => check.passed) ? 'safe' : 'warning',
    checkedAt: new Date().toISOString(),
    checks,
  };
}
