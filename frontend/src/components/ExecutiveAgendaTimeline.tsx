import { useEffect, useMemo, useState, type FormEvent } from 'react';

type AgendaPriority = 'Alta' | 'Media' | 'Baja';
type AgendaTone = 'critico' | 'alto' | 'medio' | 'seguimiento' | 'movilidad' | 'libre' | 'neutral';

type ExecutiveEvent = {
  id: string;
  dateKey: string;
  start: string;
  end: string;
  title: string;
  owner: string;
  priority: AgendaPriority;
  tone: AgendaTone;
  location: string;
  goal: string;
  context: string;
  recommendedExit: string;
};

type EventDraft = {
  title: string;
  start: string;
  end: string;
  owner: string;
  priority: AgendaPriority;
  location: string;
  goal: string;
};

type MonthCell =
  | { id: string; isBlank: true }
  | {
      id: string;
      key: string;
      day: number;
      isBlank: false;
      isToday: boolean;
      isSelected: boolean;
      events: ExecutiveEvent[];
    };

const monthLabels = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const weekdayLabels = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];
const hours = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`);
const freeWindowLabels = ['Foco', 'Seguimiento', 'Preparación', 'Cierre'];
const priorityToTone: Record<AgendaPriority, AgendaTone> = {
  Alta: 'alto',
  Media: 'medio',
  Baja: 'seguimiento',
};

const toneCopy: Record<AgendaTone, { label: string; shortLabel: string }> = {
  critico: { label: 'Crítico', shortLabel: 'Crítico' },
  alto: { label: 'Alta prioridad', shortLabel: 'Alto' },
  medio: { label: 'Prioridad media', shortLabel: 'Medio' },
  seguimiento: { label: 'Seguimiento', shortLabel: 'Seguimiento' },
  movilidad: { label: 'Movilidad lista', shortLabel: 'Movilidad' },
  libre: { label: 'Ventana libre', shortLabel: 'Libre' },
  neutral: { label: 'Neutral', shortLabel: 'Neutral' },
};

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatReadableDate = (date: Date) =>
  new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

const minutesFromTime = (time: string) => {
  const [hour = '0', minute = '0'] = time.split(':');

  return Number(hour) * 60 + Number(minute);
};

const getBrowserToday = () => {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  return today;
};

const getMonthStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const addDays = (date: Date, days: number) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);

  return copy;
};

const getDominantTone = (dayEvents: ExecutiveEvent[]): AgendaTone => {
  if (dayEvents.length === 0) {
    return 'libre';
  }

  const order: AgendaTone[] = ['critico', 'alto', 'medio', 'movilidad', 'seguimiento', 'neutral'];

  return order.find((tone) => dayEvents.some((event) => event.tone === tone)) ?? 'neutral';
};

const createDraft = (): EventDraft => ({
  title: '',
  start: '10:00',
  end: '11:00',
  owner: 'Dirección',
  priority: 'Media',
  location: 'Sala ejecutiva',
  goal: '',
});

const createDemoEvents = (anchorDate: Date): ExecutiveEvent[] => {
  const todayKey = formatDateKey(anchorDate);
  const tomorrowKey = formatDateKey(addDays(anchorDate, 1));
  const secondDayKey = formatDateKey(addDays(anchorDate, 2));
  const thirdDayKey = formatDateKey(addDays(anchorDate, 3));
  const fifthDayKey = formatDateKey(addDays(anchorDate, 5));

  return [
    {
      id: 'demo-today-0830',
      dateKey: todayKey,
      start: '08:30',
      end: '09:10',
      title: 'Alineación ejecutiva del día',
      owner: 'Dirección',
      priority: 'Alta',
      tone: 'alto',
      location: 'Sala norte',
      goal: 'Ordenar decisiones críticas y responsables antes de abrir operación.',
      context: 'LÍA detecta alta carga entre decisiones, documentos y seguimiento operativo.',
      recommendedExit: 'Llegar 10 min antes con prioridades cerradas.',
    },
    {
      id: 'demo-today-1100',
      dateKey: todayKey,
      start: '11:00',
      end: '12:00',
      title: 'Comité de riesgos abiertos',
      owner: 'Riesgos',
      priority: 'Alta',
      tone: 'critico',
      location: 'Mesa ejecutiva',
      goal: 'Definir mitigación, responsable y fecha de cierre para cada riesgo activo.',
      context: 'Requiere entrar con matriz de riesgos y acuerdos previos listos.',
      recommendedExit: 'Entrar con 3 decisiones límite y criterio de escalamiento.',
    },
    {
      id: 'demo-today-1430',
      dateKey: todayKey,
      start: '14:30',
      end: '15:20',
      title: 'Revisión de contrato prioritario',
      owner: 'Legal',
      priority: 'Media',
      tone: 'medio',
      location: 'Sala documental',
      goal: 'Confirmar cláusulas pendientes y preparar salida para firma.',
      context: 'Documento sensible con dependencias de validación y cierre comercial.',
      recommendedExit: 'Preparar versión final y responsable de firma.',
    },
    {
      id: 'demo-today-1730',
      dateKey: todayKey,
      start: '17:30',
      end: '18:00',
      title: 'Cierre ejecutivo y siguientes pasos',
      owner: 'Operación',
      priority: 'Baja',
      tone: 'seguimiento',
      location: 'Remoto',
      goal: 'Consolidar acuerdos del día y dejar acciones listas para mañana.',
      context: 'Bloque corto para reducir pendientes sin dueño antes del cierre.',
      recommendedExit: 'Cerrar minuta y enviar responsables antes de las 18:20.',
    },
    {
      id: 'demo-plus-1-0920',
      dateKey: tomorrowKey,
      start: '09:20',
      end: '10:00',
      title: 'Mapa de traslados ejecutivos',
      owner: 'Asistente ejecutivo',
      priority: 'Media',
      tone: 'movilidad',
      location: 'Ruta ejecutiva',
      goal: 'Confirmar ventanas de traslado y puntos de preparación entre reuniones.',
      context: 'La agenda requiere margen operativo para evitar decisiones con prisa.',
      recommendedExit: 'Reservar salida 25 min antes del siguiente bloque.',
    },
    {
      id: 'demo-plus-2-1210',
      dateKey: secondDayKey,
      start: '12:10',
      end: '12:45',
      title: 'Seguimiento de acuerdos críticos',
      owner: 'Operación',
      priority: 'Baja',
      tone: 'seguimiento',
      location: 'Sala breve',
      goal: 'Revisar acuerdos vencidos y convertirlos en responsables accionables.',
      context: 'Bloque diseñado para reducir pendientes abiertos antes del cierre semanal.',
      recommendedExit: 'Salir con 3 responsables y fecha de confirmación.',
    },
    {
      id: 'demo-plus-3-1600',
      dateKey: thirdDayKey,
      start: '16:00',
      end: '16:50',
      title: 'Cierre comercial prioritario',
      owner: 'Comercial',
      priority: 'Alta',
      tone: 'alto',
      location: 'Mesa comercial',
      goal: 'Cerrar condiciones pendientes y preparar confirmación de decisión.',
      context: 'Oportunidad relevante con riesgo de diluirse si no hay cierre claro.',
      recommendedExit: 'Enviar confirmación ejecutiva antes de las 17:20.',
    },
    {
      id: 'demo-plus-5-1030',
      dateKey: fifthDayKey,
      start: '10:30',
      end: '11:30',
      title: 'Planeación estratégica compacta',
      owner: 'Dirección',
      priority: 'Media',
      tone: 'medio',
      location: 'Sala estratégica',
      goal: 'Definir foco de la semana y tres decisiones de alto impacto.',
      context: 'Bloque de preparación para iniciar la siguiente semana con claridad.',
      recommendedExit: 'Cerrar narrativa y prioridades antes del mediodía.',
    },
  ];
};

export function ExecutiveAgendaTimeline() {
  const [todayKey, setTodayKey] = useState(() => formatDateKey(new Date()));
  const [now, setNow] = useState(() => new Date());
  const [visibleMonth, setVisibleMonth] = useState(() => getMonthStart(getBrowserToday()));
  const [selectedDate, setSelectedDate] = useState(() => getBrowserToday());
  const [events, setEvents] = useState<ExecutiveEvent[]>(() => createDemoEvents(getBrowserToday()));
  const [draft, setDraft] = useState<EventDraft>(() => createDraft());
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const refreshClock = () => {
      const current = new Date();
      setNow(current);
      setTodayKey(formatDateKey(current));
    };
    const interval = window.setInterval(refreshClock, 30000);

    refreshClock();

    return () => window.clearInterval(interval);
  }, []);

  const selectedKey = formatDateKey(selectedDate);
  const selectedEvents = useMemo(
    () =>
      events
        .filter((event) => event.dateKey === selectedKey)
        .sort((a, b) => minutesFromTime(a.start) - minutesFromTime(b.start)),
    [events, selectedKey],
  );

  const eventsByDate = useMemo(
    () =>
      events.reduce<Record<string, ExecutiveEvent[]>>((acc, event) => {
        acc[event.dateKey] = [...(acc[event.dateKey] ?? []), event];
        return acc;
      }, {}),
    [events],
  );

  const monthDays = useMemo<MonthCell[]>(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1);
    const leadingBlanks = (firstDay.getDay() + 6) % 7;

    return [
      ...Array.from({ length: leadingBlanks }, (_, index) => ({ id: `blank-${index}`, isBlank: true }) as const),
      ...Array.from({ length: daysInMonth }, (_, index) => {
        const date = new Date(year, month, index + 1);
        const key = formatDateKey(date);

        return {
          id: key,
          key,
          day: index + 1,
          isBlank: false,
          isToday: key === todayKey,
          isSelected: key === selectedKey,
          events: eventsByDate[key] ?? [],
        };
      }),
    ];
  }, [eventsByDate, selectedKey, todayKey, visibleMonth]);

  const upcomingDays = useMemo(() => {
    const base = new Date(selectedDate);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(base);
      date.setDate(base.getDate() + index + 1);
      const key = formatDateKey(date);
      const dayEvents = eventsByDate[key] ?? [];

      return {
        key,
        label: new Intl.DateTimeFormat('es-MX', { weekday: 'short', day: 'numeric' }).format(date),
        count: dayEvents.length,
        tone: getDominantTone(dayEvents),
        title: dayEvents[0]?.title ?? 'Ventana disponible',
      };
    })
      .sort((a, b) => Number(b.count > 0) - Number(a.count > 0))
      .slice(0, 4);
  }, [eventsByDate, selectedDate]);

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const upcomingEvents =
    selectedKey === todayKey ? selectedEvents.filter((event) => minutesFromTime(event.start) >= nowMinutes) : selectedEvents;
  const nextEvent = upcomingEvents[0] ?? selectedEvents[0];
  const criticalCount = selectedEvents.filter((event) => event.priority === 'Alta').length;
  const criticalBlockCount = selectedEvents.filter((event) => event.tone === 'critico' || event.priority === 'Alta').length;
  const followUpCount = selectedEvents.filter((event) => event.tone === 'seguimiento' || event.tone === 'movilidad').length;
  const occupiedHours = selectedEvents.reduce((total, event) => {
    return total + Math.max(0, minutesFromTime(event.end) - minutesFromTime(event.start)) / 60;
  }, 0);
  const freeHours = Math.max(0, 24 - occupiedHours);
  const dayTone = getDominantTone(selectedEvents);
  const loadLabel = selectedEvents.length >= 4 ? 'Alta' : selectedEvents.length >= 2 ? 'Media' : 'Baja';
  const riskLabel = criticalBlockCount >= 2 ? 'Alto' : criticalBlockCount === 1 ? 'Medio' : 'Bajo';
  const mobilityLabel = selectedEvents.some((event) => event.tone === 'movilidad') || selectedEvents.length > 3 ? 'Atención' : 'Lista';
  const dayLoadLabel =
    selectedEvents.length === 0 ? 'Día libre' : criticalCount > 0 ? 'Atención alta' : 'Ritmo controlado';
  const executiveReading =
    selectedEvents.length > 0
      ? `Día con ${selectedEvents.length} eventos, ${followUpCount} seguimientos y ${criticalBlockCount} bloques críticos. LÍA sugiere preparar traslados y cierres antes de las horas clave.`
      : 'Día libre para planeación, seguimiento o trabajo profundo.';
  const readingChips = selectedEvents.length > 0 ? ['Preparar', 'Confirmar', 'Cerrar'] : ['Planear', 'Seguimiento', 'Cierre'];

  const moveMonth = (direction: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  };

  const selectDate = (year: number, month: number, day: number) => {
    setSelectedDate(new Date(year, month, day));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanTitle = draft.title.trim();
    if (!cleanTitle) {
      return;
    }

    setEvents((current) => [
      ...current,
      {
        id: `${selectedKey}-${Date.now()}`,
        dateKey: selectedKey,
        start: draft.start,
        end: draft.end,
        title: cleanTitle,
        owner: draft.owner.trim() || 'Dirección',
        priority: draft.priority,
        tone: priorityToTone[draft.priority],
        location: draft.location.trim() || 'Por definir',
        goal: draft.goal.trim() || 'Definir objetivo, responsable y salida esperada.',
        context: 'Evento agregado en estado local de esta sesión.',
        recommendedExit: 'Confirmar salida y responsable al cerrar el bloque.',
      },
    ]);
    setActionFeedback(`Bloque local agregado: ${cleanTitle}`);
    setDraft(createDraft());
    setFormOpen(false);
  };

  const handleEventAction = (title: string, action: string) => {
    setActionFeedback(`${action}: ${title}`);
  };

  const selectedReadableDate = formatReadableDate(selectedDate);
  const monthTitle = `${monthLabels[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`;

  return (
    <section className="lia-agenda-v400-shell" aria-label="Agenda ejecutiva mensual con timeline">
      <aside className="lia-agenda-v400-left">
        <div className="lia-agenda-v400-calendar-panel">
          <div className="lia-agenda-v400-panel-head">
            <div>
              <p>AGENDA MENSUAL</p>
              <h2>{monthTitle}</h2>
            </div>
            <div className="lia-agenda-v400-month-controls" aria-label="Navegación de mes">
              <button type="button" onClick={() => moveMonth(-1)} aria-label="Mes anterior">
                ‹
              </button>
              <button type="button" onClick={() => moveMonth(1)} aria-label="Mes siguiente">
                ›
              </button>
            </div>
          </div>

          <div className="lia-agenda-v400-weekdays">
            {weekdayLabels.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>

          <div className="lia-agenda-v400-month-grid">
            {monthDays.map((item) => {
              if (item.isBlank) {
                return <span className="lia-agenda-v400-day lia-agenda-v400-day-empty" key={item.id} />;
              }

              const visibleYear = visibleMonth.getFullYear();
              const visibleMonthIndex = visibleMonth.getMonth();

              return (
                <button
                  className={[
                    'lia-agenda-v400-day',
                    item.isToday ? 'lia-agenda-v400-day-today' : '',
                    item.isSelected ? 'lia-agenda-v400-day-selected' : '',
                    item.events.length > 0 ? `lia-agenda-v400-day-has-${getDominantTone(item.events)}` : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  type="button"
                  key={item.key}
                  onClick={() => selectDate(visibleYear, visibleMonthIndex, item.day)}
                  aria-pressed={item.isSelected}
                >
                  <b>{item.day}</b>
                  {item.events.length > 0 && (
                    <span className="lia-agenda-v400-event-dots" aria-label={`${item.events.length} eventos`}>
                      {item.events.slice(0, 3).map((agendaEvent) => (
                        <i className={`lia-agenda-v400-dot-${agendaEvent.tone}`} key={agendaEvent.id} />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lia-agenda-v400-stats">
          <article className="lia-agenda-v400-stat-eventos">
            <i />
            <span>Eventos</span>
            <strong>{selectedEvents.length}</strong>
            <small>{selectedEvents.length === 1 ? 'bloque activo' : 'bloques activos'}</small>
          </article>
          <article className="lia-agenda-v400-stat-prioridad">
            <i />
            <span>Prioridad alta</span>
            <strong>{criticalCount}</strong>
            <small>{criticalCount > 0 ? 'requiere foco' : 'sin presión crítica'}</small>
          </article>
          <article className="lia-agenda-v400-stat-libre">
            <i />
            <span>Ventanas libres</span>
            <strong>{freeHours.toFixed(1)}</strong>
            <small>horas disponibles</small>
          </article>
        </div>

        <div className="lia-agenda-v400-upcoming">
          <div className="lia-agenda-v400-section-title">
            <p>PRÓXIMOS DÍAS</p>
          </div>
          {upcomingDays.map((day) => (
            <button
              className={`lia-agenda-v400-upcoming-${day.tone}`}
              type="button"
              key={day.key}
              onClick={() => setSelectedDate(new Date(`${day.key}T12:00:00`))}
            >
              <i />
              <span>
                <strong>{day.label}</strong>
                <small>{day.title}</small>
              </span>
              <b>{day.count > 0 ? `${day.count} eventos` : 'Libre'}</b>
            </button>
          ))}
        </div>
      </aside>

      <main className="lia-agenda-v400-main">
        <header className={`lia-agenda-v400-day-header lia-agenda-v400-day-header-${dayTone}`}>
          <div>
            <p>DÍA SELECCIONADO</p>
            <h1>{selectedReadableDate}</h1>
            <span>
              {selectedKey === todayKey
                ? 'Vista en tiempo real con agenda local'
                : 'Plan ejecutivo local sin conexión externa'}
            </span>
            <div className="lia-agenda-v400-header-chips">
              <b className={`lia-agenda-v400-chip-${dayTone}`}>{dayLoadLabel}</b>
              <b>Timeline 24h</b>
              <b>Estado local</b>
            </div>
            <div className="lia-agenda-v400-day-pulse" aria-label="Pulso del día">
              <article>
                <span>Carga</span>
                <strong>{loadLabel}</strong>
              </article>
              <article>
                <span>Riesgo</span>
                <strong>{riskLabel}</strong>
              </article>
              <article>
                <span>Movilidad</span>
                <strong>{mobilityLabel}</strong>
              </article>
              <article>
                <span>Seguimientos</span>
                <strong>{followUpCount}</strong>
              </article>
            </div>
          </div>
          <div className="lia-agenda-v400-live-clock">
            <small>AHORA</small>
            <strong>
              {now.toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </strong>
          </div>
        </header>

        <section className="lia-agenda-v400-lia-alert">
          <div>
            <p>LÍA CONTEXTO</p>
            <strong>
              {nextEvent
                ? `Siguiente bloque: ${nextEvent.start} · ${nextEvent.title}`
                : 'No hay más eventos programados para este día.'}
            </strong>
            <small className="lia-agenda-v400-local-feedback">
              {actionFeedback ?? 'Sin acciones locales recientes.'}
            </small>
          </div>
          <span>
            {selectedEvents.length > 0
              ? 'Agenda lista para operar con prioridad, responsable y objetivo por bloque.'
              : 'Día disponible para planeación, seguimiento o trabajo profundo.'}
          </span>
        </section>

        <section className="lia-agenda-v400-reading">
          <div>
            <p>LECTURA DEL DÍA</p>
            <strong>{executiveReading}</strong>
          </div>
          <div className="lia-agenda-v400-reading-chips">
            {readingChips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
        </section>

        {!formOpen ? (
          <section className="lia-agenda-v400-form-compact">
            <button type="button" onClick={() => setFormOpen(true)}>
              <span>+ Agendar bloque</span>
              <small>Estado local</small>
            </button>
            <p>Formulario compacto listo cuando necesites capturar un bloque nuevo.</p>
          </section>
        ) : (
          <form className="lia-agenda-v400-form lia-agenda-v400-form-expanded" onSubmit={handleSubmit}>
            <div className="lia-agenda-v400-form-head">
            <div>
              <p>NUEVO BLOQUE LOCAL</p>
              <strong>Agrega una decisión, seguimiento o ventana ejecutiva sin persistencia.</strong>
            </div>
            <span>{selectedReadableDate}</span>
          </div>
          <label>
            <span>Nuevo evento</span>
            <input
              value={draft.title}
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
              placeholder="Ej. Revisión ejecutiva"
            />
          </label>
          <label>
            <span>Inicio</span>
            <input
              type="time"
              value={draft.start}
              onChange={(event) => setDraft((current) => ({ ...current, start: event.target.value }))}
            />
          </label>
          <label>
            <span>Fin</span>
            <input
              type="time"
              value={draft.end}
              onChange={(event) => setDraft((current) => ({ ...current, end: event.target.value }))}
            />
          </label>
          <label>
            <span>Prioridad</span>
            <select
              value={draft.priority}
              onChange={(event) => setDraft((current) => ({ ...current, priority: event.target.value as AgendaPriority }))}
            >
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
            </select>
          </label>
          <label>
            <span>Responsable</span>
            <input
              value={draft.owner}
              onChange={(event) => setDraft((current) => ({ ...current, owner: event.target.value }))}
            />
          </label>
          <label>
            <span>Ubicación</span>
            <input
              value={draft.location}
              onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))}
            />
          </label>
          <label className="lia-agenda-v400-form-wide">
            <span>Objetivo</span>
            <input
              value={draft.goal}
              onChange={(event) => setDraft((current) => ({ ...current, goal: event.target.value }))}
              placeholder="Salida esperada del bloque"
            />
          </label>
          <button className="lia-agenda-v400-form-secondary" type="button" onClick={() => setFormOpen(false)}>
            Cerrar
          </button>
          <button type="submit">
            <span>Agregar bloque</span>
            <small>Solo sesión local</small>
          </button>
        </form>
        )}

        <section className="lia-agenda-v400-timeline" aria-label="Línea de tiempo de 24 horas">
          {hours.map((hour) => {
            const hourStart = minutesFromTime(hour);
            const hourEnd = hourStart + 59;
            const isCurrentHour = nowMinutes >= hourStart && nowMinutes <= hourEnd;
            const hourEvents = selectedEvents.filter((event) => {
              const eventStart = minutesFromTime(event.start);

              return eventStart >= hourStart && eventStart <= hourEnd;
            });

            return (
              <div
                className={`lia-agenda-v400-hour-row ${
                  hourEvents.length > 0 ? 'lia-agenda-v400-hour-active' : 'lia-agenda-v400-hour-quiet'
                }`}
                key={hour}
              >
                <time>{hour}</time>
                <div className="lia-agenda-v400-hour-content">
                  {isCurrentHour && (
                    <div className="lia-agenda-v400-now-line" style={{ top: `${(now.getMinutes() / 60) * 100}%` }}>
                      <span>AHORA</span>
                    </div>
                  )}
                  {hourEvents.length > 0 ? (
                    hourEvents.map((agendaEvent) => (
                      <article
                        className={`lia-agenda-v400-event-card lia-agenda-v400-tone-${agendaEvent.tone} lia-agenda-v400-priority-${agendaEvent.priority.toLowerCase()}`}
                        key={agendaEvent.id}
                      >
                        <div className="lia-agenda-v400-event-top">
                          <span className="lia-agenda-v400-event-time">
                            {agendaEvent.start} - {agendaEvent.end}
                          </span>
                          <b>{toneCopy[agendaEvent.tone].label}</b>
                        </div>
                        <h3>{agendaEvent.title}</h3>
                        <p>{agendaEvent.context}</p>
                        <div className="lia-agenda-v400-event-goal">{agendaEvent.goal}</div>
                        <footer className="lia-agenda-v400-event-meta">
                          <span>Responsable: {agendaEvent.owner}</span>
                          <span>Ubicación: {agendaEvent.location}</span>
                        </footer>
                        <div className="lia-agenda-v400-event-mobility">
                          <span>Salida recomendada</span>
                          <b>{agendaEvent.recommendedExit}</b>
                        </div>
                        <div className="lia-agenda-v400-event-tags">
                          <span className={`lia-agenda-v400-tag-${agendaEvent.tone}`}>
                            {toneCopy[agendaEvent.tone].shortLabel}
                          </span>
                          <span>{agendaEvent.priority}</span>
                          <span>Local</span>
                        </div>
                        <div className="lia-agenda-v400-event-actions">
                          <button
                            type="button"
                            onClick={() => handleEventAction(agendaEvent.title, 'Contexto preparado')}
                          >
                            Preparar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEventAction(agendaEvent.title, 'Seguimiento marcado')}
                          >
                            Seguimiento
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="lia-agenda-v400-free-slot">
                      <i />
                      {Number(hour.slice(0, 2)) % 3 === 0 && (
                        <>
                          <span>{freeWindowLabels[(Number(hour.slice(0, 2)) / 3) % freeWindowLabels.length]}</span>
                          <b>Ventana ejecutiva</b>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </section>
  );
}
