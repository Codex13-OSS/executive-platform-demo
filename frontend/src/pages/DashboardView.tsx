import { useMemo, useState } from 'react';
import CognitiveGraph from '../components/CognitiveGraph';
import ExecutiveEnvironmentCard from '../components/ExecutiveEnvironmentCard';
import GlassPanel from '../components/GlassPanel';
import StatusChip from '../components/StatusChip';
import TopBar from '../components/TopBar';
import ThemeToggle from '../components/ThemeToggle';
import { DailySummaryCard } from '../data/mockDashboard';
import { DemoSession } from '../lib/auth';

type Day = { key: string; label: string; date: string; status: 'libre'|'ocupado'|'critico'; meetings: number; events: Array<{time:string; title:string; priority:'Alta'|'Media'|'Baja'; briefing:string}>; slots: string[] };
type AlertItem = { level: 'Alta'|'Media'|'Baja'; title: string; detail: string; source: 'Agenda'|'Riesgo'|'Documento'; time: string };
type DashboardViewProps = { session: DemoSession; cards: DailySummaryCard[]; onLogout: () => void; theme: 'dark'|'light'; onToggleTheme: () => void; };

const week: Day[] = [
  { key:'lun', label:'LUN', date:'12', status:'critico', meetings:4, events:[{time:'09:00', title:'Briefing ejecutivo del día', priority:'Alta', briefing:'listo'},{time:'11:30', title:'Revisión de proceso crítico', priority:'Media', briefing:'requiere contexto'},{time:'14:00', title:'Seguimiento con dirección', priority:'Alta', briefing:'sin confirmar'},{time:'17:30', title:'Cierre operativo y pendientes', priority:'Media', briefing:'listo'}], slots:['10:00 - 11:00 Disponible','15:00 - 16:30 Disponible','18:00 - 18:30 Disponible'] },
  { key:'mar', label:'MAR', date:'13', status:'ocupado', meetings:3, events:[{time:'10:00', title:'Comité comercial', priority:'Media', briefing:'listo'}], slots:['12:00 - 13:00 Disponible'] },
  { key:'mie', label:'MIÉ', date:'14', status:'ocupado', meetings:2, events:[{time:'09:30', title:'Sync financiero', priority:'Media', briefing:'listo'}], slots:['11:00 - 12:30 Disponible'] },
  { key:'jue', label:'JUE', date:'15', status:'libre', meetings:1, events:[{time:'16:00', title:'Revisión documental', priority:'Baja', briefing:'listo'}], slots:['09:00 - 12:00 Disponible'] },
  { key:'vie', label:'VIE', date:'16', status:'ocupado', meetings:2, events:[{time:'11:00', title:'Seguimiento operativo', priority:'Alta', briefing:'sin confirmar'}], slots:['14:00 - 15:00 Disponible'] },
  { key:'sab', label:'SÁB', date:'17', status:'libre', meetings:0, events:[], slots:['Toda la jornada disponible'] },
  { key:'dom', label:'DOM', date:'18', status:'libre', meetings:0, events:[], slots:['Toda la jornada disponible'] },
];

const views = ['dashboard','agenda','seguimiento','documentos','alertas'] as const;

export default function DashboardView({ session, cards, onLogout, theme, onToggleTheme }: DashboardViewProps) {
  const [tab, setTab] = useState<(typeof views)[number]>('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [days, setDays] = useState(week);
  const [activeDay, setActiveDay] = useState('lun');
  const [alerts, setAlerts] = useState<AlertItem[]>([{level:'Alta',title:'Acción crítica sin confirmar',detail:'Requiere autorización antes de ejecutar.',source:'Riesgo',time:'09:15'}]);

  const day = useMemo(() => days.find((d) => d.key===activeDay) ?? days[0],[days,activeDay]);
  const addAlert = (title:string, detail:string, level:AlertItem['level']='Media', source:AlertItem['source']='Agenda') => {
    const time = new Date().toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'});
    setAlerts((p)=>[{title,detail,level,source,time},...p].slice(0,8));
  };
  const setBriefing = (time:string) => setDays((prev)=>prev.map((d)=>d.key!==activeDay?d:{...d,events:d.events.map((e)=>e.time===time?{...e,briefing:'listo'}:e)}));

  const nav = <nav className="shell-nav-list">{views.map((v)=><button key={v} className={tab===v?'active':''} onClick={()=>{setTab(v);setDrawerOpen(false);}}>{v}</button>)}</nav>;

  return (
    <main className="dashboard-shell cinematic-v3">
      <aside className="dashboard-sidebar"><h3>LÍA O.S</h3>{nav}</aside>
      <div className="dashboard-main">
        <button className="command-nav-btn" onClick={()=>setDrawerOpen(true)}>☰ Menú</button>
        <TopBar eyebrow="Plataforma Ejecutiva de Coordinación" title="Centro de Comando LÍA O.S" subtitle={`Bienvenido, ${session.name}.`} actions={<><ExecutiveEnvironmentCard variant="compact" /><ThemeToggle theme={theme} onToggle={onToggleTheme} /><button type="button" className="btn-secondary" onClick={onLogout}>Cerrar sesión</button></>} />

        <div className="runtime-version-badge">LÍA UI V4 ACTIVA</div>

        <div className="v3-marker">LÍA UI V4 ACTIVA</div>

        {tab==='dashboard' && <>
          <section className="hero-cinematic-grid">
            <GlassPanel className="hero-cinematic-main" variant="strong"><p className="eyebrow">estado del día</p><h2>Operación estable con focos críticos controlados</h2><p className="muted">Resumen operativo: 3 acciones críticas, 2 reuniones sin confirmar, 1 riesgo con impacto alto.</p><div className="hero-actions"><button>Acción recomendada</button><button>Abrir contexto</button></div></GlassPanel>
            <GlassPanel className="hero-cinematic-alert" variant="elevated"><p className="eyebrow">alerta principal</p><strong>Revisión crítica pendiente</strong><p>Responsable: Dirección Operativa · Deadline: 11:30</p><StatusChip label="Prioridad alta" tone="alert" /></GlassPanel>
          </section>

          <section className="cinematic-metrics">{cards.map((c,idx)=><GlassPanel key={c.id} className={`cinematic-metric tone-${idx===0?'info':idx===1?'warn':'ok'}`} variant="default"><p>{c.title}</p><strong>{c.value}</strong><small>{c.note}</small><div className="metric-line" /></GlassPanel>)}</section>

          <section className="cognitive-command-zone"><CognitiveGraph /><GlassPanel className="attention-now" variant="default"><p className="eyebrow">Qué requiere atención ahora</p><div><b>Validar alerta de riesgo comercial</b><span>Responsable: COO · 12:00</span><button>Tomar acción</button></div><div><b>Confirmar reunión de dirección</b><span>Responsable: PMO · 14:00</span><button>Tomar acción</button></div><div><b>Revisar documento estratégico</b><span>Responsable: Legal · 16:00</span><button>Tomar acción</button></div></GlassPanel></section>
        </>}

        {tab==='agenda' && <section className="agenda-premium"><div className="v3-marker">LÍA UI V4 ACTIVA</div><GlassPanel variant="strong" className="agenda-header"><p className="eyebrow">Agenda ejecutiva contextual</p><h2>Calendario inteligente semanal</h2><div className="month-heat"><span className="high">ENE</span><span className="mid">FEB</span><span className="ok">MAR</span><span className="high">ABR</span><span className="mid">MAY</span></div></GlassPanel><div className="agenda-week">{days.map((d)=><button key={d.key} onClick={()=>setActiveDay(d.key)} className={activeDay===d.key?'active':''}><strong>{d.label}</strong><span>{d.date}</span><em>{d.meetings} reuniones</em><b className={d.status}>{d.status}</b></button>)}</div><div className="agenda-day-grid"><GlassPanel variant="default"><h3>Timeline del día</h3>{day.events.map((e)=><article key={e.time} className={`event-block ${e.priority.toLowerCase()}`}><div><b>{e.time}</b><span>{e.title}</span><StatusChip label={e.priority} tone={e.priority==='Alta'?'alert':'pending'} /></div><small>briefing {e.briefing}</small><div className="event-actions"><button onClick={()=>setBriefing(e.time)}>Generar briefing</button><button onClick={()=>addAlert('Recordatorio creado', `${e.title} (${e.time})`, 'Media','Agenda')}>Crear recordatorio</button><button>Ver contexto</button></div></article>)}</GlassPanel><GlassPanel variant="default"><h3>Espacios disponibles</h3>{day.slots.map((slot)=><div key={slot} className="free-slot"><span>{slot}</span><button>Bloquear espacio</button></div>)}</GlassPanel></div></section>}

        {tab==='seguimiento' && <section className="tracking-control-room"><div className="v3-marker">LÍA UI V4 ACTIVA</div><GlassPanel className="tracking-head" variant="strong"><h2>Sala de control operativo</h2><div className="cadence-ring"><span>87%</span></div></GlassPanel><div className="tracking-premium-grid">{cards.map((c,idx)=><GlassPanel key={c.id} variant="default" className={`tracking-premium-card risk-${idx===1?'high':idx===2?'medium':'low'}`}><p className="eyebrow">{c.title}</p><strong>{c.value}</strong><p>{c.note}</p><div className="tracking-meta"><span>{idx===0?'+8% semana':idx===1?'-4% ayer':'estable'}</span><span>{idx===0?'Deadline: hoy 18:00':idx===1?'Hito: mañana 09:00':'Siguiente: validación'}</span><span>Responsable: {idx===1?'Operaciones':'Dirección'}</span></div><div className="tracking-spark" /></GlassPanel>)}</div></section>}

        {tab==='documentos' && <section className="docs-command-center"><div className="v3-marker">LÍA UI V4 ACTIVA</div><div className="docs-grid"><GlassPanel variant="default" className="doc-card contrato"><i>◈</i><p className="eyebrow">Contrato · v1.4</p><h3>Contrato inteligente</h3><p className="muted">Estado: revisión · Responsable: Legal · Última actividad: 09:20</p><div className="doc-actions"><button>Ver documento</button><button>Generar resumen</button></div><div className="metric-line" /></GlassPanel><GlassPanel variant="default" className="doc-card acta"><i>◉</i><p className="eyebrow">Acta · v2.1</p><h3>Acta ejecutiva</h3><p className="muted">Estado: aprobado · Responsable: Dirección · Última actividad: 08:40</p><div className="doc-actions"><button>Preparar junta</button><button>Marcar revisión</button></div><div className="metric-line" /></GlassPanel></div></section>}

        {tab==='alertas' && <section className="alerts-matrix"><div className="v3-marker">LÍA UI V4 ACTIVA</div>{alerts.map((a,i)=><GlassPanel key={`${a.title}-${i}`} variant="default" className={`alert-item sev-${a.level.toLowerCase()}`}><div><StatusChip label={a.level} tone={a.level==='Alta'?'alert':a.level==='Media'?'pending':'done'} /><span className="alert-source">{a.source}</span></div><b>{a.title}</b><p>{a.detail}</p><small>{a.time} · Estado: pendiente validación</small><div className="event-actions"><button>Revisar</button><button>Validar</button></div></GlassPanel>)}</section>}

        <section className="dashboard-command-grid"><GlassPanel className="premium-sidebar" variant="default"><p className="eyebrow">LÍNEAS ACTIVAS</p><ul className="command-list"><li>Agenda sincronizada</li><li>Alertas conectadas</li><li>Documentos críticos en revisión</li></ul></GlassPanel><GlassPanel className="jarvis-core-panel" variant="elevated"><div className="jarvis-head-row"><p className="eyebrow">JARVIS COGNITIVE CORE</p><StatusChip label="En línea" tone="active" /></div><div className="mini-core-wrap"><span className="mini-core-dot" /></div><div className="jarvis-log-mini"><p>09:42 · Agenda cruzada con riesgo comercial.</p><p>09:43 · Documento estratégico actualizado.</p></div><div className="jarvis-input-mini"><input placeholder="Pedir acción a Jarvis..." /><button type="button">Enviar</button></div></GlassPanel></section>
      </div>

      {drawerOpen && <div className="nav-drawer-backdrop" onClick={()=>setDrawerOpen(false)}><aside className="nav-drawer" onClick={(e)=>e.stopPropagation()}><button className="nav-drawer-close" onClick={()=>setDrawerOpen(false)}>✕</button>{nav}</aside></div>}
    </main>
  );
}
