import re

with open('client/src/components/map/MapDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix activeCam overlay container for mobile and glassmorphism
old_container = r'absolute top-24 right-6 w-\[400px\] bg-\[#111111\]/85 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10'
new_container = r'absolute top-24 left-4 right-4 md:left-auto md:right-6 md:w-[400px] glass-panel !border-white/10 !rounded-3xl shadow-2xl'
content = re.sub(old_container, new_container, content)

# Fix action buttons that didn't get refactored correctly
content = content.replace('bg-[#161622] hover:bg-[#1e1e2d] border border-[#2d2d44]', 'glass-button !border-white/5')
content = content.replace('bg-[#0d1623] hover:bg-[#131f32] border border-[#1e2d44]', 'glass-button !border-cyan-500/30 !bg-cyan-500/10 hover:!bg-cyan-500/20')

# Fix maximize button
content = content.replace('bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg border border-[#333]', 'glass-button !px-2 !py-2 !rounded-xl')
content = content.replace('bg-[#1a1a1a] hover:bg-[#2a2a2a] hover:text-red-400 rounded-lg border border-[#333]', 'glass-button !px-2 !py-2 hover:!text-red-400 !rounded-xl')

# Fix video area container
content = content.replace('border border-[#333]', 'border border-white/10')
content = content.replace('bg-[#0a110d] border border-[#132d1e] text-[#2db26a]', 'glass-panel !bg-emerald-500/10 !border-emerald-500/20 !text-emerald-400')

with open('client/src/components/map/MapDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
