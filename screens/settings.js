export function renderSettings({ onBack, onToggleTheme, getTheme }) {
  const settingsBackButton = document.getElementById('settingsBackButton');
  const notificationButton = document.getElementById('settingsNotificationButton');
  const privacyButton = document.getElementById('settingsPrivacyButton');
  const themeToggleButton = document.getElementById('settingsThemeToggleButton');
  const themeLabel = document.getElementById('settingsThemeLabel');

  if (settingsBackButton) {
    settingsBackButton.addEventListener('click', () => {
      if (onBack) onBack();
    });
  }

  if (notificationButton) {
    notificationButton.addEventListener('click', () => {
      alert('Notification settings coming soon.');
    });
  }

  if (privacyButton) {
    privacyButton.addEventListener('click', () => {
      alert('Privacy settings coming soon.');
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
      if (themeLabel) {
        themeLabel.textContent = theme === 'dark' ? 'Dark mode is active.' : 'Light mode is active.';
      }
      if (themeToggleButton) {
        themeToggleButton.textContent = theme === 'dark' ? 'Switch to Light Mode' : 'Toggle Dark Mode';
      }
    },
  };
}
