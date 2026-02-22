import { once } from 'node:events';
import { Channel, ChannelModel, Options, connect } from 'amqplib';


type QueuedPool = { 
    channels: Channel[],
    inflightCreates: Promise<Channel>[],
    rrIndex: number
}

export interface IProducer {
  produceToqueue: (queue: string, msg: string) => Promise<void>;
}

export interface IQueueProducer {
  readonly queue: string;
  produce: (msg: string) => Promise<void>;
}

export class QueueProducer implements IQueueProducer { 
    constructor(readonly queue: string, private readonly producer: IProducer) { }
    async produce(msg: string) : Promise<void> { 
        await this.producer.produceToqueue(this.queue, msg)
   }
}

export class Producer implements IProducer { 
    private connection : ChannelModel | undefined;
    private connectionPromise: Promise<ChannelModel> | undefined;
    private pools  = new Map<String, QueuedPool>;
    private readonly poolSizePerQueue = 4;
    private readonly queueOptions: Options.AssertQueue = { durable: true };
    
    constructor(private readonly uri: string) { }

    async produceToqueue(queue: string, msg: string) { 
        const channel = await this.acquireChannel(queue);
        await channel.assertQueue(queue, this.queueOptions);
        const ok = channel.sendToQueue(queue, Buffer.from(msg), {persistent: true});
        console.log(ok)
        if(!ok) { 
            await once(channel, 'drain')            
        }
        console.log('waiting for confirmation');    
    }

    async  ensureConnection(): Promise<ChannelModel> { 
        if(this.connection) { 
            return this.connection
        }
        if(!this.connectionPromise) { 
            // open connectio and send
            this.connectionPromise = connect(this.uri)
                .then(connection => { 
                    connection.on('close', () => { 
                        this.connection = undefined;
                        this.connectionPromise = undefined;
                        this.pools.clear()
                    })
                    connection.on('error', () => { 
                        this.connection = undefined;
                        this.connectionPromise = undefined;
                        this.pools.clear();
                    })
                    return connection
                }).catch(err => { throw err; } )
        }
        this.connection = await this.connectionPromise;
        return this.connection;
    }

    getOrCreatePool(queue: string): QueuedPool { 
        let pool = this.pools.get(queue);
        if(!pool) { 
            pool  = { channels: [], inflightCreates: [], rrIndex: 0}
            this.pools.set(queue, pool)
        }
        return pool
    }

    private async acquireChannel(queue: string): Promise<Channel> {
        const pool = this.getOrCreatePool(queue);
    
        // Fast path: pool already warmed.
        if (pool.channels.length >= this.poolSizePerQueue) {
          const ch = pool.channels[pool.rrIndex % pool.channels.length];
          pool.rrIndex = (pool.rrIndex + 1) % pool.channels.length;
          if(ch !== undefined) return ch
        }
    
        // Need to grow pool. Cap concurrent creates to remaining slots.
        const slotsLeft = this.poolSizePerQueue - (pool.channels.length + pool.inflightCreates.length);
        if (slotsLeft > 0) {
          const createP = this.createChannel(queue, pool).finally(() => {
            const i = pool.inflightCreates.indexOf(createP);
            if (i >= 0) pool.inflightCreates.splice(i, 1);
          });
          pool.inflightCreates.push(createP);
        }
    
        // If we already have any channel, use RR immediately; otherwise await first create.
        if (pool.channels.length > 0) {
          const ch = pool.channels[pool.rrIndex % pool.channels.length];
          pool.rrIndex = (pool.rrIndex + 1) % pool.channels.length;
          if(ch !== undefined) return ch;
        }
    
        const ch = pool.inflightCreates[0];
        if(ch !== undefined) return ch
        throw new Error("failed to acquire channel")
    }
    private async createChannel(queue: string, pool: QueuedPool) { 
        const conn = await this.ensureConnection();
        const ch = await conn.createConfirmChannel();
        await ch.assertQueue(queue, this.queueOptions);

        const invalidate = () => {
        const i = pool.channels.indexOf(ch);
        if (i >= 0) pool.channels.splice(i, 1);
        };

        ch.on('close', invalidate);
        ch.on('error', invalidate);
        console.log("Channel created for queue:", queue);
        pool.channels.push(ch);
        return ch;
    }


    async close() { 
        const allChannels = Array.from(this.pools.values()).flatMap(p => p.channels);
        this.pools.clear();
        await Promise.allSettled(allChannels.map(ch => ch.close()))
        if(this.connection) { 
            await this.connection.close().catch(err => undefined);
            this.connection = undefined;
            this.connectionPromise = undefined;
        }
    }
}