import re

with open('server/src/server.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const publicRoutes = require('./routes/public');\nconst publicRoutes = require('./routes/public');", "const publicRoutes = require('./routes/public');")
content = content.replace("app.use('/api/public', publicRoutes);\napp.use('/api/public', publicRoutes);", "app.use('/api/public', publicRoutes);")

with open('server/src/server.js', 'w', encoding='utf-8') as f:
    f.write(content)
