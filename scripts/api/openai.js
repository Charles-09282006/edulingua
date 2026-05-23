export async function fetchAiLessonContent(course) {
  if (!course || !course.id) return null;

  try {
    const response = await fetch('/api/lesson-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseId: course.id,
        title: course.title,
        language: course.language,
        level: course.level,
      }),
    });

    if (!response.ok) {
      console.warn('OpenAI lesson API returned', response.status);
      return null;
    }

    const payload = await response.json();
    return payload.lesson || null;
  } catch (error) {
    console.warn('Failed to fetch AI lesson content:', error);
    return null;
  }
}
