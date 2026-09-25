const fs = require('fs');
const content = fs.readFileSync('server/src/server.js', 'utf8');

const injection = `
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
`;

if (!content.includes('/api/emergency-reset')) {
  const newContent = content.replace("app.use('/api/public', publicRoutes);", "app.use('/api/public', publicRoutes);\n" + injection);
  fs.writeFileSync('server/src/server.js', newContent);
}
