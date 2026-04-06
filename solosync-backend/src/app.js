const express = require('express');
const cors    = require('cors');

const authRoutes    = require('./routes/auth.routes');
const clientRoutes  = require('./routes/client.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes    = require('./routes/task.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

// ── MIDDLEWARE ──────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());        // parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// ── ROUTES ──────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/clients',  clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks',    taskRoutes);
app.use('/api/payments', paymentRoutes);

// ── HEALTH CHECK ────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── GLOBAL ERROR HANDLER ────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

module.exports = app;