# EduLingua

A responsive web app scaffold for a language learning experience inspired by Duolingo.

## Project Structure

- `index.html` — single-page scaffold with screen sections
- `styles/style.css` — responsive UI styles and layout
- `scripts/app.js` — entry point and navigation state management
- `scripts/screens/` — screen-specific logic modules
- `components/` — reusable UI helper modules
- `assets/` — place images, icons, and branding assets here

## Navigation Flow

1. Landing Page
2. Sign Up / Login
3. 7 Questions onboarding for new users
4. Home screen with course selection
5. Lesson preview screen
6. Profile screen

## Notes

- Focus is on UI scaffolding and navigation only.
- TODOs are included for gamification, streaks, notifications, and lesson content.

## OpenAI integration

This project now includes a small API server for generating actual translated lesson content using OpenAI.

1. Copy `.env.example` to `.env`.
2. Set `OPENAI_API_KEY` in `.env`.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:3000` in your browser.

The server exposes `/api/lesson-content` and serves the static app so lesson content can be generated securely without embedding the API key in the client.
