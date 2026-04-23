import { useMemo, useState } from 'react';
import DashboardView from './pages/DashboardView';
import EntryFormView from './pages/EntryFormView';
import LoginView from './pages/LoginView';
import { mockDashboardCards } from './data/mockDashboard';
import { getSession, loginDemo, logoutDemo, type DemoSession } from './lib/auth';
import { config } from './lib/config';
import { RawEntry } from '../../shared/types';

type AppView = 'dashboard' | 'entry-form';

export default function App() {
  const [session, setSession] = useState<DemoSession | null>(() => getSession());
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [entries, setEntries] = useState<RawEntry[]>([]);

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

  const handleSaveEntry = (input: Omit<RawEntry, 'id' | 'createdAt'>) => {
    const newEntry: RawEntry = {
      ...input,
      id: `entry-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setEntries((prev) => [newEntry, ...prev]);
    setCurrentView('dashboard');
  };

  const latestEntry = entries[0] ?? null;

  if (!session) {
    return <LoginView onSubmit={handleLogin} />;
  }

  if (currentView === 'entry-form') {
    return (
      <EntryFormView
        onBack={() => setCurrentView('dashboard')}
        onSave={handleSaveEntry}
      />
    );
  }

  return (
    <DashboardView
      session={session}
      cards={cards}
      latestEntry={latestEntry}
      onStartEntry={() => setCurrentView('entry-form')}
      onLogout={handleLogout}
    />
  );
}
