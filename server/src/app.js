import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import productRoutes from './routes/productRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());

  const allowedOrigins = env.clientUrl.split(',').map((o) => o.trim());
  app.use(cors());
  app.use(
    cors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    })
  );

  app.use(express.json({ limit: '100kb' }));

  if (env.nodeEnv !== 'test') {
    app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
  }

  // Rate limit write operations only — reads (catalog browsing) stay unrestricted.
  const writeLimiter = rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.', error: { code: 'RATE_LIMITED' } },
  });
  app.use(['/api/products'], (req, res, next) => {
    if (req.method === 'GET') return next();
    return writeLimiter(req, res, next);
  });

  app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'OK', data: { uptime: process.uptime() } });
  });

  app.use('/api/products', productRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
