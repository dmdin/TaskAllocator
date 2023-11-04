import { MONGO_CONNECTION_STRING } from '$env/static/private';
import mongoose, { ConnectionStates, type ConnectOptions } from 'mongoose';



export async function ensureConnected(target: any, propertyKey: string, descriptor: PropertyDescriptor)  {
    if(mongoose.connection.readyState != ConnectionStates.connected)
    {
        await mongoose.connect(MONGO_CONNECTION_STRING, {dbName: "task-allocator"} as ConnectOptions);
    }
  
    return descriptor.value;
  }
