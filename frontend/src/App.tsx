import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { CognitiveGraph } from './components/CognitiveGraph';
import { NeuralCore } from './components/NeuralCore';
import { activity, agenda, alerts, documents, tracking } from './data/liaOsExecutiveData';
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

  const viewContext: Record<View, string> = {
    dashboard: 'Centro ejecutivo',
    agenda: 'Agenda ejecutiva',
    tracking: 'Seguimiento operativo',
    documents: 'Documentos',
    alerts: 'Alertas',
  };

  const buildContextualResult = (instruction: string, fallback: string) => {
    const lower = instruction.toLowerCase();
    const context = viewContext[view];

    if (lower.includes('abrir documento')) {
      return `${context}: documento abierto con estado, responsable y decisión pendiente.`;
    }

    if (lower.includes('priorizar')) {
      return `${context}: prioridad elevada. LÍA conectó alerta, responsable y siguiente cierre.`;
    }

    if (lower.includes('validación') || lower.includes('validar')) {
      return `${context}: validación registrada. Queda pendiente confirmación humana y criterio de cierre.`;
    }

    if (lower.includes('briefing') || lower.includes('guion')) {
      return `${context}: briefing listo con objetivo, riesgos, preguntas clave y salida esperada.`;
    }

    if (lower.includes('recordatorio') || lower.includes('alerta')) {
      return `${context}: alerta preparada con origen, estado y acción recomendada.`;
    }

    if (lower.includes('bloquear') || lower.includes('reservar')) {
      return `${context}: bloque reservado para cerrar pendiente con responsable y resultado esperado.`;
    }

    if (lower.includes('responsable') || lower.includes('seguimiento') || lower.includes('frente')) {
      return `${context}: seguimiento conectado. LÍA identificó responsable, riesgo y próximo movimiento.`;
    }

    if (lower.includes('estado')) {
      return `${context}: estado actualizado con prioridad, riesgo y continuidad operativa.`;
    }

    return `${context}: ${fallback}`;
  };

  const pushLÍALog = (text: string) => {
    const time = new Date().toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setLÍALog((prev) => [`${time} · ${text}`, ...prev].slice(0, 6));
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
      [title, `Preparado ${stamp}`, 'Listo para revisión'],
      ...prev,
    ].slice(0, 6));

    setView('documents');
  };

  const addAlert = (title = 'Nuevo recordatorio ejecutivo') => {
    setAlertsList((prev) => [
      ['Alta', title, 'Alerta ejecutiva preparada. Confirmación pendiente.'],
      ...prev,
    ].slice(0, 6));

    setView('alerts');
  };

  const runLÍAAction = (instruction: string, result: string, onConfirm?: () => void) => {
    const flowContext = viewContext[view];
    const contextualResult = buildContextualResult(instruction, result);

    setActiveLiaAction(instruction);
    setLÍAState('Leyendo contexto');
    setLÍAMessages((current) => [
      ...current.slice(-5),
      { role: 'user' as const, text: instruction },
      { role: 'assistant' as const, text: `Leyendo ${flowContext.toLowerCase()}, intención y siguiente movimiento...` },
    ]);

    window.setTimeout(() => {
      setLÍAState('Registrando acción');
      setLÍAMessages((current) => {
        const next = [...current];
        const last = next[next.length - 1];

        if (last?.role === 'assistant' && last.text.startsWith('Leyendo ')) {
          next[next.length - 1] = { role: 'assistant' as const, text: contextualResult };
          return next.slice(-6);
        }

        return [...next, { role: 'assistant' as const, text: contextualResult }].slice(-6);
      });
      pushLÍALog(`${flowContext} · ${instruction} · conectado`);
      setLivePulse((pulse) => (pulse + 1) % 8);
      onConfirm?.();

      window.setTimeout(() => {
        setLÍAState('En línea');
        setActiveLiaAction(null);
      }, 1200);
    }, 520);
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

    const rawLabel = button.textContent?.replace(/\s+/g, ' ').trim();

    if (!rawLabel) return;

    const moduleActions: Record<string, string> = {
      Briefing: 'Briefing de evento preparado: contexto, riesgos y acuerdos sugeridos.',
      Recordatorio: 'Recordatorio operativo registrado para la siguiente ventana ejecutiva.',
      Guion: 'Guion ejecutivo abierto: objetivo, preguntas clave y salida esperada.',
      Revisar: 'Revisión ejecutiva iniciada: LÍA priorizó contexto, estado y siguiente acción.',
      Validar: 'Validación ejecutiva registrada: pendiente de confirmación ejecutiva final.',
      'Depurar alertas': 'Alertas depuradas. LÍA conserva la lectura prioritaria del centro ejecutivo.',
      'Confirmar responsables de proceso crítico.': 'Responsables del proceso crítico listos para confirmación y cierre.',
      'Generar resumen ejecutivo antes de junta de dirección.': 'Resumen ejecutivo preparado con decisiones, riesgos y puntos de cierre.',
      'Validar documento comercial pendiente.': 'Documento comercial enviado a validación con criterio de cierre.',
      'Bloquear espacio de revisión estratégica.': 'Bloque estratégico preparado para revisión y seguimiento.',
    };

    let label = rawLabel;
    let result = moduleActions[rawLabel] ?? '';
    let activityText = `${label}: acción ejecutiva registrada.`;

    const alertCard = button.closest('.alert-premium-card');
    const trackingLane = button.closest('.tracking-lane-card');
    const trackingAction = button.closest('.tracking-actions-panel');
    const availableSlot = button.closest('.available-slots');
    const agendaAction = button.closest('.agenda-event-actions');

    if (trackingLane) {
      const laneName = trackingLane.querySelector('.tracking-lane-top span')?.textContent?.trim() ?? 'Frente operativo';
      const laneStatus = trackingLane.querySelector('.tracking-lane-top strong')?.textContent?.trim() ?? 'Estado activo';

      label = `Abrir frente: ${laneName}`;
      result = `Seguimiento operativo: frente ${laneName} abierto. Estado ${laneStatus}. LÍA preparó responsable, riesgo y próximo movimiento.`;
      activityText = `${laneName}: frente operativo revisado.`;
    } else if (alertCard && (rawLabel === 'Revisar' || rawLabel === 'Validar')) {
      const alertTitle = alertCard.querySelector('h4')?.textContent?.trim() ?? 'Alerta ejecutiva';

      label = `${rawLabel} alerta: ${alertTitle}`;
      result = `Alertas: ${alertTitle}. LÍA vinculó origen, estado y criterio de validación.`;
      activityText = `${alertTitle}: ${rawLabel.toLowerCase()} registrado.`;
    } else if (availableSlot) {
      const slotLabel = button.querySelector('strong')?.textContent?.trim() ?? 'Bloque disponible';
      const slotTime = button.querySelector('span')?.textContent?.trim() ?? 'Horario abierto';

      label = `Reservar bloque: ${slotLabel}`;
      result = `Agenda ejecutiva: bloque ${slotTime} reservado para ${slotLabel}. LÍA preparó objetivo y salida esperada.`;
      activityText = `${slotLabel}: bloque reservado en agenda.`;
    } else if (agendaAction && moduleActions[rawLabel]) {
      const eventCard = button.closest('.agenda-event-card');
      const eventTitle = eventCard?.querySelector('h5')?.textContent?.trim() ?? 'Junta ejecutiva';

      label = `${rawLabel}: ${eventTitle}`;
      result = `${moduleActions[rawLabel]} Evento: ${eventTitle}.`;
      activityText = `${eventTitle}: ${rawLabel.toLowerCase()} preparado.`;
    } else if (trackingAction && !result) {
      result = `Seguimiento operativo: movimiento preparado. ${rawLabel}`;
      activityText = `${rawLabel}: movimiento recomendado registrado.`;
    }

    if (!result) return;

    button.classList.add('lia-simulated-feedback-v090', 'cockpit-action-active-v090');

    window.setTimeout(() => {
      button.classList.remove('cockpit-action-active-v090');
    }, 1400);

    runLÍAAction(label, result, () => addActivity(activityText));
  };

  const sendLÍA = () => {
    const clean = message.trim();
    if (!clean) return;

    const lower = clean.toLowerCase();

    if (lower.includes('documento') || lower.includes('reporte') || lower.includes('contrato')) {
      runLÍAAction(
        clean,
        'Documento conectado al centro documental con estado, responsable y decisión pendiente.',
        () => addDocument(clean.length > 34 ? `${clean.slice(0, 34)}…` : clean)
      );
    } else if (lower.includes('recordatorio') || lower.includes('alerta')) {
      runLÍAAction(
        clean,
        'Recordatorio conectado al centro de alertas con origen, prioridad y validación pendiente.',
        () => addAlert(clean.length > 36 ? `${clean.slice(0, 36)}…` : clean)
      );
    } else if (lower.includes('briefing') || lower.includes('agenda')) {
      runLÍAAction(
        clean,
        'Briefing conectado a agenda: objetivo, riesgos y salida esperada preparados.',
        () => addActivity('Briefing ejecutivo solicitado por texto.')
      );
    } else {
      runLÍAAction(
        clean,
        'Instrucción conectada al flujo ejecutivo. LÍA actualizó contexto y siguiente movimiento.',
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
      const prompt = { role: 'assistant' as const, text: 'LÍA lista. Indica prioridad, documento o alerta.' };
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
            <p>Ingresa con tus credenciales para iniciar el centro de comando.</p>
          </div>

          <div className="login-weather-integrated">
            <ExecutiveEnvironmentCard variant="login" />
          </div>

          <form
            className="login-premium-form"
            onSubmit={(event) => {
              event.preventDefault();

              if (loginEmail !== 'ejecutivo@lia.local' || loginPassword !== 'lia2026') {
                setLoginError('Credenciales de acceso: ejecutivo@lia.local / lia2026');
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
                placeholder="ejecutivo@lia.local"
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
                placeholder="lia2026"
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
    ['documents', 'Documentos en validación'],
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

      <section className="main-panel executive-interaction-layer-v090 lia-visual-executive-refinement-v092 lia-executive-minimalism-v093 lia-label-minimal-fix-v093 lia-responsive-executive-v094 lia-orb-premium-v095 lia-executive-intelligence-v096 lia-visual-density-v097 lia-module-content-v098 lia-interaction-flow-v099" onClickCapture={handleModuleActionCapture}>
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
              <div className="card kpi info"><p>Contexto ejecutivo</p><strong>4</strong><span>2 decisiones preparadas</span></div>
              <div className="card kpi critical"><p>Decisiones críticas</p><strong>8</strong><span>3 requieren confirmación</span></div>
              <div className="card kpi warning"><p>Documentos en validación</p><strong>12</strong><span>4 requieren cierre</span></div>
              <div className="card kpi stable live-card"><p>Cadencia ejecutiva</p><strong>{87 + Math.min(livePulse, 6)}%</strong><span>{livePulse > 0 ? 'actualizada por LÍA' : 'operación bajo control'}</span></div>
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
                  <strong>Prioridad ejecutiva del día</strong>
                </div>
                <div className="risk-priority-list">
                  <article>
                    <em className="critical">Crítico</em>
                    <span>Reunión de dirección requiere confirmación y síntesis.</span>
                    <small>Cruce: Agenda, alertas y documentos ejecutivos.</small>
                    <b>Acción: confirmar responsable, criterio y hora de cierre.</b>
                  </article>
                  <article>
                    <em className="warning">Prioridad</em>
                    <span>Propuesta comercial lista para cierre.</span>
                    <small>Cruce: documentos, seguimiento y oportunidad comercial.</small>
                    <b>Acción: validar versión final y preparar aprobación.</b>
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
                      onClick={() => runLÍAAction(label, result, () => addActivity(`${label}: acción ejecutiva registrada.`))}
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
                <p className="eyebrow">AGENDA EJECUTIVA</p>
                {agenda.map(([time, title, priority]) => (
                  <div className="row" key={title}>
                    <b>{time}</b>
                    <span>{title}</span>
                    <em>{priority}</em>
                  </div>
                ))}
              </div>

              <div className="panel cockpit-tracking-card-v088">
                <p className="eyebrow">EJECUCIÓN OPERATIVA</p>
                {tracking.map(([name, pct, status]) => (
                  <div className="track" key={name}>
                    <div><span>{name}</span><b>{status}</b></div>
                    <div className="bar"><i style={{ width: `${pct}%` }} /></div>
                  </div>
                ))}
              </div>

              <div className="panel activity cockpit-activity-card-v088">
                <p className="eyebrow">BITÁCORA EJECUTIVA</p>
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
              <p className="eyebrow">CENTRO DOCUMENTAL</p>
              <h3>Documentos para decisión y cierre</h3>
              <p className="muted">
                Contratos, reportes y propuestas organizados por prioridad.
              </p>
            </div>

            {documentsList.map(([title, type, status], index) => (
              <div className="panel document-card" key={`doc-${title}`}>
                <p className="eyebrow">{type} · {(index % 3 === 0 && 'Contrato') || (index % 3 === 1 && 'Reporte') || 'Acta'}</p>
                <h4>{title}</h4>
                <span>{status}</span>
            <div className="document-meta-grid">
              <div><small>Estado</small><strong>{status.includes('Listo') ? 'Listo para validación' : 'En preparación'}</strong></div>
              <div><small>Responsable</small><strong>{index % 2 === 0 ? 'Dirección' : 'Operación'}</strong></div>
              <div><small>Última actividad</small><strong>Hace {8 + index * 3} min</strong></div>
              <div><small>Siguiente acción</small><strong>Validar decisión</strong></div>
            </div>
            <div className="document-progress"><i style={{ width: `${62 + (index * 7) % 30}%` }} /></div>
                <button
                  className={`secondary compact lia-simulated-feedback-v090 ${activeLiaAction === `Abrir documento: ${title}` ? 'cockpit-action-active-v090' : ''}`}
                  onClick={() =>
                    runLÍAAction(
                      `Abrir documento: ${title}`,
                      `Vista ejecutiva lista para ${title}.`
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
            : liaState === 'Leyendo contexto'
              ? 'Leyendo intención y contexto'
              : liaState === 'Registrando acción'
                ? 'Acción ejecutiva en registro'
                : 'Acción registrada correctamente'}
        </div>
        <p className="muted">
          Prioridades, documentos, alertas y seguimiento bajo una sola lectura ejecutiva.
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
                'Briefing listo: prioridades, riesgos, responsables y cierre sugerido.',
                () => addActivity('Briefing ejecutivo del día preparado.')
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
                'Recordatorio preparado con validación pendiente.',
                () => addAlert('Recordatorio ejecutivo preparado')
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
                'Documento ejecutivo preparado para validación y cierre.',
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
                'Estado ejecutivo actualizado: prioridad, riesgo y siguiente movimiento.',
                () => addActivity('Estado operativo general actualizado.')
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