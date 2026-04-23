import type { ActionItem, RawEntry } from "../../../shared/types";

export const seedEntries: RawEntry[] = [
  {
    id: "entry-001",
    text: "Reunión con CFO: ajustar forecast Q3 por caída del 6% en pipeline enterprise.",
    category: "meeting",
    owner: "CEO",
    priority: "high",
    createdAt: "2026-04-20T09:00:00.000Z",
  },
  {
    id: "entry-002",
    text: "Seguimiento con VP Sales sobre cuentas estratégicas en riesgo.",
    category: "meeting",
    owner: "COO",
    priority: "medium",
    createdAt: "2026-04-20T13:30:00.000Z",
  },
  {
    id: "entry-003",
    text: "Incidente de latencia en onboarding enterprise escalado por soporte.",
    category: "incident",
    owner: "CTO",
    priority: "high",
    createdAt: "2026-04-19T16:45:00.000Z",
  },
  {
    id: "entry-004",
    text: "Cliente pidió adelantar piloto regional para validar expansión LATAM.",
    category: "customer",
    owner: "CRO",
    priority: "medium",
    createdAt: "2026-04-18T11:15:00.000Z",
  },
];

export const seedActions: ActionItem[] = [
  {
    id: "action-001",
    title: "Actualizar forecast Q3 con escenario conservador",
    category: "finance",
    owner: "CFO",
    status: "assigned",
    priority: "high",
    nextStep: "Presentar versión final en staff del viernes.",
  },
  {
    id: "action-002",
    title: "Definir plan de mitigación para latencia en onboarding",
    category: "product",
    owner: "CTO",
    status: "pending",
    priority: "high",
    nextStep: "Acordar ventana de despliegue con ingeniería.",
  },
  {
    id: "action-003",
    title: "Confirmar agenda de revisión con cuentas en riesgo",
    category: "sales",
    owner: "VP Sales",
    status: "confirmed",
    priority: "medium",
    nextStep: "Enviar notas de reunión al comité comercial.",
  },
];
