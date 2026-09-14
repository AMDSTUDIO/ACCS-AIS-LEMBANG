const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const cameraRoutes = require('./routes/cameras');
const settingsRoutes = require('./routes/settings');
const webrtcRoutes = require('./routes/webrtc');
const { initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

initDb();

app.use('/api/auth', authRoutes);
app.use('/api/cameras', cameraRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/webrtc', webrtcRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
