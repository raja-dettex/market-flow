import mongoose from 'mongoose';
import { UserModel } from './schema/user';
import { WorkflowModel } from './schema/workflow';

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://raja:block@mlmcluster.nr1hxjq.mongodb.net/?appName=mlmcluster';

export async function connect(): Promise<string> {
    console.log("Connecting to mongo client")
    await mongoose.connect(mongoUri)
    console.log('created connection')   
    await UserModel.createCollection(); 
    await WorkflowModel.createCollection(); 
    return 'done'
}
