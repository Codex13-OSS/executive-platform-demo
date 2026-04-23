import { FormEvent, useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeMode } from '../lib/theme';

type LoginViewProps = {
  onSubmit: (email: string, password: string) => string | null;
  theme: ThemeMode;
  onToggleTheme: () => void;
};

export default function LoginView({ onSubmit, theme, onToggleTheme }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const maybeError = onSubmit(email, password);
    setError(maybeError);
  };

  return (
    <main className="login-layout">
      <div className="login-ambient" aria-hidden="true">
        <span className="orb orb-green" />
        <span className="orb orb-red" />
        <span className="orb orb-white" />
        <span className="network-line line-a" />
        <span className="network-line line-b" />
        <span className="network-line line-c" />
        <span className="network-node node-a" />
        <span className="network-node node-b" />
        <span className="network-node node-c" />
      </div>

      <section className="panel auth-panel glass">
        <div className="login-topbar">
          <p className="eyebrow">Acceso de demostración</p>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
        <h1>Plataforma Ejecutiva de Coordinación</h1>
        <p className="muted">Conecta captura, conversión y seguimiento en una sola plataforma.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="demo@plataforma.com"
              autoComplete="email"
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button type="submit">Entrar</button>
          <p className="muted small-text">Demo: demo@plataforma.com / demo1234</p>
        </form>
      </section>
    </main>
  );
}
