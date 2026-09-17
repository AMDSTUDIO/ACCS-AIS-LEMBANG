import re

with open('client/src/components/map/MapDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_str = r'absolute top-24 left-4 right-4 md:left-auto md:right-6 md:w-\[400px\] glass-panel'
new_str = r'absolute top-24 w-[calc(100vw-2rem)] max-w-sm left-1/2 -translate-x-1/2 md:max-w-none md:translate-x-0 md:left-auto md:right-6 md:w-[400px] glass-panel'

content = re.sub(old_str, new_str, content)

with open('client/src/components/map/MapDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
