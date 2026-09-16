import re

with open('client/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<title>ACCS AIS Lembang</title>', '<title>ACCS AIS LEMBANG</title>')
content = content.replace('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />', '<link rel="icon" type="image/png" href="/ais-logo.png" />')

with open('client/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
