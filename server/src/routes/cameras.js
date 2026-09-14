const express = require('express');
const { db } = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  db.all('SELECT * FROM cameras', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows || []);
  });
});

router.post('/', (req, res) => {
  if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
  const { name, location, channel, lat, lng, rtsp_url } = req.body;
  const loc = location !== undefined ? location : '';
  db.run('INSERT INTO cameras (name, location, channel, lat, lng, rtsp_url) VALUES (?, ?, ?, ?, ?, ?)', 
    [name, loc, channel || 1, lat, lng, rtsp_url || ''], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ id: this.lastID });
  });
});

router.put('/:id', (req, res) => {
  if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
  const { name, location, channel, lat, lng, is_active, rtsp_url } = req.body;
  const active = is_active !== undefined ? is_active : 1;
  const loc = location !== undefined ? location : '';
  const rtsp = rtsp_url !== undefined ? rtsp_url : '';
  db.run('UPDATE cameras SET name=?, location=?, channel=?, lat=?, lng=?, is_active=?, rtsp_url=? WHERE id=?', 
    [name, loc, channel, lat, lng, active, rtsp, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
});

router.delete('/:id', (req, res) => {
  if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
  db.run('DELETE FROM cameras WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
});

module.exports = router;
