import {
  getExecutiveCognitiveBrainDataBusSnapshot,
  validateExecutiveCognitiveBrainDataBusSnapshot,
} from '../integrations/cognitiveBrainDataBus';

export function CognitiveBrainDataBusCard() {
  const snapshot = getExecutiveCognitiveBrainDataBusSnapshot();
  const validation = validateExecutiveCognitiveBrainDataBusSnapshot(snapshot);

  return (
    <section className={`cognitive-brain-bus-card-v180 ${validation.status === 'safe' ? 'is-safe' : 'is-warning'}`}>
      <div className="cognitive-brain-bus-orb-v180" />
      <div className="cognitive-brain-bus-head-v180">
        <span>COGNITIVE BRAIN BUS</span>
        <b>{validation.status} / locked</b>
      </div>

      <p>Read-only signal mesh</p>

      <div className="cognitive-brain-bus-grid-v180">
        <article><small>domains linked</small><strong>{snapshot.sourceDomains.length}</strong></article>
        <article><small>signals active</small><strong>{snapshot.brainSignals.length}</strong></article>
        <article><small>degraded watched</small><strong>{snapshot.degradedDomains.length}</strong></article>
        <article><small>commands suggested</small><strong>{snapshot.commandSuggestions.length}</strong></article>
      </div>

      <ul className="cognitive-brain-flow-v180">
        <li><span>agenda</span><b>priority</b></li>
        <li><span>risk</span><b>action</b></li>
        <li><span>documents</span><b>validation</b></li>
      </ul>
    </section>
  );
}
