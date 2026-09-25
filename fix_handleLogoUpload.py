import re

with open('client/src/components/settings/SettingsModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

if 'handleLogoUpload' not in content:
    content = content.replace(
        "const saveConfig = async (key, val) => {",
        """const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setRunningText({ ...runningText, logoUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };
  
  const saveConfig = async (key, val) => {"""
    )
    with open('client/src/components/settings/SettingsModal.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
