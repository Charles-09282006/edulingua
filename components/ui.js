export function createCard(title, description, actionText) {
  const card = document.createElement('article');
  card.className = 'course-card';
  card.innerHTML = `
    <div class="course-meta">Sample</div>
    <h3>${title}</h3>
    <p>${description}</p>
    <button class="tertiary-button">${actionText}</button>
  `;
  return card;
}

// TODO: Build reusable UI components for cards, modals, notifications, and progress widgets.
