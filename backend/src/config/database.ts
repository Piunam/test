import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer: MongoMemoryServer | null = null;

export async function connectDatabase(uri?: string) {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (uri) {
    await mongoose.connect(uri);
    return mongoose.connection;
  }

  memoryServer = await MongoMemoryServer.create();
  const memUri = memoryServer.getUri('bookit');
  await mongoose.connect(memUri);
  return mongoose.connection;
}

export async function disconnectDatabase() {
  await mongoose.connection.close();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
