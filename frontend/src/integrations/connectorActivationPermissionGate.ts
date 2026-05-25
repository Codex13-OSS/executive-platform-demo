export type ConnectorActivationPermissionGateStatus =
  | 'permission_gate_ready_activation_blocked'
  | 'permission_gate_warning';

export type ConnectorActivationPermissionGateStageState =
  | 'locked'
  | 'required'
  | 'ready'
  | 'blocked';

export type ConnectorActivationPermissionGateStage = {
  id: string;
  label: string;
  state: ConnectorActivationPermissionGateStageState;
  note: string;
};

export type ConnectorActivationPermissionGateApproval = {
  id: string;
  label: string;
  required: true;
  granted: false;
};

export type ConnectorActivationPermissionGatePack = {
  generatedAt: string;
  gateId: 'agenda-readonly-permission-gate';
  sourceDomain: 'agenda';
  mode: 'permission_gate_only';
  status: ConnectorActivationPermissionGateStatus;
  activationAllowed: false;
  realConnectionActive: false;
  credentialsLoaded: false;
  writesEnabled: false;
  humanApprovalRequired: true;
  permissionEnvelopeReady: true;
  connectorReviewReady: true;
  stages: ConnectorActivationPermissionGateStage[];
  approvals: ConnectorActivationPermissionGateApproval[];
  blockedCapabilities: Array<'write_events' | 'change_events' | 'remove_events' | 'send_invitations'>;
  allowedCapabilities: Array<'read_events' | 'read_availability' | 'read_metadata'>;
  decision: string;
};

export type ConnectorActivationPermissionGateValidation = {
  status: 'safe' | 'warning';
  checkedAt: string;
  checks: Array<{ id: string; passed: boolean; detail: string }>;
};

export function getConnectorActivationPermissionGatePack(): ConnectorActivationPermissionGatePack {
  return {
    generatedAt: new Date().toISOString(),
    gateId: 'agenda-readonly-permission-gate',
    sourceDomain: 'agenda',
    mode: 'permission_gate_only',
    status: 'permission_gate_ready_activation_blocked',
    activationAllowed: false,
    realConnectionActive: false,
    credentialsLoaded: false,
    writesEnabled: false,
    humanApprovalRequired: true,
    permissionEnvelopeReady: true,
    connectorReviewReady: true,
    stages: [
      { id: 'permission-envelope', label: 'permission envelope', state: 'ready', note: 'Read-only scope prepared.' },
      { id: 'human-approval', label: 'human approval', state: 'required', note: 'Executive approval is still required.' },
      { id: 'credential-loading', label: 'credential loading', state: 'locked', note: 'Credentials remain unavailable.' },
      { id: 'real-connection', label: 'real connection', state: 'locked', note: 'Real source stays off.' },
      { id: 'write-capabilities', label: 'write capabilities', state: 'blocked', note: 'Write-like actions are blocked.' },
    ],
    approvals: [
      { id: 'executive-approval', label: 'Executive approval', required: true, granted: false },
      { id: 'security-approval', label: 'Security approval', required: true, granted: false },
      { id: 'rollback-approval', label: 'Rollback approval', required: true, granted: false },
    ],
    blockedCapabilities: ['write_events', 'change_events', 'remove_events', 'send_invitations'],
    allowedCapabilities: ['read_events', 'read_availability', 'read_metadata'],
    decision: 'Permission gate is ready, but activation remains blocked until approvals are granted.',
  };
}

export function validateConnectorActivationPermissionGatePack(
  pack: ConnectorActivationPermissionGatePack = getConnectorActivationPermissionGatePack(),
): ConnectorActivationPermissionGateValidation {
  const requiredBlockedCapabilities = ['write_events', 'change_events', 'remove_events', 'send_invitations'];

  const checks = [
    { id: 'activation-blocked', passed: pack.activationAllowed === false, detail: 'Activation remains blocked.' },
    { id: 'real-connection-off', passed: pack.realConnectionActive === false, detail: 'Real source remains off.' },
    { id: 'credentials-off', passed: pack.credentialsLoaded === false, detail: 'No credentials are loaded.' },
    { id: 'writes-disabled', passed: pack.writesEnabled === false, detail: 'Writes remain disabled.' },
    { id: 'human-approval-required', passed: pack.humanApprovalRequired === true, detail: 'Human approval is required.' },
    { id: 'permission-envelope-ready', passed: pack.permissionEnvelopeReady === true, detail: 'Permission envelope is ready.' },
    { id: 'review-ready', passed: pack.connectorReviewReady === true, detail: 'Connector review is ready.' },
    {
      id: 'blocked-capabilities',
      passed: requiredBlockedCapabilities.every((capability) => pack.blockedCapabilities.includes(capability as never)),
      detail: 'Write-like capabilities are blocked.',
    },
    {
      id: 'approvals-not-granted',
      passed: pack.approvals.every((approval) => approval.required === true && approval.granted === false),
      detail: 'Required approvals are not granted yet.',
    },
    {
      id: 'safe-status',
      passed: pack.status === 'permission_gate_ready_activation_blocked',
      detail: 'Status is safe and activation blocked.',
    },
  ];

  return {
    status: checks.every((check) => check.passed) ? 'safe' : 'warning',
    checkedAt: new Date().toISOString(),
    checks,
  };
}
