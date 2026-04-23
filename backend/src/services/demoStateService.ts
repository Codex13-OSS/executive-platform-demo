import type { ActionItem, DashboardSummary, RawEntry } from "../../../shared/types";
import { addActions, addEntry, getState, resetState } from "../store/memoryStore";

type CreateEntryInput = Pick<RawEntry, "text" | "category" | "owner" | "priority">;

type ConvertEntryResult =
  | { found: false }
  | {
      found: true;
      entryId: string;
      createdActions: ActionItem[];
    };

const nowIso = (): string => new Date().toISOString();

const buildEntryId = (existingEntries: RawEntry[]): string => {
  const nextId = existingEntries.length + 1;
  return `entry-${String(nextId).padStart(3, "0")}`;
};

const buildActionId = (existingActionsCount: number, offset: number): string => {
  const nextId = existingActionsCount + offset + 1;
  return `action-${String(nextId).padStart(3, "0")}`;
};

const buildActionTitle = (entry: RawEntry, step: number): string => {
  const normalizedText = entry.text.trim();

  if (step === 1) {
    return `Analizar: ${normalizedText}`;
  }

  if (step === 2) {
    return `Alinear responsables para ${entry.category}`;
  }

  return `Confirmar cierre ejecutivo con ${entry.owner}`;
};

const buildActionStatuses = (priority: RawEntry["priority"]): ActionItem["status"][] => {
  if (priority === "high") {
    return ["assigned", "pending", "pending"];
  }

  if (priority === "medium") {
    return ["pending", "confirmed"];
  }

  return ["confirmed"];
};

const buildActionNextStep = (entry: RawEntry, step: number): string => {
  if (step === 1) {
    return `Revisar contexto de '${entry.category}' y preparar propuesta hoy.`;
  }

  if (step === 2) {
    return `Coordinar actualización con ${entry.owner} y registrar avances.`;
  }

  return `Compartir resultado final con comité ejecutivo.`;
};

export const getDashboardSummary = (): DashboardSummary => {
  const { entries, actions } = getState();

  const meetingsToday = entries.filter((entry) => entry.category === "meeting").length;
  const activePending = actions.filter(
    (action) => action.status === "pending" || action.status === "assigned",
  ).length;
  const criticalAlerts = actions.filter((action) => action.priority === "high").length;

  return {
    meetingsToday,
    activePending,
    criticalAlerts,
  };
};

export const getTracking = (): ActionItem[] => {
  const { actions } = getState();
  return actions;
};

export const createEntry = (input: CreateEntryInput): RawEntry => {
  const { entries } = getState();

  const createdEntry: RawEntry = {
    id: buildEntryId(entries),
    createdAt: nowIso(),
    ...input,
  };

  return addEntry(createdEntry);
};

export const convertEntryToActions = (entryId: string): ConvertEntryResult => {
  const { entries, actions } = getState();
  const entry = entries.find((currentEntry) => currentEntry.id === entryId);

  if (!entry) {
    return { found: false };
  }

  const statuses = buildActionStatuses(entry.priority);
  const createdActions = statuses.map((status, index): ActionItem => {
    const step = index + 1;

    return {
      id: buildActionId(actions.length, index),
      title: buildActionTitle(entry, step),
      category: entry.category,
      owner: entry.owner,
      status,
      priority: entry.priority,
      nextStep: buildActionNextStep(entry, step),
    };
  });

  const savedActions = addActions(createdActions);

  return {
    found: true,
    entryId,
    createdActions: savedActions,
  };
};

export const resetDemoState = (): void => {
  resetState();
};
