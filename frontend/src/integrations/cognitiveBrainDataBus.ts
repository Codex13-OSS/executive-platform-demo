import { getReadOnlySourceRuntimeRehearsalSnapshot } from './readOnlySourceRuntimeRehearsal';

export type CognitiveBrainDataBusSnapshot = {
  generatedAt: string;
  busStatus: 'operational';
  activeSignals: number;
  runtimeRehearsalPrepared: true;
  runtimeSourceDomain: 'agenda';
  runtimeSignalsPreview: number;
};

export function getCognitiveBrainDataBusSnapshot(): CognitiveBrainDataBusSnapshot {
  const runtime = getReadOnlySourceRuntimeRehearsalSnapshot();

  return {
    generatedAt: new Date().toISOString(),
    busStatus: 'operational',
    activeSignals: 6,
    runtimeRehearsalPrepared: true,
    runtimeSourceDomain: 'agenda',
    runtimeSignalsPreview: runtime.brainBusImpact.length,
  };
}
