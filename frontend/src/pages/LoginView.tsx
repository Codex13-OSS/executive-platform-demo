import { FormEvent, useState } from 'react';
import ExecutiveEnvironmentCard from '../components/ExecutiveEnvironmentCard';
import NeuralCore from '../components/NeuralCore';
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
    <main className="lia-login-premium">
      <div className="login-cinematic-bg" aria-hidden="true" />

      <header className="login-brand-premium">
        <div className="runtime-version-badge">LOGIN V4 ACTIVO</div>
        <strong>LÍA O.S</strong>
        <span>Executive Command Center</span>
      </header>

      <aside className="login-sync-panel">
        <p className="eyebrow">SINCRONIZANDO</p>
        <h1>NÚCLEO COGNITIVO</h1>
        <p>Acceso ejecutivo seguro</p>
        <small>Verificación contextual activa para sesiones críticas.</small>
        <ul>
          <li>Neural Sync 98%</li>
          <li>Mapa Cognitivo Enlazado</li>
          <li>Módulos Listos</li>
        </ul>
      </aside>

      <section className="login-orb-stage" aria-hidden="true">
        <div className="orb-halo-system">
          <NeuralCore />
        </div>
      </section>

      <section className="executive-access-panel">
        <ExecutiveEnvironmentCard variant="login" />
        <div className="login-head">
          <p className="eyebrow">ACCESO EJECUTIVO</p>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
        <h2>Verificación requerida</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Correo ejecutivo
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="demo@plataforma.com" autoComplete="email" />
          </label>

          <label>
            Clave de acceso
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <label className="remember-row">
            <input type="checkbox" />
            Recordar sesión
          </label>

          <button type="submit" className="btn-primary login-primary-btn">Iniciar sesión</button>
          <button type="button" className="btn-secondary biometric-btn">Acceso biométrico</button>
        </form>
      </section>

      <div className="login-system-status"><span>ESTADO DEL SISTEMA</span><strong>ÓPTIMO</strong></div>

      <footer className="login-security-footer">
        <span>LÍA CORE OS</span>
        <span>Cifrado ejecutivo</span>
        <span>Protección multinivel</span>
        <span>Sesión segura</span>
      </footer>
    </main>
  );}
