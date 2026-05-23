import {
  getReadOnlySourceRuntimeRehearsalSnapshot,
  validateReadOnlySourceRuntimeRehearsalSnapshot,
} from './readOnlySourceRuntimeRehearsal';

export type ReadOnlySourceHandshakeMode = 'readonly_source_handshake_preparation';
export type ReadOnlySourceHandshakeStatus = 'handshake_ready_locked' | 'handshake_warning';
export type ReadOnlyHandshakeGateState = 'locked' | 'required';

export type ReadOnlyHandshakePermissionEnvelope = {
  allowedScopes: Array<'read_events' | 'read_availability' | 'read_metadata'>;
  blockedScopes: Array<'create_event' | 'update_event' | 'delete_event' | 'send_invite' | 'write_metadata'>;
  requiresHumanApproval: true;
  writeEscalationBlocked: true;
};

export type ReadOnlyHandshakeCompatibilityCheck = {
  id: string;
  label: string;
  passed: boolean;
};

export type ReadOnlyHandshakeAuditReadiness = {
  readAuditReady: true;
  writeAuditBlocked: true;
  credentialAuditRequired: true;
  endpointAuditRequired: true;
  approvalTraceRequired: true;
};

export type ReadOnlySourceHandshakeSnapshot = {
  generatedAt: string;
  mode: ReadOnlySourceHandshakeMode;
  status: ReadOnlySourceHandshakeStatus;
  sourceDomain: 'agenda';
  sourceType: 'external_calendar';
  readsPrepared: true;
  writesEnabled: false;
  realConnectionActive: false;
  credentialsLoaded: false;
  endpointConfigured: false;
  endpointGate: 'locked';
  credentialGate: 'locked';
  approvalGate: 'required';
  runtimeCompatible: boolean;
  permissionEnvelope: ReadOnlyHandshakePermissionEnvelope;
  compatibilityChecks: ReadOnlyHandshakeCompatibilityCheck[];
  auditReadiness: ReadOnlyHandshakeAuditReadiness;
  handshakeSteps: string[];
  brainBusCompatibilityPreview: Array<{ id: string; from: string; to: string; state: string }>;
  safeToRender: boolean;
  nextEvolutionStep: string;
};

export type ReadOnlySourceHandshakeValidation = {
  status: 'safe' | 'warning';
  checkedAt: string;
  checks: Array<{ id: string; passed: boolean; detail: string }>;
};

export function getReadOnlySourceHandshakeSnapshot(): ReadOnlySourceHandshakeSnapshot {
  const runtimeSnapshot = getReadOnlySourceRuntimeRehearsalSnapshot();
  const runtimeValidation = validateReadOnlySourceRuntimeRehearsalSnapshot(runtimeSnapshot);

  const compatibilityChecks: ReadOnlyHandshakeCompatibilityCheck[] = [
    { id: 'runtime-safe', label: 'runtime snapshot safe', passed: runtimeValidation.status === 'safe' },
    { id: 'normalized-events', label: 'normalized events available', passed: runtimeSnapshot.normalizedReadEvents.length > 0 },
    { id: 'audit-safe', label: 'audit preview safe', passed: runtimeSnapshot.auditPreview.writeAttempted === false },
    { id: 'brain-impact', label: 'brain impact preview available', passed: runtimeSnapshot.brainBusImpact.length > 0 },
    { id: 'connector-readonly', label: 'connector remains read-only', passed: runtimeSnapshot.writesEnabled === false },
  ];

  const runtimeCompatible = compatibilityChecks.every((check) => check.passed);

  return {
    generatedAt: new Date().toISOString(),
    mode: 'readonly_source_handshake_preparation',
    status: runtimeCompatible ? 'handshake_ready_locked' : 'handshake_warning',
    sourceDomain: 'agenda',
    sourceType: 'external_calendar',
    readsPrepared: true,
    writesEnabled: false,
    realConnectionActive: false,
    credentialsLoaded: false,
    endpointConfigured: false,
    endpointGate: 'locked',
    credentialGate: 'locked',
    approvalGate: 'required',
    runtimeCompatible,
    permissionEnvelope: {
      allowedScopes: ['read_events', 'read_availability', 'read_metadata'],
      blockedScopes: ['create_event', 'update_event', 'delete_event', 'send_invite', 'write_metadata'],
      requiresHumanApproval: true,
      writeEscalationBlocked: true,
    },
    compatibilityChecks,
    auditReadiness: {
      readAuditReady: true,
      writeAuditBlocked: true,
      credentialAuditRequired: true,
      endpointAuditRequired: true,
      approvalTraceRequired: true,
    },
    handshakeSteps: [
      'prepare permission envelope',
      'verify runtime compatibility',
      'keep credential gate locked',
      'keep endpoint gate locked',
      'require approval before real connector',
    ],
    brainBusCompatibilityPreview: [
      { id: 'runtime-envelope', from: 'source runtime', to: 'handshake envelope', state: 'prepared' },
      { id: 'envelope-brain', from: 'handshake envelope', to: 'brain bus compatibility', state: 'verified' },
      { id: 'approval-activation', from: 'approval gate', to: 'future connector activation', state: 'locked' },
    ],
    safeToRender: runtimeCompatible,
    nextEvolutionStep: 'Prepare controlled external read-only connector handshake review without enabling endpoints.',
  };
}

export function validateReadOnlySourceHandshakeSnapshot(
  snapshot: ReadOnlySourceHandshakeSnapshot = getReadOnlySourceHandshakeSnapshot(),
): ReadOnlySourceHandshakeValidation {
  const writeScopes = ['create_event', 'update_event', 'delete_event', 'send_invite', 'write_metadata'];

  const checks = [
    { id: 'writes-disabled', passed: snapshot.writesEnabled === false, detail: 'Handshake writes remain disabled.' },
    { id: 'real-connection-off', passed: snapshot.realConnectionActive === false, detail: 'No real source connection is active.' },
    { id: 'credentials-off', passed: snapshot.credentialsLoaded === false, detail: 'No credentials are loaded.' },
    { id: 'endpoint-off', passed: snapshot.endpointConfigured === false, detail: 'No endpoint is configured.' },
    { id: 'endpoint-gate-locked', passed: snapshot.endpointGate === 'locked', detail: 'Endpoint gate remains locked.' },
    { id: 'credential-gate-locked', passed: snapshot.credentialGate === 'locked', detail: 'Credential gate remains locked.' },
    { id: 'approval-required', passed: snapshot.approvalGate === 'required', detail: 'Approval gate is required.' },
    { id: 'write-escalation-blocked', passed: snapshot.permissionEnvelope.writeEscalationBlocked === true, detail: 'Write escalation is blocked.' },
    {
      id: 'blocked-write-scopes',
      passed: writeScopes.every((scope) => snapshot.permissionEnvelope.blockedScopes.includes(scope as never)),
      detail: 'Write-like scopes are blocked.',
    },
    { id: 'runtime-compatible', passed: snapshot.runtimeCompatible === true, detail: 'Runtime is compatible with handshake envelope.' },
    { id: 'safe-render', passed: snapshot.safeToRender === true, detail: 'Snapshot is safe to render.' },
  ];

  return {
    status: checks.every((check) => check.passed) ? 'safe' : 'warning',
    checkedAt: new Date().toISOString(),
    checks,
  };
}
