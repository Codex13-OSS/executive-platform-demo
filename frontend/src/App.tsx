import { useMemo, useState } from 'react';
import DashboardView from './pages/DashboardView';
import LoginView from './pages/LoginView';
import { mockDashboardCards } from './data/mockDashboard';
import { DemoSession, getSession, loginDemo, logoutDemo } from './lib/auth';
import { ThemeMode } from './lib/theme';

export default function App() {
  const [session, setSession] = useState<DemoSession | null>(() => getSession());
  const [theme, setTheme] = useState<ThemeMode>('dark');

  const cards = useMemo(() => mockDashboardCards, []);

  const handleLogin = (email: string, password: string) => {
    const result = loginDemo(email, password);
    if (!result.ok || !result.session) {
      return result.error ?? 'No fue posible iniciar sesión.';
    }

    setSession(result.session);
    return null;
  };

  const handleLogout = () => {
    logoutDemo();
    setSession(null);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div data-theme={theme}>
      {!session ? (
        <LoginView onSubmit={handleLogin} theme={theme} onToggleTheme={toggleTheme} />
      ) : (
        <DashboardView
          session={session}
          cards={cards}
          latestEntry={null}
          flowCompleted={false}
          onStartEntry={() => undefined}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}
