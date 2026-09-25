const fs = require('fs');
const content = fs.readFileSync('client/src/components/settings/SettingsModal.jsx', 'utf8');

// A primitive way to check for unbound variables in JSX
// Not a full AST parser, but let's check for curly braces {}
const matches = content.match(/\{([a-zA-Z0-9_\.\?\!\s]+)\}/g);
if (matches) {
  matches.forEach(m => console.log(m));
}
