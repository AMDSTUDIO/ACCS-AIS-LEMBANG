const fs = require('fs');
const content = fs.readFileSync('server/src/server.js', 'utf8');

const injection = `
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
    const lines = yaml.split('\\n');
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
`;

if (!content.includes('/api/emergency-recover-cams')) {
  const newContent = content.replace("app.use('/api/public', publicRoutes);", "app.use('/api/public', publicRoutes);\n" + injection);
  fs.writeFileSync('server/src/server.js', newContent);
}
