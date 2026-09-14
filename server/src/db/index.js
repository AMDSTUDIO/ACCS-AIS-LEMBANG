const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './cctv.db';
const db = new sqlite3.Database(dbPath);

function initDb() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  
  db.exec(schema, (err) => {
    if (err) console.error("Error executing schema", err);
    else {
      db.get('SELECT * FROM users WHERE username = ?', ['admin'], (err, row) => {
        if (!row) {
          const hash = bcrypt.hashSync('admin123', 10);
          db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['admin', hash, 'admin']);
          
          const insertCam = db.prepare('INSERT INTO cameras (name, location, channel, lat, lng, is_active) VALUES (?, ?, ?, ?, ?, ?)');
          insertCam.run('Front Gate', 'Entrance', 1, -6.2000, 106.8166, 1);
          insertCam.run('Backyard', 'Rear', 2, -6.2010, 106.8170, 1);
          insertCam.run('Lobby', 'Indoors', 3, -6.1990, 106.8150, 1);
          insertCam.run('Parking Lot', 'Exterior', 4, -6.2020, 106.8180, 1);
          insertCam.finalize();
        }
      });
      db.get('SELECT * FROM users WHERE username = ?', ['superadmin'], (err, row) => {
        if (!row) {
          const hash = bcrypt.hashSync('superadmin123', 10);
          db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['superadmin', hash, 'superadmin']);
        }
      });
      db.get('SELECT * FROM settings WHERE key = ?', ['map_config'], (err, row) => {
        if (!row) {
          const defaultMapConfig = JSON.stringify({ lat: -6.2000, lng: 106.8166, zoom: 13 });
          db.run('INSERT INTO settings (key, value) VALUES (?, ?)', ['map_config', defaultMapConfig]);
        }
      });
    }
  });
}

module.exports = { db, initDb };
