import re

with open('client/src/index.css', 'a', encoding='utf-8') as f:
    f.write("""
@keyframes marquee {
  0% { transform: translateX(100vw); }
  100% { transform: translateX(-100%); }
}
.animate-marquee {
  animation: marquee 25s linear infinite;
  display: inline-block;
}
""")
