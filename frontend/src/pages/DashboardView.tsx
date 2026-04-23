import ActivityRingsCluster from '../components/ActivityRingsCluster';
import GlassPanel from '../components/GlassPanel';
import MetricCard from '../components/MetricCard';
import TopBar from '../components/TopBar';
import ThemeToggle from '../components/ThemeToggle';
import { DailySummaryCard } from '../data/mockDashboard';
import { DemoSession } from '../lib/auth';
import { ThemeMode } from '../lib/theme';
import { RawEntry } from '../../../shared/types';

type DashboardViewProps = {
  session: DemoSession;
  cards: DailySummaryCard[];
  latestEntry: RawEntry | null;
  flowCompleted: boolean;
  onStartEntry: () => void;
  onLogout: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
};

export default function DashboardView({
  session,
  cards,
  latestEntry,
  flowCompleted,
  onStartEntry,
  onLogout,
  theme,
  onToggleTheme,
}: DashboardViewProps) {
  const ringValues = [
    { label: 'Ejecución', sublabel: 'día', progress: 0.82, color: '#0F8A5F' },
    { label: 'Riesgo', sublabel: 'atención', progress: 0.56, color: '#C63D3D' },
    { label: 'Cadencia', sublabel: 'operación', progress: 0.74, color: '#12A372' },
  ];

  return (
    <main className="dashboard-layout dashboard-premium-layout">
      <TopBar
        eyebrow="Plataforma Ejecutiva de Coordinación"
        title="Resumen estratégico del día"
        subtitle={`Bienvenido, ${session.name}. Vista principal para coordinar ejecución institucional.`}
        actions={
          <>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button type="button" className="btn-primary" onClick={onStartEntry}>
              Capturar entrada
            </button>
            <button type="button" className="btn-secondary" onClick={onLogout}>
              Cerrar sesión
            </button>
          </>
        }
      />

      <section className="dashboard-hero-grid dashboard-balance">
        <GlassPanel className="hero-copy" variant="strong">
          <p className="eyebrow">Control institucional</p>
          <h2>Coordinación ejecutiva con trazabilidad inmediata</h2>
          <p className="muted">
            Unifica decisiones, responsables y avance operativo en una experiencia única para
            dirección. Gestiona prioridades, seguimiento y foco de forma centralizada.
          </p>
          <div className="hero-inline-stats">
            <span>Operación diaria</span>
            <span>Flujo activo</span>
            <span>Modo demo</span>
          </div>
          {flowCompleted ? (
            <div className="inline-badge">Flujo completado en la última iteración</div>
          ) : null}
        </GlassPanel>
        <GlassPanel className="hero-rings" variant="elevated">
          <ActivityRingsCluster values={ringValues} />
        </GlassPanel>
      </section>

      {latestEntry ? (
        <GlassPanel className="last-entry" variant="default">
          <p className="eyebrow">Última entrada capturada</p>
          <h3>{latestEntry.category}</h3>
          <p>{latestEntry.text}</p>
          <p className="muted small-text">
            Responsable: {latestEntry.owner} · Prioridad: {latestEntry.priority}
          </p>
        </GlassPanel>
      ) : null}

      <section className="metrics-grid" aria-label="Indicadores principales">
        {cards.map((card) => (
          <MetricCard key={card.id} label={card.title} value={card.value} note={card.note} />
        ))}
      </section>
    </main>
  );
}
