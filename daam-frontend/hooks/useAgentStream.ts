"use client";
import { useEffect, useRef, useState } from "react";

export type AgentSnapshot = {
  status: "idle" | "running" | "stopped" | "completed" | string;
  current_task: string;
  current_domain: string;
  progress: { done: number; total: number };
  last_score: number | null;
  last_risk: number | null;
  last_decision: string | null;
  last_tx_hash: string | null;
};

export type AgentEvent =
  | { type: "snapshot"; [k: string]: any }
  | { type: "step"; step: string; domain?: string; message?: string; ts?: number }
  | { type: "domains"; domains: string[]; ts?: number }
  | { type: "score"; domain: string; score: number; ts?: number }
  | { type: "risk"; domain: string; risk: number; ts?: number }
  | { type: "decision"; domain: string; decision: string; score: number; risk: number; ts?: number }
  | { type: "tx_sending"; domain: string; value_eth: number; ts?: number }
  | { type: "tx_hash"; domain: string; tx_hash: string; ts?: number }
  | { type: "tx_confirmed"; domain: string; tx_hash: string; block: number; ts?: number }
  | { type: "progress"; done: number; total: number; ts?: number }
  | { type: "complete"; message?: string; ts?: number };

export function useAgentStream(baseUrl?: string) {
  const url = baseUrl || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const [status, setStatus] = useState<AgentSnapshot>({
    status: "idle",
    current_task: "None",
    current_domain: "",
    progress: { done: 0, total: 0 },
    last_score: null,
    last_risk: null,
    last_decision: null,
    last_tx_hash: null,
  });
  const [feed, setFeed] = useState<AgentEvent[]>([]);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource(`${url}/agent/stream`, { withCredentials: false });
    esRef.current = es;

    const push = (evt: AgentEvent) => {
      setFeed((prev) => [evt, ...prev].slice(0, 200));
    };

    const setStatusMerge = (patch: Partial<AgentSnapshot>) => {
      setStatus((prev) => ({ ...prev, ...patch }));
    };

    es.addEventListener("snapshot", (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setStatusMerge(data);
      push({ type: "snapshot", ...data } as AgentEvent);
    });

    es.addEventListener("step", (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setStatusMerge({
        status: "running",
        current_task: data.step,
        current_domain: data.domain || status.current_domain,
      });
      push({ type: "step", ...data } as AgentEvent);
    });

    es.addEventListener("domains", (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setStatusMerge({ progress: { done: 0, total: (data.domains || []).length } });
      push({ type: "domains", ...data } as AgentEvent);
    });

    es.addEventListener("score", (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setStatusMerge({ last_score: data.score });
      push({ type: "score", ...data } as AgentEvent);
    });

    es.addEventListener("risk", (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setStatusMerge({ last_risk: data.risk });
      push({ type: "risk", ...data } as AgentEvent);
    });

    es.addEventListener("decision", (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setStatusMerge({ last_decision: data.decision });
      push({ type: "decision", ...data } as AgentEvent);
    });

    es.addEventListener("tx_hash", (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setStatusMerge({ last_tx_hash: data.tx_hash });
      push({ type: "tx_hash", ...data } as AgentEvent);
    });

    es.addEventListener("progress", (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setStatusMerge({ progress: { done: data.done, total: data.total } });
      push({ type: "progress", ...data } as AgentEvent);
    });

    es.addEventListener("tx_confirmed", (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      push({ type: "tx_confirmed", ...data } as AgentEvent);
    });

    es.addEventListener("complete", (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setStatusMerge({ status: "completed", current_task: "None", current_domain: "" });
      push({ type: "complete", ...data } as AgentEvent);
    });

    es.onerror = () => {
      // EventSource auto-reconnects; keep silent
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [url]);

  // Optional resilience: periodic snapshot refresh
  useEffect(() => {
    const t = setInterval(async () => {
      try {
        const res = await fetch(`${url}/agent/status`);
        if (res.ok) {
          const data = await res.json();
          setStatus((prev) => ({ ...prev, ...data }));
        }
      } catch {}
    }, 15000);
    return () => clearInterval(t);
  }, [url]);

  return { status, feed, backendUrl: url };
}
