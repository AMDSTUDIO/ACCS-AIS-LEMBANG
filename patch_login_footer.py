import re

with open('client/src/components/auth/LoginPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fetch running text
if 'runningText' not in content:
    content = content.replace(
        'const [publicCameras, setPublicCameras] = useState([]);',
        'const [publicCameras, setPublicCameras] = useState([]);\n  const [runningText, setRunningText] = useState("SELAMAT DATANG DI SISTEM PEMANTAUAN CCTV AREA ACCS AIS LEMBANG");'
    )

    fetch_cams_block = """
      axios.get('/api/public/running-text').then(res => {
        if (res.data && res.data.text) setRunningText(res.data.text);
      }).catch(console.error);
"""
    content = content.replace(
        "axios.get('/api/public/map-settings').then(res => setMapConfig(res.data)).catch(console.error);",
        "axios.get('/api/public/map-settings').then(res => setMapConfig(res.data)).catch(console.error);\n" + fetch_cams_block
    )

# 2. Add imports for social media
if 'Facebook' not in content:
    content = content.replace(
        "import { ShieldAlert, KeyRound, User, Loader2, MapPin, X, Maximize2, Video } from 'lucide-react';",
        "import { ShieldAlert, KeyRound, User, Loader2, MapPin, X, Maximize2, Video, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';"
    )

# 3. Add Footer
footer_html = """
      {/* Footer with Running Text & Social Media */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center">
        {/* Running Text */}
        <div className="flex-1 overflow-hidden flex items-center h-10 border-r border-white/10">
          <div className="bg-blue-600 h-full px-4 flex items-center justify-center whitespace-nowrap shrink-0 z-10 relative shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
            <span className="text-white text-xs font-bold uppercase tracking-wider">INFORMASI</span>
          </div>
          <div className="flex-1 overflow-hidden relative h-full flex items-center">
            <div className="animate-marquee whitespace-nowrap text-cyan-400 font-bold text-sm tracking-widest px-4">
              {runningText}
            </div>
          </div>
        </div>
        
        {/* Social Media */}
        <div className="flex items-center gap-4 px-6 h-10">
          <a href="#" className="text-slate-400 hover:text-blue-500 transition"><Facebook size={16} /></a>
          <a href="#" className="text-slate-400 hover:text-pink-500 transition"><Instagram size={16} /></a>
          <a href="#" className="text-slate-400 hover:text-red-500 transition"><Youtube size={16} /></a>
          <a href="#" className="text-slate-400 hover:text-blue-400 transition"><Twitter size={16} /></a>
        </div>
      </div>
"""

content = content.replace(
    '    </div>\n  );\n}',
    footer_html + '\n    </div>\n  );\n}'
)

with open('client/src/components/auth/LoginPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
