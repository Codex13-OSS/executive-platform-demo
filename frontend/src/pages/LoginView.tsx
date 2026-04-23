import { FormEvent, useState } from 'react';
import AmbientNetwork from '../components/AmbientNetwork';
import GlassPanel from '../components/GlassPanel';
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
    <main className="login-grid">
      <section className="login-hero">
        <AmbientNetwork />
        <div className="login-hero-copy">
          <p className="eyebrow">Sistema Institucional</p>
          <h1>Plataforma Ejecutiva de Coordinación</h1>
          <p>
            Lo disperso se convierte en decisiones accionables con seguimiento ejecutivo en tiempo
            real.
          </p>
          <ul>
            <li>Captura unificada de información crítica.</li>
            <li>Conversión inmediata en acciones estructuradas.</li>
            <li>Visibilidad de responsables y próximos pasos.</li>
          </ul>
        </div>
      </section>

      <section className="login-form-column">
        <GlassPanel className="login-form-panel" variant="elevated">
          <div className="login-head">
            <p className="eyebrow">Acceso demo</p>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>

          <h2>Ingresar al entorno de demostración</h2>
          <p className="muted">Credenciales locales para demo controlada.</p>

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

            <button type="submit" className="btn-primary">Entrar</button>
            <div className="demo-credentials">
              <span>demo@plataforma.com</span>
              <span>demo1234</span>
            </div>
          </form>
        </GlassPanel>
      </section>
    </main>
  );
}
