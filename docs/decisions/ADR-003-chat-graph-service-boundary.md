# ADR-003: Separate Chat Graph Orchestration Service

- Status: Proposed
- Date: 2026-11-05

## Context

The study chat currently runs its LangGraph workflow inside the FastAPI
application. FastAPI creates the graph and its PostgreSQL checkpointer, while
the workflow nodes call a study-chat service that also owns flashcard
authorization, domain persistence, and AI execution.

This couples graph runtime concerns to the business application and makes it
difficult for the frontend to use the native LangGraph protocol. It also makes
the graph entry point depend on application services that are not available
when LangGraph runs as an independent server.

## Decision

Create a separate `chat-graph/` service responsible for study-chat workflow
orchestration. The service owns:

- LangGraph graph construction and execution;
- workflow nodes and serializable workflow state;
- AI provider clients, prompts, and model profiles used by the workflow;
- LangGraph checkpoint storage and checkpoint lifecycle;
- the native LangGraph API consumed by the frontend.

FastAPI remains the system of record and owns:

- user authentication and authorization;
- flashcard sets, flashcards, learning progress, and error analyses;
- repositories, SQLAlchemy sessions, and transaction boundaries;
- business validation and ownership checks;
- internal API contracts used by `chat-graph`.

`chat-graph` communicates with FastAPI through authenticated HTTP API calls.
It must not import FastAPI ORM models, repositories, sessions, or application
services. The graph may forward the user's JWT to FastAPI, but FastAPI must
validate the token and re-check resource ownership for every business request.
A `thread_id` is a checkpoint identifier and must not be used as an
authorization mechanism.

The frontend uses the native LangGraph SDK/protocol to communicate with
`chat-graph`. A custom WebSocket or SSE adapter is only added if the native
protocol cannot satisfy the required streaming behavior.

## Alternatives Considered

### Keep LangGraph inside FastAPI

Rejected as the target architecture. It keeps the current coupling between
the FastAPI lifecycle, graph execution, and checkpoint ownership, and prevents
the frontend from treating LangGraph as an independent runtime.

### Move the complete study-chat service into `chat-graph`

Rejected. This would duplicate or relocate business rules, persistence, and
authorization into the orchestration service, creating a second backend
instead of a focused graph boundary.

### Share FastAPI Python internals with `chat-graph`

Rejected. Importing ORM models, repositories, or database sessions across the
service boundary would make independent deployment and testing unreliable.

## Consequences

Positive consequences:

- LangGraph can be deployed and scaled independently from FastAPI.
- The frontend can use the native LangGraph protocol.
- FastAPI remains the single owner of domain data and authorization.
- Workflow nodes can be tested with a fake business API client.
- Checkpoint ownership and graph lifecycle become explicit.

Negative consequences:

- Business operations now incur network latency and can fail independently.
- Internal API calls require timeout, retry, error-mapping, and idempotency
  rules.
- JWT propagation and service-to-service trust must be secured and tested.
- History may combine LangGraph checkpoint data with FastAPI-owned analyses.
- Local development and deployment require two independently configured
  services.

## Migration Constraints

- Preserve existing `thread_id` semantics where possible.
- Preserve persisted analysis data and existing database tables.
- Do not change prompts or model behavior as part of the service extraction.
- Move checkpoint ownership to `chat-graph` only after checkpoint resume has
  been verified.
- Remove local graph creation from FastAPI only after the new frontend path is
  validated.

## Related Decisions

- `ADR-001-layered-backend.md` defines the backend layering and dependency
  direction.
- `ADR-002-ai-infrastructure-boundary.md` defines the boundary for AI provider
  integrations.
