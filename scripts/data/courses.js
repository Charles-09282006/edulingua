export const courses = [
  {
    id: 'spanish-basics-1',
    level: 'beginner',
    language: 'Spanish',
    title: 'Basics 1',
    description: 'Start with greetings, numbers, and simple phrases.',
    lesson: {
      title: 'Spanish Basics 1',
      subtitle: 'Friendly onboarding with core vocabulary.',
      steps: [
        {
          type: 'intro',
          title: 'Welcome to your first lesson',
          text: 'In this lesson, you will learn key Spanish words with quick practice and visual memory prompts.',
        },
        {
          type: 'vocab',
          title: 'Key phrase',
          word: 'Hola',
          translation: 'Hello',
          example: 'Hola, ¿cómo estás?',
        },
        {
          type: 'choice',
          title: 'Choose the correct translation',
          prompt: 'How do you say "Hello" in Spanish?',
          options: ['Adiós', 'Hola', 'Gracias'],
          answerIndex: 1,
        },
        {
          type: 'vocab',
          title: 'Useful word',
          word: 'Gracias',
          translation: 'Thank you',
          example: 'Gracias por tu ayuda.',
        },
        {
          type: 'choice',
          title: 'Choose the matching phrase',
          prompt: 'Which phrase means "Thank you"?',
          options: ['Por favor', 'Gracias', 'Lo siento'],
          answerIndex: 1,
        },
        {
          type: 'review',
          title: 'Lesson recap',
          text: 'Great job! You learned Hola and Gracias, and practiced translating simple greetings. Review these words to lock them into memory.',
          reviewItems: [
            { word: 'Hola', translation: 'Hello' },
            { word: 'Gracias', translation: 'Thank you' },
          ],
        },
      ],
    },
  },
  {
    id: 'french-intro',
    level: 'beginner',
    language: 'French',
    title: 'Intro course',
    description: 'Practice pronunciation and everyday vocabulary.',
    lesson: {
      title: 'French Intro',
      subtitle: 'A warm start for new French learners.',
      steps: [
        {
          type: 'intro',
          title: 'Bonjour, future speaker',
          text: 'This lesson introduces common French greetings and phrases for travel and chat.',
        },
        {
          type: 'choice',
          title: 'Say hello',
          prompt: 'How do you say "Good morning" in French?',
          options: ['Bonsoir', 'Bonne nuit', 'Bonjour'],
          answerIndex: 2,
        },
        {
          type: 'review',
          title: 'Great start',
          text: 'You are building a foundation. Keep the pace and return daily for streak progress.',
        },
      ],
    },
  },
  {
    id: 'japanese-path',
    level: 'beginner',
    language: 'Japanese',
    title: 'Learning path',
    description: 'Build your first phrases with interactive challenges.',
    lesson: {
      title: 'Japanese Starter',
      subtitle: 'Begin with simple words and structure.',
      steps: [
        {
          type: 'intro',
          title: 'First Japanese phrases',
          text: 'Learn the greeting word used throughout the day and practice recognizing it.',
        },
        {
          type: 'choice',
          title: 'Select the right greeting',
          prompt: 'Which option means "Good morning" in Japanese?',
          options: ['こんばんは', 'おはよう', 'ありがとう'],
          answerIndex: 1,
        },
        {
          type: 'review',
          title: 'Keep your momentum',
          text: 'Review your answers and get ready for the next lesson in your learning path.',
        },
      ],
    },
  },
  {
    id: 'spanish-core-2',
    level: 'medium',
    language: 'Spanish',
    title: 'Core conversation',
    description: 'Move beyond basics with everyday phrases and short dialogs.',
    lesson: {
      title: 'Spanish Core Conversation',
      subtitle: 'Build confidence with practical spoken phrases.',
      steps: [
        {
          type: 'intro',
          title: 'Everyday expressions',
          text: 'Practice common Spanish phrases used in cafes, markets, and greetings.',
        },
        {
          type: 'choice',
          title: 'Choose the right phrase',
          prompt: 'Which phrase means "Can I have a coffee?"?',
          options: ['¿Dónde está?', '¿Puedo tomar un café?', 'Muchas gracias'],
          answerIndex: 1,
        },
        {
          type: 'vocab',
          title: 'Useful phrase',
          word: 'Por favor',
          translation: 'Please',
          example: 'Un café, por favor.',
        },
      ],
    },
  },
  {
    id: 'french-conversation',
    level: 'intermediate',
    language: 'French',
    title: 'Conversation practice',
    description: 'Practice short exchanges and expand your sentence-building skills.',
    lesson: {
      title: 'French Conversation Practice',
      subtitle: 'Link words into fuller sentences with confidence.',
      steps: [
        {
          type: 'intro',
          title: 'French conversation',
          text: 'Learn how to ask questions, give answers, and keep the conversation flowing.',
        },
        {
          type: 'choice',
          title: 'Choose the correct reply',
          prompt: 'How do you say "I would like a table for two" in French?',
          options: ['Je voudrais une table pour deux', 'Je suis fatigué', 'Où est la gare?'],
          answerIndex: 0,
        },
        {
          type: 'review',
          title: 'Conversation review',
          text: 'These phrases help you move from basic vocabulary to real conversation.',
        },
      ],
    },
  },
  {
    id: 'japanese-fluency-3',
    level: 'advanced',
    language: 'Japanese',
    title: 'Fluency challenge',
    description: 'Tackle advanced expressions, listening cues, and nuanced meaning.',
    lesson: {
      title: 'Japanese Fluency Challenge',
      subtitle: 'Develop more natural, fluent Japanese responses.',
      steps: [
        {
          type: 'intro',
          title: 'Advanced Japanese',
          text: 'Explore phrases and grammar used by fluent speakers in daily life.',
        },
        {
          type: 'choice',
          title: 'Understand the nuance',
          prompt: 'Which sentence expresses polite refusal in Japanese?',
          options: ['はい、もちろん', 'すみません、ちょっと...', 'これをください'],
          answerIndex: 1,
        },
        {
          type: 'review',
          title: 'Fluency recap',
          text: 'Keep practicing these richer expressions to advance your conversational flow.',
        },
      ],
    },
  },
];
