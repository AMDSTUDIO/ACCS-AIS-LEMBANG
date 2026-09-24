import re

with open('client/src/components/auth/LoginPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the wrapper relative and allow children to overlap
content = content.replace(
    '<div className="relative z-10 w-full flex flex-col lg:flex-row items-stretch justify-center h-screen">',
    '<div className="relative z-10 w-full h-screen overflow-hidden flex">'
)

# Make Map full screen
content = content.replace(
    '<div className="w-full lg:flex-1 hidden md:flex flex-col relative border-r border-white/5">',
    '<div className="absolute inset-0 w-full h-full z-0 hidden md:flex">'
)

# Move Right Side Login Card to be a floating panel on the right (or center if mobile)
content = content.replace(
    '<div className="w-full lg:w-[450px] p-4 lg:p-8 flex items-center justify-center shrink-0 bg-[#050B14] relative z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">',
    '<div className="w-full lg:w-[450px] p-4 lg:p-8 flex items-center justify-center shrink-0 bg-[#050B14]/50 backdrop-blur-xl relative z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] ml-auto border-l border-white/10">'
)

# Also fix the Marker closing tag whitespace issue that caused [object Object] in some versions of React-Leaflet
content = content.replace(
    '</Marker>',
    ''
)
content = content.replace(
    'eventHandlers={{ click: () => setActiveCam(cam) }}\n                  >',
    'eventHandlers={{ click: () => setActiveCam(cam) }}\n                  />'
)

with open('client/src/components/auth/LoginPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
