import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db/connection';
import activityRoutes from './routes/activity.routes';
import adminRoutes from './routes/admin.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', activityRoutes);
app.use('/admin', adminRoutes);

// Initialize database and start server
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Principal Admin Portal backend running on port ${PORT}`);
        console.log(`API endpoints available at http://localhost:${PORT}/api`);
    });
}).catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
});

export default app;
