const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./cctv.db');
db.run("UPDATE settings SET value = '{\"lat\":-6.808694,\"lng\":107.649589,\"zoom\":13}' WHERE key = 'map_config'", (err) => {
  if (err) console.error(err);
  else console.log('Updated map config');
});
