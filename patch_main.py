import re

with open('client/src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

if 'ErrorBoundary' not in content:
    content = content.replace(
        "import App from './App.jsx'",
        "import App from './App.jsx'\nimport ErrorBoundary from './components/ErrorBoundary.jsx'"
    )
    content = content.replace(
        "<App />",
        "<ErrorBoundary>\n    <App />\n  </ErrorBoundary>"
    )
    with open('client/src/main.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
