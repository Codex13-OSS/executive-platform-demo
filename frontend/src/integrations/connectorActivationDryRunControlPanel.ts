export type ConnectorActivationDryRunStatus =
  | 'dry_run_ready_activation_locked'
  | 'dry_run_warning';

export type ConnectorActivationDryRunStepState =
  | 'ready'
  | 'locked'
  | 'blocked'
  | 'pending';

export type ConnectorActivationDryRunStep = {
  id: string;
  label: string;
  state: ConnectorActivationDryRunStepState;
  detail: string;
};

export type ConnectorActivationDryRunControlPack = {
  generatedAt: string;
  controlId: 'agenda-readonly-dry-run-control';
  sourceDomain: 'agenda';
  mode: 'dry_run_control_only';
  status: ConnectorActivationDryRunStatus;
  dryRunReady: true;
  activationAllowed: false;
  realConnectionActive: false;
  credentialsLoaded: false;
  writesEnabled: false;
  humanApprovalRequired: true;
  permissionGateRequired: true;
  rollbackPlanRequired: true;
  simulatedReadOnly: true;
  simulatedWrite: false;
  dryRunSteps: ConnectorActivationDryRunStep[];
  blockedActions: Array<'activate_source' | 'load_credentials' | 'enable_writes' | 'emit_real_event'>;
  allowedActions: Array<'simulate_read' | 'validate_permissions' | 'preview_audit' | 'prepare_rollout_note'>;
  decision: string;
};

export type ConnectorActivationDryRunValidation = {
  status: 'safe' | 'warning';
  checkedAt: string;
  checks: Array<{ id: string; passed: boolean; detail: string }>;
};

export function getConnectorActivationDryRunControlPack(): ConnectorActivationDryRunControlPack {
  return {
    generatedAt: new Date().toISOString(),
    controlId: 'agenda-readonly-dry-run-control',
    sourceDomain: 'agenda',
    mode: 'dry_run_control_only',
    status: 'dry_run_ready_activation_locked',
    dryRunReady: true,
    activationAllowed: false,
    realConnectionActive: false,
    credentialsLoaded: false,
    writesEnabled: false,
    humanApprovalRequired: true,
    permissionGateRequired: true,
    rollbackPlanRequired: true,
    simulatedReadOnly: true,
    simulatedWrite: false,
    dryRunSteps: [
      { id: 'read-simulation', label: 'read simulation', state: 'ready', detail: 'Read-only rehearsal can be previewed.' },
      { id: 'permission-check', label: 'permission check', state: 'ready', detail: 'Permission gate remains required.' },
      { id: 'credential-load', label: 'credential load', state: 'locked', detail: 'Credentials are not loaded.' },
      { id: 'real-activation', label: 'real activation', state: 'locked', detail: 'Real connector activation remains blocked.' },
      { id: 'write-path', label: 'write path', state: 'blocked', detail: 'Write-like path stays disabled.' },
      { id: 'audit-preview', label: 'audit preview', state: 'pending', detail: 'Audit note can be prepared before approval.' },
    ],
    blockedActions: ['activate_source', 'load_credentials', 'enable_writes', 'emit_real_event'],
    allowedActions: ['simulate_read', 'validate_permissions', 'preview_audit', 'prepare_rollout_note'],
    decision: 'Dry-run control is ready for review, but real activation remains locked.',
  };
}

export function validateConnectorActivationDryRunControlPack(
  pack: ConnectorActivationDryRunControlPack = getConnectorActivationDryRunControlPack(),
): ConnectorActivationDryRunValidation {
  const requiredBlockedActions = ['activate_source', 'load_credentials', 'enable_writes', 'emit_real_event'];

  const checks = [
    { id: 'dry-run-ready', passed: pack.dryRunReady === true, detail: 'Dry-run control is ready.' },
    { id: 'activation-locked', passed: pack.activationAllowed === false, detail: 'Activation remains locked.' },
    { id: 'real-connection-off', passed: pack.realConnectionActive === false, detail: 'Real connection remains off.' },
    { id: 'credentials-off', passed: pack.credentialsLoaded === false, detail: 'Credentials are not loaded.' },
    { id: 'writes-disabled', passed: pack.writesEnabled === false, detail: 'Writes remain disabled.' },
    { id: 'human-approval-required', passed: pack.humanApprovalRequired === true, detail: 'Human approval is required.' },
    { id: 'permission-gate-required', passed: pack.permissionGateRequired === true, detail: 'Permission gate is required.' },
    { id: 'rollback-required', passed: pack.rollbackPlanRequired === true, detail: 'Rollback plan is required.' },
    { id: 'simulated-read-only', passed: pack.simulatedReadOnly === true && pack.simulatedWrite === false, detail: 'Only read simulation is allowed.' },
    {
      id: 'blocked-actions',
      passed: requiredBlockedActions.every((action) => pack.blockedActions.includes(action as never)),
      detail: 'Real activation actions are blocked.',
    },
    {
      id: 'safe-status',
      passed: pack.status === 'dry_run_ready_activation_locked',
      detail: 'Status is safe and activation locked.',
    },
  ];

  return {
    status: checks.every((check) => check.passed) ? 'safe' : 'warning',
    checkedAt: new Date().toISOString(),
    checks,
  };
}
