import 'dotenv/config';

const required = ['MONGODB_URI'];

for (const key of required) {
  if (!process.env[key] && process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error(`[config] Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  dnsServers: process.env.DNS_SERVERS
    ? process.env.DNS_SERVERS.split(',').map((server) => server.trim()).filter(Boolean)
    : [],
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100,
};
