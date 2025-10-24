export type Progress = { done: number; total: number };
export type AgentStatus = "idle" | "running" | "stopped" | "completed" | string;
export interface AgentSnapshot {
  status: AgentStatus;
  current_task: string;
  current_domain: string;
  progress: Progress;
  last_score: number | null;
  last_risk: number | null;
  last_decision: string | null;
  last_tx_hash: string | null;
}
