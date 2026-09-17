import re

with open('config/go2rtc.yaml', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'candidates:\s*\n\s*-.*', 'candidates:\n    - stun:8555', content)

with open('config/go2rtc.yaml', 'w', encoding='utf-8') as f:
    f.write(content)
