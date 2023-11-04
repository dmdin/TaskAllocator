import mongoose, {  Connection, ConnectionStates, type ConnectOptions } from 'mongoose';


export async function ensureConnected(): Promise<void> {
    if(mongoose.connection.readyState != ConnectionStates.connected)
    {
        await mongoose.connect('mongodb://root:password@193.104.57.178:27017', {dbName: "task-allocator"} as ConnectOptions);
    }
}
