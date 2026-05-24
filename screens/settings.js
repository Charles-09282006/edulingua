export function renderSettings({ onBack, onToggleTheme, onUpdateSettings, getSettings, getTheme }) {
  const settingsBackButton = document.getElementById('settingsBackButton');
  const notificationToggle = document.getElementById('settingsNotificationToggle');
  const privacyToggle = document.getElementById('settingsPrivacyToggle');
  const privacyLabel = document.getElementById('settingsPrivacyLabel');
  const themeToggleButton = document.getElementById('settingsThemeToggleButton');
  const themeLabel = document.getElementById('settingsThemeLabel');

  if (settingsBackButton) {
    settingsBackButton.addEventListener('click', () => {
      if (onBack) onBack();
    });
  }

  if (notificationToggle) {
    notificationToggle.addEventListener('change', () => {
      if (onUpdateSettings) {
        onUpdateSettings({ notificationsEnabled: notificationToggle.checked });
      }
    });
  }

  if (privacyToggle) {
    privacyToggle.addEventListener('change', () => {
      if (onUpdateSettings) {
        onUpdateSettings({ profileVisibility: privacyToggle.checked ? 'public' : 'private' });
      }
    });
  }

  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      if (onToggleTheme) onToggleTheme();
    });
  }

  return {
    update: () => {
      const theme = getTheme ? getTheme() : 'light';
      const settings = getSettings ? getSettings() : {};
      if (themeLabel) {
        themeLabel.textContent = theme === 'dark' ? 'Dark mode is active.' : 'Light mode is active.';
      }
      if (themeToggleButton) {
        themeToggleButton.textContent = theme === 'dark' ? 'Switch to Light Mode' : 'Toggle Dark Mode';
      }
      if (notificationToggle) {
        notificationToggle.checked = settings.notificationsEnabled ?? true;
      }
      if (privacyToggle) {
        privacyToggle.checked = (settings.profileVisibility ?? 'public') === 'public';
      }
      if (privacyLabel) {
        privacyLabel.textContent = (settings.profileVisibility ?? 'public') === 'public'
          ? 'Profile visibility is public.'
          : 'Profile visibility is private.';
      }
    },
  };
}
