import re

with open('client/src/components/auth/LoginPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_logo = '''<div className="bg-gradient-to-b from-cyan-400 to-blue-600 p-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,180,255,0.3)] mb-5">
            <ShieldAlert size={28} className="text-white" />
          </div>'''
new_logo = '''<div className="mb-4 flex justify-center">
            <img src="/ais-logo.png" alt="AIS Logo" className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]" />
          </div>'''

content = content.replace(old_logo, new_logo)

with open('client/src/components/auth/LoginPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
