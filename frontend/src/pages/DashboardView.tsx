import ActivityRingsCluster from '../components/ActivityRingsCluster';
import CognitiveGraph from '../components/CognitiveGraph';
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
          <p className="eyebrow">Centro de comando</p>
          <h2>Estado operativo y priorización inteligente</h2>
          <p className="muted">LÍA correlaciona contexto ejecutivo, riesgos y ejecución para sostener decisiones con trazabilidad continua.</p>
          <div className="hero-inline-stats">
            <span>Operación viva</span>
            <span>Nodo IA activo</span>
            <span>Lectura ejecutiva</span>
          </div>
          {flowCompleted ? (
            <div className="inline-badge">Flujo completado en la última iteración</div>
          ) : null}
        </GlassPanel>
        <GlassPanel className="hero-rings" variant="elevated">
          <ActivityRingsCluster values={ringValues} />
        </GlassPanel>
      </section>

      <CognitiveGraph />


      <section className="dashboard-command-grid">
        <GlassPanel className="premium-sidebar" variant="default">
          <p className="eyebrow">LÍNEAS ACTIVAS</p>
          <ul className="command-list">
            <li>Agenda estratégica sincronizada</li>
            <li>Alertas con validación humana</li>
            <li>Documentos críticos en revisión</li>
          </ul>
        </GlassPanel>

        <GlassPanel className="jarvis-core-panel" variant="elevated">
          <p className="eyebrow">JARVIS COGNITIVE CORE</p>
          <div className="mini-core-wrap"><span className="mini-core-dot" /></div>
          <p className="muted small-text">En línea · Analizando contexto operativo.</p>
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
