export type ReadOnlyAdapterDomain = 'agenda' | 'documents' | 'risks' | 'tasks' | 'contacts' | 'audit';

export type ReadOnlyAdapterStatus =
  | 'mock'
  | 'configured'
  | 'unavailable'
  | 'stale'
  | 'degraded'
  | 'connected_readonly_future';

export type ReadOnlyAdapterMode = 'simulation_readonly';

export type ReadOnlyDataAdapter = {
  id: string;
  label: string;
  domain: ReadOnlyAdapterDomain;
  status: ReadOnlyAdapterStatus;
  mode: ReadOnlyAdapterMode;
  lastSyncLabel: string;
  freshness: 'fresh' | 'stable' | 'aging';
  permissionState: 'read-only-locked';
  health: 'safe' | 'degraded' | 'attention';
  recordsPreview: number;
  nextReadinessStep: string;
  writesEnabled: false;
  credentialsLoaded: false;
  realConnectionActive: false;
};

export type ReadOnlyDataAdapterValidation = {
  safe: boolean;
  checkedAt: string;
  checks: Array<{ id: string; passed: boolean; detail: string }>;
};

export function getReadOnlyDataAdapterSimulation(): ReadOnlyDataAdapter[] {
  return [
    {
      id: 'adapter-agenda-sim',
      label: 'Agenda Stream',
      domain: 'agenda',
      status: 'mock',
      mode: 'simulation_readonly',
      lastSyncLabel: 'Ahora',
      freshness: 'fresh',
      permissionState: 'read-only-locked',
      health: 'safe',
      recordsPreview: 4,
      nextReadinessStep: 'Map field parity for external calendar read.',
      writesEnabled: false,
      credentialsLoaded: false,
      realConnectionActive: false,
    },
    {
      id: 'adapter-documents-sim',
      label: 'Documents Timeline',
      domain: 'documents',
      status: 'configured',
      mode: 'simulation_readonly',
      lastSyncLabel: 'Hace 2 min',
      freshness: 'stable',
      permissionState: 'read-only-locked',
      health: 'safe',
      recordsPreview: 3,
      nextReadinessStep: 'Prepare immutable metadata contract.',
      writesEnabled: false,
      credentialsLoaded: false,
      realConnectionActive: false,
    },
    {
      id: 'adapter-risks-sim',
      label: 'Risk Radar',
      domain: 'risks',
      status: 'degraded',
      mode: 'simulation_readonly',
      lastSyncLabel: 'Hace 7 min',
      freshness: 'aging',
      permissionState: 'read-only-locked',
      health: 'degraded',
      recordsPreview: 2,
      nextReadinessStep: 'Define fallback severity normalization rules.',
      writesEnabled: false,
      credentialsLoaded: false,
      realConnectionActive: false,
    },
    {
      id: 'adapter-tasks-sim',
      label: 'Task Pulse',
      domain: 'tasks',
      status: 'stale',
      mode: 'simulation_readonly',
      lastSyncLabel: 'Hace 18 min',
      freshness: 'aging',
      permissionState: 'read-only-locked',
      health: 'attention',
      recordsPreview: 5,
      nextReadinessStep: 'Calibrate stale threshold observability.',
      writesEnabled: false,
      credentialsLoaded: false,
      realConnectionActive: false,
    },
    {
      id: 'adapter-contacts-sim',
      label: 'Contacts Mesh',
      domain: 'contacts',
      status: 'unavailable',
      mode: 'simulation_readonly',
      lastSyncLabel: 'Sin lectura externa',
      freshness: 'stable',
      permissionState: 'read-only-locked',
      health: 'attention',
      recordsPreview: 1,
      nextReadinessStep: 'Document unavailability downgrade path.',
      writesEnabled: false,
      credentialsLoaded: false,
      realConnectionActive: false,
    },
    {
      id: 'adapter-audit-sim',
      label: 'Audit Trail Bus',
      domain: 'audit',
      status: 'connected_readonly_future',
      mode: 'simulation_readonly',
      lastSyncLabel: 'Modo preparación',
      freshness: 'stable',
      permissionState: 'read-only-locked',
      health: 'safe',
      recordsPreview: 6,
      nextReadinessStep: 'Enable signed trace schema for future read-only connector.',
      writesEnabled: false,
      credentialsLoaded: false,
      realConnectionActive: false,
    },
  ];
}

export function validateReadOnlyDataAdapterSimulation(
  adapters: ReadOnlyDataAdapter[] = getReadOnlyDataAdapterSimulation(),
): ReadOnlyDataAdapterValidation {
  const requiredDomains: ReadOnlyAdapterDomain[] = ['agenda', 'documents', 'risks', 'tasks', 'contacts', 'audit'];

  const checks = [
    {
      id: 'writes-disabled',
      passed: adapters.every((adapter) => adapter.writesEnabled === false),
      detail: 'All adapters are locked as read-only.',
    },
    {
      id: 'credentials-not-loaded',
      passed: adapters.every((adapter) => adapter.credentialsLoaded === false),
      detail: 'No adapter includes credentials.',
    },
    {
      id: 'real-connection-off',
      passed: adapters.every((adapter) => adapter.realConnectionActive === false),
      detail: 'No real data connection is active.',
    },
    {
      id: 'minimum-domains-present',
      passed: requiredDomains.every((domain) => adapters.some((adapter) => adapter.domain === domain)),
      detail: 'All minimum domains are represented in simulation.',
    },
    {
      id: 'safe-simulation-shape',
      passed: adapters.length >= requiredDomains.length,
      detail: 'Simulation remains complete and safe for UI readiness.',
    },
  ];

  return {
    safe: checks.every((check) => check.passed),
    checkedAt: new Date().toISOString(),
    checks,
  };
}
