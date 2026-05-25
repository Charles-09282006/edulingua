import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());

const openaiKey = process.env.OPENAI_API_KEY;
if (!openaiKey) {
  console.warn('Warning: OPENAI_API_KEY is not set. /api/lesson-content endpoint will fail until it is configured.');
}

const openai = new OpenAI({ apiKey: openaiKey });

function buildLessonPrompt({ title, language, level }) {
  return `Generate a structured lesson for a language learner.
Return only valid JSON with a top-level object containing {"steps": [...]}.
The lesson should be appropriate for a ${level} learner of ${language}.
Include 4 to 5 steps with the following types: intro, vocab, choice, review.
For vocab steps, include a target-language word, its English translation, and an example sentence.
For choice steps, provide 3 options and an integer answerIndex.
For review steps, include an array of reviewItems with word and translation.
Use actual ${language} words and realistic English translations.

Example output structure:
{
  "steps": [
    {"type":"intro","title":"...","text":"..."},
    {"type":"vocab","title":"...","word":"...","translation":"...","example":"..."},
    {"type":"choice","title":"...","prompt":"...","options":["..."],"answerIndex":0},
    {"type":"review","title":"...","text":"...","reviewItems":[{"word":"...","translation":"..."}]}
  ]
}

Now create the lesson for the course titled \"${title}\" in ${language}.`;
}

function parseLessonJson(rawText) {
  const trimmed = rawText.trim();
  try {
    return JSON.parse(trimmed);
  } catch (parseError) {
    const jsonStart = trimmed.indexOf('{');
    const jsonEnd = trimmed.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = trimmed.slice(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString);
    }
    throw parseError;
  }
}

app.post('/api/lesson-content', async (req, res) => {
  if (!openaiKey) {
    return res.status(500).json({ error: 'OpenAI API key is not configured on the server.' });
  }

  const { courseId, title, language, level } = req.body;
  if (!courseId || !language || !title || !level) {
    return res.status(400).json({ error: 'Missing required course metadata.' });
  }

  try {
    const prompt = buildLessonPrompt({ title, language, level });
    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
      temperature: 0.8,
      max_output_tokens: 700,
    });

    const rawOutput = response.output_text || response.output?.[0]?.content?.[0]?.text || '';
    const lesson = parseLessonJson(rawOutput);
    if (!lesson || !Array.isArray(lesson.steps)) {
      return res.status(502).json({ error: 'OpenAI returned invalid lesson data.' });
    }

    return res.json({ lesson });
  } catch (error) {
    console.error('OpenAI lesson generation error:', error);
    return res.status(500).json({ error: 'Failed to generate lesson content.' });
  }
});
app.post('/api/tts', async (req, res) => {
  if (!openaiKey) {
    return res.status(500).json({ error: 'OpenAI API key is not configured on the server.' });
  }

  const { text, voice = 'alloy', format = 'mp3' } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Missing required text field.' });
  }

  try {
    const response = await openai.audio.speech.create({
      model: 'gpt-4o-mini-tts',
      voice,
      input: text,
      format,
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = format === 'wav' ? 'audio/wav' : 'audio/mpeg';
    res.setHeader('Content-Type', contentType);
    return res.send(buffer);
  } catch (error) {
    console.error('OpenAI TTS error:', error);
    return res.status(500).json({ error: 'Failed to generate speech audio.' });
  }
});
app.use(express.static(__dirname));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`EduLingua server running at http://localhost:${port}`);
});
