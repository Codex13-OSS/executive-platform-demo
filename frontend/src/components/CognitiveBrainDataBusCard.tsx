import { getCognitiveBrainDataBusSnapshot } from '../integrations/cognitiveBrainDataBus';

export function CognitiveBrainDataBusCard() {
  const snapshot = getCognitiveBrainDataBusSnapshot();

  return (
    <section className="read-only-source-runtime-card-v200">
      <div className="read-only-foundation-head-v160">
        <span>COGNITIVE BRAIN BUS</span>
        <b>{snapshot.busStatus}</b>
      </div>
      <div className="runtime-chip-row-v200">
        <span className="runtime-chip-v200">signals {snapshot.activeSignals}</span>
        <span className="runtime-chip-v200">runtime rehearsal ready</span>
        <span className="runtime-chip-v200">agenda source prepared</span>
      </div>
    </section>
  );
}
