import re

with open('client/src/components/settings/SettingsModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'rtsp_url: \'\' });',
    'rtsp_url: \'\', is_public: 0 });'
)

with open('client/src/components/settings/SettingsModal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
