import re

with open('server/src/db/index.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('db.run("ALTER TABLE users ADD COLUMN permissions TEXT DEFAULT \'all\'", (err) => {});', 'db.run("ALTER TABLE users ADD COLUMN permissions TEXT DEFAULT \'all\'", (err) => {});\n      db.run("ALTER TABLE cameras ADD COLUMN is_public INTEGER DEFAULT 0", (err) => {});')

with open('server/src/db/index.js', 'w', encoding='utf-8') as f:
    f.write(content)
