import express from 'express';
import morgan from 'morgan';
import { authenticateToken } from './middlewares/authenticate.middleware.js';

// rutas
import usersRoutes from './routes/users.routes.js';
import authRoutes from './routes/auth.routes.js';
import tasksRoutes from './routes/tasks.routes.js';

const app = express();

// middlewares
app.use(morgan('dev'));
app.use(express.json());

// rutas
app.use('/api/login', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tasks', authenticateToken, tasksRoutes);

export default app;