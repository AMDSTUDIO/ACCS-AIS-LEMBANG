import re

with open('client/src/components/auth/LoginPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Container background
content = content.replace(
    'bg-black/40 relative z-20',
    'bg-black/20 backdrop-blur-md relative z-20'
)

# Card background
content = content.replace(
    'bg-black/30 rounded-[2.5rem]',
    'glass-panel !bg-[#050B14]/60 !backdrop-blur-3xl rounded-[2.5rem]'
)

with open('client/src/components/auth/LoginPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
