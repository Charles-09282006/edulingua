const onboardingQuestions = [
  'What is your current language level?',
  'What is your main learning goal?',
  'How many minutes can you study each day?',
  'Which language do you want to learn first?',
  'Do you prefer reading, speaking, or listening practice?',
  'Will you use mobile lessons, desktop, or both?',
  'What motivates you to keep learning?'
];

export function renderQuestions({ onComplete }) {
  const container = document.getElementById('questionContainer');
  const nextButton = document.getElementById('questionNextButton');
  const skipButton = document.getElementById('skipQuestionsButton');
  let currentIndex = 0;

  function updateQuestion() {
    const question = onboardingQuestions[currentIndex];
    container.innerHTML = `
      <div class="question-card">
        <h3>Question ${currentIndex + 1}</h3>
        <p>${question}</p>
        <label>
          Your answer
          <input type="text" class="question-input" placeholder="Type your answer here" />
        </label>
      </div>
    `;
  }

  nextButton.addEventListener('click', () => {
    currentIndex += 1;
    if (currentIndex >= onboardingQuestions.length) {
      onComplete();
      return;
    }
    updateQuestion();
  });

  skipButton.addEventListener('click', onComplete);
  updateQuestion();
}
