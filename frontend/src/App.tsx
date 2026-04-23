import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import DashboardView from './pages/DashboardView';
import EntryFormView from './pages/EntryFormView';
import LoginView from './pages/LoginView';
import ActionConversionView from './pages/ActionConversionView';
import TrackingView from './pages/TrackingView';
import { mockDashboardCards } from './data/mockDashboard';
import { getSession, loginDemo, logoutDemo, type DemoSession } from './lib/auth';
import { config } from './lib/config';
import { ActionItem, RawEntry } from '../../shared/types';

type AppView = 'dashboard' | 'entry-form' | 'action-conversion' | 'tracking';
type EntryDraft = Omit<RawEntry, 'id' | 'createdAt'>;

const STATUS_ROTATION: ActionItem['status'][] = ['assigned', 'pending', 'confirmed'];

function convertRawEntryToActions(entry: RawEntry): ActionItem[] {
  const chunks = entry.text
    .split('.')
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 3);

  const steps = chunks.length > 0 ? chunks : [entry.text.trim()];

  return steps.map((title, index) => ({
    id: `action-${entry.id}-${index + 1}`,
    title,
    category: entry.category,
    owner: entry.owner,
    status: STATUS_ROTATION[index % STATUS_ROTATION.length],
    priority: entry.priority,
    nextStep: `Coordinar seguimiento de “${title.slice(0, 42)}”.`,
  }));
}

function resetDemoFlowState(
  setEntries: Dispatch<SetStateAction<RawEntry[]>>,
  setActions: Dispatch<SetStateAction<ActionItem[]>>,
  setFlowCompleted: Dispatch<SetStateAction<boolean>>,
  setCurrentView: Dispatch<SetStateAction<AppView>>,
) {
  setEntries([]);
  setActions([]);
  setFlowCompleted(false);
  setCurrentView('dashboard');
}

export default function App() {
  const [session, setSession] = useState<DemoSession | null>(() => getSession());
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [entries, setEntries] = useState<RawEntry[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [flowCompleted, setFlowCompleted] = useState(false);

  const cards = useMemo(() => {
    if (config.useMockData) {
      return mockDashboardCards;
    }
    return [];
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

  const handleSaveEntry = (input: EntryDraft) => {
    const newEntry: RawEntry = {
      ...input,
      id: `entry-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setEntries((prev) => [newEntry, ...prev]);
    setActions(convertRawEntryToActions(newEntry));
    setFlowCompleted(false);
    setCurrentView('action-conversion');
  };

  const handleResetDemo = () => {
    resetDemoFlowState(setEntries, setActions, setFlowCompleted, setCurrentView);
  };

  const latestEntry = entries[0] ?? null;

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
        onSave={handleSaveEntry}
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
        onFinish={() => {
          setFlowCompleted(actions.length > 0);
          setCurrentView('dashboard');
        }}
        onReset={handleResetDemo}
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
