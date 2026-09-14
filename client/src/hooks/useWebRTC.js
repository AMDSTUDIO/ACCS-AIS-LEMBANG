import { useEffect, useRef } from 'react';
import axios from 'axios';

export function useWebRTC(cameraId, streamType = 'sub') {
  const videoRef = useRef(null);
  const pcRef = useRef(null);

  useEffect(() => {
    if (!cameraId) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    pcRef.current = pc;

    pc.addTransceiver('video', { direction: 'recvonly' });
    pc.addTransceiver('audio', { direction: 'recvonly' });

    pc.ontrack = (event) => {
      if (videoRef.current && event.streams[0]) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    pc.createOffer().then(offer => {
      pc.setLocalDescription(offer);
      
      axios.post('http://localhost:5000/api/webrtc', {
        cameraId,
        streamType,
        type: offer.type,
        sdp: offer.sdp
      }, { withCredentials: true })
      .then(res => {
        pc.setRemoteDescription(new RTCSessionDescription({
          type: 'answer',
          sdp: res.data.sdp
        }));
      })
      .catch(console.error);
    });

    return () => {
      if (pcRef.current) pcRef.current.close();
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [cameraId, streamType]);

  return videoRef;
}
