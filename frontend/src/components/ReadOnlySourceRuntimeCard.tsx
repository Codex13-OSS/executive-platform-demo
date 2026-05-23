import {
  getReadOnlySourceRuntimeRehearsalSnapshot,
  validateReadOnlySourceRuntimeRehearsalSnapshot,
} from '../integrations/readOnlySourceRuntimeRehearsal';

export function ReadOnlySourceRuntimeCard() {
  const snapshot = getReadOnlySourceRuntimeRehearsalSnapshot();
  const validation = validateReadOnlySourceRuntimeRehearsalSnapshot(snapshot);

  return (
    <section className={`read-only-source-runtime-card-v200 ${validation.safe ? 'is-safe' : 'is-warning'}`}>
      <div className="read-only-foundation-head-v160">
        <span>SOURCE RUNTIME</span>
        <b>{snapshot.status}</b>
      </div>
      <div className="runtime-chip-row-v200">
        <span className="runtime-chip-v200">Read-only rehearsal</span>
        <span className="runtime-chip-v200">agenda source</span>
        <span className="runtime-chip-v200">reads rehearsed</span>
        <span className="runtime-chip-v200">writes blocked</span>
        <span className="runtime-chip-v200">credentials untouched</span>
        <span className="runtime-chip-v200">endpoint untouched</span>
        <span className="runtime-chip-v200">events {snapshot.normalizedReadEvents.length}</span>
        <span className="runtime-chip-v200">brain impacts {snapshot.brainBusImpact.length}</span>
        <span className="runtime-chip-v200">audit safe</span>
      </div>
      <div className="runtime-flow-v200">
        <small>read event → normalize</small>
        <small>normalize → brain bus</small>
        <small>brain bus → priority</small>
        <small>risk hint → command preview</small>
      </div>
    </section>
  );
}
