import { useMemo, useState } from 'react';

type AgendaPriority = 'Alta' | 'Media' | 'Baja';
type AgendaStatus = 'briefing listo' | 'requiere contexto' | 'sin confirmar' | 'confirmado' | 'bloqueado';

type AgendaEvent = {
  id: string;
  time: string;
  end: string;
  title: string;
  priority: AgendaPriority;
  status: AgendaStatus;
  owner: string;
  context: string;
  goal: string;
  talkTrack: string;
  topics: string[];
  questions: string[];
  risks: string[];
  outputs: string[];
  docs: string[];
};

type AgendaSlot = {
  id: string;
  time: string;
  label: string;
};

type AgendaDay = {
  id: string;
  label: string;
  date: string;
  state: string;
  tone: 'free' | 'busy' | 'critical';
  events: AgendaEvent[];
  slots: AgendaSlot[];
};

const agendaYear = [
  { id: 'ENE', label: 'Enero', load: 18, risk: 3 },
  { id: 'FEB', label: 'Febrero', load: 22, risk: 4 },
  { id: 'MAR', label: 'Marzo', load: 17, risk: 2 },
  { id: 'ABR', label: 'Abril', load: 26, risk: 5 },
  { id: 'MAY', label: 'Mayo', load: 31, risk: 6 },
  { id: 'JUN', label: 'Junio', load: 24, risk: 4 },
  { id: 'JUL', label: 'Julio', load: 19, risk: 2 },
  { id: 'AGO', label: 'Agosto', load: 21, risk: 3 },
  { id: 'SEP', label: 'Septiembre', load: 29, risk: 5 },
  { id: 'OCT', label: 'Octubre', load: 25, risk: 4 },
  { id: 'NOV', label: 'Noviembre', load: 20, risk: 3 },
  { id: 'DIC', label: 'Diciembre', load: 14, risk: 2 },
];

const baseWeek: AgendaDay[] = [
  {
    id: 'lun',
    label: 'LUN',
    date: '13',
    state: 'operativo',
    tone: 'busy',
    events: [
      {
        id: 'lun-0900',
        time: '09:00',
        end: '09:45',
        title: 'Briefing ejecutivo del día',
        priority: 'Alta',
        status: 'briefing listo',
        owner: 'Dirección',
        context: 'Resumen operativo, riesgos y documentos pendientes.',
        goal: 'Alinear prioridades del día y decidir qué temas requieren atención inmediata.',
        talkTrack: 'Abrir con estado general, confirmar bloqueos críticos y cerrar con responsables claros.',
        topics: ['Prioridades del día', 'Riesgos activos', 'Documentos pendientes', 'Reuniones críticas'],
        questions: ['¿Qué decisión no puede esperar?', '¿Qué responsable debe confirmar hoy?', '¿Qué documento bloquea avance?'],
        risks: ['Falta de priorización', 'Decisiones sin dueño', 'Pendientes sin fecha'],
        outputs: ['Lista de prioridades', 'Responsables definidos', 'Acciones críticas del día'],
        docs: ['Resumen operativo', 'Bitácora IA', 'Agenda del día'],
      },
      {
        id: 'lun-1130',
        time: '11:30',
        end: '12:15',
        title: 'Revisión de proceso crítico',
        priority: 'Media',
        status: 'requiere contexto',
        owner: 'Operación',
        context: 'Validar responsables y dependencias antes de sesión.',
        goal: 'Detectar el punto exacto que está frenando el proceso y asignar solución.',
        talkTrack: 'Enfocar la conversación en hechos, bloqueo, responsable, fecha y criterio de cierre.',
        topics: ['Estado actual', 'Bloqueos', 'Responsables', 'Fecha de resolución'],
        questions: ['¿Cuál es el cuello de botella?', '¿Quién puede desbloquearlo?', '¿Qué evidencia confirma avance?'],
        risks: ['Reunión sin datos', 'Responsable ambiguo', 'Compromisos no medibles'],
        outputs: ['Bloqueo identificado', 'Responsable asignado', 'Fecha de seguimiento'],
        docs: ['Reporte de proceso', 'Historial de seguimiento'],
      },
    ],
    slots: [
      { id: 'lun-slot-1000', time: '10:00 - 11:00', label: 'Disponible para seguimiento' },
      { id: 'lun-slot-1500', time: '15:00 - 16:30', label: 'Disponible para revisión documental' },
      { id: 'lun-slot-1800', time: '18:00 - 18:30', label: 'Disponible para cierre' },
    ],
  },
  {
    id: 'mar',
    label: 'MAR',
    date: '14',
    state: 'crítico',
    tone: 'critical',
    events: [
      {
        id: 'mar-0930',
        time: '09:30',
        end: '10:15',
        title: 'Validación de riesgos abiertos',
        priority: 'Alta',
        status: 'requiere contexto',
        owner: 'Riesgos',
        context: 'Cruzar agenda, documentos y alertas antes de aprobar.',
        goal: 'Determinar si los riesgos pueden mitigarse o deben escalarse.',
        talkTrack: 'Separar riesgos reales de ruido operativo y pedir decisión explícita por cada punto.',
        topics: ['Riesgos críticos', 'Impacto', 'Mitigación', 'Escalamiento'],
        questions: ['¿Qué riesgo afecta operación?', '¿Cuál es el costo de no actuar?', '¿Quién autoriza mitigación?'],
        risks: ['Autorizar sin evidencia', 'No escalar a tiempo', 'Subestimar impacto'],
        outputs: ['Riesgos priorizados', 'Plan de mitigación', 'Alertas validadas'],
        docs: ['Matriz de riesgos', 'Alertas activas'],
      },
      {
        id: 'mar-1200',
        time: '12:00',
        end: '12:40',
        title: 'Llamada con cliente estratégico',
        priority: 'Alta',
        status: 'sin confirmar',
        owner: 'Comercial',
        context: 'Preparar antecedentes y propuesta pendiente.',
        goal: 'Avanzar la oportunidad comercial con una propuesta clara y siguiente paso cerrado.',
        talkTrack: 'Iniciar con diagnóstico, reforzar valor, presentar ruta de solución y cerrar con fecha.',
        topics: ['Necesidad del cliente', 'Propuesta', 'Dudas comerciales', 'Siguiente paso'],
        questions: ['¿Qué decisión necesitan tomar?', '¿Qué obstáculo frena el cierre?', '¿Qué fecha podemos asegurar?'],
        risks: ['No cerrar siguiente paso', 'Hablar de precio sin valor', 'Falta de responsable'],
        outputs: ['Siguiente reunión', 'Responsable del cliente', 'Documento requerido'],
        docs: ['Propuesta comercial', 'Resumen del cliente'],
      },
    ],
    slots: [
      { id: 'mar-slot-1030', time: '10:30 - 11:30', label: 'Disponible para briefing corto' },
      { id: 'mar-slot-1400', time: '14:00 - 15:30', label: 'Disponible para decisión ejecutiva' },
      { id: 'mar-slot-1730', time: '17:30 - 18:00', label: 'Disponible para cierre' },
    ],
  },
  {
    id: 'mie',
    label: 'MIÉ',
    date: '15',
    state: 'en curso',
    tone: 'busy',
    events: [
      {
        id: 'mie-0900',
        time: '09:00',
        end: '09:30',
        title: 'Briefing ejecutivo del día',
        priority: 'Alta',
        status: 'briefing listo',
        owner: 'LÍA',
        context: 'Vista diaria preparada con riesgos y prioridades.',
        goal: 'Preparar al ejecutivo para operar el día con claridad y foco.',
        talkTrack: 'Resumir estado, marcar prioridades y convertir pendientes en decisiones accionables.',
        topics: ['Prioridades', 'Riesgos', 'Agenda', 'Documentos'],
        questions: ['¿Qué debe resolverse hoy?', '¿Qué reunión necesita preparación?', '¿Qué alerta requiere validación?'],
        risks: ['Saturación de agenda', 'Falta de contexto', 'Decisiones reactivas'],
        outputs: ['Plan del día', 'Briefings preparados', 'Alertas priorizadas'],
        docs: ['Resumen diario', 'Mapa cognitivo'],
      },
      {
        id: 'mie-1130',
        time: '11:30',
        end: '12:20',
        title: 'Revisión de proceso crítico',
        priority: 'Media',
        status: 'requiere contexto',
        owner: 'Operación',
        context: 'Contexto incompleto; requiere validación antes de entrar.',
        goal: 'Entrar a la junta con preguntas correctas y salir con responsable/fecha.',
        talkTrack: 'No permitir conversación general. Llevarla a problema, evidencia, decisión y fecha.',
        topics: ['Problema actual', 'Evidencia', 'Responsables', 'Plan de cierre'],
        questions: ['¿Qué falta para cerrar?', '¿Qué dependencia no está resuelta?', '¿Quién confirma el avance?'],
        risks: ['Junta informativa sin decisión', 'Falta de evidencia', 'No documentar acuerdos'],
        outputs: ['Acuerdo operativo', 'Responsable', 'Fecha de revisión'],
        docs: ['Reporte de avance', 'Pendientes previos'],
      },
      {
        id: 'mie-1400',
        time: '14:00',
        end: '15:00',
        title: 'Seguimiento con dirección',
        priority: 'Alta',
        status: 'sin confirmar',
        owner: 'Dirección',
        context: 'Cita crítica; falta confirmación humana.',
        goal: 'Presentar avance, riesgos y decisiones necesarias de forma ejecutiva.',
        talkTrack: 'Hablar en formato: estado actual, riesgo, decisión requerida y siguiente paso.',
        topics: ['Avance semanal', 'Riesgos', 'Decisiones pendientes', 'Responsables'],
        questions: ['¿Qué decisión necesita dirección?', '¿Qué tema se debe escalar?', '¿Qué compromiso queda firmado?'],
        risks: ['Llegar sin síntesis', 'No pedir decisión', 'Cerrar sin responsables'],
        outputs: ['Decisiones tomadas', 'Responsables confirmados', 'Próxima revisión'],
        docs: ['Resumen de seguimiento', 'Bitácora de riesgos'],
      },
      {
        id: 'mie-1730',
        time: '17:30',
        end: '18:00',
        title: 'Cierre operativo y pendientes',
        priority: 'Media',
        status: 'confirmado',
        owner: 'LÍA',
        context: 'Cierre con bitácora y alertas activas.',
        goal: 'Cerrar el día con pendientes organizados y alertas listas para mañana.',
        talkTrack: 'Confirmar qué se cerró, qué queda abierto y qué debe entrar mañana en agenda.',
        topics: ['Pendientes cerrados', 'Alertas', 'Seguimientos', 'Agenda siguiente'],
        questions: ['¿Qué quedó abierto?', '¿Quién debe responder?', '¿Qué se agenda mañana?'],
        risks: ['Arrastrar pendientes', 'No registrar acuerdos', 'Perder trazabilidad'],
        outputs: ['Cierre del día', 'Pendientes de mañana', 'Alertas actualizadas'],
        docs: ['Bitácora diaria', 'Resumen de cierre'],
      },
    ],
    slots: [
      { id: 'mie-slot-1000', time: '10:00 - 11:00', label: 'Disponible para seguimiento' },
      { id: 'mie-slot-1500', time: '15:00 - 16:30', label: 'Disponible para revisión estratégica' },
      { id: 'mie-slot-1800', time: '18:00 - 18:30', label: 'Disponible para cierre extendido' },
    ],
  },
  {
    id: 'jue',
    label: 'JUE',
    date: '16',
    state: 'estable',
    tone: 'free',
    events: [
      {
        id: 'jue-1000',
        time: '10:00',
        end: '10:40',
        title: 'Revisión comercial',
        priority: 'Media',
        status: 'confirmado',
        owner: 'Comercial',
        context: 'Seguimiento de oportunidades abiertas.',
        goal: 'Revisar oportunidades y decidir cuáles merecen seguimiento inmediato.',
        talkTrack: 'Separar prospectos tibios de oportunidades reales y cerrar acciones comerciales.',
        topics: ['Oportunidades', 'Estatus de clientes', 'Seguimiento', 'Cierre'],
        questions: ['¿Qué cliente está listo para avanzar?', '¿Qué propuesta falta?', '¿Qué seguimiento se agenda?'],
        risks: ['Perder oportunidad', 'Falta de propuesta', 'No agendar seguimiento'],
        outputs: ['Lista de oportunidades', 'Seguimientos programados'],
        docs: ['Pipeline comercial', 'Propuestas activas'],
      },
    ],
    slots: [
      { id: 'jue-slot-0900', time: '09:00 - 10:00', label: 'Disponible' },
      { id: 'jue-slot-1130', time: '11:30 - 12:30', label: 'Disponible para cliente' },
      { id: 'jue-slot-1600', time: '16:00 - 17:30', label: 'Disponible para decisión' },
    ],
  },
  {
    id: 'vie',
    label: 'VIE',
    date: '17',
    state: 'libre',
    tone: 'free',
    events: [
      {
        id: 'vie-1100',
        time: '11:00',
        end: '11:45',
        title: 'Corte semanal ejecutivo',
        priority: 'Alta',
        status: 'requiere contexto',
        owner: 'Dirección',
        context: 'Preparar métricas, alertas y pendientes de la semana.',
        goal: 'Cerrar la semana con lectura ejecutiva y prioridades para la siguiente.',
        talkTrack: 'Resumir resultados, evidenciar riesgos y convertir pendientes en plan semanal.',
        topics: ['Resultados', 'Riesgos', 'Pendientes', 'Prioridades próximas'],
        questions: ['¿Qué se logró?', '¿Qué debe escalarse?', '¿Qué entra primero la próxima semana?'],
        risks: ['Cerrar sin decisiones', 'No priorizar', 'No documentar compromisos'],
        outputs: ['Resumen semanal', 'Plan siguiente semana', 'Responsables'],
        docs: ['Reporte semanal', 'Bitácora IA'],
      },
    ],
    slots: [
      { id: 'vie-slot-0900', time: '09:00 - 10:30', label: 'Disponible para briefing' },
      { id: 'vie-slot-1230', time: '12:30 - 14:00', label: 'Disponible para seguimiento' },
    ],
  },
  {
    id: 'sab',
    label: 'SÁB',
    date: '18',
    state: 'ligero',
    tone: 'free',
    events: [],
    slots: [{ id: 'sab-slot-1000', time: '10:00 - 12:00', label: 'Disponible' }],
  },
  {
    id: 'dom',
    label: 'DOM',
    date: '19',
    state: 'sin carga',
    tone: 'free',
    events: [],
    slots: [{ id: 'dom-slot-1100', time: '11:00 - 12:00', label: 'Disponible' }],
  },
];

function saveAgendaAlert(title: string, detail: string) {
  const stored = localStorage.getItem('lia-agenda-alerts');
  const current = stored ? JSON.parse(stored) : [];
  const next = [{ id: Date.now(), level: 'Media', title, detail }, ...current].slice(0, 10);
  localStorage.setItem('lia-agenda-alerts', JSON.stringify(next));
  window.dispatchEvent(new Event('lia-agenda-alerts-updated'));
}

export function AgendaCalendar() {
  const [week, setWeek] = useState(baseWeek);
  const [selectedDay, setSelectedDay] = useState('mie');
  const [briefedEvents, setBriefedEvents] = useState<string[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('mie-1130');
  const [selectedMonth, setSelectedMonth] = useState('MAY');

  const day = week.find((item) => item.id === selectedDay) ?? week[0];

  const selectedEvent = useMemo(() => {
    const eventFromDay = day.events.find((event) => event.id === selectedEventId);
    return eventFromDay ?? day.events[0];
  }, [day.events, selectedEventId]);

  const selectDay = (dayId: string) => {
    const nextDay = week.find((item) => item.id === dayId);
    setSelectedDay(dayId);
    setSelectedEventId(nextDay?.events[0]?.id ?? '');
  };

  const generateBriefing = (event: AgendaEvent) => {
    setSelectedEventId(event.id);
    setBriefedEvents((prev) => [...new Set([...prev, event.id])]);
    saveAgendaAlert(`Agenda · ${event.time}`, `Briefing preparado para ${event.title}. Guion, riesgos y preguntas clave preparados.`);
  };

  const createReminder = (event: AgendaEvent) => {
    setSelectedEventId(event.id);
    saveAgendaAlert(`Agenda · ${event.time}`, `${event.title} — recordatorio creado desde calendario ejecutivo.`);
  };

  const openContext = (event: AgendaEvent) => {
    setSelectedEventId(event.id);
    saveAgendaAlert(`Contexto · ${event.time}`, `Contexto abierto para ${event.title}.`);
  };

  const blockSlot = (slot: AgendaSlot) => {
    const newEvent: AgendaEvent = {
      id: `blocked-${slot.id}`,
      time: slot.time.split(' - ')[0],
      end: slot.time.split(' - ')[1] ?? '',
      title: 'Espacio bloqueado por LÍA',
      priority: 'Media',
      status: 'bloqueado',
      owner: 'LÍA',
      context: slot.label,
      goal: 'Reservar tiempo operativo para avanzar pendientes sin interrupción.',
      talkTrack: 'Usar este bloque para cerrar una tarea específica y documentar salida.',
      topics: ['Bloqueo operativo', 'Pendiente prioritario', 'Resultado esperado'],
      questions: ['¿Qué se debe cerrar en este bloque?', '¿Qué documento o decisión queda pendiente?'],
      risks: ['Bloquear sin objetivo', 'No registrar resultado'],
      outputs: ['Tiempo reservado', 'Pendiente asignado'],
      docs: ['Agenda ejecutiva'],
    };

    setWeek((prev) =>
      prev.map((item) =>
        item.id === selectedDay
          ? {
              ...item,
              state: 'actualizado',
              tone: 'busy',
              slots: item.slots.filter((current) => current.id !== slot.id),
              events: [...item.events, newEvent].sort((a, b) => a.time.localeCompare(b.time)),
            }
          : item
      )
    );

    setSelectedEventId(newEvent.id);
    saveAgendaAlert(`Agenda · ${slot.time}`, `Espacio bloqueado: ${slot.label}.`);
  };

  return (
    <section className="agenda-calendar-shell agenda-compact-pass-v087">
      <div className="panel module-header agenda-command-header">
        <div>
          <p className="eyebrow">AGENDA INTELIGENTE · CALENDARIO ACTIVO</p>
          <h3>Calendario ejecutivo contextual</h3>
          <p className="muted">
            Semana ejecutiva conectada a prioridades, alertas y decisiones de cierre.
          </p>
        </div>

        <div className="agenda-command-stats">
          <div><span>Citas</span><strong>{day.events.length}</strong></div>
          <div><span>Espacios</span><strong>{day.slots.length}</strong></div>
          <div><span>Estado</span><strong>{day.state}</strong></div>
        </div>
      </div>

      <div className="agenda-legend-strip">
        <span className="tone-free">Libre</span>
        <span className="tone-stable">Estable</span>
        <span className="tone-busy">En curso</span>
        <span className="tone-critical">Crítico</span>
        <span className="tone-priority">Alta prioridad</span>
      </div>

      <section className="panel agenda-year-planner">
        <div>
          <p className="eyebrow">CONTROL ANUAL</p>
          <h4>Planeación ejecutiva por mes</h4>
          <span>Vista preparada para administrar citas de todo el año.</span>
        </div>

        <div className="agenda-month-grid">
          {agendaYear.map((month) => (
            <button
              key={month.id}
              type="button"
              className={selectedMonth === month.id ? 'active' : ''}
              onClick={() => setSelectedMonth(month.id)}
            >
              <strong>{month.id}</strong>
              <span>{month.load} citas</span>
              <em>{month.risk} críticas</em>
            </button>
          ))}
        </div>
      </section>

      <div className="agenda-week-strip">
        {week.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`agenda-day-card day-${item.tone} ${item.id === selectedDay ? 'active' : ''}`}
            onClick={() => selectDay(item.id)}
          >
            <span>{item.label}</span>
            <strong>{item.date}</strong>
            <em>{item.events.length} citas</em>
            <small>{item.state}</small>
          </button>
        ))}
      </div>

      <div className="agenda-day-layout agenda-day-layout-briefing">
        <section className="panel agenda-timeline-panel">
          <div className="agenda-section-head">
            <div>
              <p className="eyebrow">DÍA EJECUTIVO</p>
              <h4>{day.label} {day.date}</h4>
            </div>
            <span className={`agenda-state-pill day-${day.tone}`}>{day.state}</span>
          </div>

          <div className="agenda-timeline">
            {day.events.length === 0 ? (
              <div className="agenda-empty-state">
                <strong>Día sin decisiones críticas</strong>
                <span>Disponible para planeación, revisión documental o seguimiento estratégico.</span>
              </div>
            ) : (
              day.events.map((event) => {
                const isBriefed = briefedEvents.includes(event.id) || event.status === 'briefing listo';
                const isSelected = selectedEvent?.id === event.id;

                return (
                  <article
                    key={event.id}
                    className={`agenda-event-card ${isSelected ? 'selected' : ''} priority-${event.priority.toLowerCase()} status-${event.status.replace(/\s+/g, '-')}`}
                    onClick={() => setSelectedEventId(event.id)}
                  >
                    <div className="agenda-event-time">
                      <strong>{event.time}</strong>
                      <span>{event.end}</span>
                    </div>

                    <div className="agenda-event-body">
                      <div className="agenda-event-title">
                        <h5>{event.title}</h5>
                        <span>{event.priority}</span>
                      </div>
                      <p>{event.context}</p>
                <div className="agenda-primary-action">Siguiente movimiento: {isBriefed ? "Validar" : "Briefing"}</div>

                      <div className="agenda-event-meta">
                        <span>{event.owner}</span>
                        <span>{isBriefed ? 'briefing listo' : event.status}</span>
                  <span>{event.priority === 'Alta' ? 'riesgo alto' : event.priority === 'Media' ? 'riesgo moderado' : 'riesgo controlado'}</span>
                      </div>

                      <div className="agenda-event-actions">
                        <button type="button" onClick={(e) => { e.stopPropagation(); generateBriefing(event); }}>
                          Briefing
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); createReminder(event); }}>
                          Recordatorio
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); openContext(event); }}>
                          Guion
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <aside className="agenda-right-stack">
          {selectedEvent ? (
            <section className="panel agenda-briefing-panel">
              <div className="agenda-section-head">
                <div>
                  <p className="eyebrow">PREPARACIÓN DE JUNTA</p>
                  <h4>{selectedEvent.title}</h4>
                </div>
                <span className={`meeting-readiness priority-${selectedEvent.priority.toLowerCase()}`}>
                  {selectedEvent.priority}
                </span>
              </div>

              <div className="briefing-script">
                <span>Guion ejecutivo</span>
                <strong>{selectedEvent.talkTrack}</strong>
              </div>

              <div className="briefing-block">
                <span>Objetivo</span>
                <p>{selectedEvent.goal}</p>
              </div>

              <div className="briefing-grid">
                <div className="briefing-list">
                  <span>Temas clave</span>
                  {selectedEvent.topics.map((topic) => <em key={topic}>{topic}</em>)}
                </div>

                <div className="briefing-list">
                  <span>Preguntas clave</span>
                  {selectedEvent.questions.map((question) => <em key={question}>{question}</em>)}
                </div>

                <div className="briefing-list">
                  <span>Riesgos</span>
                  {selectedEvent.risks.map((risk) => <em key={risk}>{risk}</em>)}
                </div>

                <div className="briefing-list">
                  <span>Resultado esperado</span>
                  {selectedEvent.outputs.map((output) => <em key={output}>{output}</em>)}
                </div>
              </div>

              <div className="briefing-docs">
                <span>Material requerido</span>
                {selectedEvent.docs.map((doc) => <strong key={doc}>{doc}</strong>)}
              </div>
            </section>
          ) : null}

          <section className="panel agenda-availability-panel">
            <div className="agenda-section-head">
              <div>
                <p className="eyebrow">VENTANAS DISPONIBLES</p>
                <h4>Bloques útiles</h4>
              </div>
            </div>

            <div className="available-slots">
              {day.slots.map((slot) => (
                <button key={slot.id} type="button" onClick={() => blockSlot(slot)}>
                  <span>{slot.time}</span>
                  <strong>{slot.label}</strong>
                  <em>Reservar bloque</em>
                </button>
              ))}
            </div>

            <div className="agenda-ai-brief">
              <p className="eyebrow">LECTURA LÍA</p>
              <strong>
                {day.tone === 'critical'
                  ? 'Prioriza riesgos antes de confirmar nuevas citas.'
                  : 'Hay ventanas útiles para preparar contexto y cerrar pendientes.'}
              </strong>
              <span>
                LÍA puede convertir espacios libres en revisión documental, confirmaciones o sesiones de cierre.
              </span>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
