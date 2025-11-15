import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './core/errors/errorHandler.js';

import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import propertyRoutes from './modules/properties/property.routes.js';

const app = express();

// Security middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger
app.use(morgan('dev'));

// CORS
app.use(cors({ origin: '*', credentials: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;