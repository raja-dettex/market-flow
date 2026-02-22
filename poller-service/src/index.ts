import { Collection, Document, MongoClient } from 'mongodb';
import { Producer, QueueProducer } from './producer';

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://raja:block@mlmcluster.nr1hxjq.mongodb.net/?appName=mlmcluster';


type TriggerEvents = {
    id: string,
    op: string,
    updatedFields?: any,
    fullDocument?: Document
}

const connectToDbAndGetCollection = async (): Promise<Collection<Document>> => { 
    try { 
        const client = new MongoClient(mongoUri);
        await client.connect()
        const db = client.db("test");
        const collection = db.collection("workflows");
        return collection
    } catch(error) { 
        throw error
    }
}
const init = async () => { 
    const producer = new Producer('amqp://guest:guest@localhost:5672/');
    const workflowProducer = new QueueProducer('workflow-queue',producer);
    await workflowProducer.produce(JSON.stringify({ ping: true, at: Date.now() }));
    console.log("startup publish ok");
    const collection = await connectToDbAndGetCollection();
    const pipeline = [
        {
          $match: {
            operationType: { $in: ["insert", "update"] }
          }
        }
    ];
    
    const changeStream = collection.watch(pipeline);
    changeStream.on('change', async (changeEvent) => { 
        if(changeEvent.operationType === 'insert') { 
            // do something
            let id = changeEvent.documentKey._id;
            let doc = changeEvent.fullDocument;
            const createTriggerEvent: TriggerEvents = { 
                id: id.toString(),
                op: 'insert',
                fullDocument: doc
            }
            await workflowProducer.produce(JSON.stringify(createTriggerEvent))
        } else if (changeEvent.operationType === 'update') { 
            // do something
            let id = changeEvent.documentKey._id;
            let updatedFields = changeEvent.updateDescription.updatedFields;
            console.log(updatedFields);
            const updateTriggerEvent: TriggerEvents = { 
                id: id.toString(),
                op: 'udpate',
                updatedFields: updatedFields
            }
            console.log(updateTriggerEvent);
            await workflowProducer.produce(JSON.stringify(updateTriggerEvent))
            console.log('produced')
        }
    })
}

init().then(() => console.log('change stream captured has started succesfully')).catch(err => console.error(err))


// open connection to rabbitmq and channel to produce to rabbit queue 


