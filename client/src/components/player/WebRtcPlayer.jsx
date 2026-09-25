import React from 'react';
import { useWebRTC } from '../../hooks/useWebRTC';

export default function WebRtcPlayer({ cameraId, streamType = 'sub', className = '' }) {
  const videoRef = useWebRTC(cameraId, streamType);

  return (
    <video
      ref={videoRef}
      className={`w-full h-full object-contain bg-black cursor-pointer ${className}`}
      autoPlay
      muted
      playsInline
      controls={false}
      onClick={(e) => {
        if (!document.fullscreenElement) {
          e.target.requestFullscreen().catch(err => console.log(err));
        } else {
          document.exitFullscreen().catch(err => console.log(err));
        }
      }}
    />
  );
}
