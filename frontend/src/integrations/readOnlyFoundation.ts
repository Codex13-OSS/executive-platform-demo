import {
  getReadOnlyDataAdapterSimulation,
  validateReadOnlyDataAdapterSimulation,
  type ReadOnlyDataAdapter,
  type ReadOnlyDataAdapterValidation,
} from './readOnlyDataAdapters';

export type ExecutiveReadOnlyMode = 'mock_readonly' | 'contract_only';
export type ExecutiveReadOnlyDomain =
  | 'agenda'
  | 'contacts'
  | 'tasks'
  | 'documents'
  | 'risks'
  | 'audit';

export type ExecutiveReadOnlySource = {
  id: string;
  label: string;
  domain: ExecutiveReadOnlyDomain;
  mode: ExecutiveReadOnlyMode;
  endpoint: null;
  enabled: boolean;
  records: number;
  lastSyncAt: string;
};

export type ExecutiveReadOnlyHealth = {
  status: 'safe' | 'warning';
  writesEnabled: false;
  realApisConnected: false;
  credentialsRequired: false;
  checkedAt: string;
};

export type ExecutiveReadOnlyEvent = {
  id: string;
  title: string;
  window: string;
  priority: 'low' | 'medium' | 'high';
  sourceId: string;
};

export type ExecutiveReadOnlyContact = {
  id: string;
  displayName: string;
  role: string;
  sourceId: string;
};

export type ExecutiveReadOnlyTask = {
  id: string;
  title: string;
  owner: string;
  status: 'open' | 'review' | 'blocked';
  sourceId: string;
};

export type ExecutiveReadOnlyDocument = {
  id: string;
  title: string;
  status: 'draft' | 'review' | 'ready';
  sourceId: string;
};

export type ExecutiveReadOnlyRisk = {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  mitigation: string;
  sourceId: string;
};

export type ExecutiveReadOnlyAuditEvent = {
  id: string;
  action: string;
  actor: string;
  result: 'simulated' | 'observed';
  sourceId: string;
};

export type ExecutiveReadOnlySnapshot = {
  adapterSimulation: ReadOnlyDataAdapter[];
  adapterValidation: ReadOnlyDataAdapterValidation;
  mode: ExecutiveReadOnlyMode;
  generatedAt: string;
  writesEnabled: false;
  realApisConnected: false;
  credentialsRequired: false;
  sources: ExecutiveReadOnlySource[];
  health: ExecutiveReadOnlyHealth;
  events: ExecutiveReadOnlyEvent[];
  contacts: ExecutiveReadOnlyContact[];
  tasks: ExecutiveReadOnlyTask[];
  documents: ExecutiveReadOnlyDocument[];
  risks: ExecutiveReadOnlyRisk[];
  audit: ExecutiveReadOnlyAuditEvent[];
};

export type ExecutiveReadOnlySelfCheck = {
  status: 'safe' | 'warning';
  checkedAt: string;
  checks: Array<{
    id: string;
    label: string;
    passed: boolean;
  }>;
};

export const EXECUTIVE_READ_ONLY_MODE: ExecutiveReadOnlyMode = 'mock_readonly';
export const EXECUTIVE_WRITES_ENABLED = false as const;
export const EXECUTIVE_REAL_APIS_CONNECTED = false as const;
export const EXECUTIVE_CREDENTIALS_REQUIRED = false as const;

export function areExecutiveWritesEnabled() {
  return EXECUTIVE_WRITES_ENABLED;
}

export function getExecutiveReadOnlySnapshot(): ExecutiveReadOnlySnapshot {
  const generatedAt = new Date().toISOString();
  const adapterSimulation = getReadOnlyDataAdapterSimulation();
  const adapterValidation = validateReadOnlyDataAdapterSimulation(adapterSimulation);

  const sources: ExecutiveReadOnlySource[] = [
    {
      id: 'source-agenda-mock',
      label: 'Agenda',
      domain: 'agenda',
      mode: EXECUTIVE_READ_ONLY_MODE,
      endpoint: null,
      enabled: true,
      records: 4,
      lastSyncAt: generatedAt,
    },
    {
      id: 'source-documents-mock',
      label: 'Documentos',
      domain: 'documents',
      mode: EXECUTIVE_READ_ONLY_MODE,
      endpoint: null,
      enabled: true,
      records: 3,
      lastSyncAt: generatedAt,
    },
    {
      id: 'source-risks-mock',
      label: 'Riesgos',
      domain: 'risks',
      mode: EXECUTIVE_READ_ONLY_MODE,
      endpoint: null,
      enabled: true,
      records: 2,
      lastSyncAt: generatedAt,
    },
    {
      id: 'source-audit-mock',
      label: 'Auditoría',
      domain: 'audit',
      mode: 'contract_only',
      endpoint: null,
      enabled: true,
      records: 5,
      lastSyncAt: generatedAt,
    },
  ];

  return {
    adapterSimulation,
    adapterValidation,
    mode: EXECUTIVE_READ_ONLY_MODE,
    generatedAt,
    writesEnabled: EXECUTIVE_WRITES_ENABLED,
    realApisConnected: EXECUTIVE_REAL_APIS_CONNECTED,
    credentialsRequired: EXECUTIVE_CREDENTIALS_REQUIRED,
    sources,
    health: {
      status: 'safe',
      writesEnabled: EXECUTIVE_WRITES_ENABLED,
      realApisConnected: EXECUTIVE_REAL_APIS_CONNECTED,
      credentialsRequired: EXECUTIVE_CREDENTIALS_REQUIRED,
      checkedAt: generatedAt,
    },
    events: [
      { id: 'event-briefing', title: 'Briefing ejecutivo', window: '08:30', priority: 'high', sourceId: 'source-agenda-mock' },
      { id: 'event-review', title: 'Revisión de decisiones', window: '11:00', priority: 'medium', sourceId: 'source-agenda-mock' },
    ],
    contacts: [
      { id: 'contact-ops', displayName: 'Equipo operativo', role: 'Seguimiento', sourceId: 'source-agenda-mock' },
    ],
    tasks: [
      { id: 'task-followup', title: 'Validar seguimiento prioritario', owner: 'Dirección', status: 'review', sourceId: 'source-risks-mock' },
    ],
    documents: [
      { id: 'doc-proposal', title: 'Propuesta ejecutiva', status: 'review', sourceId: 'source-documents-mock' },
    ],
    risks: [
      { id: 'risk-approval', title: 'Decisión pendiente', severity: 'medium', mitigation: 'Confirmación humana requerida', sourceId: 'source-risks-mock' },
    ],
    audit: [
      { id: 'audit-foundation', action: 'Read-only self-check', actor: 'LÍA O.S.', result: 'simulated', sourceId: 'source-audit-mock' },
    ],
  };
}

export function validateExecutiveReadOnlySnapshot(
  snapshot: ExecutiveReadOnlySnapshot,
): ExecutiveReadOnlySelfCheck {
  const checks = [
    {
      id: 'writes-disabled',
      label: 'Writes disabled',
      passed: snapshot.writesEnabled === false && areExecutiveWritesEnabled() === false,
    },
    {
      id: 'no-real-apis',
      label: 'Real APIs disconnected',
      passed: snapshot.realApisConnected === false,
    },
    {
      id: 'no-credentials',
      label: 'Credentials not required',
      passed: snapshot.credentialsRequired === false,
    },
    {
      id: 'no-endpoints',
      label: 'No external endpoints',
      passed: snapshot.sources.every((source) => source.endpoint === null),
    },
    {
      id: 'mock-sources',
      label: 'Mock sources available',
      passed: snapshot.sources.length > 0,
    },
    {
      id: 'adapter-simulation-safe',
      label: 'Adapter simulation safe',
      passed: snapshot.adapterValidation.safe,
    },
    {
      id: 'timestamp',
      label: 'Snapshot timestamp available',
      passed: Boolean(snapshot.generatedAt),
    },
  ];

  return {
    status: checks.every((check) => check.passed) ? 'safe' : 'warning',
    checkedAt: new Date().toISOString(),
    checks,
  };
}
