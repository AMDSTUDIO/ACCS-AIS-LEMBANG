import re

with open('client/src/components/settings/SettingsModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure newCam state reset includes is_public: 0
content = content.replace(
    'setNewCam({ id: null, name: \'\', location: \'\', channel: 1, lat: mapConfig.lat || -6.808722, lng: mapConfig.lng || 107.649002, rtsp_url: \'\' })',
    'setNewCam({ id: null, name: \'\', location: \'\', channel: 1, lat: mapConfig.lat || -6.808722, lng: mapConfig.lng || 107.649002, rtsp_url: \'\', is_public: 0 })'
)

# Add Checkbox in the form
checkbox_html = '''
                              <label className="flex items-center gap-2 mt-3 cursor-pointer p-2 bg-slate-900 border border-slate-700 rounded-lg w-fit">
                                <input 
                                  type="checkbox" 
                                  checked={!!newCam.is_public}
                                  onChange={(e) => setNewCam({...newCam, is_public: e.target.checked ? 1 : 0})}
                                  className="w-4 h-4 rounded border-slate-600 bg-slate-800"
                                />
                                <span className="text-sm font-bold text-cyan-400">Tampilkan di Peta Publik (Halaman Login)</span>
                              </label>
                            </div>
                          </div>
'''

content = content.replace(
    '</datalist>\n                            </div>\n                          </div>',
    '</datalist>\n' + checkbox_html
)

with open('client/src/components/settings/SettingsModal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
