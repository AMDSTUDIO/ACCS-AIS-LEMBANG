import React from 'react';
import { useWebRTC } from '../../hooks/useWebRTC';

export default function WebRtcPlayer({ cameraId, streamType = 'sub', className = '' }) {
  const videoRef = useWebRTC(cameraId, streamType);

  return (
    <video
      ref={videoRef}
      className={`w-full h-full object-contain bg-black ${className}`}
      autoPlay
      muted
      playsInline
      controls={false}
      onDoubleClick={() => {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(err => console.log(err));
        }
      }}
    />
  );
}
