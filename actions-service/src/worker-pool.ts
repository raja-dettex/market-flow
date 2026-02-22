import { Worker } from "worker_threads";
import path from 'node:path';


type TriggerType = "price-trigger" | "time-trigger";
type TimeTrigger = { timeInSeconds: number };
type PriceTrigger = { price: number; asset: string };
type Task = {
  orderType: "Buy" | "Sell";
  asset: string;
  exchange: string;
  amount: number;
};
type Action = {
  id: string;
  type: TriggerType;
  trigger: TimeTrigger | PriceTrigger;
  task: Task[];
};

type WorkerMsg =
  | { kind: "schedule"; action: Action }
  | { kind: "cancel"; actionId: string }
  | { kind: "shutdown" };


export class ActionHandlerPool { 
    private workers: Worker[] = [];
    private inflight = new Map<number, number>();
    private stickyWorkerToAction = new Map<string, number>() // this is for time affinity


    constructor(private readonly poolSize = 4) { 
        const workerPath = path.resolve(__dirname, "worker-action.js");
        for(let i = 0; i < poolSize; i++) { 
            const worker = new Worker(workerPath);
            this.workers.push(worker);
            this.inflight.set(i, 0)
        }
    }

    private pickLessBusy(): number { 
        let best = 0; 
        let bestLoad = Number.MAX_SAFE_INTEGER;
        for ( let i = 0; i < this.workers.length; i++) { 
            let load = this.inflight.get(i) ?? 0;
            if(load < bestLoad) { 
                bestLoad = load;
                best = i
            }
        }

        return best;
    }


    dispatch(action: Action) { 
        let workerIdx : number;
        if(action.type === 'time-trigger') { 
            workerIdx = this.stickyWorkerToAction.get(action.id) ?? this.pickLessBusy();
            this.stickyWorkerToAction.set(action.id, workerIdx)
        } else { 
            workerIdx = this.pickLessBusy()
        }

        this.inflight.set(workerIdx, this.inflight.get(workerIdx) ?? 0 + 1);
        this.workers[workerIdx]?.postMessage({kind: 'schedule', action} satisfies WorkerMsg)


        // prototype simplification: decrement immediately after post
        this.inflight.set(workerIdx, Math.max(0, (this.inflight.get(workerIdx) ?? 1) - 1));

    }

    cancel(actionId: string) { 
        const workerIdx = this.stickyWorkerToAction.get(actionId);
        if(workerIdx === undefined) return;
        this.workers[workerIdx]?.postMessage({kind: 'cancel', actionId} satisfies WorkerMsg);
        this.stickyWorkerToAction.delete(actionId)
    }

    shutdown() { 
        for(const worker of this.workers) { 
            worker.postMessage({kind: 'shutdown'} satisfies WorkerMsg)
        }
    }
}