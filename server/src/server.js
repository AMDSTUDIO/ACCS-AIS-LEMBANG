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

app.get('/api/emergency-recover-api-v2', async (req, res) => {
  const dbModule = require('./db');
  const db = dbModule.db || dbModule;
  const sqlite3 = require('sqlite3').verbose();
  const directDb = new sqlite3.Database('./cctv.db');
  
  try {
    const axios = require('axios');
    const response = await axios.get('http://43.173.8.205:1984/api/streams');
    const streamsObj = response.data;
    
    if (!streamsObj) {
      return res.send("Gagal menarik data dari Go2RTC (Kosong)");
    }
    
    const streamKeys = Object.keys(streamsObj);
    let recovered = 0;
    
    directDb.serialize(() => {
      directDb.run("CREATE TABLE IF NOT EXISTS cameras (id TEXT PRIMARY KEY, name TEXT, location TEXT, rtsp_url TEXT, lat REAL, lng REAL, is_public INTEGER DEFAULT 0, channel INTEGER DEFAULT 0)");
      const stmt = directDb.prepare("INSERT OR REPLACE INTO cameras (id, name, location, rtsp_url, lat, lng, is_public, channel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      
      streamKeys.forEach((key, index) => {
        let name = key;
        if (name.startsWith('camera_')) name = name.replace('camera_', 'Camera ');
        
        let url = "";
        if (streamsObj[key] && streamsObj[key].producers && streamsObj[key].producers[0]) {
           url = streamsObj[key].producers[0].url;
        }
        
        const lat = -6.808722 + (Math.random() * 0.005 - 0.0025);
        const lng = 107.649002 + (Math.random() * 0.005 - 0.0025);
        
        stmt.run([key, name, 'Recovered Area', url, lat, lng, 1, index + 1]);
        recovered++;
      });
      
      stmt.finalize(() => {
        res.send("<h1>Berhasil memulihkan " + recovered + " kamera dari IP 43.173.8.205!</h1><a href='/monitor/map'>Kembali ke Peta</a>");
      });
    });
  } catch (err) {
    res.send("Gagal konek ke Go2RTC: " + err.message);
  }
});


app.get('/api/emergency-recover-api', async (req, res) => {
  const dbModule = require('./db');
  const db = dbModule.db || dbModule;
  const sqlite3 = require('sqlite3').verbose();
  const directDb = new sqlite3.Database('./cctv.db');
  
  try {
    const axios = require('axios');
    const response = await axios.get('http://127.0.0.1:1984/api/streams');
    const streamsObj = response.data;
    
    if (!streamsObj) {
      return res.send("Gagal menarik data dari Go2RTC (Kosong)");
    }
    
    const streamKeys = Object.keys(streamsObj);
    let recovered = 0;
    
    directDb.serialize(() => {
      directDb.run("CREATE TABLE IF NOT EXISTS cameras (id TEXT PRIMARY KEY, name TEXT, location TEXT, rtsp_url TEXT, lat REAL, lng REAL, is_public INTEGER DEFAULT 0, channel INTEGER DEFAULT 0)");
      const stmt = directDb.prepare("INSERT OR REPLACE INTO cameras (id, name, location, rtsp_url, lat, lng, is_public, channel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      
      streamKeys.forEach((key, index) => {
        let name = key;
        if (name.startsWith('camera_')) name = name.replace('camera_', 'Camera ');
        
        // Try to get original URL if it exists, otherwise just store the go2rtc internally
        let url = "";
        if (streamsObj[key] && streamsObj[key].producers && streamsObj[key].producers[0]) {
           url = streamsObj[key].producers[0].url;
        }
        
        const lat = -6.808722 + (Math.random() * 0.005 - 0.0025);
        const lng = 107.649002 + (Math.random() * 0.005 - 0.0025);
        
        stmt.run([key, name, 'Recovered Area', url, lat, lng, 1, index + 1]);
        recovered++;
      });
      
      stmt.finalize(() => {
        res.send("<h1>Berhasil memulihkan " + recovered + " kamera dari API Go2RTC!</h1><a href='/monitor/map'>Kembali ke Peta</a>");
      });
    });
  } catch (err) {
    res.send("Gagal konek ke Go2RTC: " + err.message);
  }
});


app.get('/api/emergency-recover-cams', (req, res) => {
  const dbModule = require('./db');
  const db = dbModule.db || dbModule;
  const sqlite3 = require('sqlite3').verbose();
  const directDb = new sqlite3.Database('./cctv.db');
  
  const axios = require('axios');
  
  // Try to read go2rtc.yaml
  let recovered = 0;
  try {
    const yaml = require('fs').readFileSync('go2rtc.yaml', 'utf8');
    const lines = yaml.split('\n');
    let inStreams = false;
    const streams = [];
    
    for (const line of lines) {
      if (line.trim() === 'streams:') {
        inStreams = true;
        continue;
      }
      if (inStreams && line.startsWith('  ') && line.includes(':')) {
        const id = line.split(':')[0].trim();
        const url = line.substring(line.indexOf(':') + 1).trim();
        if (id && url) {
          streams.push({ id, url });
        }
      } else if (inStreams && line.trim() && !line.startsWith('  ')) {
        inStreams = false;
      }
    }
    
    // Insert into DB
    directDb.serialize(() => {
      directDb.run("CREATE TABLE IF NOT EXISTS cameras (id TEXT PRIMARY KEY, name TEXT, location TEXT, rtsp_url TEXT, lat REAL, lng REAL, is_public INTEGER DEFAULT 0, channel INTEGER DEFAULT 0)");
      
      const stmt = directDb.prepare("INSERT OR REPLACE INTO cameras (id, name, location, rtsp_url, lat, lng, is_public, channel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      
      streams.forEach((s, index) => {
        let name = s.id;
        if (name.startsWith('camera_')) name = name.replace('camera_', 'Camera ');
        
        // Random coords around Lembang center
        const lat = -6.808722 + (Math.random() * 0.005 - 0.0025);
        const lng = 107.649002 + (Math.random() * 0.005 - 0.0025);
        
        stmt.run([s.id, name, 'Recovered Area', s.url, lat, lng, 1, index + 1]);
        recovered++;
      });
      
      stmt.finalize(() => {
        res.send("<h1>Berhasil memulihkan " + recovered + " kamera dari Go2RTC!</h1><a href='/monitor/map'>Kembali ke Peta</a>");
      });
    });
    
  } catch (err) {
    res.send("Gagal: " + err.message);
  }
});


app.get('/api/emergency-reset', (req, res) => {
  const bcrypt = require('bcryptjs');
  const db = require('./db').db || (require('./db') instanceof sqlite3 ? require('./db') : null);
  
  // Try direct sqlite connection if module export is weird
  const sqlite3 = require('sqlite3').verbose();
  const directDb = new sqlite3.Database('./cctv.db');
  
  directDb.serialize(() => {
    directDb.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password_hash TEXT, role TEXT, permissions TEXT)");
    
    const hash = bcrypt.hashSync('superadmin123', 10);
    directDb.get('SELECT * FROM users WHERE username = "superadmin"', [], (err, row) => {
      if (row) {
        directDb.run("UPDATE users SET password_hash = ? WHERE username = 'superadmin'", [hash], (err) => {
          res.send("<h1>Password direset ke: superadmin123</h1><a href='/'>Kembali ke Login</a>");
        });
      } else {
        directDb.run("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)", ['superadmin', hash, 'superadmin'], (err) => {
          res.send("<h1>Akun superadmin dibuat ulang dengan password: superadmin123</h1><a href='/'>Kembali ke Login</a>");
        });
      }
    });
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
