import GlassPanel from '../components/GlassPanel';
import PageShell from '../components/PageShell';
import StatusChip from '../components/StatusChip';
import TopBar from '../components/TopBar';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeMode } from '../lib/theme';
import { ActionItem, RawEntry } from '../../../shared/types';

type ActionConversionViewProps = {
  entry: RawEntry | null;
  actions: ActionItem[];
  onGoTracking: () => void;
  onEdit: () => void;
  onGoDashboard: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
};

export default function ActionConversionView({ entry, actions, onGoTracking, onEdit, onGoDashboard, theme, onToggleTheme }: ActionConversionViewProps) {
  if (!entry) {
    return (
      <PageShell>
        <GlassPanel className="empty-state" variant="strong">
          <h2>No hay nota para convertir</h2>
          <button type="button" className="btn-primary" onClick={onGoDashboard}>Ir al dashboard</button>
        </GlassPanel>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <TopBar
        eyebrow="Transformación inteligente"
        title="Entrada cruda → Acciones organizadas"
        subtitle="Composición comparativa de alto nivel entre contexto original y plan accionable."
        actions={
          <>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button type="button" className="btn-secondary" onClick={onEdit}>Volver a editar</button>
            <button type="button" className="btn-primary" onClick={onGoTracking}>Ir a seguimiento</button>
          </>
        }
      />

      <section className="split-grid split-dense">
        <GlassPanel variant="strong" className="source-panel">
          <p className="eyebrow">Entrada original</p>
          <h3>{entry.category}</h3>
          <p>{entry.text}</p>
          <div className="chips">
            <StatusChip label={entry.priority} tone={entry.priority === 'high' ? 'alert' : 'active'} />
            <StatusChip label="capturada" tone="done" />
          </div>
          <p className="muted small-text">Owner: {entry.owner}</p>
          <p className="muted small-text">Timestamp: {new Date(entry.createdAt).toLocaleString('es-ES')}</p>
        </GlassPanel>

        <GlassPanel variant="elevated">
          <p className="eyebrow">Acciones generadas</p>
          <h3>{actions.length} acciones detectadas</h3>
          <div className="action-cards-grid">
            {actions.map((action) => (
              <article key={action.id} className="action-row action-card-item">
                <div>
                  <strong>{action.title}</strong>
                  <p className="muted small-text">{action.owner} · {action.category}</p>
                  <p className="small-text"><strong>Siguiente paso:</strong> {action.nextStep}</p>
                </div>
                <div className="chips">
                  <StatusChip label={action.status} tone={action.status === 'confirmed' ? 'done' : action.status === 'assigned' ? 'active' : 'pending'} />
                  <StatusChip label={action.priority} tone={action.priority === 'high' ? 'alert' : 'active'} />
                </div>
              </article>
            ))}
          </div>
        </GlassPanel>
      </section>
    </PageShell>
  );
}
