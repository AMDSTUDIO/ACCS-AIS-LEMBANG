import re

with open('server/src/routes/public.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_route = """router.get('/running-text', (req, res) => {
  db.get('SELECT value FROM settings WHERE key = ?', ['running_text'], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ text: row ? JSON.parse(row.value) : 'SELAMAT DATANG DI SISTEM PEMANTAUAN CCTV AREA ACCS AIS LEMBANG' });
  });
});"""

new_route = """router.get('/running-text', (req, res) => {
  db.get('SELECT value FROM settings WHERE key = ?', ['running_text'], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (row) {
      try {
        let parsed = JSON.parse(row.value);
        if (typeof parsed === 'string') {
          parsed = { text: parsed, speed: 25, logoUrl: '' };
        }
        return res.json(parsed);
      } catch(e) {
        return res.json({ text: row.value, speed: 25, logoUrl: '' });
      }
    }
    res.json({ text: 'SELAMAT DATANG DI SISTEM PEMANTAUAN CCTV AREA ACCS AIS LEMBANG', speed: 25, logoUrl: '' });
  });
});"""

content = content.replace(old_route, new_route)

with open('server/src/routes/public.js', 'w', encoding='utf-8') as f:
    f.write(content)
