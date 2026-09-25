import re

with open('client/src/components/auth/LoginPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix imports
content = content.replace(
    'Facebook, Instagram, Youtube, Twitter',
    'Globe, MessageCircle, MonitorPlay, Share2'
)

# Fix JSX
content = content.replace(
    '<Facebook size={16} />', '<MessageCircle size={16} />'
)
content = content.replace(
    '<Instagram size={16} />', '<Share2 size={16} />'
)
content = content.replace(
    '<Youtube size={16} />', '<MonitorPlay size={16} />'
)
content = content.replace(
    '<Twitter size={16} />', '<Globe size={16} />'
)

with open('client/src/components/auth/LoginPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
