import re

with open('client/src/components/auth/LoginPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure state supports social object
state_old = 'const [runningText, setRunningText] = useState({ text: "SELAMAT DATANG DI SISTEM PEMANTAUAN CCTV AREA ACCS AIS LEMBANG", speed: 25, logoUrl: "" });'
state_new = 'const [runningText, setRunningText] = useState({ text: "SELAMAT DATANG DI SISTEM PEMANTAUAN CCTV AREA ACCS AIS LEMBANG", speed: 25, logoUrl: "", social: {} });'
content = content.replace(state_old, state_new)

# Update Footer social icons
footer_old = """{/* Social Media */}
        <div className="flex items-center gap-4 px-6 h-10">
          <a href="#" className="text-slate-400 hover:text-blue-500 transition"><MessageCircle size={16} /></a>
          <a href="#" className="text-slate-400 hover:text-pink-500 transition"><Share2 size={16} /></a>
          <a href="#" className="text-slate-400 hover:text-red-500 transition"><MonitorPlay size={16} /></a>
          <a href="#" className="text-slate-400 hover:text-blue-400 transition"><Globe size={16} /></a>
        </div>"""

footer_new = """{/* Social Media */}
        <div className="flex items-center gap-4 px-6 h-10">
          {runningText.social?.website && <a href={runningText.social.website} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition" title="Website"><Globe size={16} /></a>}
          {runningText.social?.whatsapp && <a href={`https://wa.me/${runningText.social.whatsapp}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-green-500 transition" title="WhatsApp"><MessageCircle size={16} /></a>}
          {runningText.social?.instagram && <a href={runningText.social.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-500 transition" title="Instagram"><Share2 size={16} /></a>}
          {runningText.social?.youtube && <a href={runningText.social.youtube} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-red-500 transition" title="YouTube"><MonitorPlay size={16} /></a>}
        </div>"""

content = content.replace(footer_old, footer_new)

with open('client/src/components/auth/LoginPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
