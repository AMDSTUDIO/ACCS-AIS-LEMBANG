import re

with open('server/src/routes/public.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'SELECT * FROM cameras WHERE location LIKE "%PUBLIC%" OR location LIKE "%KOMERSIAL%"',
    'SELECT * FROM cameras WHERE is_public = 1'
)

content = content.replace(
    'SELECT * FROM cameras WHERE id = ? AND (location LIKE "%PUBLIC%" OR location LIKE "%KOMERSIAL%")',
    'SELECT * FROM cameras WHERE id = ? AND is_public = 1'
)

with open('server/src/routes/public.js', 'w', encoding='utf-8') as f:
    f.write(content)
