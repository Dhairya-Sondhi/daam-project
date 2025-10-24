from typing import Dict, Any, List
from threading import Lock
import queue
import time

class AgentBus:
    def __init__(self):
        self.subscribers: List[queue.Queue] = []
        self.lock = Lock()

    def subscribe(self) -> queue.Queue:
        q = queue.Queue(maxsize=1000)
        with self.lock:
            self.subscribers.append(q)
        return q

    def unsubscribe(self, q: queue.Queue):
        with self.lock:
            if q in self.subscribers:
                self.subscribers.remove(q)

    def publish(self, event: Dict[str, Any]):
        event.setdefault("ts", time.time())
        with self.lock:
            for q in list(self.subscribers):
                try:
                    q.put_nowait(event)
                except queue.Full:
                    try:
                        q.get_nowait()
                    except Exception:
                        pass
                    try:
                        q.put_nowait(event)
                    except Exception:
                        pass

class StatusStore:
    def __init__(self):
        self.lock = Lock()
        self.snapshot: Dict[str, Any] = {
            "status": "idle",
            "current_task": "None",
            "current_domain": "",
            "progress": {"done": 0, "total": 0},
            "last_score": None,
            "last_risk": None,
            "last_decision": None,
            "last_tx_hash": None
        }

    def update(self, patch: Dict[str, Any]):
        with self.lock:
            self.snapshot.update(patch)

    def get(self) -> Dict[str, Any]:
        with self.lock:
            return dict(self.snapshot)

agent_bus = AgentBus()
status_store = StatusStore()