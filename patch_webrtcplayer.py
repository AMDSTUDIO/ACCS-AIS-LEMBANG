import re

with open('client/src/components/player/WebRtcPlayer.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "export default function WebRtcPlayer({ cameraId, streamType = 'sub', className = '' }) {",
    "export default function WebRtcPlayer({ cameraId, streamType = 'sub', publicMode = false, className = '' }) {"
)

content = content.replace(
    "const videoRef = useWebRTC(cameraId, streamType);",
    "const videoRef = useWebRTC(cameraId, streamType, publicMode);"
)

with open('client/src/components/player/WebRtcPlayer.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
