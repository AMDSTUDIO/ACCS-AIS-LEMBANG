import re

for filepath in ['client/src/components/map/MapDashboard.jsx', 'client/src/components/auth/LoginPage.jsx']:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix L.divIcon
    content = content.replace('new L.divIcon({', 'L.divIcon({')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
