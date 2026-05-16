import { useEffect, useRef, useState } from 'react';
import { CognitiveGraph } from './components/CognitiveGraph';
import { NeuralCore } from './components/NeuralCore';
import { activity, agenda, alerts, documents, tracking } from './data/liaOsDemoData';
import { mobileJarvisFixStyles, styles } from './styles/liaOsStyles';
import { AgendaCalendar } from './components/AgendaCalendar';
import { PremiumAlertsView } from './components/PremiumAlertsView';
import { TrackingCommandView } from './components/TrackingCommandView';
import { ExecutiveEnvironmentCard } from './components/ExecutiveEnvironmentCard';

type View = 'dashboard' | 'agenda' | 'tracking' | 'documents' | 'alerts';

export default function App() {
  const [logged, setLogged] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [jarvisState, setJarvisState] = useState('En línea');
  const [message, setMessage] = useState('');
  const [jarvisLog, setJarvisLog] = useState([
    'Núcleo cognitivo iniciado.',
    'Dashboard sincronizado.',
    'Esperando instrucción ejecutiva.',
  ]);
  const [activityFeed, setActivityFeed] = useState(activity);
  const [documentsList, setDocumentsList] = useState(documents);
  const [, setAlertsList] = useState(alerts);
  const [livePulse, setLivePulse] = useState(0);
  const [jarvisMessages, setJarvisMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Estoy en línea. Puedo ayudarte con agenda, documentos, alertas y seguimiento ejecutivo.',
    },
  ]);
  const [mobileOrbListening, setMobileOrbListening] = useState(false);
  const [mobileJarvisOpen, setMobileJarvisOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);
  const orbTimeoutRef = useRef<number | null>(null);

  const pushJarvisLog = (text: string) => {
    const time = new Date().toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setJarvisLog((prev) => [`${time} · ${text}`, ...prev].slice(0, 4));
  };

  const addActivity = (text: string) => {
    setActivityFeed((prev) => [text, ...prev].slice(0, 5));
  };

  const addDocument = (title = 'Documento generado por Jarvis') => {
    const stamp = new Date().toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setDocumentsList((prev) => [
      [title, `Generado ${stamp}`, 'Listo para revisión'],
      ...prev,
    ].slice(0, 6));

    setView('documents');
  };

  const addAlert = (title = 'Nuevo recordatorio ejecutivo') => {
    setAlertsList((prev) => [
      ['Alta', title, 'Jarvis creó una alerta mock y requiere confirmación humana.'],
      ...prev,
    ].slice(0, 6));

    setView('alerts');
  };

  const runJarvisAction = (instruction: string, result: string, onConfirm?: () => void) => {
    setJarvisMessages((prev) => [
      ...prev,
      { role: 'user' as const, text: instruction },
    ].slice(-6));

    setJarvisState('Analizando contexto');
    pushJarvisLog(`Recibido: ${instruction}`);

    setTimeout(() => {
      setJarvisState('Ejecutando acción');
      pushJarvisLog('Validación ejecutiva completada.');
    }, 700);

    setTimeout(() => {
      setJarvisState('Confirmado');
      pushJarvisLog(result);
      setJarvisMessages((prev) => [
        ...prev,
        { role: 'assistant' as const, text: result },
      ].slice(-6));
      setLivePulse((prev) => prev + 1);
      onConfirm?.();
    }, 1500);

    setTimeout(() => setJarvisState('En línea'), 2800);
  };

  const sendJarvis = () => {
    const clean = message.trim();
    if (!clean) return;

    const lower = clean.toLowerCase();

    if (lower.includes('documento') || lower.includes('reporte') || lower.includes('contrato')) {
      runJarvisAction(
        clean,
        'Documento generado y agregado al módulo documental.',
        () => addDocument(clean.length > 34 ? `${clean.slice(0, 34)}…` : clean)
      );
    } else if (lower.includes('recordatorio') || lower.includes('alerta')) {
      runJarvisAction(
        clean,
        'Recordatorio creado y agregado al centro de alertas.',
        () => addAlert(clean.length > 36 ? `${clean.slice(0, 36)}…` : clean)
      );
    } else if (lower.includes('briefing') || lower.includes('agenda')) {
      runJarvisAction(
        clean,
        'Briefing generado y registrado en actividad reciente.',
        () => addActivity('Jarvis generó un briefing ejecutivo solicitado por texto.')
      );
    } else {
      runJarvisAction(
        clean,
        'Solicitud procesada en modo demo. El dashboard fue actualizado visualmente.',
        () => addActivity(`Jarvis procesó: ${clean.length > 44 ? `${clean.slice(0, 44)}…` : clean}`)
      );
    }

    setMessage('');
  };

  const activateMobileOrb = () => {
    if (orbTimeoutRef.current) window.clearTimeout(orbTimeoutRef.current);
    setMobileJarvisOpen(true);
    setMobileOrbListening(true);
    setJarvisState('Escuchando...');
    setJarvisMessages((prev) => {
      const prompt = { role: 'assistant' as const, text: 'Jarvis lista. ¿Qué necesitas?' };
      const last = prev[prev.length - 1];

      if (last?.role === prompt.role && last.text === prompt.text) {
        return prev;
      }

      return [...prev, prompt].slice(-6);
    });
    pushJarvisLog('Interacción móvil activada.');
    window.setTimeout(() => mobileInputRef.current?.focus(), 120);
    orbTimeoutRef.current = window.setTimeout(() => {
      setMobileOrbListening(false);
      setJarvisState('En línea');
    }, 2400);
  };

  useEffect(() => () => {
    if (orbTimeoutRef.current) window.clearTimeout(orbTimeoutRef.current);
  }, []);

  if (!logged) {
    return (
      <main className="lia-login-premium">
        <style>{styles}</style>
        <style>{mobileJarvisFixStyles}</style>

        <div className="login-cinematic-bg" aria-hidden="true" />
        <div className="login-mesh-glow" aria-hidden="true" />

        <header className="login-brand-premium">
          <div className="login-brand-mark">LÍA</div>
          <div>
            <strong>LÍA O.S</strong>
            <span>Executive Command Center</span>
          </div>
        </header>

        <div className="login-system-status">
          <span className="login-status-dot" />
          <div>
            <small>ESTADO DEL SISTEMA</small>
            <strong>ÓPTIMO</strong>
          </div>
        </div>

        <aside className="login-sync-panel">
          <p className="login-eyebrow">SINCRONIZANDO</p>
          <h1>NÚCLEO COGNITIVO</h1>
          <p>
            Acceso ejecutivo seguro. Verificando identidad, enlazando contexto operativo
            y preparando el mapa cognitivo de dirección.
          </p>

          <div className="login-sync-stack">
            <div><span>Neural Sync</span><strong>98%</strong></div>
            <div><span>Mapa Cognitivo</span><strong>Enlazado</strong></div>
            <div><span>Módulos</span><strong>Listos</strong></div>
          </div>
        </aside>

        <section className="login-orb-stage" aria-label="Núcleo cognitivo LÍA">
          <div className="orb-halo-system">
            <NeuralCore />
          </div>
          <div className="orb-caption">
            <span>LÍA Core</span>
            <strong>Cognitive sync active</strong>
          </div>
        </section>

        <section className="executive-access-panel">
          <div className="access-panel-head">
            <p className="login-eyebrow">ACCESO EJECUTIVO</p>
            <h2>Verificación requerida</h2>
            <p>Ingresa con credenciales demo para iniciar el centro de comando.</p>
          </div>

          <div className="login-weather-integrated">
            <ExecutiveEnvironmentCard variant="login" />
          </div>

          <form
            className="login-premium-form"
            onSubmit={(event) => {
              event.preventDefault();

              if (loginEmail !== 'demo@plataforma.com' || loginPassword !== 'demo1234') {
                setLoginError('Credenciales demo: demo@plataforma.com / demo1234');
                return;
              }

              setLoginError(null);
              setLogged(true);
            }}
          >
            <label className="login-field">
              <span>Correo ejecutivo</span>
              <input
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                placeholder="demo@plataforma.com"
                autoComplete="email"
              />
            </label>

            <label className="login-field">
              <span>Clave de acceso</span>
              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                placeholder="demo1234"
                autoComplete="current-password"
              />
            </label>

            <label className="login-checkbox">
              <input type="checkbox" defaultChecked />
              <span>Recordar sesión en este dispositivo</span>
            </label>

            {loginError ? <p className="login-error">{loginError}</p> : null}

            <button type="submit" className="login-premium-submit">
              Iniciar sesión <span>→</span>
            </button>

            <button type="button" className="login-biometric">
              Acceso biométrico
            </button>
          </form>
        </section>

        <footer className="login-security-footer">
          <span>LÍA CORE OS</span>
          <span>Cifrado ejecutivo</span>
          <span>Protección multinivel</span>
          <span>Sesión segura</span>
        </footer>
      </main>
    );
  }


  const nav = [
    ['dashboard', 'Dashboard'],
    ['agenda', 'Agenda'],
    ['tracking', 'Seguimiento'],
    ['documents', 'Documentos'],
    ['alerts', 'Alertas'],
  ] as const;

  return (
    <>
    <main className="os-shell">
      <style>{styles}</style>
        <style>{mobileJarvisFixStyles}</style>

      <aside className="sidebar">
        <div>
          <div className="logo">LÍA O.S</div>
          <p className="side-sub">Executive Command Center</p>
        </div>

        <nav>
          {nav.map(([id, label]) => (
            <button
              key={id}
              className={view === id ? 'nav-item active' : 'nav-item'}
              onClick={() => setView(id)}
            >
              <span>◆</span>{label}
            </button>
          ))}
        </nav>

        <div className="system-status">
          <span className="dot" />
          Jarvis activo
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">SOLUCIONES INFORMÁTICAS</p>
            <h2>{view === 'dashboard' ? 'Centro de Comando Ejecutivo' : nav.find(([id]) => id === view)?.[1]}</h2>
          </div>
          <ExecutiveEnvironmentCard variant="compact" />
          <button className="secondary" onClick={() => setLogged(false)}>Cerrar sesión</button>
        </header>

        {view === 'dashboard' && (
          <>
            <section className="kpi-grid">
              <div className="card"><p>Reuniones hoy</p><strong>4</strong><span>2 requieren briefing</span></div>
              <div className="card"><p>Acciones críticas</p><strong>8</strong><span>3 en riesgo</span></div>
              <div className="card"><p>Documentos</p><strong>12</strong><span>4 generados por Jarvis</span></div>
              <div className="card live-card"><p>Operación</p><strong>{87 + Math.min(livePulse, 6)}%</strong><span>{livePulse > 0 ? 'actualizado por Jarvis' : 'cadencia estable'}</span></div>
            </section>

            <CognitiveGraph />

            <section className="dashboard-grid">
              <div className="panel">
                <p className="eyebrow">AGENDA INTELIGENTE</p>
                {agenda.map(([time, title, priority]) => (
                  <div className="row" key={title}>
                    <b>{time}</b>
                    <span>{title}</span>
                    <em>{priority}</em>
                  </div>
                ))}
              </div>

              <div className="panel">
                <p className="eyebrow">SEGUIMIENTO OPERATIVO</p>
                {tracking.map(([name, pct, status]) => (
                  <div className="track" key={name}>
                    <div><span>{name}</span><b>{status}</b></div>
                    <div className="bar"><i style={{ width: `${pct}%` }} /></div>
                  </div>
                ))}
              </div>

              <div className="panel activity">
                <p className="eyebrow">ACTIVIDAD RECIENTE</p>
                {activityFeed.map((item, index) => <div className="activity-item" key={`${item}-${index}`}>{item}</div>)}
              </div>
            </section>
          </>
        )}

        {view === 'agenda' && <AgendaCalendar />}

        {view === 'tracking' && <TrackingCommandView legacyTracking={tracking} />}

        {view === 'documents' && (
          <section className="module-grid">
            <div className="panel module-header">
              <p className="eyebrow">DOCUMENTOS INTELIGENTES</p>
              <h3>Generación documental asistida</h3>
              <p className="muted">
                Contratos, actas, reportes y propuestas generadas desde instrucciones conversacionales.
              </p>
            </div>

            {documentsList.map(([title, type, status]) => (
              <div className="panel document-card" key={`doc-${title}`}>
                <p className="eyebrow">{type}</p>
                <h4>{title}</h4>
                <span>{status}</span>
                <button
                  className="secondary compact"
                  onClick={() =>
                    runJarvisAction(
                      `Abrir documento: ${title}`,
                      `Preview mock listo para ${title}.`
                    )
                  }
                >
                  Ver documento
                </button>
              </div>
            ))}
          </section>
        )}

        {view === 'alerts' && <PremiumAlertsView />}

      </section>

      <aside className="jarvis-panel">
        <div className="jarvis-orb">
          <NeuralCore />
        </div>
        <p className="eyebrow">JARVIS COGNITIVE CORE</p>
        <h3>{jarvisState}</h3>
        <div className={`jarvis-state ${jarvisState.toLowerCase().replace(/\s+/g, '-')}`}>
          <span />
          {jarvisState === 'En línea'
            ? 'Listo para recibir instrucciones'
            : jarvisState === 'Analizando contexto'
              ? 'Leyendo intención y contexto'
              : jarvisState === 'Ejecutando acción'
                ? 'Aplicando cambios en modo demo'
                : 'Acción registrada correctamente'}
        </div>
        <p className="muted">
          Núcleo IA integrado para agenda, seguimiento, documentos, recordatorios y decisiones ejecutivas.
        </p>

        <div className="jarvis-chat">
          <p className="eyebrow">CONVERSACIÓN</p>
          <div className="jarvis-chat-stream">
            {jarvisMessages.map((item, index) => (
              <div className={`jarvis-bubble ${item.role}`} key={`${item.role}-${index}-${item.text}`}>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <button
            onClick={() =>
              runJarvisAction(
                'Briefing de hoy',
                'Briefing ejecutivo listo: 4 reuniones, 3 acciones críticas y 2 documentos pendientes.',
                () => addActivity('Briefing ejecutivo del día generado por Jarvis.')
              )
            }
          >
            Briefing de hoy
          </button>
          <button
            onClick={() =>
              runJarvisAction(
                'Crear recordatorio',
                'Recordatorio mock programado y registrado en el centro de alertas.',
                () => addAlert('Recordatorio ejecutivo creado por Jarvis')
              )
            }
          >
            Crear recordatorio
          </button>
          <button
            onClick={() =>
              runJarvisAction(
                'Generar documento',
                'Documento mock generado y agregado al módulo de documentos.',
                () => addDocument('Documento generado por Jarvis')
              )
            }
          >
            Generar documento
          </button>
          <button
            onClick={() =>
              runJarvisAction(
                'Estado operativo',
                'Estado operativo recalculado: operación estable con seguimiento activo.',
                () => addActivity('Jarvis recalculó el estado operativo general.')
              )
            }
          >
            Estado operativo
          </button>
        </div>

        <div className="jarvis-log">
          <p className="eyebrow">BITÁCORA IA</p>
          {jarvisLog.map((item, index) => (
            <div className="jarvis-log-item" key={`${item}-${index}`}>{item}</div>
          ))}
        </div>

        <div className="jarvis-input">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendJarvis()}
            placeholder="Habla con Jarvis..."
          />
          <button onClick={sendJarvis}>↑</button>
        </div>
      </aside>
    </main>
    <button className={`mobile-jarvis-orb ${mobileOrbListening ? 'listening' : ''}`} onClick={activateMobileOrb}>
      <NeuralCore />
    </button>
    <div className="mobile-jarvis-chip">
      <strong>{mobileOrbListening ? 'Escuchando...' : 'En línea'}</strong>
    </div>
    {mobileJarvisOpen && (
      <section className="mobile-jarvis-panel" role="dialog" aria-label="Jarvis móvil">
        <div className="mobile-jarvis-header">
          <div>
            <p className="eyebrow">JARVIS MÓVIL</p>
            <strong>Asistente ejecutivo activo</strong>
          </div>

          <button
            type="button"
            className="mobile-jarvis-close"
            aria-label="Cerrar Jarvis móvil"
            onClick={() => {
              setMobileJarvisOpen(false);
              setMobileOrbListening(false);
              setJarvisState('En línea');
              if (orbTimeoutRef.current) window.clearTimeout(orbTimeoutRef.current);
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="mobile-jarvis-stream">
          {jarvisMessages.slice(-3).map((item, index) => (
            <div className={`jarvis-bubble ${item.role}`} key={`mobile-${item.role}-${index}-${item.text}`}>
              {item.text}
            </div>
          ))}
        </div>

        <div className="jarvis-input mobile">
          <input
            ref={mobileInputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendJarvis()}
            placeholder="Habla con Jarvis..."
          />
          <button onClick={sendJarvis}>↑</button>
        </div>
      </section>
    )}
    </>
  );
}