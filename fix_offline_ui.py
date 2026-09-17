import re

with open('client/src/components/map/MapDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_dot = r'<div className={mt-\[4px\] w-1\.5 h-1\.5 rounded-full shadow-\[0_0_5px_currentColor\] shrink-0 \$\{activeCam\?\.id === cam\.id \? \'animate-pulse\' : \'\'\}} style=\{\{ backgroundColor: gColor, color: gColor \}\}></div>'
new_dot = r'<div className={mt-[4px] w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor] shrink-0  } style={{ backgroundColor: cam.is_active ? gColor : undefined, color: cam.is_active ? gColor : undefined }}></div>'

content = re.sub(old_dot, new_dot, content)

old_name = r'<div className={ont-bold text-xs truncate leading-tight \$\{activeCam\?\.id === cam\.id \? \'text-white\' : \'text-slate-300\'\}}>\{cam\.name\}</div>'
new_name = r'<div className={ont-bold text-xs truncate leading-tight }>{cam.name} {!cam.is_active && <span className="text-[8px] text-red-500 ml-1 px-1 border border-red-500/30 rounded bg-red-500/10">OFFLINE</span>}</div>'

content = re.sub(old_name, new_name, content)

with open('client/src/components/map/MapDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
