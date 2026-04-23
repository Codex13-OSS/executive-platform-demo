import type { ActionItem, RawEntry } from "../../../shared/types";
import { seedActions, seedEntries } from "../data/seed";

type DemoState = {
  entries: RawEntry[];
  actions: ActionItem[];
};

const cloneEntries = (entries: RawEntry[]): RawEntry[] => entries.map((entry) => ({ ...entry }));
const cloneActions = (actions: ActionItem[]): ActionItem[] => actions.map((action) => ({ ...action }));

const buildSeedState = (): DemoState => ({
  entries: cloneEntries(seedEntries),
  actions: cloneActions(seedActions),
});

let state: DemoState = buildSeedState();

export const getState = (): DemoState => ({
  entries: cloneEntries(state.entries),
  actions: cloneActions(state.actions),
});

export const resetState = (): DemoState => {
  state = buildSeedState();
  return getState();
};

export const setEntries = (entries: RawEntry[]): RawEntry[] => {
  state.entries = cloneEntries(entries);
  return cloneEntries(state.entries);
};

export const setActions = (actions: ActionItem[]): ActionItem[] => {
  state.actions = cloneActions(actions);
  return cloneActions(state.actions);
};

export const addEntry = (entry: RawEntry): RawEntry => {
  state.entries.push({ ...entry });
  return { ...entry };
};

export const addActions = (actions: ActionItem[]): ActionItem[] => {
  const nextActions = cloneActions(actions);
  state.actions.push(...nextActions);
  return cloneActions(nextActions);
};
