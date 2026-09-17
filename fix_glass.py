import re

# 1. Update index.css for better glass effect
with open('client/src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Make glass panel more visible and elegant (slate tinted blur)
css = re.sub(r'\.glass-panel\s*\{[^}]+\}', '.glass-panel {\n    @apply bg-slate-900/70 backdrop-blur-2xl border border-white/10 shadow-2xl;\n  }', css)
css = re.sub(r'\.glass-button\s*\{[^}]+\}', '.glass-button {\n    @apply bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-xl border border-white/10 transition-all shadow-md rounded-xl text-white/90;\n  }', css)

with open('client/src/index.css', 'w', encoding='utf-8') as f:
    f.write(css)

# 2. Fix the sidebar in MapDashboard.jsx which was missed
with open('client/src/components/map/MapDashboard.jsx', 'r', encoding='utf-8') as f:
    map_jsx = f.read()

map_jsx = map_jsx.replace('bg-[#111111]/95 backdrop-blur-xl border border-white/10', 'glass-panel')
map_jsx = map_jsx.replace('bg-[#111111]/90 backdrop-blur-md', 'glass-panel')
map_jsx = map_jsx.replace('border-b border-[#222]', 'border-b border-white/10')
map_jsx = map_jsx.replace('border-[#222]', 'border-white/10')
map_jsx = map_jsx.replace('bg-[#151515]', 'bg-white/5')
map_jsx = map_jsx.replace('bg-[#1a1a1a]', 'bg-white/10')
map_jsx = map_jsx.replace('bg-[#222]', 'bg-white/10')
map_jsx = map_jsx.replace('text-[#222]', 'text-white/20')

# Also fix the weird text colors inside the popup
map_jsx = map_jsx.replace('text-[#8e8eba]', 'text-slate-300')
map_jsx = map_jsx.replace('text-[#6090d8]', 'text-cyan-300')
map_jsx = map_jsx.replace('bg-[#0a110d]', 'bg-emerald-900/30')
map_jsx = map_jsx.replace('border-[#132d1e]', 'border-emerald-500/30')

with open('client/src/components/map/MapDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(map_jsx)

# 3. MultiViewGrid.jsx text colors
with open('client/src/components/multiview/MultiViewGrid.jsx', 'r', encoding='utf-8') as f:
    grid_jsx = f.read()

grid_jsx = grid_jsx.replace('text-slate-500', 'text-slate-400')
grid_jsx = grid_jsx.replace('text-slate-400 hover:text-white', 'text-slate-300 hover:text-white')

with open('client/src/components/multiview/MultiViewGrid.jsx', 'w', encoding='utf-8') as f:
    f.write(grid_jsx)

