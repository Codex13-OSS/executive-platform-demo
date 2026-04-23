import { ActionItem, RawEntry } from '../../../shared/types';

type ActionConversionViewProps = {
  entry: RawEntry | null;
  actions: ActionItem[];
  onContinue: () => void;
  onEdit: () => void;
  onGoDashboard: () => void;
};

export default function ActionConversionView({
  entry,
  actions,
  onContinue,
  onEdit,
  onGoDashboard,
}: ActionConversionViewProps) {
  if (!entry) {
    return (
      <main className="dashboard-layout">
        <section className="panel empty-state">
          <p className="eyebrow">Sin entrada activa</p>
          <h1>No hay nota para convertir</h1>
          <p className="muted">Regresa al dashboard para crear una nueva entrada ejecutiva.</p>
          <button type="button" onClick={onGoDashboard}>
            Ir al dashboard
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-layout">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Transformación completada</p>
          <h1>La nota ya se convirtió en acciones</h1>
          <p className="muted">De entrada libre a ejecución estructurada en segundos.</p>
        </div>
        <div className="header-actions">
          <button type="button" className="ghost" onClick={onEdit}>
            Volver a editar
          </button>
          <button type="button" onClick={onContinue}>
            Continuar
          </button>
        </div>
      </header>

      <section className="comparison-grid">
        <article className="panel conversion-block">
          <p className="eyebrow">Antes · Entrada</p>
          <h2>{entry.category}</h2>
          <p>{entry.text}</p>
          <p className="muted small-text">Owner: {entry.owner}</p>
        </article>

        <article className="panel conversion-block">
          <p className="eyebrow">Después · Acciones</p>
          <h2>{actions.length} acciones detectadas</h2>
          <p className="muted">
            Lista local preparada para la siguiente fase de tracking y ejecución.
          </p>
        </article>
      </section>

      <section className="cards-grid" aria-label="Acciones generadas">
        {actions.map((action) => (
          <article key={action.id} className="panel action-card">
            <div className="action-top">
              <h3>{action.title}</h3>
              <div className="chips">
                <span className={`chip chip-priority-${action.priority}`}>{action.priority}</span>
                <span className={`chip chip-status-${action.status}`}>{action.status}</span>
              </div>
            </div>
            <p className="muted small-text">Categoría: {action.category}</p>
            <p className="muted small-text">Responsable: {action.owner}</p>
            <p>
              <strong>Siguiente paso:</strong> {action.nextStep}
            </p>
          </article>
        ))}
      </section>

      <section className="panel next-phase">
        <p className="eyebrow">Siguiente paso de la demo</p>
        <p>
          El botón continuar vuelve al dashboard mientras preservamos esta conversión en estado
          local para enlazar TrackingView en el siguiente incremento.
        </p>
      </section>
    </main>
  );
}
