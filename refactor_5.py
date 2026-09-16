import re

with open('client/src/components/settings/SettingsModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the main modal glass
content = content.replace('bg-[#0f1520] border border-slate-800', 'glass-panel !rounded-[2rem] shadow-2xl')
content = content.replace('bg-[#151c28] border-b border-slate-800', 'border-b border-white/5 bg-transparent')

# Make sidebar glass
content = content.replace('bg-[#0b1018] border-r border-slate-800', 'glass-panel !rounded-3xl border-r border-white/5 mx-2 my-2')
content = content.replace('hover:bg-[#1a2332]', 'hover:bg-white/5')
content = content.replace('bg-cyan-500/10 text-cyan-400', 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.1)]')

# Update content area backgrounds
content = content.replace('bg-[#0b1018] border border-slate-800', 'glass-panel')
content = content.replace('bg-[#151c28]', 'bg-white/5')
content = content.replace('border-slate-800', 'border-white/10')
content = content.replace('border-[#1e293b]', 'border-white/10')

with open('client/src/components/settings/SettingsModal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
