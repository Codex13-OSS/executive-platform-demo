import {
  getExecutiveReadOnlySnapshot,
  validateExecutiveReadOnlySnapshot,
} from '../integrations/readOnlyFoundation';

export function ReadOnlyFoundationCard() {
  const snapshot = getExecutiveReadOnlySnapshot();
  const selfCheck = validateExecutiveReadOnlySnapshot(snapshot);
  const adapters = snapshot.adapterSimulation;
  const degradedCount = adapters.filter((adapter) => adapter.status === 'degraded').length;
  const mockCount = adapters.filter((adapter) => adapter.status === 'mock').length;
  const readinessCount = adapters.filter((adapter) => adapter.status === 'configured' || adapter.status === 'connected_readonly_future').length;
  const statusLabels: Record<string, string> = {
    connected_readonly_future: 'lectura futura',
    configured: 'configurado',
    degraded: 'degradado',
    mock: 'preparado',
  };

  return (
    <section className={`read-only-foundation-card-v160 ${selfCheck.status === 'safe' ? 'is-safe' : 'is-warning'}`}>
      <div className="read-only-foundation-orb-v160" />
      <div className="read-only-foundation-head-v160">
        <span>READ-ONLY FOUNDATION</span>
        <b>{selfCheck.status}</b>
      </div>

      <div className="read-only-foundation-grid-v160">
        <article><small>Lectura preparada</small><strong>activa</strong></article>
        <article><small>Dominios</small><strong>{adapters.length} preparados</strong></article>
        <article><small>Escrituras</small><strong>desactivadas</strong></article>
        <article><small>Conexiones reales</small><strong>inactivas</strong></article>
      </div>

      <div className="read-only-foundation-chips-v170">
        <span className="chip-readiness">preparación {readinessCount}</span>
        <span className="chip-degraded">degradado {degradedCount}</span>
        <span className="chip-mock">preparado {mockCount}</span>
      </div>

      <ul className="read-only-foundation-domains-v170">
        {adapters.map((adapter) => (
          <li key={adapter.id}>
            <span>{adapter.domain}</span>
            <b className={`state-${adapter.status}`}>{statusLabels[adapter.status] ?? adapter.status.replace(/_/g, ' ')}</b>
          </li>
        ))}
      </ul>
    </section>
  );
}
