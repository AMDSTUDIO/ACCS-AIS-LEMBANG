const net = require('net');

async function checkRtsp(url) {
  return new Promise((resolve) => {
    try {
      const match = url.match(/rtsp:\/\/(?:[^:]+:[^@]+@)?([^:/]+)(?::(\d+))?/);
      if (!match) return resolve(false);
      
      const host = match[1];
      const port = match[2] ? parseInt(match[2]) : 554;
      
      const socket = new net.Socket();
      socket.setTimeout(2000);
      
      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });
      
      socket.on('error', () => {
        socket.destroy();
        resolve(false);
      });
      
      socket.connect(port, host);
    } catch (e) {
      resolve(false);
    }
  });
}

module.exports = { checkRtsp };
