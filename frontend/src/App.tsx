import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { CognitiveGraph } from './components/CognitiveGraph';
import { NeuralCore } from './components/NeuralCore';
import { activity, agenda, alerts, documents, tracking } from './data/liaOsDemoData';
import { mobileLÍAFixStyles, styles } from './styles/liaOsStyles';
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [liaState, setLÍAState] = useState('En línea');
  const [message, setMessage] = useState('');
  const [liaLog, setLÍALog] = useState([
    'Núcleo cognitivo iniciado.',
    'Centro ejecutivo listo.',
    'Esperando instrucción ejecutiva.',
  ]);
  const [activityFeed, setActivityFeed] = useState(activity);
  const [documentsList, setDocumentsList] = useState(documents);
  const [, setAlertsList] = useState(alerts);
  const [livePulse, setLivePulse] = useState(0);
  const [liaMessages, setLÍAMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'En línea. Lista para agenda, documentos y alertas.',
    },
  ]);
  const [mobileOrbListening, setMobileOrbListening] = useState(false);
  const [mobileLÍAOpen, setMobileLÍAOpen] = useState(false);
  const [activeLiaAction, setActiveLiaAction] = useState<string | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);
  const orbTimeoutRef = useRef<number | null>(null);

  const pushLÍALog = (text: string) => {
    const time = new Date().toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setLÍALog((prev) => [`${time} · ${text}`, ...prev].slice(0, 4));
  };

  const addActivity = (text: string) => {
    setActivityFeed((prev) => [text, ...prev].slice(0, 5));
  };

  const addDocument = (title = 'Documento listo para revisión') => {
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
      ['Alta', title, 'LÍA creó una alerta ejecutiva y requiere confirmación humana.'],
      ...prev,
    ].slice(0, 6));

    setView('alerts');
  };

  const runLÍAAction = (instruction: string, result: string, onConfirm?: () => void) => {
    setActiveLiaAction(instruction);
    setLÍAState('Analizando contexto');
    setLÍAMessages((current) => [
      ...current,
      { role: 'user', text: instruction },
      { role: 'assistant', text: 'LÍA procesando solicitud ejecutiva...' },
    ]);

    window.setTimeout(() => {
      setLÍAState('Ejecutando acción');
      setLÍAMessages((current) => {
        const next = [...current];
        const last = next[next.length - 1];

        if (last?.role === 'assistant' && last.text === 'LÍA procesando solicitud ejecutiva...') {
          next[next.length - 1] = { role: 'assistant', text: result };
          return next;
        }

        return [...next, { role: 'assistant', text: result }];
      });
      setLÍALog((current) => [`Acción ejecutiva registrada: ${instruction}`, ...current].slice(0, 6));
      setLivePulse((pulse) => (pulse + 1) % 8);
      onConfirm?.();

      window.setTimeout(() => {
        setLÍAState('En línea');
        setActiveLiaAction(null);
      }, 1200);
    }, 650);
  };

  const handleModuleActionCapture = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement | null;
    const button = target?.closest('button');

    if (!button) return;

    if (
      button.closest('.quick-actions') ||
      button.closest('.cockpit-decision-actions-v090') ||
      button.closest('.document-card')
    ) {
      return;
    }

    const label = button.textContent?.replace(/\s+/g, ' ').trim();

    if (!label) return;

    const moduleActions: Record<string, string> = {
      'Briefing': 'Briefing de evento preparado: contexto, riesgos y acuerdos sugeridos.',
      'Recordatorio': 'Recordatorio operativo registrado para la siguiente ventana ejecutiva.',
      'Guion': 'Guion ejecutivo abierto: objetivo, preguntas clave y salida esperada.',
      Revisar: 'Revisión ejecutiva iniciada: LÍA priorizó contexto, estado y siguiente acción.',
      Validar: 'Validación ejecutiva registrada: pendiente de confirmación ejecutiva final.',
      'Limpiar alertas': 'Alertas marcadas para revisión ejecutiva.',
    };

    const result = moduleActions[label];

    if (!result) return;

    button.classList.add('lia-simulated-feedback-v090', 'cockpit-action-active-v090');

    window.setTimeout(() => {
      button.classList.remove('cockpit-action-active-v090');
    }, 1400);

    runLÍAAction(label, result, () => addActivity(`${label} ejecutado por LÍA.`));
  };

  const sendLÍA = () => {
    const clean = message.trim();
    if (!clean) return;

    const lower = clean.toLowerCase();

    if (lower.includes('documento') || lower.includes('reporte') || lower.includes('contrato')) {
      runLÍAAction(
        clean,
        'Documento generado y agregado al módulo documental.',
        () => addDocument(clean.length > 34 ? `${clean.slice(0, 34)}…` : clean)
      );
    } else if (lower.includes('recordatorio') || lower.includes('alerta')) {
      runLÍAAction(
        clean,
        'Recordatorio creado y agregado al centro de alertas.',
        () => addAlert(clean.length > 36 ? `${clean.slice(0, 36)}…` : clean)
      );
    } else if (lower.includes('briefing') || lower.includes('agenda')) {
      runLÍAAction(
        clean,
        'Briefing generado y registrado en actividad reciente.',
        () => addActivity('LÍA generó un briefing ejecutivo solicitado por texto.')
      );
    } else {
      runLÍAAction(
        clean,
        'Solicitud procesada. El centro ejecutivo fue actualizado visualmente.',
        () => addActivity(`LÍA procesó: ${clean.length > 44 ? `${clean.slice(0, 44)}…` : clean}`)
      );
    }

    setMessage('');
  };

  const activateMobileOrb = () => {
    if (orbTimeoutRef.current) window.clearTimeout(orbTimeoutRef.current);
    setMobileLÍAOpen(true);
    setMobileOrbListening(true);
    setLÍAState('Escuchando...');
    setLÍAMessages((prev) => {
      const prompt = { role: 'assistant' as const, text: 'LÍA lista. ¿Qué necesitas?' };
      const last = prev[prev.length - 1];

      if (last?.role === prompt.role && last.text === prompt.text) {
        return prev;
      }

      return [...prev, prompt].slice(-6);
    });
    pushLÍALog('Interacción móvil activada.');
    window.setTimeout(() => mobileInputRef.current?.focus(), 120);
    orbTimeoutRef.current = window.setTimeout(() => {
      setMobileOrbListening(false);
      setLÍAState('En línea');
    }, 2400);
  };

  useEffect(() => () => {
    if (orbTimeoutRef.current) window.clearTimeout(orbTimeoutRef.current);
  }, []);

  if (!logged) {
    return (
      <main className="lia-login-premium">
        <style>{styles}</style>
        <style>{mobileLÍAFixStyles}</style>

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
                className="login-autofill-dark-fix-v088"
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
                className="login-autofill-dark-fix-v088"
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
    ['documents', 'Documentos listos'],
    ['alerts', 'Alertas'],
  ] as const;

  return (
    <>
    <main className="os-shell">
      <style>{styles}</style>
        <style>{mobileLÍAFixStyles}</style>


      <button
        type="button"
        className="mobile-nav-toggle"
        aria-label="Abrir navegación principal"
        onClick={() => setMobileNavOpen(true)}
      >
        <span />
        <span />
        <span />
        <strong>Menú</strong>
      </button>

      {mobileNavOpen && (
        <div className="mobile-nav-layer" role="presentation">
          <button
            type="button"
            className="mobile-nav-backdrop"
            aria-label="Cerrar navegación"
            onClick={() => setMobileNavOpen(false)}
          />

          <nav className="mobile-nav-drawer" aria-label="Navegación móvil LÍA O.S">
            <div className="mobile-nav-head">
              <div className="login-brand-mark">LÍA</div>
              <div>
                <strong>LÍA O.S</strong>
                <span>Command Center</span>
              </div>
              <button
                type="button"
                className="mobile-nav-close"
                aria-label="Cerrar menú"
                onClick={() => setMobileNavOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="mobile-nav-links">
              {nav.map(([id, label]) => (
                <button
                  key={`mobile-${id}`}
                  type="button"
                  className={view === id ? 'mobile-nav-link active' : 'mobile-nav-link'}
                  onClick={() => {
                    setView(id);
                    setMobileNavOpen(false);
                  }}
                >
                  <span>{label}</span>
                  <em>{view === id ? 'Activo' : 'Abrir'}</em>
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}

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
          LÍA activo
        </div>
      </aside>

      <section className="main-panel executive-interaction-layer-v090 lia-visual-executive-refinement-v092 lia-executive-minimalism-v093 lia-label-minimal-fix-v093 lia-responsive-executive-v094" onClickCapture={handleModuleActionCapture}>
        <header className="topbar">
          <div>
            <p className="eyebrow">SOLUCIONES INFORMÁTICAS</p>
            <h2>{view === 'dashboard' ? 'Centro de Comando Ejecutivo' : nav.find(([id]) => id === view)?.[1]}</h2>
          </div>
          <ExecutiveEnvironmentCard variant="compact" />
          <button className="secondary" onClick={() => setLogged(false)}>Cerrar sesión</button>
        </header>

        {view === 'dashboard' && (
          <section className="executive-cockpit-layout-v088">
            <section className="kpi-grid executive-first-screen-v087 executive-cockpit-kpis-v088">
              <div className="card kpi info"><p>Información activa</p><strong>4</strong><span>2 sesiones con briefing</span></div>
              <div className="card kpi critical"><p>Riesgos críticos</p><strong>8</strong><span>3 requieren decisión</span></div>
              <div className="card kpi warning"><p>Documentos listos</p><strong>12</strong><span>4 listos para validar</span></div>
              <div className="card kpi stable live-card"><p>Cadencia operativa</p><strong>{87 + Math.min(livePulse, 6)}%</strong><span>{livePulse > 0 ? 'actualizado por LÍA' : 'operación estable'}</span></div>
            </section>

            <section className="executive-cockpit-main-v088">
              <article className="panel cognitive-compact-stage-v088">
                <div className="cockpit-section-head-v088">
                  <p className="eyebrow">MAPA COGNITIVO</p>
                  <strong>Núcleo ejecutivo en vivo</strong>
                </div>
                <CognitiveGraph />
              </article>

              <aside className="panel risk-priority-panel cockpit-decision-core-v088">
                <div className="risk-priority-head">
                  <p className="eyebrow">RIESGO / CONEXIÓN / ACCIÓN</p>
                  <strong>Decisión ejecutiva inmediata</strong>
                </div>
                <div className="risk-priority-list">
                  <article>
                    <em className="critical">Crítico</em>
                    <span>Seguimiento con dirección sin confirmar.</span>
                    <small>Conexión: Agenda + Alertas + Documentos.</small>
                    <b>Acción: validar responsable y cierre antes de 14:00.</b>
                  </article>
                  <article>
                    <em className="warning">Prioridad</em>
                    <span>Documento comercial pendiente de firma.</span>
                    <small>Conexión: Documentos + Seguimiento.</small>
                    <b>Acción: revisión legal en la próxima ventana libre.</b>
                  </article>
                <div className="cockpit-decision-actions-v090">
                  {[
                    ['Priorizar alerta', 'Alerta priorizada en el flujo ejecutivo inmediato.'],
                    ['Solicitar validación', 'Validación preparada para dirección con contexto y siguiente acción.'],
                    ['Crear seguimiento', 'Seguimiento agregado al control ejecutivo del día.'],
                  ].map(([label, result]) => (
                    <button
                      key={label}
                      className={`lia-simulated-feedback-v090 ${activeLiaAction === label ? 'cockpit-action-active-v090' : ''}`}
                      onClick={() => runLÍAAction(label, result, () => addActivity(`${label} registrado por LÍA.`))}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                </div>
              </aside>
            </section>

            <section className="cockpit-secondary-grid-v088">
              <div className="panel cockpit-agenda-card-v088">
                <p className="eyebrow">AGENDA INTELIGENTE</p>
                {agenda.map(([time, title, priority]) => (
                  <div className="row" key={title}>
                    <b>{time}</b>
                    <span>{title}</span>
                    <em>{priority}</em>
                  </div>
                ))}
              </div>

              <div className="panel cockpit-tracking-card-v088">
                <p className="eyebrow">SEGUIMIENTO OPERATIVO</p>
                {tracking.map(([name, pct, status]) => (
                  <div className="track" key={name}>
                    <div><span>{name}</span><b>{status}</b></div>
                    <div className="bar"><i style={{ width: `${pct}%` }} /></div>
                  </div>
                ))}
              </div>

              <div className="panel activity cockpit-activity-card-v088">
                <p className="eyebrow">ACTIVIDAD RECIENTE</p>
                {activityFeed.map((item, index) => <div className="activity-item" key={`${item}-${index}`}>{item}</div>)}
              </div>
            </section>
          </section>
        )}

        {view === 'agenda' && <AgendaCalendar />}

        {view === 'tracking' && <TrackingCommandView legacyTracking={tracking} />}

        {view === 'documents' && (
          <section className="module-grid docs-depth-pass-v087">
            <div className="panel module-header">
              <p className="eyebrow">DOCUMENTOS INTELIGENTES</p>
              <h3>Generación documental asistida</h3>
              <p className="muted">
                Contratos, actas y reportes listos para revisión.
              </p>
            </div>

            {documentsList.map(([title, type, status], index) => (
              <div className="panel document-card" key={`doc-${title}`}>
                <p className="eyebrow">{type} · {(index % 3 === 0 && 'Contrato') || (index % 3 === 1 && 'Reporte') || 'Acta'}</p>
                <h4>{title}</h4>
                <span>{status}</span>
            <div className="document-meta-grid">
              <div><small>Estado</small><strong>{status.includes('Listo') ? 'Listo para validación' : 'En progreso'}</strong></div>
              <div><small>Responsable</small><strong>{index % 2 === 0 ? 'Dirección' : 'Operación'}</strong></div>
              <div><small>Última actividad</small><strong>Hace {8 + index * 3} min</strong></div>
              <div><small>Siguiente acción</small><strong>Revisar y aprobar</strong></div>
            </div>
            <div className="document-progress"><i style={{ width: `${62 + (index * 7) % 30}%` }} /></div>
                <button
                  className={`secondary compact lia-simulated-feedback-v090 ${activeLiaAction === `Abrir documento: ${title}` ? 'cockpit-action-active-v090' : ''}`}
                  onClick={() =>
                    runLÍAAction(
                      `Abrir documento: ${title}`,
                      `Preview mock listo para ${title}.`
                    )
                  }
                >
                  Abrir
                </button>
              </div>
            ))}
          </section>
        )}

        {view === 'alerts' && <PremiumAlertsView />}

      </section>

      <aside className="lia-panel lia-panel-compact-v087 lia-executive-copilot-v088">
        <div className="lia-orb">
          <NeuralCore />
        </div>
        <p className="eyebrow">LÍA COGNITIVE CORE</p>
        <h3>{liaState}</h3>
        <div className={`lia-state ${liaState.toLowerCase().replace(/\s+/g, '-')}`}>
          <span />
          {liaState === 'En línea'
            ? 'Listo para recibir instrucciones'
            : liaState === 'Analizando contexto'
              ? 'Leyendo intención y contexto'
              : liaState === 'Ejecutando acción'
                ? 'Coordinando acción ejecutiva'
                : 'Acción registrada correctamente'}
        </div>
        <p className="muted">
          Agenda, documentos, alertas y seguimiento en una sola lectura.
        </p>

        <div className="lia-chat">
          <p className="eyebrow">CONVERSACIÓN</p>
          <div className="lia-chat-stream">
            {liaMessages.map((item, index) => (
              <div className={`lia-bubble ${item.role} ${item.role === 'assistant' && index === liaMessages.length - 1 ? 'lia-action-response-v090' : ''}`} key={`${item.role}-${index}-${item.text}`}>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <button
            className={`lia-simulated-feedback-v090 ${activeLiaAction === 'Briefing' ? 'cockpit-action-active-v090' : ''}`}
            onClick={() =>
              runLÍAAction(
                'Briefing',
                'Briefing preparado: 4 reuniones, 3 acciones críticas.',
                () => addActivity('Briefing ejecutivo del día preparado por LÍA.')
              )
            }
          >
            Briefing
          </button>
          <button
            className={`lia-simulated-feedback-v090 ${activeLiaAction === 'Recordatorio' ? 'cockpit-action-active-v090' : ''}`}
            onClick={() =>
              runLÍAAction(
                'Recordatorio',
                'Recordatorio mock programado y registrado en el centro de alertas.',
                () => addAlert('Recordatorio ejecutivo creado por LÍA')
              )
            }
          >
            Recordatorio
          </button>
          <button
            className={`lia-simulated-feedback-v090 ${activeLiaAction === 'Documento' ? 'cockpit-action-active-v090' : ''}`}
            onClick={() =>
              runLÍAAction(
                'Documento',
                'Documento ejecutivo listo para revisión.',
                () => addDocument('Documento listo para revisión')
              )
            }
          >
            Documento
          </button>
          <button
            className={`lia-simulated-feedback-v090 ${activeLiaAction === 'Estado' ? 'cockpit-action-active-v090' : ''}`}
            onClick={() =>
              runLÍAAction(
                'Estado',
                'Estado actualizado.',
                () => addActivity('LÍA recalculó el estado operativo general.')
              )
            }
          >
            Estado
          </button>
        </div>

        <div className="lia-log">
          <p className="eyebrow">BITÁCORA IA</p>
          {liaLog.map((item, index) => (
            <div className={`lia-log-item ${index === 0 ? 'lia-live-activity-v090' : ''}`} key={`${item}-${index}`}>{item}</div>
          ))}
        </div>

        <div className="lia-input">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendLÍA()}
            placeholder="Habla con LÍA..."
          />
          <button onClick={sendLÍA}>↑</button>
        </div>
      </aside>
    </main>
    <button className={`mobile-lia-orb ${mobileOrbListening ? 'listening' : ''}`} onClick={activateMobileOrb}>
      <NeuralCore />
    </button>
    <div className="mobile-lia-chip">
      <strong>{mobileOrbListening ? 'Escuchando...' : 'En línea'}</strong>
    </div>
    {mobileLÍAOpen && (
      <section className="mobile-lia-panel" role="dialog" aria-label="LÍA móvil">
        <div className="mobile-lia-header">
          <div>
            <p className="eyebrow">LÍA MÓVIL</p>
            <strong>Asistente ejecutivo activo</strong>
          </div>

          <button
            type="button"
            className="mobile-lia-close"
            aria-label="Cerrar LÍA móvil"
            onClick={() => {
              setMobileLÍAOpen(false);
              setMobileOrbListening(false);
              setLÍAState('En línea');
              if (orbTimeoutRef.current) window.clearTimeout(orbTimeoutRef.current);
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="mobile-lia-stream">
          {liaMessages.slice(-3).map((item, index) => (
            <div className={`lia-bubble ${item.role} ${item.role === 'assistant' && index === liaMessages.length - 1 ? 'lia-action-response-v090' : ''}`} key={`mobile-${item.role}-${index}-${item.text}`}>
              {item.text}
            </div>
          ))}
        </div>

        <div className="lia-input mobile">
          <input
            ref={mobileInputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendLÍA()}
            placeholder="Habla con LÍA..."
          />
          <button onClick={sendLÍA}>↑</button>
        </div>
      </section>
    )}
    </>
  );
}