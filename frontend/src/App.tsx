import { useEffect, useRef, useState } from 'react';
import { mobileJarvisFixStyles, styles } from './styles/liaOsStyles';

type View = 'dashboard' | 'agenda' | 'tracking' | 'documents' | 'alerts';

function NeuralCore() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let tick = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    const nodes = Array.from({ length: 132 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0007,
      vy: (Math.random() - 0.5) * 0.0007,
      r: Math.random() * 2 + 0.8,
      phase: Math.random() * Math.PI * 2,
    }));

    const staticSpecks = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.15 + 0.35,
      phase: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.34 + 0.12,
    }));

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      tick += 1;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.48);
      glow.addColorStop(0, 'rgba(56,189,248,.34)');
      glow.addColorStop(0.42, 'rgba(0,180,216,.12)');
      glow.addColorStop(1, 'rgba(2,6,23,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      staticSpecks.forEach((s, index) => {
        const flicker = Math.sin(tick * 0.11 + s.phase + index * 0.37) * 0.5 + 0.5;
        const shimmer = ((tick + index * 7) % 19 === 0) ? 0.75 : 0;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, (s.r + flicker * 0.65) * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224,242,254,${Math.min(0.92, s.alpha + flicker * 0.22 + shimmer)})
/* FINAL PANEL POLISH — mobile Jarvis overlay + denser static orb */
.mobile-jarvis-close{
  appearance:none!important;
  -webkit-appearance:none!important;
}

@media(max-width:1100px){
  .mobile-jarvis-panel{
    position:fixed!important;
    left:14px!important;
    right:14px!important;
    bottom:86px!important;
    z-index:997!important;
    max-height:42vh!important;
    overflow:auto!important;

    display:grid!important;
    gap:9px!important;

    border:1px solid rgba(125,211,252,.18)!important;
    border-radius:26px!important;
    background:
      radial-gradient(circle at 82% 0%,rgba(56,189,248,.12),transparent 38%),
      linear-gradient(180deg,rgba(15,23,42,.90),rgba(3,10,22,.94))!important;
    backdrop-filter:blur(26px) saturate(132%)!important;
    padding:16px 14px 14px!important;
    box-shadow:
      0 28px 90px rgba(0,0,0,.56),
      0 0 52px rgba(56,189,248,.12),
      inset 0 1px 0 rgba(255,255,255,.045)!important;
  }

  .mobile-jarvis-panel::before{
    content:''!important;
    position:absolute!important;
    inset:0!important;
    pointer-events:none!important;
    border-radius:26px!important;
    background:
      linear-gradient(135deg,rgba(186,230,253,.08),transparent 28%,rgba(56,189,248,.04)),
      linear-gradient(rgba(125,211,252,.035) 1px,transparent 1px)!important;
    background-size:auto,100% 22px!important;
    opacity:.65!important;
  }

  .mobile-jarvis-panel > *{
    position:relative!important;
    z-index:1!important;
  }

  .mobile-jarvis-panel > .eyebrow{
    margin:0 42px 2px 0!important;
    color:#7dd3fc!important;
    letter-spacing:.22em!important;
    text-shadow:0 0 18px rgba(56,189,248,.28)!important;
  }

  .mobile-jarvis-close{
    position:absolute!important;
    top:10px!important;
    right:10px!important;
    z-index:3!important;

    width:30px!important;
    height:30px!important;
    min-width:30px!important;
    padding:0!important;

    display:grid!important;
    place-items:center!important;

    border:1px solid rgba(125,211,252,.20)!important;
    border-radius:999px!important;
    background:rgba(3,10,22,.58)!important;
    color:rgba(234,246,255,.82)!important;
    font-size:13px!important;
    line-height:1!important;
    cursor:pointer!important;

    box-shadow:
      0 10px 30px rgba(0,0,0,.28),
      inset 0 1px 0 rgba(255,255,255,.06)!important;
    backdrop-filter:blur(14px)!important;
  }

  .mobile-jarvis-close:hover{
    border-color:rgba(125,211,252,.36)!important;
    color:#eaf6ff!important;
    box-shadow:
      0 12px 34px rgba(0,0,0,.34),
      0 0 24px rgba(56,189,248,.14)!important;
  }

  .mobile-jarvis-stream{
    max-height:130px!important;
    padding-right:2px!important;
  }

  .jarvis-input.mobile{
    margin-top:2px!important;
  }

  .jarvis-input.mobile input{
    background:rgba(2,6,23,.54)!important;
    border-color:rgba(125,211,252,.18)!important;
    box-shadow:inset 0 1px 0 rgba(255,255,255,.035)!important;
  }

  .mobile-jarvis-orb{
    background:
      radial-gradient(circle at 34% 26%,rgba(255,255,255,.58),rgba(186,230,253,.32) 16%,rgba(56,189,248,.18) 38%,rgba(2,6,23,.22) 68%,rgba(2,6,23,.08) 100%),
      radial-gradient(circle at 72% 70%,rgba(14,165,233,.30),transparent 58%)!important;
  }

  .mobile-jarvis-orb .neural-core{
    opacity:.92!important;
    filter:
      contrast(1.18)
      brightness(1.08)
      drop-shadow(0 0 16px rgba(186,230,253,.86))
      drop-shadow(0 0 32px rgba(56,189,248,.36))!important;
  }

  .jarvis-orb .neural-core{
    opacity:.96!important;
    filter:
      contrast(1.22)
      brightness(1.10)
      drop-shadow(0 0 18px rgba(186,230,253,.74))
      drop-shadow(0 0 36px rgba(56,189,248,.30))!important;
  }
}


/* FINAL QUALITY FIX — mobile Jarvis panel/header/close/orb density */
.mobile-jarvis-close{
  all:unset!important;
}

@media(max-width:1100px){
  .mobile-jarvis-panel{
    display:grid!important;
    gap:10px!important;
    padding:14px!important;
    border-radius:26px!important;
    border:1px solid rgba(125,211,252,.18)!important;
    background:
      radial-gradient(circle at 84% 0%,rgba(56,189,248,.14),transparent 34%),
      radial-gradient(circle at 8% 100%,rgba(14,165,233,.08),transparent 32%),
      linear-gradient(180deg,rgba(15,23,42,.90),rgba(3,10,22,.96))!important;
    backdrop-filter:blur(28px) saturate(136%)!important;
    box-shadow:
      0 30px 100px rgba(0,0,0,.58),
      0 0 55px rgba(56,189,248,.13),
      inset 0 1px 0 rgba(255,255,255,.05)!important;
  }

  .mobile-jarvis-header{
    display:flex!important;
    align-items:center!important;
    justify-content:space-between!important;
    gap:12px!important;
    min-height:34px!important;
    padding:0 0 4px!important;
    border-bottom:1px solid rgba(125,211,252,.08)!important;
  }

  .mobile-jarvis-header .eyebrow{
    margin:0!important;
    color:#7dd3fc!important;
    letter-spacing:.22em!important;
    text-shadow:0 0 18px rgba(56,189,248,.30)!important;
  }

  .mobile-jarvis-close{
    all:unset!important;
    width:30px!important;
    height:30px!important;
    min-width:30px!important;
    display:grid!important;
    place-items:center!important;
    border-radius:999px!important;
    border:1px solid rgba(125,211,252,.22)!important;
    background:
      radial-gradient(circle at 35% 25%,rgba(255,255,255,.10),transparent 42%),
      rgba(3,10,22,.58)!important;
    color:rgba(234,246,255,.84)!important;
    cursor:pointer!important;
    box-shadow:
      0 12px 30px rgba(0,0,0,.26),
      0 0 20px rgba(56,189,248,.08),
      inset 0 1px 0 rgba(255,255,255,.08)!important;
    backdrop-filter:blur(14px)!important;
  }

  .mobile-jarvis-close span{
    display:block!important;
    font-size:18px!important;
    line-height:1!important;
    transform:translateY(-1px)!important;
  }

  .mobile-jarvis-close:hover,
  .mobile-jarvis-close:focus-visible{
    border-color:rgba(125,211,252,.42)!important;
    color:#eaf6ff!important;
    box-shadow:
      0 14px 36px rgba(0,0,0,.34),
      0 0 30px rgba(56,189,248,.18)!important;
    outline:none!important;
  }

  .mobile-jarvis-stream{
    max-height:130px!important;
    display:grid!important;
    gap:7px!important;
    overflow:auto!important;
    padding-right:2px!important;
    scrollbar-width:thin!important;
    scrollbar-color:rgba(56,189,248,.26) transparent!important;
  }

  .mobile-jarvis-stream::-webkit-scrollbar{
    width:5px!important;
  }

  .mobile-jarvis-stream::-webkit-scrollbar-thumb{
    background:rgba(56,189,248,.26)!important;
    border-radius:999px!important;
  }

  .jarvis-input.mobile{
    margin-top:2px!important;
    display:flex!important;
    gap:8px!important;
  }

  .jarvis-input.mobile input{
    min-height:42px!important;
    background:rgba(2,6,23,.58)!important;
    border:1px solid rgba(125,211,252,.18)!important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.04),
      0 0 24px rgba(56,189,248,.04)!important;
  }

  .jarvis-input.mobile input:focus{
    border-color:rgba(125,211,252,.38)!important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.05),
      0 0 30px rgba(56,189,248,.16)!important;
  }

  .jarvis-input.mobile button{
    min-height:42px!important;
    box-shadow:0 0 30px rgba(34,211,238,.24)!important;
  }

  .mobile-jarvis-orb{
    box-shadow:
      inset 0 0 20px rgba(255,255,255,.25),
      inset 0 0 56px rgba(125,211,252,.27),
      0 0 26px rgba(186,230,253,.48),
      0 0 76px rgba(56,189,248,.32),
      0 0 130px rgba(14,165,233,.15)!important;
  }

  .mobile-jarvis-orb::after{
    background:
      radial-gradient(circle at 12% 24%,rgba(255,255,255,.72) 0 1px,transparent 2px),
      radial-gradient(circle at 21% 52%,rgba(186,230,253,.60) 0 1px,transparent 2px),
      radial-gradient(circle at 31% 34%,rgba(125,211,252,.66) 0 1px,transparent 2px),
      radial-gradient(circle at 43% 72%,rgba(255,255,255,.48) 0 1px,transparent 2px),
      radial-gradient(circle at 54% 21%,rgba(56,189,248,.54) 0 1px,transparent 2px),
      radial-gradient(circle at 67% 49%,rgba(186,230,253,.50) 0 1px,transparent 2px),
      radial-gradient(circle at 78% 31%,rgba(255,255,255,.44) 0 1px,transparent 2px),
      radial-gradient(circle at 87% 76%,rgba(125,211,252,.48) 0 1px,transparent 2px),
      linear-gradient(118deg,transparent 16%,rgba(186,230,253,.14),transparent 56%)!important;
    opacity:.88!important;
  }

  .mobile-jarvis-orb .neural-core,
  .jarvis-orb .neural-core{
    opacity:.98!important;
    filter:
      contrast(1.25)
      brightness(1.10)
      drop-shadow(0 0 18px rgba(186,230,253,.82))
      drop-shadow(0 0 36px rgba(56,189,248,.36))!important;
  }
}

`;
        ctx.fill();
      });

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.phase += 0.012;
        if (n.x < 0.1 || n.x > 0.9) n.vx *= -1;
        if (n.y < 0.1 || n.y > 0.9) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = (a.x - b.x) * w;
          const dy = (a.y - b.y) * h;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < 150 * window.devicePixelRatio) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56,189,248,${(1 - d / (150 * window.devicePixelRatio)) * 0.18})


`;
            ctx.lineWidth = 0.8 * window.devicePixelRatio;
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();

            const pulse = (tick + i * 9) % 90;
            if (pulse < 32) {
              const t = pulse / 32;
              ctx.beginPath();
              ctx.arc(a.x * w + (b.x - a.x) * w * t, a.y * h + (b.y - a.y) * h * t, 1.8 * window.devicePixelRatio, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(125,211,252,.9)';
              ctx.fill();
            }
          }
        }
      }

      nodes.forEach((n) => {
        const p = Math.sin(n.phase) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, (n.r + p) * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186,230,253,${0.55 + p * 0.35})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas className="neural-core" ref={ref} />;
}

const agenda = [
  ['09:00', 'Briefing ejecutivo del día', 'Alta'],
  ['11:30', 'Revisión de proceso crítico', 'Media'],
  ['14:00', 'Seguimiento con dirección', 'Alta'],
  ['17:30', 'Cierre operativo y pendientes', 'Media'],
];

const tracking = [
  ['Contratos inteligentes', 78, 'En tiempo'],
  ['Recordatorios ejecutivos', 62, 'En riesgo'],
  ['Dashboard comercial', 91, 'En tiempo'],
  ['Documentos generados', 44, 'Retrasado'],
];

const activity = [
  'Jarvis generó resumen ejecutivo del día.',
  'Se detectaron 3 acciones críticas pendientes.',
  'Nuevo documento listo para revisión.',
  'Seguimiento actualizado sin recargar dashboard.',
];

const documents = [
  ['Contrato inteligente', 'Word / PDF', 'Listo para revisión'],
  ['Acta ejecutiva', 'Documento interno', 'Generado por Jarvis'],
  ['Reporte operativo', 'Resumen semanal', 'Pendiente de aprobación'],
  ['Propuesta comercial', 'Versión beta', 'Borrador activo'],
];

const alerts = [
  ['Alta', 'Acción crítica sin confirmar', 'Requiere autorización antes de ejecutar.'],
  ['Media', 'Briefing pendiente', 'Reunión próxima sin contexto generado.'],
  ['Media', 'Documento esperando revisión', 'Jarvis preparó un borrador para validar.'],
  ['Baja', 'Cadencia estable', 'Operación dentro de parámetros esperados.'],
];

export default function App() {
  const [logged, setLogged] = useState(false);
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
  const [alertsList, setAlertsList] = useState(alerts);
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
      <main className="login-os">
        <style>{styles}</style>
        <style>{mobileJarvisFixStyles}</style>
        <div className="login-bg"><NeuralCore /></div>
        <section className="login-card">
          <div className="brand-mark">LÍA</div>
          <p className="eyebrow">EXECUTIVE INTELLIGENCE OPERATING SYSTEM</p>
          <h1>LÍA O.S Beta</h1>
          <p className="muted">
            Centro de comando ejecutivo con Jarvis IA, operación viva y seguimiento inteligente.
          </p>
          <button className="primary" onClick={() => setLogged(true)}>Acceder al sistema</button>
          <div className="credentials">demo@lia-os.mx · demo1234</div>
        </section>
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

        {view === 'agenda' && (
          <section className="module-grid">
            <div className="panel module-header">
              <p className="eyebrow">AGENDA INTELIGENTE</p>
              <h3>Agenda ejecutiva contextual</h3>
              <p className="muted">
                Vista preparada para briefings automáticos, prioridades, responsables y confirmaciones críticas.
              </p>
            </div>

            <div className="panel module-list">
              {agenda.map(([time, title, priority]) => (
                <div className="module-row" key={`agenda-${title}`}>
                  <div>
                    <b>{time}</b>
                    <span>{title}</span>
                  </div>
                  <em>{priority}</em>
                </div>
              ))}
            </div>

            <div className="panel briefing-card">
              <p className="eyebrow">BRIEFING JARVIS</p>
              <strong>2 reuniones requieren contexto</strong>
              <span className="muted">
                Jarvis puede preparar historial, temas pendientes, riesgos y puntos sugeridos antes de cada sesión.
              </span>
              <button
                className="primary compact"
                onClick={() =>
                  runJarvisAction(
                    'Generar briefing de agenda',
                    'Briefing generado: contexto, riesgos y puntos sugeridos listos.',
                    () => addActivity('Jarvis generó briefing contextual para la agenda inteligente.')
                  )
                }
              >
                Generar briefing
              </button>
            </div>
          </section>
        )}

        {view === 'tracking' && (
          <section className="module-grid">
            <div className="panel module-header">
              <p className="eyebrow">SEGUIMIENTO OPERATIVO</p>
              <h3>Procesos activos bajo control</h3>
              <p className="muted">
                Semáforos, porcentaje de avance, responsables y cambios visibles en tiempo real.
              </p>
            </div>

            {tracking.map(([name, pct, status]) => (
              <div className="panel process-card" key={`process-${name}`}>
                <div className="process-head">
                  <span>{name}</span>
                  <b>{status}</b>
                </div>
                <strong>{pct}%</strong>
                <div className="bar"><i style={{ width: `${pct}%` }} /></div>
                <p className="muted">Última actualización registrada por Jarvis.</p>
              </div>
            ))}
          </section>
        )}

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

        {view === 'alerts' && (
          <section className="module-grid">
            <div className="panel module-header">
              <p className="eyebrow">ALERTAS Y CONFIRMACIONES</p>
              <h3>Centro de control preventivo</h3>
              <p className="muted">
                Ninguna acción crítica se ejecuta sin validación humana y trazabilidad.
              </p>
            </div>

            <div className="panel alerts-list">
              {alertsList.map(([level, title, detail]) => (
                <div className="alert-row" key={`alert-${title}`}>
                  <span className={`alert-severity ${level.toLowerCase()}`}>{level}</span>
                  <div>
                    <b>{title}</b>
                    <p>{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
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