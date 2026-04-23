export type DashboardSummary = {
  meetingsToday: number;
  activePending: number;
  criticalAlerts: number;
};

export type RawEntry = {
  id: string;
  text: string;
  category: string;
  owner: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
};

export type ActionItem = {
  id: string;
  title: string;
  category: string;
  owner: string;
  status: "assigned" | "pending" | "confirmed";
  priority: "low" | "medium" | "high";
  nextStep: string;
};
