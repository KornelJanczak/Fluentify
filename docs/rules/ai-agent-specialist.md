# AI and Architecture

## Boundaries

- Keep HTTP concerns in FastAPI routers and dependencies.
- Keep use-case orchestration in services.
- Keep persistence in repositories and provider-specific integrations in infrastructure.
- Keep domain decisions independent from FastAPI, SQLAlchemy, and AI SDK details where practical.
- Keep AI provider clients, prompts, model profiles, structured output, retries, and tracing under `backend/app/infrastructure/ai/`.
- Use LangGraph for multi-step, conditional, streaming, resumable, or checkpointed workflows. Keep a single model call in an ordinary service.

## Errors and Security

- Validate external input with Pydantic schemas at the API boundary.
- Raise explicit domain or infrastructure exceptions and map them to stable API errors in the adapter layer.
- Do not catch broad exceptions in graph nodes or return success-shaped empty state.
- Never log secrets, tokens, passwords, or unredacted sensitive user data.
- Treat a client-controlled LangGraph `thread_id` as a checkpoint key, never as authorization.
- Authorize ownership before invoking workflows or accessing user-owned data.

## AI Reliability

- Keep workflow state serializable and limited to data needed to move the workflow forward. Never put sessions, requests, ORM instances, provider clients, or secrets in state.
- PostgreSQL remains the source of truth; graph checkpoints hold temporary resumable progress.
- Persist model, prompt, and workflow versions with important generated business data.
- Use deterministic fake dependencies in ordinary tests. Use LangSmith datasets or evaluators for model-quality and prompt-regression checks.