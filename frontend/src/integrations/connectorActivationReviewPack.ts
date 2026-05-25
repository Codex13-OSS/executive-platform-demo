export type ConnectorActivationReviewStatus = 'review_ready_activation_locked' | 'review_blocked';
export type ConnectorActivationReviewGateState = 'locked' | 'required' | 'ready';

export type ConnectorActivationReviewGate = {
  id: string;
  label: string;
  state: ConnectorActivationReviewGateState;
};

export type ConnectorActivationPermissionReview = {
  allowedReadScopes: Array<'read_events' | 'read_availability' | 'read_metadata'>;
  blockedWriteScopes: Array<'create_event' | 'update_event' | 'delete_event' | 'send_invite' | 'write_metadata'>;
};

export type ConnectorActivationRiskReview = {
  id: string;
  label: string;
  state: 'blocked' | 'review_required' | 'required';
};

export type ConnectorActivationAuditReview = {
  id: string;
  label: string;
  state: 'ready' | 'required' | 'not_emitted';
};

export type ConnectorActivationReviewPack = {
  generatedAt: string;
  reviewId: 'agenda-readonly-activation-review';
  sourceDomain: 'agenda';
  sourceType: 'external_calendar';
  mode: 'activation_review_only';
  status: ConnectorActivationReviewStatus;
  reviewReady: boolean;
  activationAllowed: false;
  realConnectionActive: false;
  endpointConfigured: false;
  credentialsLoaded: false;
  writesEnabled: false;
  humanApprovalRequired: true;
  rollbackPlanRequired: true;
  auditTraceRequired: true;
  permissionReview: ConnectorActivationPermissionReview;
  gates: ConnectorActivationReviewGate[];
  riskReview: ConnectorActivationRiskReview[];
  auditReview: ConnectorActivationAuditReview[];
  checklist: string[];
  nextDecision: string;
};

export type ConnectorActivationReviewValidation = {
  status: 'safe' | 'warning';
  checkedAt: string;
  checks: Array<{ id: string; passed: boolean; detail: string }>;
};

export function getConnectorActivationReviewPack(): ConnectorActivationReviewPack {
  return {
    generatedAt: new Date().toISOString(),
    reviewId: 'agenda-readonly-activation-review',
    sourceDomain: 'agenda',
    sourceType: 'external_calendar',
    mode: 'activation_review_only',
    status: 'review_ready_activation_locked',
    reviewReady: true,
    activationAllowed: false,
    realConnectionActive: false,
    endpointConfigured: false,
    credentialsLoaded: false,
    writesEnabled: false,
    humanApprovalRequired: true,
    rollbackPlanRequired: true,
    auditTraceRequired: true,
    permissionReview: {
      allowedReadScopes: ['read_events', 'read_availability', 'read_metadata'],
      blockedWriteScopes: ['create_event', 'update_event', 'delete_event', 'send_invite', 'write_metadata'],
    },
    gates: [
      { id: 'endpoint-gate', label: 'endpoint gate', state: 'locked' },
      { id: 'credential-gate', label: 'credential gate', state: 'locked' },
      { id: 'approval-gate', label: 'approval gate', state: 'required' },
      { id: 'audit-gate', label: 'audit gate', state: 'required' },
      { id: 'rollback-gate', label: 'rollback gate', state: 'required' },
    ],
    riskReview: [
      { id: 'credential-exposure', label: 'credential exposure risk', state: 'blocked' },
      { id: 'accidental-write', label: 'accidental write risk', state: 'blocked' },
      { id: 'data-mismatch', label: 'data mismatch risk', state: 'review_required' },
      { id: 'user-approval', label: 'user approval risk', state: 'required' },
    ],
    auditReview: [
      { id: 'read-log', label: 'read log ready', state: 'ready' },
      { id: 'permission-trace', label: 'permission trace required', state: 'required' },
      { id: 'activation-event', label: 'activation event not emitted', state: 'not_emitted' },
      { id: 'rollback-note', label: 'rollback note required', state: 'required' },
    ],
    checklist: [
      'Permission envelope ready',
      'Runtime compatible',
      'Audit trace required',
      'Rollback note required',
      'Human approval required',
    ],
    nextDecision: 'Human approval required before connector activation rehearsal.',
  };
}

export function validateConnectorActivationReviewPack(
  pack: ConnectorActivationReviewPack = getConnectorActivationReviewPack(),
): ConnectorActivationReviewValidation {
  const requiredBlockedWriteScopes = ['create_event', 'update_event', 'delete_event', 'send_invite', 'write_metadata'];

  const checks = [
    { id: 'activation-blocked', passed: pack.activationAllowed === false, detail: 'Activation remains locked.' },
    { id: 'real-connection-off', passed: pack.realConnectionActive === false, detail: 'No real connection is active.' },
    { id: 'endpoint-off', passed: pack.endpointConfigured === false, detail: 'No endpoint is configured.' },
    { id: 'credentials-off', passed: pack.credentialsLoaded === false, detail: 'No credentials are loaded.' },
    { id: 'writes-disabled', passed: pack.writesEnabled === false, detail: 'Writes remain disabled.' },
    { id: 'human-approval-required', passed: pack.humanApprovalRequired === true, detail: 'Human approval is required.' },
    { id: 'review-ready', passed: pack.reviewReady === true, detail: 'Review pack is ready.' },
    {
      id: 'write-scopes-blocked',
      passed: requiredBlockedWriteScopes.every((scope) => pack.permissionReview.blockedWriteScopes.includes(scope as never)),
      detail: 'Write-like scopes are blocked.',
    },
    { id: 'safe-status', passed: pack.status === 'review_ready_activation_locked', detail: 'Status is safe and activation locked.' },
  ];

  return {
    status: checks.every((check) => check.passed) ? 'safe' : 'warning',
    checkedAt: new Date().toISOString(),
    checks,
  };
}
