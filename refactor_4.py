import re

with open('client/src/components/multiview/MultiViewGrid.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Sidebar
content = content.replace('bg-[#0a0f16] border-r border-[#1a2332]', 'glass-panel md:rounded-r-3xl md:my-4 md:border-l-0')
content = content.replace('bg-[#05080f]', 'bg-transparent')
content = content.replace('bg-[#0d141f]', 'bg-white/5')
content = content.replace('border-b border-[#1a2332]', 'border-b border-white/5')
content = content.replace('border-[#1a2332]', 'border-white/10')
content = content.replace('bg-[#0f1724]', 'bg-black/20 backdrop-blur-md')
content = content.replace('bg-[#151f2e] border-[#1e2d44]', 'glass-button')
content = content.replace('bg-[#131f32]', 'bg-white/10')
content = content.replace('border-[#1e2d44]', 'border-white/10')

# Top header
content = content.replace('h-14 bg-[#0a0f16] border-b border-[#1a2332]', 'h-14 glass-panel md:rounded-b-3xl md:mx-4 border-t-0')
content = content.replace('bg-[#0f1724] border-[#1e2d44] hover:bg-[#1a2639]', 'glass-button')
content = content.replace('bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20', 'glass-button !border-red-500/30 text-red-400 hover:!bg-red-500/20')

# Grid container
content = content.replace('bg-[#02050A]', 'bg-transparent')
content = content.replace('bg-[#050505] border border-[#1a1a1a]', 'glass-panel !rounded-xl')
content = content.replace('border-cyan-500 border-2', 'ring-2 ring-cyan-500/80 shadow-[0_0_20px_rgba(0,255,255,0.3)]')
content = content.replace('bg-[#0f1724] border-[#1a2332]', 'glass-button border-dashed opacity-50 hover:opacity-100')

with open('client/src/components/multiview/MultiViewGrid.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
