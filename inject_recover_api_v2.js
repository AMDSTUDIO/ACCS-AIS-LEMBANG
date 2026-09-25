const fs = require('fs');
const content = fs.readFileSync('server/src/server.js', 'utf8');

const betterInjection = `
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
`;

if (!content.includes('/api/emergency-recover-api-v2')) {
  const newContent = content.replace("app.use('/api/public', publicRoutes);", "app.use('/api/public', publicRoutes);\n" + betterInjection);
  fs.writeFileSync('server/src/server.js', newContent);
}
