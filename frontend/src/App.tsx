import { useEffect, useMemo, useState } from 'react';
import { DailySummaryCard } from './data/mockDashboard';
import DashboardView from './pages/DashboardView';
import EntryFormView from './pages/EntryFormView';
import LoginView from './pages/LoginView';
import ActionConversionView from './pages/ActionConversionView';
import TrackingView from './pages/TrackingView';
import { getSession, loginDemo, logoutDemo, type DemoSession } from './lib/auth';
import {
  createEntry,
  convertEntry,
  getDashboardSummary,
  getTracking,
  resetDemoFlow,
  type TrackingSummary,
} from './lib/demoApi';
import { RawEntry } from '../../shared/types';

type AppView = 'dashboard' | 'entry-form' | 'action-conversion' | 'tracking';
type EntryDraft = Omit<RawEntry, 'id' | 'createdAt'>;

const EMPTY_TRACKING_SUMMARY: TrackingSummary = {
  total: 0,
  assigned: 0,
  pending: 0,
  confirmed: 0,
};

function mapSummaryToCards(summary: {
  meetingsToday: number;
  activePending: number;
  criticalAlerts: number;
}): DailySummaryCard[] {
  return [
    {
      id: 'prioridades',
      title: 'Prioridades activas',
      value: String(summary.activePending),
      note: `${summary.criticalAlerts} requieren seguimiento inmediato`,
    },
    {
      id: 'reuniones',
      title: 'Reuniones clave hoy',
      value: String(summary.meetingsToday),
      note: 'Primera sesión 09:30 AM',
    },
    {
      id: 'conversiones',
      title: 'Acciones convertidas',
      value: String(summary.activePending + summary.meetingsToday + 1),
      note: '85% dentro del SLA esperado',
    },
  ];
}

export default function App() {
  const [session, setSession] = useState<DemoSession | null>(() => getSession());
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [cards, setCards] = useState<DailySummaryCard[]>([]);
  const [entries, setEntries] = useState<RawEntry[]>([]);
  const [actions, setActions] = useState([] as Awaited<ReturnType<typeof convertEntry>>);
  const [trackingSummary, setTrackingSummary] = useState<TrackingSummary>(EMPTY_TRACKING_SUMMARY);
  const [flowCompleted, setFlowCompleted] = useState(false);

  useEffect(() => {
    let mounted = true;

    void getDashboardSummary()
      .then((summary) => {
        if (!mounted) {
          return;
        }
        setCards(mapSummaryToCards(summary));
      })
      .catch(() => {
        if (!mounted) {
          return;
        }
        setCards(mapSummaryToCards({ meetingsToday: 5, activePending: 8, criticalAlerts: 2 }));
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = (email: string, password: string) => {
    const result = loginDemo(email, password);
    if (!result.ok || !result.session) {
      return result.error ?? 'No se pudo iniciar sesión.';
    }

    setSession(result.session);
    setCurrentView('dashboard');
    return null;
  };

  const handleLogout = () => {
    logoutDemo();
    setSession(null);
    setCurrentView('dashboard');
  };

  const handleSaveEntry = async (input: EntryDraft) => {
    const newEntry = await createEntry(input);
    const convertedActions = await convertEntry(newEntry);

    setEntries((prev) => [newEntry, ...prev]);
    setActions(convertedActions);
    setTrackingSummary(await getTracking(convertedActions));
    setFlowCompleted(false);
    setCurrentView('action-conversion');
  };

  const handleResetDemo = async () => {
    await resetDemoFlow();
    setEntries([]);
    setActions([]);
    setTrackingSummary(EMPTY_TRACKING_SUMMARY);
    setFlowCompleted(false);
    setCurrentView('dashboard');
  };

  const latestEntry = useMemo(() => entries[0] ?? null, [entries]);

  if (!session) {
    return <LoginView onSubmit={handleLogin} />;
  }

  if (currentView === 'entry-form') {
    const initialDraft = latestEntry
      ? {
          text: latestEntry.text,
          category: latestEntry.category,
          owner: latestEntry.owner,
          priority: latestEntry.priority,
        }
      : undefined;

    return (
      <EntryFormView
        initialDraft={initialDraft}
        onBack={() => setCurrentView('dashboard')}
        onSave={(draft) => {
          void handleSaveEntry(draft);
        }}
      />
    );
  }

  if (currentView === 'action-conversion') {
    return (
      <ActionConversionView
        entry={latestEntry}
        actions={actions}
        onGoTracking={() => setCurrentView('tracking')}
        onEdit={() => setCurrentView('entry-form')}
        onGoDashboard={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'tracking') {
    return (
      <TrackingView
        entry={latestEntry}
        actions={actions}
        summary={trackingSummary}
        onFinish={() => {
          setFlowCompleted(actions.length > 0);
          setCurrentView('dashboard');
        }}
        onReset={() => {
          void handleResetDemo();
        }}
        onBackDashboard={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <DashboardView
      session={session}
      cards={cards}
      latestEntry={latestEntry}
      flowCompleted={flowCompleted}
      onStartEntry={() => setCurrentView('entry-form')}
      onLogout={handleLogout}
    />
  );
}
