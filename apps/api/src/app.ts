import express from 'express';
import cors from 'cors';
import { logger } from '@tools-website/utils';
import authRoutes from './infrastructure/routes/auth.routes';
import userRoutes from './infrastructure/routes/user.routes';
import adminRoutes from './infrastructure/routes/admin.routes';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Request logging middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Routing
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled internal server error', err);
  res.status(500).json({ message: 'Something went wrong' });
});

export default app;
