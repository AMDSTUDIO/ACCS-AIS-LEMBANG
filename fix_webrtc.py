import re

with open('client/src/components/player/WebRtcPlayer.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add publicMode prop to WebRtcPlayer
content = re.sub(r'export default function WebRtcPlayer\(\{ cameraId, streamType = \'sub\' \}\) \{', r'export default function WebRtcPlayer({ cameraId, streamType = \'sub\', publicMode = false }) {', content)

# Change useWebRTC to accept publicMode
content = re.sub(r'const \{ videoRef, error, loading \} = useWebRTC\(cameraId, streamType\);', r'const { videoRef, error, loading } = useWebRTC(cameraId, streamType, publicMode);', content)

with open('client/src/components/player/WebRtcPlayer.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('client/src/hooks/useWebRTC.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Update useWebRTC definition
content = re.sub(r'export function useWebRTC\(cameraId, streamType = \'sub\'\) \{', r'export function useWebRTC(cameraId, streamType = \'sub\', publicMode = false) {', content)

# Update axios.post endpoint
content = re.sub(r'axios\.post\(\'/api/webrtc\',', r'axios.post(publicMode ? \'/api/public/webrtc\' : \'/api/webrtc\',', content)

with open('client/src/hooks/useWebRTC.js', 'w', encoding='utf-8') as f:
    f.write(content)
