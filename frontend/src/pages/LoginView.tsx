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
    <main className="login-screen">
      <div className="login-network-layer" aria-hidden="true">
        <AmbientNetwork />
      </div>
      <div className="login-screen-overlay" aria-hidden="true" />

      <div className="login-grid premium-login-grid">
        <section className="login-hero premium-login-hero">
          <div className="login-hero-copy premium-login-copy">
            <p className="eyebrow">Sistema Institucional</p>
            <h1>Plataforma Ejecutiva de Coordinación</h1>
            <p className="login-subtitle">
              De notas dispersas a una operación ejecutiva trazable: captura, convierte y supervisa
              decisiones en una sola experiencia institucional.
            </p>

            <ul className="login-value-list">
              <li>Captura unificada de información crítica con contexto completo.</li>
              <li>Conversión inmediata en acciones estructuradas con ownership explícito.</li>
              <li>Visibilidad transversal del avance, riesgos y próximos pasos.</li>
            </ul>

            <div className="hero-footer-metrics login-metrics-grid">
              <div>
                <strong>+42%</strong>
                <span>velocidad de coordinación</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>trazabilidad ejecutiva</span>
              </div>
              <div>
                <strong>1 flujo</strong>
                <span>una sola puerta de entrada</span>
              </div>
            </div>
          </div>
        </section>

        <section className="login-form-column premium-login-form-column">
          <GlassPanel className="login-form-panel premium-login-panel" variant="elevated">
            <div className="login-head">
              <p className="eyebrow">Acceso demo</p>
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </div>

            <h2>Ingresar al entorno de demostración</h2>
            <p className="muted">Autenticación local para recorrido ejecutivo completo del flujo demo.</p>

            <form onSubmit={handleSubmit} className="auth-form premium-auth-form">
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
              <div className="demo-credentials premium-demo-credentials">
                <span>demo@plataforma.com</span>
                <span>demo1234</span>
              </div>
            </form>
          </GlassPanel>
        </section>
      </div>
    </main>
  );
}
