const axios = require('axios');
axios.post('http://localhost:5000/api/webrtc', {
  cameraId: 1,
  streamType: 'sub',
  type: 'offer',
  sdp: 'v=0\r\n'
}).then(console.log).catch(e => console.error(e.response ? e.response.data : e.message));
