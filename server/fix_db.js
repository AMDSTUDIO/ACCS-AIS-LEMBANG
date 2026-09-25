const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cctv.db');
db.run("DELETE FROM settings WHERE key = 'running_text'", (err) => {
  if (err) console.error(err); else console.log("CLEARED");
});
