import React from 'react';
import { useTheme } from '@context/ThemeContext';
import WebApp from '@twa-dev/sdk';

const SettingsPanel = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="settings-panel">
      <h3>Ayarlar</h3>
      <div className="setting-item">
        <label>Karanlık Tema:</label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={toggleTheme}
        />
      </div>
      <div className="setting-item">
        <label>Dil Seçimi:</label>
        <select>
          <option value="tr">Türkçe</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  );
};

export default SettingsPanel;