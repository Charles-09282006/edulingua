import { courses } from '../scripts/data/courses.js';

export function renderHome({ onLessonOpen }) {
  const container = document.getElementById('courseGrid');
  const streakPill = document.getElementById('streakPill');
  const pathPill = document.getElementById('pathPill');
  const streakValue = document.getElementById('streakValue');
  const xpValue = document.getElementById('xpValue');
  const badgeSummary = document.getElementById('badgeSummary');
  const reminderMessage = document.getElementById('reminderMessage');
  const dailyChallengeTitle = document.getElementById('dailyChallengeTitle');
  const dailyChallengeDescription = document.getElementById('dailyChallengeDescription');
  const dailyChallengeButton = document.getElementById('dailyChallengeButton');

  function getRecommendedCourses(pathLevels) {
    if (!container) return [];
    const activeLevels = pathLevels && pathLevels.length ? pathLevels : ['beginner'];
    const recommended = courses.filter((course) => activeLevels.includes(course.level));
    return recommended.length ? recommended : courses;
  }

  function renderCourses(pathLevels) {
    if (!container) return;
    const availableCourses = getRecommendedCourses(pathLevels);
    container.innerHTML = availableCourses
      .map(
        (course) => `
      <article class="course-card">
        <div class="course-meta">${course.language}</div>
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <button class="tertiary-button" data-course-id="${course.id}">Start lesson</button>
      </article>
    `
      )
      .join('');
  }

  if (container) {
    container.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-course-id]');
      if (!button) return;
      const courseId = button.dataset.courseId;
      const course = courses.find((item) => item.id === courseId);
      if (!course) return;
      onLessonOpen(course);
    });
  }

  if (dailyChallengeButton) {
    dailyChallengeButton.addEventListener('click', () => {
      if (typeof onLessonOpen === 'function') {
        onLessonOpen('spanish-basics-1');
      }
    });
  }

  function update({ streak, xp, badges, pathName, recommendedCourseLevels, reminderMessage: message, dailyChallenge }) {
    renderCourses(recommendedCourseLevels);
    if (streakPill) streakPill.textContent = `${streak}-day streak`;
    if (pathPill) pathPill.textContent = pathName;
    if (streakValue) streakValue.textContent = `${streak}-day streak`;
    if (xpValue) xpValue.textContent = `${xp} XP`;
    if (reminderMessage) reminderMessage.textContent = message;
    if (dailyChallengeTitle) dailyChallengeTitle.textContent = dailyChallenge.title;
    if (dailyChallengeDescription) dailyChallengeDescription.textContent = dailyChallenge.description;
    if (dailyChallengeButton) {
      dailyChallengeButton.textContent = dailyChallenge.completed ? 'Completed' : 'View challenge';
      dailyChallengeButton.disabled = dailyChallenge.completed;
    }
    if (badgeSummary) {
      badgeSummary.textContent = badges.length
        ? `${badges.length} badge${badges.length > 1 ? 's' : ''} earned`
        : 'No badges earned yet';
    }
  }

  return {
    update,
  };
}
