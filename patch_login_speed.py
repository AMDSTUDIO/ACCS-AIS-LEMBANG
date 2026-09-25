import re

with open('client/src/components/auth/LoginPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update state definition
content = content.replace(
    'const [runningText, setRunningText] = useState("SELAMAT DATANG DI SISTEM PEMANTAUAN CCTV AREA ACCS AIS LEMBANG");',
    'const [runningText, setRunningText] = useState({ text: "SELAMAT DATANG DI SISTEM PEMANTAUAN CCTV AREA ACCS AIS LEMBANG", speed: 25, logoUrl: "" });'
)

# 2. Update fetch logic - the backend already returns the full object
fetch_old = "if (res.data && res.data.text) setRunningText(res.data.text);"
fetch_new = "if (res.data && res.data.text) setRunningText(res.data);"
content = content.replace(fetch_old, fetch_new)

# 3. Update Marquee rendering
marquee_old = """<div className="animate-marquee whitespace-nowrap text-cyan-400 font-bold text-sm tracking-widest px-4">
              {runningText}
            </div>"""

marquee_new = """<div className="animate-marquee whitespace-nowrap text-cyan-400 font-bold text-sm tracking-widest px-4 flex items-center gap-4" style={{ animationDuration: `${runningText.speed || 25}s` }}>
              {runningText.logoUrl && <img src={runningText.logoUrl} alt="Logo" className="h-6 object-contain" />}
              <span>{runningText.text}</span>
            </div>"""

content = content.replace(marquee_old, marquee_new)

with open('client/src/components/auth/LoginPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
