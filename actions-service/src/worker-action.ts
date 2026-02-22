import { parentPort } from "node:worker_threads";

type TriggerType = 'price-trigger' | 'time-trigger';

type TimeTrigger = { timeInSeconds: number };
type PriceTrigger = { price: number, asset: string};

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
    | { kind: 'schedule', action: Action}
    | { kind: 'cancel', actionId: string}
    | { kind: 'shutdown'}

const timerLoop = new Map<string, {active: boolean, timeout: NodeJS.Timeout | undefined}>()

async function executeTasks(action : Action) { 
    console.log(`[worker] executing task of id: ${action.id}`)
    console.log('the tasks are')
    for(const task of action.task) { 
        console.log(task)
    }
}
function startTimerLoop(action: Action) { 
    const trigger = action.trigger as TimeTrigger;
    const delayMs = Math.max(1000, trigger.timeInSeconds * 1000);
    const state = { active: true, timeout: undefined as NodeJS.Timeout | undefined};
    timerLoop.set(action.id, state)
    const tick = async() => { 
        if(!state.active) return;
        await executeTasks(action);
        state.timeout = setTimeout(tick, delayMs);
    }
    state.timeout = setTimeout(tick, delayMs)
}


function stopTimeLoop(actionId: string) { 
    const state = timerLoop.get(actionId);
    if(state) { 
        state.active = false;
        if(state.timeout)  clearTimeout(state.timeout)
        timerLoop.delete(actionId)
    }
}


parentPort?.on('message', async (msg: WorkerMsg) => { 
    if(msg.kind === 'schedule') { 
        const action = msg.action;
        if(action.type === 'time-trigger') {
            stopTimeLoop(action.id) 
            startTimerLoop(action)
            return;
        }
        if( action.type == 'price-trigger') { 
            // execute once
            await executeTasks(action)
            return
        }     
    }
    if(msg.kind === 'cancel') { 
        stopTimeLoop(msg.actionId)
        return;
    }

    if(msg.kind === 'shutdown') { 
        for(const actionId in timerLoop.keys()) stopTimeLoop(actionId)
        process.exit(0)
    }
}) 