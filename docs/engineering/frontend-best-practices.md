# Frontend Best Practices

## Components

- Keep components focused on one UI responsibility.
- Prefer composition over large conditional components.
- Keep business rules in services or domain-oriented helpers rather than JSX.
- Reuse existing primitives before creating new UI components.

## User Experience

- Support loading, empty, error, and success states.
- Preserve keyboard navigation and visible focus states.
- Keep layouts usable on narrow screens.
- Use clear, consistent action names.

## Data Fetching

- Use native `fetch` in Server Components and Server Actions so requests can use the server rendering and caching model.
- Use TanStack Query in Client Components for REST queries and mutations that need browser-side loading, caching, retries, or invalidation.
- Keep API request helpers and query keys in `frontend/lib/` or a feature-oriented data module, not inside JSX.
- Check `response.ok` and translate backend failures into a consistent error shape before rendering them.
- Use query invalidation after mutations when the server is the source of truth.
- Keep LangGraph SSE streaming separate from TanStack Query; use the existing `useStream` integration for the study chat.
- Resolve the browser-to-FastAPI transport through CORS or a same-origin Next.js proxy before introducing a client-side REST query.

## Testing Data Fetching

- Use MSW to mock FastAPI responses in TanStack Query component tests.
- Test observable loading, success, empty, error, and mutation states rather than QueryClient internals.
- Keep query keys deterministic so tests can isolate and invalidate cached data.

## Changes

- Inspect nearby components before introducing a new pattern.
- Keep data-fetching and mutation behavior easy to test.
- Update this document when a project-wide frontend convention is agreed.
