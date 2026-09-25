import re

with open('server/src/server.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'app.use(express.json());',
    "app.use(express.json({ limit: '10mb' }));\napp.use(express.urlencoded({ limit: '10mb', extended: true }));"
)

with open('server/src/server.js', 'w', encoding='utf-8') as f:
    f.write(content)
