import { Channel } from "amqplib";
import { Consumer, QueueConsumer } from "./consumer";
import { ActionHandlerPool } from "./worker-pool";
type NodeType = TriggerType | ActionBlockType
type TriggerType = 'price-trigger' | 'time-trigger'
type ActionBlockType = 'hyperliquid' | 'bagpack' | 'lighter'
type TriggerEvents = {
    id: string,
    op: string,
    updatedFields?: any,
    fullDocument?: Document
}

export type PriceTriggerMetadata = { 
    asset: string,
    price: number
}
export type TimerMetadata = { 
    time: number
}
export type TradeActionMetadata = { 
    asset: string,
    amount: number,
    exchange: string,
    orderType: string
}
export type Kind = "action" | "trigger"
export type  Node =  {
    type: NodeType,  
    data: { 
        label: string,
        kind: Kind,
        metadata: TimerMetadata | PriceTriggerMetadata | TradeActionMetadata
    },
    id: string,
    position: { x: number, y: number },
}

type Document = { 
    triggerType: TriggerType,
    nodes: Node[]
}


type TradeType = 'Buy' | 'Sell' 

type TimeTrigger =  { 
    timeInSeconds: number
}

type PriceTrigger = { 
    price: number,
    asset: string
}

type Task = { 
    orderType: TradeType,
    asset: string,
    exchange: string,
    amount: number
}
type Action = { 
    id: string; 
    type: TriggerType,
    trigger: TimeTrigger | PriceTrigger,
    task: Task[]
}
const TASK_LIST = [];
const workerPool = new ActionHandlerPool();
const consumer = new Consumer('amqp://guest:guest@localhost:5672');
const queueConsumer = new QueueConsumer('workflow-queue', consumer);    
function recv_loop() { 
    console.log('starting receive loop')
    const callback = (msg: string, channel: Channel): void => {
        console.log(msg)
        const triggerEvent: TriggerEvents = JSON.parse(msg); 
        console.log(triggerEvent)
        if(triggerEvent.op === 'insert') { 
            if(triggerEvent.fullDocument) { 
                const type = triggerEvent.fullDocument.triggerType;
                let trigger;
                let tasks: Task[] = []
                for(let node of triggerEvent.fullDocument.nodes) { 
                    const nodeMeta = node.data.metadata;
                    if(node.type === 'price-trigger' && "asset" in nodeMeta && "price" in nodeMeta) { 
                        trigger = { 
                            asset: nodeMeta.asset,
                            price: nodeMeta.price
                        }
                    }else if(node.type === 'time-trigger' && "time" in nodeMeta) { 
                        trigger = { 
                            timeInSeconds: nodeMeta.time
                        }
                    } else if((node.type === 'bagpack' || node.type === 'hyperliquid' || node.type === 'lighter') 
                        && 'exchange' in nodeMeta && 'amount' in nodeMeta && 'orderType' in nodeMeta && 'asset' in nodeMeta) { 
                        tasks.push({
                            exchange: nodeMeta.exchange,
                            amount: nodeMeta.amount,
                            orderType: (nodeMeta.orderType === 'buy')?'Buy':'Sell',
                            asset: nodeMeta.asset
                        })
                    }
                }
                if(trigger !== undefined) { 
                    const action: Action = { 
                        id: Math.random().toString(),
                        type: type, 
                        trigger: trigger,
                        task: tasks
                    }
                    workerPool.dispatch(action)
                }
            }
        }
    }
    queueConsumer.consume(callback).catch(err => console.error(err))
}

recv_loop()

