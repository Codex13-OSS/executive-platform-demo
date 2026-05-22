import {
  getExecutiveReadOnlySnapshot,
  validateExecutiveReadOnlySnapshot,
} from '../integrations/readOnlyFoundation';

export function ReadOnlyFoundationCard() {
  const snapshot = getExecutiveReadOnlySnapshot();
  const selfCheck = validateExecutiveReadOnlySnapshot(snapshot);
  const syncTime = new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(snapshot.generatedAt));

  return (
    <section className={`read-only-foundation-card-v160 ${selfCheck.status === 'safe' ? 'is-safe' : 'is-warning'}`}>
      <div className="read-only-foundation-orb-v160" />
      <div className="read-only-foundation-head-v160">
        <span>Read-only foundation</span>
        <b>{selfCheck.status}</b>
      </div>

      <div className="read-only-foundation-grid-v160">
        <article>
          <small>Mode</small>
          <strong>{snapshot.mode.replace('_', ' ')}</strong>
        </article>
        <article>
          <small>Sources</small>
          <strong>{snapshot.sources.length}</strong>
        </article>
        <article>
          <small>Writes</small>
          <strong>disabled</strong>
        </article>
        <article>
          <small>Sync</small>
          <strong>{syncTime}</strong>
        </article>
      </div>

      <p>Contrato seguro para futuras lecturas reales. Sin APIs, credenciales ni escritura.</p>
    </section>
  );
}
