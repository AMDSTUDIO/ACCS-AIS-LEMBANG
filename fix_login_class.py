import re

with open('client/src/components/auth/LoginPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'className={w-3 h-3 rounded-full  border }',
    'className={`w-3 h-3 rounded-full ${getLocationColor(activeCam.location).bg} border ${getLocationColor(activeCam.location).border}`}'
)

content = content.replace(
    'className={w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] }',
    'className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${!activeCam.is_active ? "bg-red-500 text-red-500" : "bg-green-500 text-green-500 animate-pulse"}`}'
)

with open('client/src/components/auth/LoginPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
