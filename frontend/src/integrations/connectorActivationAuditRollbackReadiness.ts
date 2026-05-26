export type ConnectorActivationAuditRollbackStatus =
  | 'audit_rollback_ready_activation_locked'
  | 'audit_rollback_warning';

export type ConnectorActivationAuditRollbackState =
  | 'ready'
  | 'required'
  | 'locked'
  | 'blocked';

export type ConnectorActivationAuditRollbackItem = {
  id: string;
  label: string;
  state: ConnectorActivationAuditRollbackState;
  detail: string;
};

export type ConnectorActivationAuditRollbackPack = {
  generatedAt: string;
  readinessId: 'agenda-readonly-audit-rollback-readiness';
  sourceDomain: 'agenda';
  mode: 'audit_rollback_readiness_only';
  status: ConnectorActivationAuditRollbackStatus;
  auditEvidenceReady: true;
  rollbackPlanReady: true;
  activationAllowed: false;
  realConnectionActive: false;
  credentialsLoaded: false;
  writesEnabled: false;
  humanApprovalRequired: true;
  dryRunRequired: true;
  auditEventEmitted: false;
  rollbackExecuted: false;
  readinessItems: ConnectorActivationAuditRollbackItem[];
  blockedActions: Array<'activate_source' | 'load_credentials' | 'enable_writes' | 'emit_real_event' | 'skip_rollback'>;
  allowedActions: Array<'preview_audit' | 'validate_rollback' | 'review_evidence' | 'prepare_activation_note'>;
  decision: string;
};

export type ConnectorActivationAuditRollbackValidation = {
  status: 'safe' | 'warning';
  checkedAt: string;
  checks: Array<{ id: string; passed: boolean; detail: string }>;
};

export function getConnectorActivationAuditRollbackPack(): ConnectorActivationAuditRollbackPack {
  return {
    generatedAt: new Date().toISOString(),
    readinessId: 'agenda-readonly-audit-rollback-readiness',
    sourceDomain: 'agenda',
    mode: 'audit_rollback_readiness_only',
    status: 'audit_rollback_ready_activation_locked',
    auditEvidenceReady: true,
    rollbackPlanReady: true,
    activationAllowed: false,
    realConnectionActive: false,
    credentialsLoaded: false,
    writesEnabled: false,
    humanApprovalRequired: true,
    dryRunRequired: true,
    auditEventEmitted: false,
    rollbackExecuted: false,
    readinessItems: [
      { id: 'audit-evidence', label: 'audit evidence', state: 'ready', detail: 'Evidence preview can be reviewed.' },
      { id: 'rollback-plan', label: 'rollback plan', state: 'ready', detail: 'Rollback path is prepared.' },
      { id: 'human-approval', label: 'human approval', state: 'required', detail: 'Approval is still required.' },
      { id: 'dry-run-result', label: 'dry-run result', state: 'required', detail: 'Dry-run review remains required.' },
      { id: 'real-activation', label: 'real activation', state: 'locked', detail: 'Real activation stays locked.' },
      { id: 'write-path', label: 'write path', state: 'blocked', detail: 'Write-like path remains disabled.' },
    ],
    blockedActions: ['activate_source', 'load_credentials', 'enable_writes', 'emit_real_event', 'skip_rollback'],
    allowedActions: ['preview_audit', 'validate_rollback', 'review_evidence', 'prepare_activation_note'],
    decision: 'Audit and rollback readiness are prepared, but real activation remains locked.',
  };
}

export function validateConnectorActivationAuditRollbackPack(
  pack: ConnectorActivationAuditRollbackPack = getConnectorActivationAuditRollbackPack(),
): ConnectorActivationAuditRollbackValidation {
  const requiredBlockedActions = ['activate_source', 'load_credentials', 'enable_writes', 'emit_real_event', 'skip_rollback'];

  const checks = [
    { id: 'audit-ready', passed: pack.auditEvidenceReady === true, detail: 'Audit evidence preview is ready.' },
    { id: 'rollback-ready', passed: pack.rollbackPlanReady === true, detail: 'Rollback plan is ready.' },
    { id: 'activation-locked', passed: pack.activationAllowed === false, detail: 'Activation remains locked.' },
    { id: 'real-connection-off', passed: pack.realConnectionActive === false, detail: 'Real connection remains off.' },
    { id: 'credentials-off', passed: pack.credentialsLoaded === false, detail: 'Credentials are not loaded.' },
    { id: 'writes-disabled', passed: pack.writesEnabled === false, detail: 'Writes remain disabled.' },
    { id: 'human-approval-required', passed: pack.humanApprovalRequired === true, detail: 'Human approval is required.' },
    { id: 'dry-run-required', passed: pack.dryRunRequired === true, detail: 'Dry-run review is required.' },
    { id: 'no-real-audit-event', passed: pack.auditEventEmitted === false, detail: 'No real activation event is emitted.' },
    { id: 'rollback-not-executed', passed: pack.rollbackExecuted === false, detail: 'Rollback is prepared, not executed.' },
    {
      id: 'blocked-actions',
      passed: requiredBlockedActions.every((action) => pack.blockedActions.includes(action as never)),
      detail: 'Unsafe activation actions are blocked.',
    },
    {
      id: 'safe-status',
      passed: pack.status === 'audit_rollback_ready_activation_locked',
      detail: 'Status is safe and activation locked.',
    },
  ];

  return {
    status: checks.every((check) => check.passed) ? 'safe' : 'warning',
    checkedAt: new Date().toISOString(),
    checks,
  };
}
