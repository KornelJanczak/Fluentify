# Architecture Overview

> Initial project documentation. Expand this document when the architecture becomes more settled.

## Product

English AI Tutor is a backend-first application for learning English through flashcards, generated example sentences, spaced repetition, and an AI study chat.

## Main Areas

- `backend/` — FastAPI application, persistence, AI integrations, and LangGraph entry points.
- `frontend/` — Next.js user interface.
- `docs/` — architecture, engineering practices, and architectural decisions.

## Current Boundaries

The backend currently separates API routers, application services, repositories, database models, schemas, and AI infrastructure. The frontend should consume backend contracts without duplicating backend business rules.

## Request Flow

1. A client sends a request to a router.
2. The router validates input and resolves dependencies.
3. A service coordinates the use case.
4. Repositories and infrastructure integrations perform I/O.
5. The router maps the result to an API schema.

## Open Questions

- Where should authentication and user ownership boundaries live?
- Which AI workflows belong in LangGraph versus ordinary services?
- What is the long-term frontend data-fetching strategy?
