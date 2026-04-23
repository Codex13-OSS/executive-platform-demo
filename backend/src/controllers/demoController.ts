import type { Request, Response } from "express";
import type { RawEntry } from "../../../shared/types";
import {
  convertEntryToActions,
  createEntry,
  getDashboardSummary,
  getTracking,
  resetDemoState,
} from "../services/demoStateService";

type CreateEntryBody = Pick<RawEntry, "text" | "category" | "owner" | "priority">;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isValidPriority = (
  value: unknown,
): value is CreateEntryBody["priority"] => value === "low" || value === "medium" || value === "high";

const validateCreateEntryBody = (
  body: unknown,
): { valid: true; data: CreateEntryBody } | { valid: false; message: string } => {
  if (typeof body !== "object" || body === null) {
    return { valid: false, message: "Body must be a JSON object." };
  }

  const payload = body as Partial<CreateEntryBody>;

  if (!isNonEmptyString(payload.text)) {
    return { valid: false, message: "Field 'text' is required and must be a non-empty string." };
  }

  if (!isNonEmptyString(payload.category)) {
    return { valid: false, message: "Field 'category' is required and must be a non-empty string." };
  }

  if (!isNonEmptyString(payload.owner)) {
    return { valid: false, message: "Field 'owner' is required and must be a non-empty string." };
  }

  if (!isValidPriority(payload.priority)) {
    return { valid: false, message: "Field 'priority' is required and must be one of: low, medium, high." };
  }

  return {
    valid: true,
    data: {
      text: payload.text,
      category: payload.category,
      owner: payload.owner,
      priority: payload.priority,
    },
  };
};

export const getDashboardHandler = (_req: Request, res: Response): void => {
  res.status(200).json(getDashboardSummary());
};

export const getTrackingHandler = (_req: Request, res: Response): void => {
  res.status(200).json(getTracking());
};

export const createEntryHandler = (req: Request, res: Response): void => {
  const validation = validateCreateEntryBody(req.body);

  if (!validation.valid) {
    res.status(400).json({ error: validation.message });
    return;
  }

  const createdEntry = createEntry(validation.data);
  res.status(201).json(createdEntry);
};

export const convertEntryHandler = (req: Request, res: Response): void => {
  const entryId = req.params.id;
  const result = convertEntryToActions(entryId);

  if (!result.found) {
    res.status(404).json({ error: "Entry not found." });
    return;
  }

  res.status(200).json({
    entryId: result.entryId,
    createdActions: result.createdActions,
  });
};

export const resetDemoStateHandler = (_req: Request, res: Response): void => {
  resetDemoState();
  res.status(200).json({ ok: true });
};
