import re

with open('client/src/components/auth/LoginPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Soften the background overlay
content = content.replace('bg-[#050B14]/80 mix-blend-multiply', 'bg-slate-950/70 mix-blend-multiply backdrop-blur-sm')
content = content.replace('from-[#050B14] via-[#050B14]/50 to-transparent', 'from-slate-950 via-slate-900/60 to-transparent')

# Soften the glowing accents
content = content.replace('bg-blue-500/20', 'bg-blue-500/10')
content = content.replace('bg-cyan-400/10', 'bg-cyan-400/5')

# Glass card
content = content.replace('bg-[#0a1220]/60 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,180,255,0.15)] rounded-3xl', 'glass-panel rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)]')

# Inputs
content = content.replace('bg-[#050B14]/80 border border-white/5 rounded-xl', 'bg-black/20 border border-white/10 rounded-2xl backdrop-blur-md')
content = content.replace('focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,255,255,0.1)]', 'focus:border-cyan-400/50 focus:bg-black/40 focus:ring-1 focus:ring-cyan-400/50')

# Button
content = content.replace('bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400', 'bg-gradient-to-r from-cyan-600/80 to-blue-600/80 hover:from-cyan-500 hover:to-blue-500 backdrop-blur-md border border-white/10')
content = content.replace('rounded-xl transition-all shadow-[0_0_20px_rgba(0,180,255,0.2)] hover:shadow-[0_0_30px_rgba(0,180,255,0.4)]', 'rounded-2xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,200,255,0.3)]')

with open('client/src/components/auth/LoginPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
