import re

with open('client/src/components/map/GroupViewModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make modal background glass
content = content.replace('bg-black flex flex-col', 'bg-slate-950/80 backdrop-blur-xl flex flex-col')
content = content.replace('bg-[#111827] border-b border-slate-800', 'bg-transparent border-b border-white/10')
content = content.replace('bg-black overflow-hidden flex flex-col', 'bg-transparent overflow-hidden flex flex-col')
content = content.replace('bg-[#050505] border border-slate-800', 'glass-panel !rounded-2xl')
content = content.replace('bg-blue-900/50 border border-blue-500/30', 'bg-blue-500/20 border border-blue-500/30 shadow-[0_0_15px_rgba(0,150,255,0.2)]')

with open('client/src/components/map/GroupViewModal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
