import re

with open('client/src/components/auth/LoginPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Header
content = content.replace(
    '<h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">PUBLIC LIVE MAP</h1>\n                <p className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mt-1">Sistem Pemantauan Publik</p>',
    '<h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">ACCS <span className="font-light text-slate-300">AIS LEMBANG</span></h1>\n                <p className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mt-1">AREA CCTV CONTROL SYSTEM</p>'
)

# 2. Add isFullscreen state
if 'const [isFullscreen, setIsFullscreen] = useState(false);' not in content:
    content = content.replace(
        'const [activeCam, setActiveCam] = useState(null);',
        'const [activeCam, setActiveCam] = useState(null);\n  const [isFullscreen, setIsFullscreen] = useState(false);'
    )

# 3. Reset fullscreen when closing active cam
content = content.replace(
    'onClick={() => setActiveCam(null)}',
    'onClick={() => { setActiveCam(null); setIsFullscreen(false); }}'
)

# 4. Add Maximize button to popup
maximize_btn = '<button onClick={() => setIsFullscreen(true)} className="w-8 h-8 flex justify-center items-center glass-button !px-0 !py-0 hover:!text-white !rounded-xl transition"><Maximize2 size={14}/></button>\n                      <button onClick={() => { setActiveCam(null); setIsFullscreen(false); }}'
content = content.replace(
    '<button onClick={() => { setActiveCam(null); setIsFullscreen(false); }}',
    maximize_btn
)

# 5. Add Fullscreen Overlay Layer at the bottom of the component
fullscreen_overlay = '''
      {/* Fullscreen Player Overlay */}
      {isFullscreen && activeCam && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-center pointer-events-none">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getLocationColor(activeCam.location).bg} animate-pulse`}></div>
              <h2 className="font-extrabold text-white text-xl uppercase drop-shadow-md">{activeCam.location || 'Area Publik'}</h2>
            </div>
            <button onClick={() => setIsFullscreen(false)} className="w-10 h-10 flex justify-center items-center bg-white/10 hover:bg-red-500/80 backdrop-blur-md rounded-xl text-white pointer-events-auto transition">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 w-full h-full relative">
            <WebRtcPlayer cameraId={activeCam.id} streamType="sub" publicMode={true} />
          </div>
        </div>
      )}
'''

content = content.replace(
    '    </div>\n  );\n}',
    fullscreen_overlay + '\n    </div>\n  );\n}'
)

with open('client/src/components/auth/LoginPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
