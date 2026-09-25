const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const dbPath = './cctv.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening db', err);
    return;
  }
  const hash = bcrypt.hashSync('superadmin123', 10);
  db.run("UPDATE users SET password_hash = ? WHERE username = 'superadmin'", [hash], function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Password reset for superadmin to: superadmin123');
    }
  });
});
