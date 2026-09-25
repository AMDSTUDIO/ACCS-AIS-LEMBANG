import re

for filename in ['server/src/routes/webrtc.js', 'server/src/routes/public.js']:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We leave nvr = { ip: '127.0.0.1' } alone since that's fallback config for NVR, not Go2RTC
    content = content.replace('http://127.0.0.1:1984', 'http://43.173.8.205:1984')
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
