import { useMemo, useState } from 'react';
import DashboardView from './pages/DashboardView';
import LoginView from './pages/LoginView';
import { mockDashboardCards } from './data/mockDashboard';
import { getSession, loginDemo, logoutDemo, type DemoSession } from './lib/auth';
import { config } from './lib/config';

export default function App() {
  const [session, setSession] = useState<DemoSession | null>(() => getSession());

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
    return null;
  };

  const handleLogout = () => {
    logoutDemo();
    setSession(null);
  };

  if (!session) {
    return <LoginView onSubmit={handleLogin} />;
  }

  return <DashboardView session={session} cards={cards} onLogout={handleLogout} />;
}
