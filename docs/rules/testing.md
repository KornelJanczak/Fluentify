# Testing Rules

- Test observable behavior and important failure paths rather than implementation details.
- Start with the narrowest relevant command and keep tests deterministic, isolated, and readable.
- Backend tests use pytest; unit-test pure service logic, integration-test repository/database behavior, and use deterministic fake AI dependencies. Real LLM calls do not belong in ordinary tests.
- Frontend tests use Vitest, React Testing Library, `user-event`, and MSW. Use Playwright for meaningful browser workflows.
- Cover success, validation, loading, empty, error, and interaction states where they apply.
- Add a regression test for a fixed bug. Do not weaken or delete tests to make an implementation pass.
- Prefer accessible selectors in frontend tests and factories over stale shared fixtures.
