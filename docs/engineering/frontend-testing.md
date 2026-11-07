# Frontend Testing Practices

## Principles

- Test observable, user-visible behavior rather than implementation details.
- Start with the narrowest relevant test.
- Cover important success, loading, error, and interaction paths.
- Keep tests deterministic, isolated, and readable.
- Prefer accessible selectors over implementation-specific selectors.

## Stack

- Vitest is the unit and component test runner.
- React Testing Library and `user-event` verify accessible component
  behavior.
- MSW provides deterministic API mocks for unit and component tests.
- Playwright covers meaningful browser workflows and cross-boundary behavior.

## Test scope

- Use Vitest for utility functions, hooks, and isolated component behavior.
- Keep end-to-end tests for workflows that cross meaningful boundaries.
- Use Playwright for browser-level flows such as opening a flashcard set,
  sending a chat message, and displaying an AI correction.

## Commands

Run commands from `frontend/`:

```bash
bun run test
bun run test:watch
bun run test:e2e
bun run lint
```

Vitest tests use `.test.` or `.spec.` filenames. Playwright tests should live
under `frontend/tests/` or `frontend/e2e/`.
