import re

with open('client/src/components/map/MapDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Sidebar glassmorphism
content = content.replace('className="w-full md:w-80 bg-[#0a0a0a] flex flex-col border-r border-[#1a1a1a] shrink-0 z-20"', 'className="w-full md:w-80 glass-panel md:rounded-r-3xl flex flex-col shrink-0 z-20 md:my-4 md:border-l-0"')
content = content.replace('bg-[#111] border-b border-[#222]', 'bg-transparent border-b border-white/5')

# Search bar
content = content.replace('bg-[#1a1a1a] border-[#333]', 'bg-black/20 border-white/10 backdrop-blur-md')
content = content.replace('focus:border-blue-500', 'focus:border-cyan-500/50 focus:bg-black/40')

# List items
content = content.replace('hover:bg-[#151515] border-b border-[#1a1a1a]', 'hover:bg-white/5 border-b border-white/5')
content = content.replace('bg-[#151515]', 'bg-white/5')
content = content.replace('text-[#222]', 'text-white/10')
content = content.replace('text-blue-500', 'text-cyan-400')

# Popup styles (the activeCam overlay)
content = content.replace('bg-[#111] border-[#222]', 'glass-panel !border-white/10 !rounded-2xl shadow-2xl')
content = content.replace('bg-[#222] border-[#333]', 'bg-black/30 border-white/10')
content = content.replace('bg-[#1a1a1a] hover:bg-[#2a2a2a] border-[#333]', 'glass-button')
content = content.replace('bg-[#151515] border-[#222]', 'bg-black/20 border-white/5 backdrop-blur-md')
content = content.replace('bg-[#0a110d] border-[#132d1e]', 'bg-emerald-500/10 border-emerald-500/20')

# Floating buttons
content = content.replace('bg-[#111] border-[#333] hover:bg-[#222]', 'glass-button')
content = content.replace('bg-[#0d1623] hover:bg-[#131f32] border-[#1e2d44]', 'glass-button !border-cyan-500/30 !bg-cyan-500/10 hover:!bg-cyan-500/20')
content = content.replace('bg-[#1a1a1a] hover:bg-[#222] border-[#333]', 'glass-button')

with open('client/src/components/map/MapDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
