import { courses } from '../scripts/data/courses.js';
import { fetchAiLessonContent, fetchTextToSpeech } from '../scripts/api/openai.js';

export function renderLesson({ onComplete, onCancel }) {
  const lessonTitle = document.getElementById('lessonTitle');
  const lessonSubtitle = document.getElementById('lessonSubtitle');
  const lessonContent = document.getElementById('lessonContent');
  const lessonXpValue = document.getElementById('lessonXpValue');
  const lessonStreakValue = document.getElementById('lessonStreakValue');
  const lessonBadgeCount = document.getElementById('lessonBadgeCount');
  const stepCounter = document.getElementById('lessonStepCounter');
  const progressFill = document.querySelector('#lessonScreen .progress-fill');
  const nextButton = document.getElementById('lessonNextButton');
  const backButton = document.getElementById('backToHomeButton');

  let currentCourse = null;
  let currentStep = 0;
  let selectedChoiceIndex = null;
  let lessonContext = {};
  let activeAudio = null;
  let activeAudioUrl = null;

  function createPlayButton(text) {
    return `
      <button type="button" class="play-button" data-audio-text="${encodeURIComponent(
        String(text || '')
      )}">
        🔊 Listen
      </button>
    `;
  }

  function speakText(text, button) {
    if (!window.speechSynthesis || !text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentCourse?.language === 'Spanish'
      ? 'es-ES'
      : currentCourse?.language === 'French'
      ? 'fr-FR'
      : currentCourse?.language === 'Japanese'
      ? 'ja-JP'
      : 'en-US';

    utterance.onend = () => {
      if (button) {
        button.disabled = false;
        button.classList.remove('loading');
      }
    };

    utterance.onerror = () => {
      if (button) {
        button.disabled = false;
        button.classList.remove('loading');
      }
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  async function playText(text, button) {
    if (!text) return;
    if (activeAudio) {
      activeAudio.pause();
      if (activeAudioUrl) {
        URL.revokeObjectURL(activeAudioUrl);
        activeAudioUrl = null;
      }
      activeAudio = null;
    }

    if (button) {
      button.disabled = true;
      button.classList.add('loading');
    }

    try {
      const audioBlob = await fetchTextToSpeech(text);
      if (!audioBlob) {
        throw new Error('No audio returned');
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      activeAudioUrl = audioUrl;
      activeAudio = new Audio(audioUrl);
      activeAudio.addEventListener(
        'ended',
        () => {
          if (button) {
            button.disabled = false;
            button.classList.remove('loading');
          }
          URL.revokeObjectURL(audioUrl);
          activeAudioUrl = null;
          activeAudio = null;
        },
        { once: true }
      );

      await activeAudio.play();
    } catch (error) {
      console.error('Text-to-speech failed, falling back to browser TTS', error);
      speakText(text, button);
    }
  }

  function attachPlayButtonListeners() {
    const playButtons = lessonContent.querySelectorAll('.play-button');
    playButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const encodedText = button.getAttribute('data-audio-text') || '';
        const text = decodeURIComponent(encodedText);
        playText(text, button);
      });
    });
  }

  function getStep() {
    return currentCourse?.lesson.steps[currentStep];
  }

  function updateProgress() {
    const stepCount = currentCourse.lesson.steps.length;
    stepCounter.textContent = `Step ${currentStep + 1} of ${stepCount}`;
    const percent = Math.round((currentStep / Math.max(stepCount - 1, 1)) * 100);
    if (progressFill) progressFill.style.width = `${percent}%`;
  }

  function renderChoiceFeedback(step) {
    const feedback = lessonContent.querySelector('.feedback-text');
    if (!feedback) return;
    if (selectedChoiceIndex === null) {
      feedback.textContent = 'Select an answer to reveal instant feedback.';
      feedback.classList.remove('correct', 'incorrect');
      return;
    }

    const isCorrect = selectedChoiceIndex === step.answerIndex;
    feedback.textContent = isCorrect
      ? 'Correct! ¡Muy bien!'
      : 'Not quite. Try again next time and keep practicing those phrases.';
    feedback.classList.toggle('correct', isCorrect);
    feedback.classList.toggle('incorrect', !isCorrect);
  }

  function renderReviewStep(step) {
    const items = step.reviewItems || [];
    const reviewCards = items
      .map(
        (item) => `
        <div class="review-card">
          <p class="vocab-word">${item.word}</p>
          <p class="vocab-translation">${item.translation}</p>
        </div>
      `
      )
      .join('');

    lessonContent.innerHTML = `
      <div class="lesson-card lesson-step review-summary">
        <h3>${step.title}</h3>
        <p>${step.text}</p>
        ${step.text ? createPlayButton(step.text) : ''}
        <div class="review-grid">
          ${reviewCards || '<p class="feedback-text">Review the lesson content and keep practicing on your next session.</p>'}
        </div>
      </div>
    `;
    attachPlayButtonListeners();
  }

  function renderStep() {
    const step = getStep();
    if (!step || !lessonContent) return;

    lessonTitle.textContent = currentCourse.lesson.title;
    lessonSubtitle.textContent = currentCourse.lesson.subtitle;
    updateProgress();
    updateGamificationPanel();

    const rewardText = step.type === 'choice'
      ? 'Earn 15 XP for a quick win.'
      : step.type === 'vocab'
      ? 'Earn 10 XP by mastering this word.'
      : 'Earn 5 XP by completing this step.';

    if (step.type === 'vocab') {
      lessonContent.innerHTML = `
        <div class="lesson-card lesson-step vocab-card">
          <div class="reward-pill">${rewardText}</div>
          <h3>${step.title}</h3>
          <p class="vocab-word">${step.word}</p>
          <p class="vocab-translation">${step.translation}</p>
          ${createPlayButton(`${step.word}: ${step.translation}. ${step.example}`)}
          <p>${step.example}</p>
        </div>
      `;
    } else if (step.type === 'choice') {
      lessonContent.innerHTML = `
        <div class="lesson-card lesson-step">
          <div class="reward-pill">${rewardText}</div>
          <h3>${step.title}</h3>
          <p>${step.prompt}</p>
          ${createPlayButton(step.prompt)}
          <div class="option-grid">
            ${step.options
              .map(
                (option, index) => `
              <button type="button" class="option-button ${selectedChoiceIndex === index ? 'active' : ''}" data-index="${index}">
                ${option}
              </button>
            `
              )
              .join('')}
          </div>
          <p class="feedback-text">Select an answer to reveal instant feedback.</p>
        </div>
      `;
    } else if (step.type === 'review') {
      renderReviewStep(step);
    } else {
      lessonContent.innerHTML = `
        <div class="lesson-card lesson-step">
          <h3>${step.title}</h3>
          <p>${step.text}</p>
          ${step.text ? createPlayButton(step.text) : ''}
        </div>
      `;
    }

    const isLast = currentStep === currentCourse.lesson.steps.length - 1;
    nextButton.textContent = isLast ? 'Finish lesson' : 'Continue lesson';

    if (step.type === 'choice') {
      const optionButtons = lessonContent.querySelectorAll('.option-button');
      optionButtons.forEach((button) => {
        button.addEventListener('click', () => {
          selectedChoiceIndex = Number(button.dataset.index);
          optionButtons.forEach((btn) => {
            btn.classList.toggle('active', btn === button);
          });
          renderChoiceFeedback(step);
        });
      });
      renderChoiceFeedback(step);
    }

    attachPlayButtonListeners();
  }

  const completionModal = document.getElementById('lessonCompleteModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const modalCloseButton = document.getElementById('modalCloseButton');

  function setModalVisibility(visible) {
    if (!completionModal) return;
    completionModal.classList.toggle('hidden', !visible);
  }

  function showCompletionModal() {
    const stepCount = currentCourse.lesson.steps.length;
    if (modalTitle) modalTitle.textContent = `${currentCourse.language} lesson complete!`;
    if (modalMessage) {
      modalMessage.textContent = `You completed ${stepCount} steps and earned your first XP rewards.`;
    }
    setModalVisibility(true);
  }

  function updateGamificationPanel() {
    if (lessonXpValue) {
      lessonXpValue.textContent = `${lessonContext.xp || 0} XP`;
    }
    if (lessonStreakValue) {
      const streakDays = lessonContext.streak || 0;
      lessonStreakValue.textContent = `${streakDays} day${streakDays === 1 ? '' : 's'}`;
    }
    if (lessonBadgeCount) {
      lessonBadgeCount.textContent = `${(lessonContext.badges || []).length} earned`;
    }
  }

  function closeModal() {
    setModalVisibility(false);
    onComplete();
  }

  async function open(courseOrId, context = {}) {
    const selectedCourse = typeof courseOrId === 'string'
      ? courses.find((course) => course.id === courseOrId)
      : courseOrId;

    currentCourse = selectedCourse || courses[0];
    currentStep = 0;
    selectedChoiceIndex = null;
    setModalVisibility(false);

    if (lessonContent) {
      lessonContent.innerHTML = `
        <div class="lesson-card lesson-step">
          <h3>Loading lesson content...</h3>
          <p>Please wait while we generate examples and translations for ${currentCourse.language}.</p>
        </div>
      `;
    }

    const aiLesson = await fetchAiLessonContent(currentCourse);
    if (aiLesson && Array.isArray(aiLesson.steps) && aiLesson.steps.length) {
      currentCourse = {
        ...currentCourse,
        lesson: {
          ...currentCourse.lesson,
          steps: aiLesson.steps,
        },
      };
    }

    renderStep();
  }

  nextButton.addEventListener('click', () => {
    const step = getStep();
    if (!step) return;

    if (step.type === 'choice' && selectedChoiceIndex === null) {
      nextButton.textContent = 'Select an answer first';
      return;
    }

    if (currentStep < currentCourse.lesson.steps.length - 1) {
      currentStep += 1;
      selectedChoiceIndex = null;
      renderStep();
      return;
    }

    showCompletionModal();
  });

  backButton.addEventListener('click', () => {
    if (onCancel) onCancel();
  });
  if (modalCloseButton) modalCloseButton.addEventListener('click', closeModal);

  return {
    open,
  };
}
