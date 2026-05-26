export type ReadOnlyRealConnectorPreparationStatus =
  | 'real_preparation_ready_connection_locked'
  | 'real_preparation_warning';

export type ReadOnlyRealConnectorReadinessState =
  | 'ready'
  | 'locked'
  | 'blocked'
  | 'required';

export type ReadOnlyRealConnectorSchemaField = {
  id: string;
  label: string;
  required: boolean;
  mapped: boolean;
};

export type ReadOnlyRealConnectorReadinessItem = {
  id: string;
  label: string;
  state: ReadOnlyRealConnectorReadinessState;
  detail: string;
};

export type ReadOnlyRealConnectorPreparationPack = {
  generatedAt: string;
  preparationId: 'agenda-readonly-real-connector-preparation';
  sourceDomain: 'agenda';
  mode: 'real_connector_preparation_only';
  status: ReadOnlyRealConnectorPreparationStatus;
  connectorProfileReady: true;
  readSchemaReady: true;
  adapterBoundaryReady: true;
  normalizationReady: true;
  auditBoundaryReady: true;
  realConnectionActive: false;
  credentialsLoaded: false;
  endpointConfigured: false;
  writesEnabled: false;
  activationAllowed: false;
  schemaFields: ReadOnlyRealConnectorSchemaField[];
  readinessItems: ReadOnlyRealConnectorReadinessItem[];
  blockedActions: Array<'connect_real_source' | 'load_credentials' | 'configure_endpoint' | 'enable_writes' | 'mutate_events'>;
  allowedActions: Array<'prepare_schema' | 'prepare_adapter_boundary' | 'prepare_normalization' | 'prepare_audit_boundary'>;
  nextStep: string;
};

export type ReadOnlyRealConnectorPreparationValidation = {
  status: 'safe' | 'warning';
  checkedAt: string;
  checks: Array<{ id: string; passed: boolean; detail: string }>;
};

export function getReadOnlyRealConnectorPreparationPack(): ReadOnlyRealConnectorPreparationPack {
  return {
    generatedAt: new Date().toISOString(),
    preparationId: 'agenda-readonly-real-connector-preparation',
    sourceDomain: 'agenda',
    mode: 'real_connector_preparation_only',
    status: 'real_preparation_ready_connection_locked',
    connectorProfileReady: true,
    readSchemaReady: true,
    adapterBoundaryReady: true,
    normalizationReady: true,
    auditBoundaryReady: true,
    realConnectionActive: false,
    credentialsLoaded: false,
    endpointConfigured: false,
    writesEnabled: false,
    activationAllowed: false,
    schemaFields: [
      { id: 'event-id', label: 'event id', required: true, mapped: true },
      { id: 'title', label: 'title', required: true, mapped: true },
      { id: 'start-time', label: 'start time', required: true, mapped: true },
      { id: 'end-time', label: 'end time', required: true, mapped: true },
      { id: 'location', label: 'location', required: false, mapped: true },
      { id: 'attendees', label: 'attendees', required: false, mapped: true },
      { id: 'status', label: 'status', required: false, mapped: true },
      { id: 'source-updated-at', label: 'source updated at', required: false, mapped: true },
    ],
    readinessItems: [
      { id: 'connector-profile', label: 'connector profile', state: 'ready', detail: 'Agenda read-only connector profile is prepared.' },
      { id: 'read-schema', label: 'read schema', state: 'ready', detail: 'Minimum event fields are mapped.' },
      { id: 'adapter-boundary', label: 'adapter boundary', state: 'ready', detail: 'Adapter boundary is prepared without runtime calls.' },
      { id: 'normalization', label: 'normalization', state: 'ready', detail: 'Incoming event shape can be normalized safely.' },
      { id: 'credentials', label: 'credentials', state: 'locked', detail: 'Credential loading remains locked.' },
      { id: 'real-connection', label: 'real connection', state: 'locked', detail: 'Real source connection remains off.' },
      { id: 'write-scope', label: 'write scope', state: 'blocked', detail: 'Write-like capabilities remain blocked.' },
      { id: 'human-approval', label: 'human approval', state: 'required', detail: 'Activation still requires explicit approval.' },
    ],
    blockedActions: ['connect_real_source', 'load_credentials', 'configure_endpoint', 'enable_writes', 'mutate_events'],
    allowedActions: ['prepare_schema', 'prepare_adapter_boundary', 'prepare_normalization', 'prepare_audit_boundary'],
    nextStep: 'Prepare controlled read-only adapter rehearsal without enabling real credentials or source connection.',
  };
}

export function validateReadOnlyRealConnectorPreparationPack(
  pack: ReadOnlyRealConnectorPreparationPack = getReadOnlyRealConnectorPreparationPack(),
): ReadOnlyRealConnectorPreparationValidation {
  const requiredBlockedActions = ['connect_real_source', 'load_credentials', 'configure_endpoint', 'enable_writes', 'mutate_events'];

  const checks = [
    { id: 'profile-ready', passed: pack.connectorProfileReady === true, detail: 'Connector profile is ready.' },
    { id: 'schema-ready', passed: pack.readSchemaReady === true, detail: 'Read schema is ready.' },
    { id: 'adapter-boundary-ready', passed: pack.adapterBoundaryReady === true, detail: 'Adapter boundary is ready.' },
    { id: 'normalization-ready', passed: pack.normalizationReady === true, detail: 'Normalization is ready.' },
    { id: 'audit-boundary-ready', passed: pack.auditBoundaryReady === true, detail: 'Audit boundary is ready.' },
    { id: 'real-connection-off', passed: pack.realConnectionActive === false, detail: 'Real connection remains off.' },
    { id: 'credentials-off', passed: pack.credentialsLoaded === false, detail: 'Credentials are not loaded.' },
    { id: 'endpoint-off', passed: pack.endpointConfigured === false, detail: 'No source endpoint is configured.' },
    { id: 'writes-disabled', passed: pack.writesEnabled === false, detail: 'Writes remain disabled.' },
    { id: 'activation-blocked', passed: pack.activationAllowed === false, detail: 'Activation remains blocked.' },
    { id: 'required-fields-mapped', passed: pack.schemaFields.filter((field) => field.required).every((field) => field.mapped), detail: 'Required read fields are mapped.' },
    {
      id: 'blocked-actions',
      passed: requiredBlockedActions.every((action) => pack.blockedActions.includes(action as never)),
      detail: 'Real connection and write actions are blocked.',
    },
    {
      id: 'safe-status',
      passed: pack.status === 'real_preparation_ready_connection_locked',
      detail: 'Status is safe and real connection locked.',
    },
  ];

  return {
    status: checks.every((check) => check.passed) ? 'safe' : 'warning',
    checkedAt: new Date().toISOString(),
    checks,
  };
}
