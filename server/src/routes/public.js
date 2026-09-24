const express = require('express');
const { db } = require('../db');
const axios = require('axios');
const router = express.Router();

router.get('/cameras', (req, res) => {
  db.all('SELECT * FROM cameras WHERE location LIKE "%PUBLIC%" OR location LIKE "%KOMERSIAL%" LIMIT 2', (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

router.post('/webrtc', (req, res) => {
  const { cameraId, streamType, type, sdp } = req.body;
  
  db.get('SELECT * FROM cameras WHERE id = ? AND (location LIKE "%PUBLIC%" OR location LIKE "%KOMERSIAL%")', [cameraId], (err, cam) => {
    if (err || !cam) return res.status(403).json({ error: 'Camera not found or not public' });
    
    db.get('SELECT * FROM settings WHERE key = ?', ['nvr_config'], async (err, row) => {
      let nvr = { ip: '127.0.0.1', user: 'admin', pass: 'admin123', port: 554 };
      if (row) nvr = JSON.parse(row.value);
      
      const subtype = streamType === 'sub' ? 1 : 0;
      let rtspUrl = cam.rtsp_url;
      if (!rtspUrl) {
        rtspUrl = 
tsp://:@:/cam/realmonitor?channel=&subtype=;
      }
      
      try {
        const streamName = cam__;
        const addStreamUrl = http://127.0.0.1:1984/api/streams?name=&src=;
        await axios.put(addStreamUrl);

        const go2rtcUrl = http://127.0.0.1:1984/api/webrtc?src=;
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
