const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const hash = bcrypt.hashSync('superadmin123', 10);

function resetDb(dbPath) {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) return;
    db.run("UPDATE users SET password_hash = ? WHERE username = 'superadmin'", [hash], function(err) {
      if (!err) console.log('Password reset in:', dbPath);
    });
  });
}

resetDb('cctv.db');
resetDb('server/cctv.db');
resetDb('server/src/cctv.db');
