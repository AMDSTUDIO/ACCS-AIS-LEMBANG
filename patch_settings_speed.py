import re

with open('client/src/components/settings/SettingsModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Change runningText state to an object
content = content.replace(
    "const [runningText, setRunningText] = useState('SELAMAT DATANG DI SISTEM PEMANTAUAN CCTV AREA ACCS AIS LEMBANG');",
    "const [runningText, setRunningText] = useState({ text: 'SELAMAT DATANG DI SISTEM PEMANTAUAN CCTV AREA ACCS AIS LEMBANG', speed: 25, logoUrl: '' });"
)

# 2. Fix fetchData to handle old string or new object format
fetch_data_old = "if (sets.data.running_text) setRunningText(sets.data.running_text);"
fetch_data_new = """
    if (sets.data.running_text) {
      if (typeof sets.data.running_text === 'string') {
        setRunningText({ text: sets.data.running_text, speed: 25, logoUrl: '' });
      } else {
        setRunningText(sets.data.running_text);
      }
    }
"""
content = content.replace(fetch_data_old, fetch_data_new)

# 3. Update the UI for public display tab
old_ui = """<div>
                      <label className="block text-xs text-slate-400 mb-1">Running Text</label>
                      <textarea 
                        value={runningText} 
                        onChange={e => setRunningText(e.target.value)} 
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none h-24" 
                        placeholder="Masukkan teks berjalan..."></textarea>
                    </div>"""

new_ui = """<div>
                      <label className="block text-xs text-slate-400 mb-1">Running Text</label>
                      <textarea 
                        value={runningText.text} 
                        onChange={e => setRunningText({...runningText, text: e.target.value})} 
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none h-20" 
                        placeholder="Masukkan teks berjalan..."></textarea>
                    </div>
                    <div className="flex gap-4">
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

content = content.replace(old_ui, new_ui)

with open('client/src/components/settings/SettingsModal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
