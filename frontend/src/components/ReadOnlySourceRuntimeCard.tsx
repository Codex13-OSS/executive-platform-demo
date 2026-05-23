import {
  getReadOnlySourceRuntimeRehearsalSnapshot,
  validateReadOnlySourceRuntimeRehearsalSnapshot,
} from '../integrations/readOnlySourceRuntimeRehearsal';

export function ReadOnlySourceRuntimeCard() {
  const snapshot = getReadOnlySourceRuntimeRehearsalSnapshot();
  const validation = validateReadOnlySourceRuntimeRehearsalSnapshot(snapshot);

  return (
    <section className={`read-only-source-runtime-card-v200 ${validation.status === 'safe' ? 'is-safe' : 'is-warning'}`}>
      <div className="read-only-source-runtime-head-v200">
        <span>SOURCE RUNTIME</span>
        <b>{validation.status} / rehearsal</b>
      </div>

      <p>Read-only rehearsal · {snapshot.sourceDomain} source</p>

      <div className="read-only-source-runtime-grid-v200">
        <article><small>reads</small><strong>rehearsed</strong></article>
        <article><small>writes</small><strong>blocked</strong></article>
        <article><small>credentials</small><strong>untouched</strong></article>
        <article><small>endpoint</small><strong>untouched</strong></article>
      </div>

      <div className="read-only-source-runtime-strip-v200">
        <span>{snapshot.normalizedReadEvents.length} normalized events</span>
        <span>{snapshot.brainBusImpact.length} brain impacts</span>
        <span>audit safe</span>
        <span>handshake prep ready</span>
        <span>activation locked</span>
      </div>

      <ul className="read-only-source-runtime-flow-v200">
        <li><span>read event</span><b>normalize</b></li>
        <li><span>normalize</span><b>brain bus</b></li>
        <li><span>brain bus</span><b>priority</b></li>
        <li><span>risk hint</span><b>command preview</b></li>
      </ul>
    </section>
  );
}
