import re

# 1. Update index.css
with open('client/src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

if '.glass-panel' not in css:
    css += '''
@layer utilities {
  .glass-panel {
    @apply bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl;
  }
  .glass-button {
    @apply bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-md border border-white/10 transition-all shadow-sm rounded-xl;
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
'''
    with open('client/src/index.css', 'w', encoding='utf-8') as f:
        f.write(css)

# 2. App.jsx - make background softer
with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    app_jsx = f.read()
app_jsx = app_jsx.replace('bg-slate-900', 'bg-slate-950')
with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(app_jsx)

