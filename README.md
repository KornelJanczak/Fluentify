# Fluentify: Node.js, Express, TS, Postgre SQL, Redis, Next.js 15

## Application Description 📋
This platform is a comprehensive solution for learning languages, powered by AI. It's also my most ambitious full-stack project to date, with my primary focus being on the backend so far.

Currently, the app supports learning English, German, Spanish, French, Italian, and potentially more languages in the future.

The standout feature of the platform is the AI tutor, which offers low-latency audio conversations. It enables users to both send voice messages and receive spoken responses, creating an immersive and interactive learning experience.

## Key features 🔑: (Already implemented)
- Voice AI Responses – Enables spoken feedback with low latency (not yet real-time, but improving this is a future goal).
- Customizable Tutor Profiles – Choose the tutor’s accent, origin, and language proficiency level (aligned with CEFR standards)
- Vocabulary Learning – Leverages flashcard sets for effective vocabulary acquisition.
- Authentication – Secure login via OAuth with session management powered by Redis.
- Vocabulary Management – Full CRUD functionality for creating and managing vocabulary sets.
- Flashcard Management – Full CRUD functionality for flashcards.
- 100% written in TS
- Backend Architecture – OOP and adheres strictly to OOP and SOLID principles.


## Key features 🔑: (In progress...)
- Speech to Text – Converts user speech to text for Voice AI chat functionality.
- Feedback Based on Conversations – Tracks what the user has learned and provides suggestions on areas to practice to improve language skills.
- Completing the rest of UI 
- Redis Cache
- Queues 
- Written Mode for Flashcards
- Learn Mode for Flashcards 
- Translations for AI Responses
- Correction Mode for User Responses – Analyzes user responses via AI and offers corrections for better learning outcomes.

## Main tools (Backend) 🛠
- Node.js
- Typescript
- Express
- Vercel AI SDK
- Google Text To Speech
- PostgreSQL
- Drizzle ORM
- Redis
- Awilix
- Winston


## Main tools (Frontend) 🛠
- Next.js 15
- React.js 15
- Typescript
- Vercel AI SDK
- ShadcnUI
- Tailwind CSS

## License
[MIT](https://choosealicense.com/licenses/mit/)
