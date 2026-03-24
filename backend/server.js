const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const entryRoutes = require('./routes/entries');
const activityRoutes = require('./routes/activities');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/activities', activityRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Daily API running' }));

app.listen(PORT, () => {
  console.log(`Daily API server running on http://localhost:${PORT}`);
});
