export function renderProfile() {
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profileStreak = document.getElementById('profileStreak');
  const profileXp = document.getElementById('profileXp');
  const profileCompleted = document.getElementById('profileCompleted');
  const profileBadges = document.getElementById('profileBadges');
  const profileSyncMessage = document.getElementById('profileSyncMessage');

  function update({ userName, userEmail, streak, xp, badges, completedLessons, profileSyncMessage: syncMessage }) {
    if (profileName) {
      profileName.textContent = userName || 'EduLingua learner';
    }

    if (profileEmail) {
      profileEmail.textContent = userEmail || 'Not signed in';
    }

    if (profileStreak) {
      profileStreak.textContent = streak
        ? `${streak} days of streak progress`
        : '0 days yet — complete a lesson to start your streak.';
    }

    if (profileXp) {
      profileXp.textContent = `${xp} XP`;
    }

    if (profileCompleted) {
      profileCompleted.textContent = completedLessons && completedLessons.length
        ? `${completedLessons.length} lesson${completedLessons.length === 1 ? '' : 's'} completed`
        : 'No lessons completed yet.';
    }

    if (profileBadges) {
      if (!badges || !badges.length) {
        profileBadges.innerHTML = '<p>No badges earned yet.</p>';
      } else {
        profileBadges.innerHTML = badges
          .map((badge) => `<span class="badge-pill">${badge}</span>`)
          .join('');
      }
    }

    if (profileSyncMessage) {
      if (syncMessage) {
        profileSyncMessage.textContent = syncMessage;
        profileSyncMessage.classList.remove('hidden');
      } else {
        profileSyncMessage.textContent = '';
        profileSyncMessage.classList.add('hidden');
      }
    }
  }

  return {
    update,
  };
}
