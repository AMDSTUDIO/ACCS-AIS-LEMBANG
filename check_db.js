const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./server/database.sqlite');
db.all('SELECT * FROM settings', [], (err, rows) => {
  console.log(rows);
});
