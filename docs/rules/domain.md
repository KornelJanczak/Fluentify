# Domain Language

- Use the vocabulary established by the product and architecture docs: flashcard set, flashcard, example sentence, study chat, error analysis, learning progress, spaced repetition, and user ownership.
- Keep business rules in the application/domain layer rather than in routers, ORM models, UI components, or provider adapters.
- Do not invent domain behavior while implementing infrastructure work. When a new business rule or ambiguous term appears, ask or document the decision in `docs/`.
- Keep the backend as the source of truth for validation and learning behavior; the frontend should present backend contracts.