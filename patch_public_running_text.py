import re

with open('server/src/routes/public.js', 'r', encoding='utf-8') as f:
    content = f.read()

running_text_route = """
router.get('/running-text', (req, res) => {
  db.get('SELECT value FROM settings WHERE key = ?', ['running_text'], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ text: row ? JSON.parse(row.value) : 'SELAMAT DATANG DI SISTEM PEMANTAUAN CCTV AREA ACCS AIS LEMBANG' });
  });
});
"""

if '/running-text' not in content:
    content = content.replace("router.get('/map-settings',", running_text_route + "\nrouter.get('/map-settings',")

with open('server/src/routes/public.js', 'w', encoding='utf-8') as f:
    f.write(content)
