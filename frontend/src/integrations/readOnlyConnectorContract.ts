export type ReadOnlyConnectorMode = 'contract_rehearsal_agenda';
export type ReadOnlyConnectorStatus = 'rehearsal_ready';

export type ReadOnlyConnectorRehearsalEvent = {
  id: string;
  title: string;
  timeWindow: string;
  location: string;
  riskHint: 'low' | 'medium' | 'high';
  readOperation: 'agenda_event_read' | 'availability_read' | 'event_risk_read';
};

export type ReadOnlyConnectorRehearsalSnapshot = {
  generatedAt: string;
  mode: ReadOnlyConnectorMode;
  status: ReadOnlyConnectorStatus;
  sourceDomain: 'agenda';
  readsEnabled: true;
  writesEnabled: false;
  realSourceActive: false;
  credentialsLoaded: false;
  events: ReadOnlyConnectorRehearsalEvent[];
  safeToRender: true;
};

export function getReadOnlyConnectorRehearsalSnapshot(): ReadOnlyConnectorRehearsalSnapshot {
  return {
    generatedAt: new Date().toISOString(),
    mode: 'contract_rehearsal_agenda',
    status: 'rehearsal_ready',
    sourceDomain: 'agenda',
    readsEnabled: true,
    writesEnabled: false,
    realSourceActive: false,
    credentialsLoaded: false,
    events: [
      { id: 'evt-001', title: 'Steering Brief', timeWindow: '09:00-09:30', location: 'Boardroom North', riskHint: 'medium', readOperation: 'agenda_event_read' },
      { id: 'evt-002', title: 'Availability Window', timeWindow: '11:30-12:00', location: 'Focus Block', riskHint: 'low', readOperation: 'availability_read' },
      { id: 'evt-003', title: 'Risk Sync', timeWindow: '16:00-16:30', location: 'Ops Room', riskHint: 'high', readOperation: 'event_risk_read' },
    ],
    safeToRender: true,
  };
}

export function validateReadOnlyConnectorRehearsalSnapshot(
  snapshot: ReadOnlyConnectorRehearsalSnapshot = getReadOnlyConnectorRehearsalSnapshot(),
) {
  const checks = [
    snapshot.writesEnabled === false,
    snapshot.realSourceActive === false,
    snapshot.credentialsLoaded === false,
    snapshot.sourceDomain === 'agenda',
    snapshot.safeToRender === true,
  ];

  return { safe: checks.every(Boolean), checks };
}
