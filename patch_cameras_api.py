import re

with open('server/src/routes/cameras.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'const { name, location, channel, lat, lng, rtsp_url } = req.body;',
    'const { name, location, channel, lat, lng, rtsp_url, is_public } = req.body;'
)
content = content.replace(
    'INSERT INTO cameras (name, location, channel, lat, lng, rtsp_url) VALUES (?, ?, ?, ?, ?, ?)',
    'INSERT INTO cameras (name, location, channel, lat, lng, rtsp_url, is_public) VALUES (?, ?, ?, ?, ?, ?, ?)'
)
content = content.replace(
    '[name, loc, channel || 1, lat, lng, rtsp_url || \'\'], function(err) {',
    '[name, loc, channel || 1, lat, lng, rtsp_url || \'\', is_public ? 1 : 0], function(err) {'
)

content = content.replace(
    'const { name, location, channel, lat, lng, is_active, rtsp_url } = req.body;',
    'const { name, location, channel, lat, lng, is_active, rtsp_url, is_public } = req.body;'
)
content = content.replace(
    'UPDATE cameras SET name=?, location=?, channel=?, lat=?, lng=?, is_active=?, rtsp_url=? WHERE id=?',
    'UPDATE cameras SET name=?, location=?, channel=?, lat=?, lng=?, is_active=?, rtsp_url=?, is_public=? WHERE id=?'
)
content = content.replace(
    '[name, loc, channel, lat, lng, active, rtsp, req.params.id], function(err) {',
    '[name, loc, channel, lat, lng, active, rtsp, is_public ? 1 : 0, req.params.id], function(err) {'
)

with open('server/src/routes/cameras.js', 'w', encoding='utf-8') as f:
    f.write(content)
