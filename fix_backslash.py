import re

with open('client/src/components/player/WebRtcPlayer.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(r"\'sub\'", "'sub'")
with open('client/src/components/player/WebRtcPlayer.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('client/src/hooks/useWebRTC.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(r"\'sub\'", "'sub'")
content = content.replace(r"\'/api/public/webrtc\'", "'/api/public/webrtc'")
content = content.replace(r"\'/api/webrtc\'", "'/api/webrtc'")
with open('client/src/hooks/useWebRTC.js', 'w', encoding='utf-8') as f:
    f.write(content)
