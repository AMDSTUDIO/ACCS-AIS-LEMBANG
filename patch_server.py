import re

with open('server/src/server.js', 'r', encoding='utf-8') as f:
    content = f.read()

if 'cameraCheck' not in content:
    content = content.replace("const { initDb } = require('./db');", "const { initDb, db } = require('./db');\nconst { checkRtsp } = require('./utils/cameraCheck');")
    
    checker_code = """
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
          rtspUrl = tsp://:@:/cam/realmonitor?channel=&subtype=1;
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
"""
    
    content = content.replace("initDb();", "initDb();\n" + checker_code)

    with open('server/src/server.js', 'w', encoding='utf-8') as f:
        f.write(content)
