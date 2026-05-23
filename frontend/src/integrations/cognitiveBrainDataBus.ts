import {
  getReadOnlyDataAdapterSimulation,
  validateReadOnlyDataAdapterSimulation,
  type ReadOnlyAdapterDomain,
} from './readOnlyDataAdapters';

export type CognitiveBrainDomain = ReadOnlyAdapterDomain;

export type CognitiveBrainSignal = {
  id: string;
  domain: CognitiveBrainDomain;
  flow: 'agenda_priority' | 'risk_action' | 'documents_validation' | 'tasks_followup' | 'contacts_alignment' | 'audit_trace';
  intensity: 'low' | 'medium' | 'high';
  status: 'active' | 'watch' | 'degraded';
  summary: string;
};

export type CognitiveBrainPriority = {
  id: string;
  domain: CognitiveBrainDomain;
  level: 'critical' | 'high' | 'medium';
  reason: string;
};

export type CognitiveBrainCommandSuggestion = {
  id: string;
  domain: CognitiveBrainDomain;
  command: string;
  expectedImpact: string;
  requiresExecutiveConfirmation: true;
};

export type CognitiveBrainDataBusSnapshot = {
  generatedAt: string;
  mode: 'mock_cognitive_bus';
  writesEnabled: false;
  realApisConnected: false;
  sourceDomains: CognitiveBrainDomain[];
  brainSignals: CognitiveBrainSignal[];
  prioritySignals: CognitiveBrainPriority[];
  commandSuggestions: CognitiveBrainCommandSuggestion[];
  graphPulse: 'stable' | 'watching' | 'adaptive';
  degradedDomains: CognitiveBrainDomain[];
  safeToRender: boolean;
  nextEvolutionStep: string;
};

export type CognitiveBrainBusValidation = {
  status: 'safe' | 'warning';
  safeToRender: boolean;
  checkedAt: string;
  checks: Array<{ id: string; passed: boolean; detail: string }>;
};

export function getExecutiveCognitiveBrainDataBusSnapshot(): CognitiveBrainDataBusSnapshot {
  const adapters = getReadOnlyDataAdapterSimulation();
  const adapterValidation = validateReadOnlyDataAdapterSimulation(adapters);
  const sourceDomains = adapters.map((adapter) => adapter.domain);
  const degradedDomains = adapters
    .filter((adapter) => adapter.status === 'degraded' || adapter.status === 'stale' || adapter.status === 'unavailable')
    .map((adapter) => adapter.domain);

  const brainSignals: CognitiveBrainSignal[] = [
    { id: 'signal-agenda-priority', domain: 'agenda', flow: 'agenda_priority', intensity: 'high', status: 'active', summary: 'Agenda ejecutiva elevó prioridad de confirmación.' },
    { id: 'signal-risk-action', domain: 'risks', flow: 'risk_action', intensity: 'high', status: degradedDomains.includes('risks') ? 'degraded' : 'active', summary: 'Riesgo operativo requiere acción guiada y seguimiento.' },
    { id: 'signal-documents-validation', domain: 'documents', flow: 'documents_validation', intensity: 'medium', status: 'watch', summary: 'Documentos listos para validación ejecutiva.' },
  ];

  const prioritySignals: CognitiveBrainPriority[] = [
    { id: 'priority-agenda', domain: 'agenda', level: 'critical', reason: 'Ventana de decisión próxima.' },
    { id: 'priority-risks', domain: 'risks', level: 'high', reason: 'Degradación observada en señal de riesgo.' },
    { id: 'priority-documents', domain: 'documents', level: 'medium', reason: 'Validación final pendiente.' },
  ];

  const commandSuggestions: CognitiveBrainCommandSuggestion[] = [
    { id: 'cmd-priority', domain: 'agenda', command: 'Priorizar cierre ejecutivo', expectedImpact: 'Alinea agenda, riesgo y confirmación.', requiresExecutiveConfirmation: true },
    { id: 'cmd-risk', domain: 'risks', command: 'Abrir seguimiento crítico', expectedImpact: 'Reduce latencia de respuesta operativa.', requiresExecutiveConfirmation: true },
    { id: 'cmd-doc', domain: 'documents', command: 'Solicitar validación documental', expectedImpact: 'Acelera decisión final del frente comercial.', requiresExecutiveConfirmation: true },
  ];

  return {
    generatedAt: new Date().toISOString(),
    mode: 'mock_cognitive_bus',
    writesEnabled: false,
    realApisConnected: false,
    sourceDomains,
    brainSignals,
    prioritySignals,
    commandSuggestions,
    graphPulse: degradedDomains.length > 1 ? 'watching' : 'adaptive',
    degradedDomains,
    safeToRender: adapterValidation.safe,
    nextEvolutionStep: 'Wire domain-to-graph contracts for controlled read-only connectors.',
  };
}

export function validateExecutiveCognitiveBrainDataBusSnapshot(
  snapshot: CognitiveBrainDataBusSnapshot = getExecutiveCognitiveBrainDataBusSnapshot(),
): CognitiveBrainBusValidation {
  const requiredDomains: CognitiveBrainDomain[] = ['agenda', 'documents', 'risks', 'tasks', 'contacts', 'audit'];
  const allowedDomains = new Set(requiredDomains);

  const checks = [
    { id: 'writes-disabled', passed: snapshot.writesEnabled === false, detail: 'Brain bus remains read-only.' },
    { id: 'no-real-apis', passed: snapshot.realApisConnected === false, detail: 'No real API connection active.' },
    { id: 'minimum-domains-represented', passed: requiredDomains.every((domain) => snapshot.sourceDomains.includes(domain)), detail: 'All read-only domains are represented in the bus.' },
    { id: 'signals-valid-domain', passed: snapshot.brainSignals.every((signal) => allowedDomains.has(signal.domain)), detail: 'Each signal comes from an allowed domain.' },
    { id: 'core-flows-present', passed: snapshot.brainSignals.some((signal) => signal.domain === 'agenda') && snapshot.brainSignals.some((signal) => signal.domain === 'risks') && snapshot.brainSignals.some((signal) => signal.domain === 'documents'), detail: 'Agenda, risks and documents are represented in active brain signals.' },
    { id: 'no-endpoints-or-credentials', passed: !('endpoint' in snapshot) && !('credentials' in snapshot), detail: 'Snapshot shape includes no endpoint or credential fields.' },
    { id: 'safe-render', passed: snapshot.safeToRender === true, detail: 'Snapshot is safe to render.' },
  ];

  const safeToRender = checks.every((check) => check.passed);
  return { status: safeToRender ? 'safe' : 'warning', safeToRender, checkedAt: new Date().toISOString(), checks };
}
