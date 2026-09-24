import re

with open('client/src/components/auth/LoginPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make map static
content = content.replace(
    'maxZoom={22} zoomControl={false}',
    'maxZoom={22} zoomControl={false} dragging={false} scrollWheelZoom={false} doubleClickZoom={false} touchZoom={false}'
)

# Remove blur and make transparent for the login card container
content = content.replace(
    'w-full lg:w-[450px] p-4 lg:p-8 flex items-center justify-center shrink-0 bg-[#050B14]/50 backdrop-blur-xl relative z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] ml-auto border-l border-white/10',
    'w-full lg:w-[450px] p-4 lg:p-8 flex items-center justify-center shrink-0 bg-black/40 relative z-20 ml-auto border-l border-white/10'
)

# Also remove the background overlay from the form card itself to make it cleaner? No, keep the glass panel but remove heavy blur if they meant that
# "ada area blur itu hilangkan dan area login coba transparan kan"
content = content.replace(
    'w-full max-w-[320px] p-8 glass-panel rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10',
    'w-full max-w-[320px] p-8 bg-black/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10'
)

with open('client/src/components/auth/LoginPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
