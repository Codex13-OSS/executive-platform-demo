import {
  getReadOnlyConnectorRehearsalSnapshot,
  validateReadOnlyConnectorRehearsalSnapshot,
} from '../integrations/readOnlyConnectorContract';

export function ReadOnlyConnectorContractCard() {
  const snapshot = getReadOnlyConnectorRehearsalSnapshot();
  const validation = validateReadOnlyConnectorRehearsalSnapshot(snapshot);
  const contract = snapshot.contract;

  return (
    <section className={`read-only-connector-card-v190 ${validation.status === 'safe' ? 'is-safe' : 'is-warning'}`}>
      <div className="read-only-connector-orb-v190" />
      <div className="read-only-connector-head-v190">
        <span>READ-ONLY CONNECTOR</span>
        <b>{validation.status} / locked</b>
      </div>

      <p>Contract rehearsal · {contract.domain}</p>

      <div className="read-only-connector-grid-v190">
        <article><small>reads</small><strong>enabled</strong></article>
        <article><small>writes</small><strong>locked</strong></article>
        <article><small>real source</small><strong>off</strong></article>
        <article><small>credentials</small><strong>off</strong></article>
      </div>

      <div className="read-only-connector-strip-v190">
        <span>{snapshot.rehearsalEvents.length} rehearsal events</span>
        <span>{contract.allowedOperations.length} read ops</span>
        <span>{contract.blockedOperations.length} blocked writes</span>
      </div>

      <ul className="read-only-connector-flow-v190">
        {snapshot.brainBusImpactPreview.map((impact) => (
          <li key={impact.id}>
            <span>{impact.from}</span>
            <b>{impact.to}</b>
          </li>
        ))}
      </ul>
    </section>
  );
}
