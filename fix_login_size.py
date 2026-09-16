import re

with open('client/src/components/auth/LoginPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make card smaller
content = content.replace('max-w-[340px] p-8', 'max-w-[280px] sm:max-w-[300px] p-6')

# Reduce margin bottom of header
content = content.replace('mb-8 text-center', 'mb-6 text-center')

# Reduce logo size
content = content.replace('w-16 h-16', 'w-14 h-14')

with open('client/src/components/auth/LoginPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
