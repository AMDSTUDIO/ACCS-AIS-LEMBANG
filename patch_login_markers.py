import re

with open('client/src/components/auth/LoginPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_create_icon = """const createIcon = (color) => new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color};"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});"""

new_create_icon = """const createIcon = (color, isActive = false) => {
  const scale = 1;
  const baseSize = 48 * scale;
  const innerSize = 24 * scale; 
  const iconSize = 14 * scale;

  return new L.divIcon({
    className: 'bg-transparent border-0',
    html: `
      <div class="relative flex items-center justify-center group cursor-pointer transition-transform duration-300 hover:scale-110" style="width:${baseSize}px; height:${baseSize}px;">
        ${isActive ? `<span class="absolute inline-flex rounded-full opacity-40 animate-ping" style="background-color: ${color}; width:${baseSize*1.2}px; height:${baseSize*1.2}px;"></span>` : ''}
        <div class="relative z-10 rounded-full border-2 flex items-center justify-center backdrop-blur-md drop-shadow-lg" 
             style="width:${innerSize}px; height:${innerSize}px; border-color: ${color}; background-color: ${color}40; ${isActive ? `box-shadow: 0 0 10px ${color};` : ''}">
          <img src="https://unpkg.com/lucide-static@0.321.0/icons/cctv.svg" class="filter invert brightness-0 sepia-0 hue-rotate-180" style="width:${iconSize}px; height:${iconSize}px; ${isActive ? `filter: drop-shadow(0 0 8px ${color});` : ''}" />
        </div>
      </div>
    `,
    iconSize: [baseSize, baseSize],
    iconAnchor: [baseSize / 2, baseSize / 2],
  });
};"""

content = content.replace(old_create_icon, new_create_icon)

content = content.replace(
    'icon={createIcon(getLocationColor(cam.location).hex)}',
    'icon={createIcon(getLocationColor(cam.location).hex, activeCam?.id === cam.id)}'
)

with open('client/src/components/auth/LoginPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
