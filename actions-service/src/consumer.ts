import { Channel, ChannelModel, connect, Connection, Options } from 'amqplib';


export interface IQueueConsumer { 
    consume: (callback: (msg: string) => void) => Promise<void>
    consume_batch: () => Promise<string[]>    
}

export class QueueConsumer implements IQueueConsumer { 

    constructor(private readonly queue: string, private readonly consumer: IConsumer) {}
    async consume(callback: (msg: string, channel:Channel) => void) { 
        await this.consumer.consume(this.queue, callback);
    }

    async consume_batch() { 
        return ['']
    }
}


export interface IConsumer { 
    consume: (queue: string, callback: (msg: string, channel: Channel) => void) => Promise<void>
}

// todo grab an exclusive lock on each channel while conusming or mutating channel buffer through manual ack
// to avoid potential race conditions;
type QueuePool = { 
    channels: Channel[],
    inflightCreates: Promise<Channel>[],
    rrIndex: number  
}

export class Consumer implements IConsumer { 
    private connection: ChannelModel | undefined;
    private connectionPromise: Promise<ChannelModel> | undefined;
    private pool: Map<string, QueuePool> = new Map()
    private readonly poolSizePerQueue = 4;
    private readonly queueOptions: Options.AssertQueue = { durable: true };

    constructor(private readonly uri: string) {
        // const pool  = this.getOrCreatePool('workflow-queue')
    }


    async consume(queue: string, callback: (msg: string, channel: Channel)=>void) { 
        //console.log('consuming')
        const chPromise = this.acquireChannel(queue);
        //console.log('channel pending to be resolved')
        //console.log(chPromise)
        const channel = await chPromise
        console.log('channel created and starting to consume')
        const reply = await channel.consume(queue, (msg) => { 
            if(msg) { 
                console.log(msg)
                callback(msg.content.toString(),channel)
                channel.ack(msg)
            }
        })
        console.log('reply from broker pipe ')
        console.log(reply)
    }
    private getOrCreatePool(queue: string) : QueuePool {
        let pool = this.pool.get(queue);
        if(pool !== undefined) return pool;
        console.log('creating pool')
        pool = { channels: [], inflightCreates: [], rrIndex: 0};
        this.pool.set(queue, pool)
        return pool
    }

    private async acquireChannel(queue: string): Promise<Channel> { 
        const pool = this.getOrCreatePool(queue);
        // console.log(pool)
        // Fast path: pool already warmed.
        if (pool.channels.length >= this.poolSizePerQueue) {
            const ch = pool.channels[pool.rrIndex % pool.channels.length];
            console.log(ch)
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
            console.log(ch)
            if(ch !== undefined) return ch;
        }
    
        const ch = pool.inflightCreates[0];
        //console.log(ch)
        if(ch !== undefined) return ch
        throw new Error("failed to acquire channel")
    }

    private async createChannel(queue: string, pool: QueuePool) { 
        console.log('creating channel')
        const conn = await this.ensureConnection();
        console.log('resolved the connection')
        const ch = await conn.createConfirmChannel();
        await ch.assertQueue(queue, this.queueOptions);
        console.log('asserted')
        const invalidate = () => {
            const i = pool.channels.indexOf(ch);
            if (i >= 0) pool.channels.splice(i, 1);
        };

        ch.on('close', invalidate);
        ch.on('error', invalidate);

        pool.channels.push(ch);
        console.log(pool.channels.length)
        return ch;
    }

    async  ensureConnection(): Promise<ChannelModel> { 
        if(this.connection) { 
            console.log('returning from here')
            return this.connection
        }
        if(!this.connectionPromise) { 
            console.log('opening connection')
            // open connectio and send
            console.log(this.uri);
            this.connectionPromise = connect(this.uri)
                .then(connection => { 
                    console.log('connected')
                    connection.on('close', () => { 
                        this.connection = undefined;
                        this.connectionPromise = undefined;
                        this.pool.clear()
                    })
                    connection.on('error', () => { 
                            this.connection = undefined;
                            this.connectionPromise = undefined;
                        this.pool.clear();
                    })
                    return connection
                }).catch(err =>  { 
                    console.error(err);
                    throw err
                } )
        }
        console.log('awaiting to be connected')
        this.connection = await this.connectionPromise;
        console.log('connected')
        return this.connection;
    }
}