const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const cameraRoutes = require('./routes/cameras');
const settingsRoutes = require('./routes/settings');
const webrtcRoutes = require('./routes/webrtc');
const usersRoutes = require('./routes/users');
const publicRoutes = require('./routes/public');
const { initDb, db } = require('./db');
const { checkRtsp } = require('./utils/cameraCheck');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

initDb();

// Background job to check camera status
setInterval(() => {
  db.get('SELECT * FROM settings WHERE key = ?', ['nvr_config'], (err, row) => {
    let nvr = { ip: '127.0.0.1', user: 'admin', pass: 'admin123', port: 554 };
    if (row) nvr = JSON.parse(row.value);
    
    db.all('SELECT * FROM cameras', async (err, cameras) => {
      if (err || !cameras) return;
      
      for (const cam of cameras) {
        let rtspUrl = cam.rtsp_url;
        if (!rtspUrl) {
          rtspUrl = `rtsp://${nvr.user}:${nvr.pass}@${nvr.ip}:${nvr.port}/cam/realmonitor?channel=${cam.channel}&subtype=1`;
        }
        
        const isOnline = await checkRtsp(rtspUrl);
        const newStatus = isOnline ? 1 : 0;
        
        if (cam.is_active !== newStatus) {
          db.run('UPDATE cameras SET is_active = ? WHERE id = ?', [newStatus, cam.id]);
        }
      }
    });
  });
}, 60000); // Check every 60 seconds


app.use('/api/auth', authRoutes);
app.use('/api/cameras', cameraRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/webrtc', webrtcRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/public', publicRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
