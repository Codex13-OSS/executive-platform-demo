import ThemeToggle from '../components/ThemeToggle';
import { TrackingSummary } from '../lib/demoApi';
import { ThemeMode } from '../lib/theme';
import { ActionItem, RawEntry } from '../../../shared/types';

type TrackingViewProps = {
  entry: RawEntry | null;
  actions: ActionItem[];
  summary: TrackingSummary;
  onFinish: () => void;
  onReset: () => void;
  onBackDashboard: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
};

export default function TrackingView({
  entry,
  actions,
  summary,
  onFinish,
  onReset,
  onBackDashboard,
  theme,
  onToggleTheme,
}: TrackingViewProps) {
  if (actions.length === 0) {
    return (
      <main className="dashboard-layout">
        <section className="panel empty-state glass">
          <p className="eyebrow">Seguimiento vacío</p>
          <h1>Aún no hay acciones para monitorear</h1>
          <p className="muted">Captura y convierte una entrada para activar este tablero de seguimiento.</p>
          <button type="button" onClick={onBackDashboard}>
            Volver al dashboard
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-layout">
      <header className="dashboard-header panel glass">
        <div>
          <p className="eyebrow">Seguimiento ejecutivo</p>
          <h1>Ahora todo tiene seguimiento</h1>
          <p className="muted">
            Entrada capturada, acciones estructuradas y responsables visibles en una sola vista.
          </p>
        </div>
        <div className="header-actions">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button type="button" className="ghost" onClick={onReset}>
            Resetear demo
          </button>
          <button type="button" onClick={onFinish}>
            Finalizar demo
          </button>
        </div>
      </header>

      <section className="summary-grid" aria-label="Resumen ejecutivo de seguimiento">
        <article className="panel summary-tile glass">
          <p className="muted">Total de acciones</p>
          <p className="metric">{summary.total}</p>
        </article>
        <article className="panel summary-tile glass">
          <p className="muted">Assigned</p>
          <p className="metric">{summary.assigned}</p>
        </article>
        <article className="panel summary-tile glass">
          <p className="muted">Pending</p>
          <p className="metric">{summary.pending}</p>
        </article>
        <article className="panel summary-tile glass">
          <p className="muted">Confirmed</p>
          <p className="metric">{summary.confirmed}</p>
        </article>
      </section>

      {entry ? (
        <section className="panel flow-note glass">
          <p className="eyebrow">Resumen del flujo</p>
          <p>
            La nota inicial de <strong>{entry.category}</strong> fue transformada en {summary.total}{' '}
            acciones con responsables y siguientes pasos concretos.
          </p>
        </section>
      ) : null}

      <section className="cards-grid" aria-label="Acciones en seguimiento">
        {actions.map((action) => (
          <article key={action.id} className="panel action-card glass">
            <div className="action-top">
              <h3>{action.title}</h3>
              <div className="chips">
                <span className={`chip chip-priority-${action.priority}`}>{action.priority}</span>
                <span className={`chip chip-status-${action.status}`}>{action.status}</span>
              </div>
            </div>
            <p className="muted small-text">Owner: {action.owner}</p>
            <p className="muted small-text">Categoría: {action.category}</p>
            <p>
              <strong>Siguiente paso:</strong> {action.nextStep}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
