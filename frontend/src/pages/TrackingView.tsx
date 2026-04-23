import ActivityRingsCluster from '../components/ActivityRingsCluster';
import GlassPanel from '../components/GlassPanel';
import MetricCard from '../components/MetricCard';
import PageShell from '../components/PageShell';
import StatusChip from '../components/StatusChip';
import TopBar from '../components/TopBar';
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

export default function TrackingView({ entry, actions, summary, onFinish, onReset, onBackDashboard, theme, onToggleTheme }: TrackingViewProps) {
  if (actions.length === 0) {
    return (
      <PageShell>
        <GlassPanel className="empty-state" variant="strong">
          <h2>Aún no hay acciones para monitorear</h2>
          <button type="button" className="btn-primary" onClick={onBackDashboard}>
            Volver al dashboard
          </button>
        </GlassPanel>
      </PageShell>
    );
  }

  const ringValues = [
    { label: 'Assigned', sublabel: 'propiedad', progress: summary.assigned / Math.max(summary.total, 1), color: '#0F8A5F' },
    { label: 'Pending', sublabel: 'atención', progress: summary.pending / Math.max(summary.total, 1), color: '#C63D3D' },
    { label: 'Confirmed', sublabel: 'cierre', progress: summary.confirmed / Math.max(summary.total, 1), color: '#12A372' },
  ];

  return (
    <PageShell>
      <TopBar
        eyebrow="Seguimiento ejecutivo"
        title="Ahora todo tiene seguimiento"
        subtitle="Estatus, ownership y próximos pasos en una vista institucional única."
        actions={
          <>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button type="button" className="btn-secondary" onClick={onReset}>Resetear demo</button>
            <button type="button" className="btn-primary" onClick={onFinish}>Finalizar demo</button>
          </>
        }
      />

      <section className="dashboard-hero-grid tracking-balance tracking-premium-hero">
        <GlassPanel variant="elevated" className="tracking-rings-panel">
          <p className="eyebrow">Pulso operativo</p>
          <ActivityRingsCluster values={ringValues} />
        </GlassPanel>

        <GlassPanel variant="strong" className="metrics-grid compact-metrics metric-surface tracking-metrics-panel">
      <section className="dashboard-hero-grid tracking-balance">
        <GlassPanel variant="elevated"><ActivityRingsCluster values={ringValues} /></GlassPanel>
        <GlassPanel variant="strong" className="metrics-grid compact-metrics metric-surface">
          <MetricCard label="Total" value={String(summary.total)} note="acciones" />
          <MetricCard label="Assigned" value={String(summary.assigned)} note="en propiedad" />
          <MetricCard label="Pending" value={String(summary.pending)} note="en seguimiento" />
          <MetricCard label="Confirmed" value={String(summary.confirmed)} note="cerradas" />
        </GlassPanel>
      </section>

      {entry ? (
        <GlassPanel className="flow-note flow-highlight" variant="default">
          <p className="eyebrow">Resumen ejecutivo</p>
          <h3>{entry.category}</h3>
          <p><strong>{summary.total}</strong> acciones activas con propietarios definidos y próximos pasos listos para ejecución.</p>
          <div className="chips">
            <StatusChip label={`${summary.assigned} assigned`} tone="active" />
            <StatusChip label={`${summary.pending} pending`} tone="pending" />
            <StatusChip label={`${summary.confirmed} confirmed`} tone="done" />
          </div>
        </GlassPanel>
      ) : null}

      <GlassPanel variant="elevated" className="tracking-actions-panel">
        <div className="action-cards-grid tracking-cards tracking-cards-premium">
          {actions.map((action) => (
            <article key={action.id} className="action-row action-card-item tracking-action-card">
      <GlassPanel variant="elevated">
        <div className="action-cards-grid tracking-cards">
          {actions.map((action) => (
            <article key={action.id} className="action-row action-card-item">
              <div>
                <h3>{action.title}</h3>
                <p className="muted small-text">{action.owner} · {action.category}</p>
                <p><strong>Siguiente paso:</strong> {action.nextStep}</p>
              </div>
              <div className="chips">
                <StatusChip label={action.status} tone={action.status === 'confirmed' ? 'done' : action.status === 'assigned' ? 'active' : 'pending'} />
                <StatusChip label={action.priority} tone={action.priority === 'high' ? 'alert' : 'active'} />
              </div>
            </article>
          ))}
        </div>
      </GlassPanel>
    </PageShell>
  );
}
