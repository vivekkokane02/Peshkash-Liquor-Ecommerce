import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

export async function connectDB() {
  try {
    if (env.dnsServers.length > 0) {
      dns.setServers(env.dnsServers);
    }
    await mongoose.connect(env.mongoUri);
    // eslint-disable-next-line no-console
    console.log(`[db] Connected to MongoDB (${env.nodeEnv})`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[db] MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
