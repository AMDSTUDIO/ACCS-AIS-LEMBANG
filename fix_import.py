import re

with open('client/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

if 'import ErrorBoundary' not in content:
    content = "import ErrorBoundary from './components/ErrorBoundary.jsx';\n" + content
    with open('client/src/main.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
