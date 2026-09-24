import re

with open('client/src/components/auth/LoginPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(r'\`', '`')

with open('client/src/components/auth/LoginPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
