import re

with open('server/src/server.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken rtspUrl line
content = re.sub(r'rtspUrl = \s*tsp://:@:/cam/realmonitor\?channel=&subtype=1;', r'rtspUrl = `rtsp://${nvr.user}:${nvr.pass}@${nvr.ip}:${nvr.port}/cam/realmonitor?channel=${cam.channel}&subtype=1`;', content)

with open('server/src/server.js', 'w', encoding='utf-8') as f:
    f.write(content)
