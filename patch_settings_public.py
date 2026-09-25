import re

with open('client/src/components/settings/SettingsModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import useAuthStore
if 'useAuthStore' not in content:
    content = content.replace(
        "import { useCctvStore } from '../../store/useCctvStore';",
        "import { useCctvStore } from '../../store/useCctvStore';\nimport { useAuthStore } from '../../store/useAuthStore';"
    )

# 2. Get user from useAuthStore
if 'const user = useAuthStore' not in content:
    content = content.replace(
        'const { cameras, setCameras } = useCctvStore();',
        'const { cameras, setCameras } = useCctvStore();\n  const user = useAuthStore(state => state.user);'
    )

# 3. Add state for running text & social links
if 'runningText' not in content:
    content = content.replace(
        "const [activeTab, setActiveTab] = useState('cctv');",
        "const [activeTab, setActiveTab] = useState('cctv');\n  const [runningText, setRunningText] = useState('SELAMAT DATANG DI SISTEM PEMANTAUAN CCTV AREA ACCS AIS LEMBANG');"
    )

# 4. Fetch running text in fetchData
if 'running_text' not in content:
    content = content.replace(
        'if (sets.data.nvr_config) setNvrConfig(sets.data.nvr_config);',
        'if (sets.data.nvr_config) setNvrConfig(sets.data.nvr_config);\n    if (sets.data.running_text) setRunningText(sets.data.running_text);'
    )

# 5. Add Sidebar Tab for Public Display (Only if user.role === 'superadmin')
if 'Tampilan Publik' not in content:
    tab_html = """
          {user?.role === 'superadmin' && (
            <button onClick={() => setActiveTab('public_display')} className={`flex items-center gap-3 p-3 rounded-xl transition font-medium ${activeTab === 'public_display' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <MapPin size={18} />
              Tampilan Publik
            </button>
          )}
"""
    content = content.replace(
        '</button>\n        </div>\n\n        {/* CONTENT AREA */}',
        '</button>\n' + tab_html + '        </div>\n\n        {/* CONTENT AREA */}'
    )

# 6. Add the Content Area for Public Display
if 'activeTab === \'public_display\'' not in content:
    content_area = """
            {/* PUBLIC DISPLAY TAB */}
            {activeTab === 'public_display' && user?.role === 'superadmin' && (
              <div className="max-w-2xl">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6">
                  <h3 className="text-blue-400 font-bold mb-1">Pengaturan Tampilan Halaman Login</h3>
                  <p className="text-sm text-slate-300 mb-4">Edit teks berjalan (Running Text) yang akan ditampilkan di bawah halaman login.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Running Text</label>
                      <textarea 
                        value={runningText} 
                        onChange={e => setRunningText(e.target.value)} 
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none h-24" 
                        placeholder="Masukkan teks berjalan..."></textarea>
                    </div>
                    
                    <button onClick={() => saveConfig('running_text', runningText)} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20">
                      <Save size={18} /> Simpan Tampilan
                    </button>
                  </div>
                </div>
              </div>
            )}
"""
    content = content.replace(
        '{/* MAP CONFIG TAB */}',
        content_area + '\n            {/* MAP CONFIG TAB */}'
    )

with open('client/src/components/settings/SettingsModal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
