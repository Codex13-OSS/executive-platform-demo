import { ActionItem, DashboardSummary, RawEntry } from '../../../shared/types';
import { config } from './config';

type EntryInput = Omit<RawEntry, 'id' | 'createdAt'>;

export type TrackingSummary = {
  total: number;
  assigned: number;
  pending: number;
  confirmed: number;
};

const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  meetingsToday: 5,
  activePending: 8,
  criticalAlerts: 2,
};

const STATUS_ROTATION: ActionItem['status'][] = ['assigned', 'pending', 'confirmed'];

function buildTrackingSummary(actions: ActionItem[]): TrackingSummary {
  return {
    total: actions.length,
    assigned: actions.filter((action) => action.status === 'assigned').length,
    pending: actions.filter((action) => action.status === 'pending').length,
    confirmed: actions.filter((action) => action.status === 'confirmed').length,
  };
}

function convertRawEntryToActions(entry: RawEntry): ActionItem[] {
  const chunks = entry.text
    .split('.')
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 3);

  const steps = chunks.length > 0 ? chunks : [entry.text.trim()];

  return steps.map((title, index) => ({
    id: `action-${entry.id}-${index + 1}`,
    title,
    category: entry.category,
    owner: entry.owner,
    status: STATUS_ROTATION[index % STATUS_ROTATION.length],
    priority: entry.priority,
    nextStep: `Coordinar seguimiento de “${title.slice(0, 42)}”.`,
  }));
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Demo API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (config.useMockData) {
    return MOCK_DASHBOARD_SUMMARY;
  }

  return requestJson<DashboardSummary>('/dashboard');
}

export async function createEntry(input: EntryInput): Promise<RawEntry> {
  if (config.useMockData) {
    return {
      ...input,
      id: `entry-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
  }

  return requestJson<RawEntry>('/entries', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function convertEntry(entry: RawEntry): Promise<ActionItem[]> {
  if (config.useMockData) {
    return convertRawEntryToActions(entry);
  }

  return requestJson<ActionItem[]>(`/entries/${entry.id}/convert`, {
    method: 'POST',
    body: JSON.stringify(entry),
  });
}

export async function getTracking(actions: ActionItem[]): Promise<TrackingSummary> {
  if (config.useMockData) {
    return buildTrackingSummary(actions);
  }

  return requestJson<TrackingSummary>('/tracking');
}

export async function resetDemoFlow(): Promise<void> {
  if (config.useMockData) {
    return;
  }

  await requestJson('/reset', {
    method: 'POST',
    body: JSON.stringify({}),
  });
}
