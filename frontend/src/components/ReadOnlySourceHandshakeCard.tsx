import {
  getReadOnlySourceHandshakeSnapshot,
  validateReadOnlySourceHandshakeSnapshot,
} from '../integrations/readOnlySourceHandshake';

export function ReadOnlySourceHandshakeCard() {
  const snapshot = getReadOnlySourceHandshakeSnapshot();
  const validation = validateReadOnlySourceHandshakeSnapshot(snapshot);

  return (
    <section className={`read-only-source-handshake-card-v210 ${validation.status === 'safe' ? 'is-safe' : 'is-warning'}`}>
      <div className="read-only-source-handshake-head-v210">
        <span>SOURCE HANDSHAKE</span>
        <b>{validation.status} / locked</b>
      </div>

      <p>Connector preparation · {snapshot.sourceDomain} source</p>

      <div className="read-only-source-handshake-grid-v210">
        <article><small>endpoint</small><strong>{snapshot.endpointGate}</strong></article>
        <article><small>credentials</small><strong>{snapshot.credentialGate}</strong></article>
        <article><small>approval</small><strong>{snapshot.approvalGate}</strong></article>
        <article><small>runtime</small><strong>{snapshot.runtimeCompatible ? 'compatible' : 'review'}</strong></article>
      </div>

      <div className="read-only-source-handshake-strip-v210">
        <span>reads prepared</span>
        <span>writes blocked</span>
        <span>audit ready</span>
      </div>

      <ul className="read-only-source-handshake-flow-v210">
        <li><span>runtime</span><b>envelope</b></li>
        <li><span>envelope</span><b>brain bus</b></li>
        <li><span>approval</span><b>activation gate</b></li>
      </ul>
    </section>
  );
}
