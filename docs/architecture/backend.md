# Backend Architecture

The backend is a modular monolith. Product capabilities are organized into
feature modules, while technical infrastructure and application entry points
remain shared. Each module owns the behavior needed to understand and change
one capability without creating a second application-wide layer hierarchy.

## Stack

The backend uses FastAPI, Pydantic schemas, SQLAlchemy/Alembic persistence, and
AI integrations that may be orchestrated with LangGraph.

## Module Structure

Feature modules use a flat vertical-slice structure. Each module has one
directory, and the file suffix describes its role. This keeps the feature
boundary visible without recreating a deep layer hierarchy inside every
module:

```text
backend/app/
├── modules/
│   ├── flashcard_sets/
│   │   ├── flashcard_sets_router.py
│   │   ├── flashcard_sets_dependencies.py
│   │   ├── flashcard_set_model.py
│   │   ├── flashcard_set_repository.py
│   │   ├── flashcard_set_schema.py
│   │   ├── flashcard_set_service.py
│   ├── flashcards/
│   │   ├── flashcard_model.py
│   │   ├── flashcard_repository.py
│   │   ├── flashcard_schema.py
│   │   ├── flashcard_service.py
│   │   └── flashcards_router.py
│   ├── example_sentences/
│   │   ├── example_sentence_dependencies.py
│   │   ├── example_sentence_schema.py
│   │   └── example_sentence_service.py
│   ├── error_analysis/
│   │   ├── error_analysis_model.py
│   │   ├── error_analysis_repository.py
│   │   ├── error_analysis_schema.py
│   │   └── error_analysis_summary_service.py
│   └── study_chat/
│       ├── study_chat_router.py
│       ├── study_chat_dependencies.py
│       ├── chat_schema.py
│       └── study_chat_service.py
├── workflows/
│   └── study_chat/
│       ├── dependencies.py
│       ├── graph.py
│       ├── nodes.py
│       └── state.py
├── infrastructure/
├── config.py
├── database.py
├── graph.py
└── main.py
```

The `flashcard_sets` module owns set-level operations and the set aggregate.
The `flashcards` module owns individual card operations. The
`example_sentences` module owns AI-generated examples and may use both
flashcard modules. The `error_analysis` module owns persisted language-error
analysis and its summary. The `study_chat` module owns chat transport and
application service behavior, while its LangGraph workflow lives under the
global `app/workflows/study_chat/` boundary.

## Responsibilities

- `modules/<module>/*_router.py` — thin HTTP adapters and route registration.
- `modules/<module>/*_dependencies.py` — module-local FastAPI dependency wiring.
- `modules/<module>/*_service.py` — application use cases and orchestration.
- `modules/<module>/*_repository.py` — persistence access for the module.
- `modules/<module>/*_model.py` — SQLAlchemy models owned by the module.
- `modules/<module>/*_schema.py` — API input and output contracts owned by the module.
- `workflows/<workflow>/` — application workflows that coordinate module services without owning HTTP transport.
- `infrastructure/` — external providers and technical integrations shared by modules.
- `database.py` — engine, session, and database dependency boundary.
- `main.py` — FastAPI composition root and router registration.
- `chat-graph/` — separate LangGraph orchestration service; the backend no
  longer owns the LangGraph CLI entry point.

## Dependency Direction

The normal request flow is:

```text
API adapter -> module service -> module repository
                           \-> shared infrastructure
```

Routers validate input, resolve dependencies, call a service, and map the
result to an API schema. Services remain independent from HTTP details.
Repositories are the only persistence boundary, and provider-specific code
stays in `infrastructure/`.

Modules must not import another module's internal files. When a feature needs
another module, it should use a small public module API. Shared code belongs in
`infrastructure/` or another explicitly domain-neutral package only when it is
truly shared; do not create shared abstractions merely to avoid one import.

The intended feature dependencies are:

```text
example_sentences -> flashcards, flashcard_sets
study_chat -> flashcards, flashcard_sets, error_analysis
workflows/study_chat -> study_chat
```

`error_analysis` must not import `study_chat`, and feature modules must not
import workflow implementation details.

The application composition root may import module routers and dependency
factories. This is the intentional exception that assembles the application.

## Database and Migrations

Moving a model between Python packages is not a schema change. Module moves
must preserve table names, columns, foreign keys, relationship declarations,
transaction ownership, and existing Alembic revisions. `alembic/env.py` must
import every ORM model before assigning `Base.metadata` so autogeneration sees
the complete model registry.

## AI Boundary

AI provider calls should be isolated behind `backend/app/infrastructure/ai/` and coordinated by services or graph workflows. Prompts and model profiles should remain explicit and versionable.

## LangGraph Workflows

LangGraph is an application workflow orchestrator, not a replacement for the
API, domain, persistence, or AI infrastructure layers. Use it when an AI
use case has multiple steps, conditional routing, streaming, resumability, or
checkpointed state. A single model call should remain an ordinary application
service operation.

The dependency direction for a graph is:

```text
API adapter -> application service -> graph workflow
                                      -> application services
                                      -> repositories and AI infrastructure
```

Graph nodes coordinate one workflow step. They must not contain HTTP concerns,
construct ORM queries, own provider configuration, or create ad-hoc database
sessions. Provider clients, prompts, structured-output schemas, retries, and
model profiles remain under `app/infrastructure/ai/`. Repositories remain the
only persistence boundary.

### Graph layout

Each production workflow should have explicit role-named files under the
application-level workflow boundary:

```text
app/workflows/<workflow_name>/
├── state.py          # serializable workflow state and reducers
├── dependencies.py   # typed ports/context supplied by the application layer
├── nodes.py          # small steps returning partial state updates
├── routing.py        # conditional transitions, when needed
└── graph.py          # graph construction and compilation
```

The graph factory should accept dependencies or a typed context rather than
creating them during module import or inside individual nodes. This keeps
graphs deterministic in tests and reusable from HTTP handlers, WebSockets, and
background workers.

### State rules

Workflow state should contain only the data needed to move the workflow
forward and should be serializable by the configured checkpointer. Include
stable identifiers such as `user_id`, `conversation_id`, and
`flashcard_set_id`, plus validated model inputs and outputs. Do not put
`AsyncSession`, FastAPI requests, provider clients, secrets, or ORM instances
in the state.

State is not a substitute for the domain database. PostgreSQL remains the
source of truth for users, conversations, flashcards, and learning analyses.
LangGraph checkpoints store resumable workflow progress and temporary state.

### Execution, ownership, and errors

The application layer must authorize `user_id` against `conversation_id` and
`flashcard_set_id` before invoking a graph. A client-controlled
`thread_id` is a checkpoint key, not an authorization mechanism.

Use explicit domain and infrastructure exceptions. Map them to API errors at
the adapter boundary rather than catching broad exceptions in nodes or
returning success-shaped empty state. Persist model name, prompt version, and
workflow version with important AI-generated business data.

### Streaming and observability

Graphs may emit domain events such as `reply_token`,
`inspection_completed`, and `workflow_completed`. HTTP and WebSocket adapters
may expose those events differently, but the graph must not format transport
responses.

Trace meaningful workflows with LangSmith using non-sensitive identifiers and
model/prompt versions. Do not log secrets or unredacted sensitive user data.
Add a checkpointer and stable `thread_id` when a workflow must survive
reconnects, restarts, or horizontal scaling.

## Testing and Verification

Test module behavior at the narrowest useful boundary. Services should be
tested with fake repositories or provider clients, repositories with database
integration tests, and workflow nodes with deterministic dependencies. Do not
make real LLM calls in ordinary tests.

After structural changes, verify application startup, registered route paths,
the `chat-graph` entrypoint, `uv run alembic check`, and a migration upgrade
against a disposable PostgreSQL database.

## To Decide

- Authentication and authorization boundaries.
- Transaction ownership and session lifetime.
- Error taxonomy and public error responses.
- Observability and LangSmith tracing policy.
