import re

with open('client/src/components/map/MapDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the red LIVE badge overlapping the video
target = r'<div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-\[10px\] font-bold text-white flex items-center gap-1\.5 border border-white/10">\s*<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> LIVE\s*</div>'
content = re.sub(target, '', content)

with open('client/src/components/map/MapDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
