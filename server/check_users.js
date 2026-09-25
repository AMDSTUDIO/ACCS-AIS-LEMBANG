const sqlite3 = require('sqlite3').verbose();
const dbPath = './cctv.db';
const db = new sqlite3.Database(dbPath, (err) => {
  db.all("SELECT username, role FROM users", (err, rows) => {
    console.log(rows);
  });
});
