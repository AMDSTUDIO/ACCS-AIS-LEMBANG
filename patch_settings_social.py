import re

with open('client/src/components/settings/SettingsModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State update
state_old = "const [runningText, setRunningText] = useState({ text: 'SELAMAT DATANG DI SISTEM PEMANTAUAN CCTV AREA ACCS AIS LEMBANG', speed: 25, logoUrl: '' });"
state_new = """const defaultPublicConfig = { text: 'SELAMAT DATANG DI SISTEM PEMANTAUAN CCTV AREA ACCS AIS LEMBANG', speed: 25, logoUrl: '', social: { website: '', whatsapp: '', instagram: '', youtube: '' } };
  const [runningText, setRunningText] = useState(defaultPublicConfig);"""
content = content.replace(state_old, state_new)

# 2. Fetch update
fetch_old = """if (sets.data.running_text) {
      if (typeof sets.data.running_text === 'string') {
        setRunningText({ text: sets.data.running_text, speed: 25, logoUrl: '' });
      } else {
        setRunningText(sets.data.running_text);
      }
    }"""
fetch_new = """if (sets.data.running_text) {
      if (typeof sets.data.running_text === 'string') {
        setRunningText({ ...defaultPublicConfig, text: sets.data.running_text });
      } else {
        setRunningText({ ...defaultPublicConfig, ...sets.data.running_text, social: { ...defaultPublicConfig.social, ...(sets.data.running_text.social || {}) } });
      }
    }"""
content = content.replace(fetch_old, fetch_new)

# 3. Handle file upload function
if 'handleLogoUpload' not in content:
    content = content.replace(
        "const saveConfig = async (key, value) => {",
        """const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setRunningText({ ...runningText, logoUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };
  
  const saveConfig = async (key, value) => {"""
    )

# 4. Update UI
ui_old = """<div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-slate-400 mb-1">Durasi Kecepatan (Detik)</label>
                        <input 
                          type="number" 
                          value={runningText.speed} 
                          onChange={e => setRunningText({...runningText, speed: Number(e.target.value)})} 
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 outline-none" 
                          placeholder="25 (makin kecil makin cepat)" />
                        <p className="text-[10px] text-slate-500 mt-1">Makin kecil angkanya, makin cepat berjalannya (Default: 25).</p>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-slate-400 mb-1">URL Logo Tambahan (Opsional)</label>
                        <input 
                          type="text" 
                          value={runningText.logoUrl} 
                          onChange={e => setRunningText({...runningText, logoUrl: e.target.value})} 
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 outline-none" 
                          placeholder="https://.../logo.png" />
                      </div>
                    </div>"""

ui_new = """<div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-slate-400 mb-1">Durasi Kecepatan (Detik)</label>
                        <input type="number" value={runningText.speed} onChange={e => setRunningText({...runningText, speed: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 outline-none" placeholder="25" />
                        <p className="text-[10px] text-slate-500 mt-1">Makin kecil = makin cepat (Default: 25)</p>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-slate-400 mb-1">Logo Running Text (PNG/JPG)</label>
                        <div className="flex items-center gap-3">
                          {runningText.logoUrl && <img src={runningText.logoUrl} className="h-10 w-10 object-contain bg-black/40 rounded border border-slate-700" alt="Logo" />}
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer bg-slate-900 border border-slate-700 rounded-lg" />
                        </div>
                        {runningText.logoUrl && <button onClick={() => setRunningText({...runningText, logoUrl: ''})} className="text-[10px] text-red-500 mt-1 hover:underline">Hapus Logo</button>}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700/50">
                      <h4 className="text-sm font-bold text-slate-300 mb-3">Tautan Media Sosial Footer</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Website URL</label>
                          <input type="text" value={runningText.social?.website || ''} onChange={e => setRunningText({...runningText, social: {...runningText.social, website: e.target.value}})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white outline-none focus:border-blue-500" placeholder="https://..." />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Nomor WhatsApp</label>
                          <input type="text" value={runningText.social?.whatsapp || ''} onChange={e => setRunningText({...runningText, social: {...runningText.social, whatsapp: e.target.value}})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white outline-none focus:border-blue-500" placeholder="628123..." />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Instagram URL</label>
                          <input type="text" value={runningText.social?.instagram || ''} onChange={e => setRunningText({...runningText, social: {...runningText.social, instagram: e.target.value}})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white outline-none focus:border-blue-500" placeholder="https://instagram.com/..." />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">YouTube URL</label>
                          <input type="text" value={runningText.social?.youtube || ''} onChange={e => setRunningText({...runningText, social: {...runningText.social, youtube: e.target.value}})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white outline-none focus:border-blue-500" placeholder="https://youtube.com/..." />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2">Kosongkan kolom jika tidak ingin menampilkan ikon tersebut di halaman login.</p>
                    </div>"""

content = content.replace(ui_old, ui_new)

with open('client/src/components/settings/SettingsModal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
