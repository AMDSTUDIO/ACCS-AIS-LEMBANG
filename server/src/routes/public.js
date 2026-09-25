const express = require('express');
const { db } = require('../db');
const axios = require('axios');
const router = express.Router();

router.get('/cameras', (req, res) => {
  db.all('SELECT * FROM cameras WHERE is_public = 1', (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});


router.get('/running-text', (req, res) => {
  db.get('SELECT value FROM settings WHERE key = ?', ['running_text'], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ text: row ? JSON.parse(row.value) : 'SELAMAT DATANG DI SISTEM PEMANTAUAN CCTV AREA ACCS AIS LEMBANG' });
  });
});

router.get('/map-settings', (req, res) => {
  db.get('SELECT value FROM settings WHERE key = ?', ['map_center'], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(row ? JSON.parse(row.value) : { lat: -6.808722, lng: 107.649002, zoom: 19 });
  });
});

router.post('/webrtc', (req, res) => {
  const { cameraId, streamType, type, sdp } = req.body;
  
  db.get('SELECT * FROM cameras WHERE id = ? AND is_public = 1', [cameraId], (err, cam) => {
    if (err || !cam) return res.status(403).json({ error: 'Camera not found or not public' });
    
    db.get('SELECT * FROM settings WHERE key = ?', ['nvr_config'], async (err, row) => {
      let nvr = { ip: '127.0.0.1', user: 'admin', pass: 'admin123', port: 554 };
      if (row) nvr = JSON.parse(row.value);
      
      const subtype = streamType === 'sub' ? 1 : 0;
      let rtspUrl = cam.rtsp_url;
      if (!rtspUrl) {
        rtspUrl = `rtsp://${nvr.user}:${nvr.pass}@${nvr.ip}:${nvr.port}/cam/realmonitor?channel=${cam.channel}&subtype=${subtype}`;
      }
      
      try {
        const streamName = `cam_${cam.id}_${streamType}`;
        const addStreamUrl = `http://127.0.0.1:1984/api/streams?name=${streamName}&src=${encodeURIComponent(rtspUrl)}`;
        await axios.put(addStreamUrl);

        const go2rtcUrl = `http://127.0.0.1:1984/api/webrtc?src=${streamName}`;
        const response = await axios.post(go2rtcUrl, sdp, {
          headers: { 'Content-Type': 'application/sdp' }
        });
        
        let answerSdp = response.data;
        if (typeof response.data === 'object' && response.data.sdp) {
          answerSdp = response.data.sdp;
        }
        res.json({ type: 'answer', sdp: answerSdp });
      } catch (error) {
        res.status(500).json({ error: 'WebRTC negotiation failed' });
      }
    });
  });
});

module.exports = router;
