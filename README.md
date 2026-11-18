# Fluentify — English AI Tutor

<p align="center">
  <strong style="font-size: 1.25rem;">Say it like you mean it.</strong><br>
  <em>An AI-powered conversational English coaching platform combining multi-turn voice & text chat, automated error coaching, contextual example generation, and spaced repetition flashcards.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.13+-3776AB?style=flat&logo=python&logoColor=white" alt="Python 3.13+" />
  <img src="https://img.shields.io/badge/FastAPI-0.143+-009688?style=flat&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/LangGraph-1.2+-1C3C3C?style=flat&logo=langchain&logoColor=white" alt="LangGraph" />
  <img src="https://img.shields.io/badge/PostgreSQL-16+-4169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Package_Manager-uv_&_bun-FF4088?style=flat" alt="uv & bun" />
</p>

---

## 📖 Overview

**Fluentify** (English AI Tutor) helps language learners transition from textbook English to natural, spontaneous speech. By combining real-time conversational AI with proven learning principles — spaced repetition, targeted error analysis, and multimodal voice interaction — learners practice real-world communication with immediate, patient feedback.

The project is structured as a modern monorepo with strict architectural boundaries separating domain persistence, AI workflow orchestration, and user interface delivery.

---

## ✨ Key Features

### 🎙️ Interactive Voice & Study Chat
- **Multi-turn Conversational AI**: State-managed study tutor powered by **LangGraph** with session persistence across conversation threads.
- **Ultra-low Latency Voice Playback**: Real-time streaming text-to-speech powered by **Cartesia Sonic** via browser-side WebSocket integration.
- **Voice Input & Speech-to-Text**: Audio recordings transcribed with **OpenAI Whisper** and stored in S3-compatible cloud storage (Neon Object Storage / AWS S3).
- **Inline Error Coaching**: Identifies grammatical nuances, unnatural phrasing, and vocabulary slips directly within the chat stream without interrupting conversational flow.

### 🧠 Flashcard Sets & Spaced Repetition (SRS)
- **Deck & Card Management**: Vertical-slice CRUD for vocabulary decks and customized flashcards.
- **SM-2 Spaced Repetition**: Dynamic scheduling tracking repetitions, intervals, and ease factors based on learner recall ratings (`again`, `hard`, `good`, `easy`).
- **Review Prioritization**: Automatically surfaces due cards to optimize long-term retention.

### 🤖 AI-Powered Vocabulary Assistance
- **Contextual Example Generation**: Automatically generates natural sentences demonstrating target words in diverse conversational contexts.
- **Granular Error History**: Tracks error trends and past coaching points to reinforce weak areas over time.

### 🔐 Security & Reliability
- **Stateless Authentication**: JWT authentication with password hashing using **Argon2** (`pwdlib`).
- **Strict Boundary Ownership**: Clear resource isolation ensuring users only access their own flashcards, audio recordings, and chat threads.
- **Observability**: Complete trace monitoring, prompt versioning, and evaluation tracking via **LangSmith**.

---

## 🏗️ Architecture

The system follows a three-tier decoupled architecture designed for scale and independent deployment (see [ADR-003](docs/decisions/ADR-003-chat-graph-service-boundary.md)):

```mermaid
flowchart TD
    subgraph Client ["Frontend (Next.js 16 + React 19)"]
        UI["UI / Tailwind CSS / shadcn/ui"]
        TQuery["TanStack Query"]
        LGClient["@langchain/react SDK"]
        CartesiaJS["@cartesia/cartesia-js (WebSocket)"]
    end

    subgraph Orchestration ["AI Orchestration (apps/chat-graph)"]
        LGServer["LangGraph Server (Port 8123)"]
        GraphState["Workflow Nodes & State"]
        PGCheckpointer[("PostgreSQL Checkpointer")]
    end

    subgraph CoreBackend ["Core API (apps/backend)"]
        FastAPI["FastAPI API (Port 8000)"]
        AuthModule["JWT & Argon2 Auth"]
        FlashcardsModule["Flashcards & SRS"]
        AudioService["Audio & TTS Token Service"]
        MainDB[("PostgreSQL Database")]
        S3Storage[("S3 / Neon Object Storage")]
    end

    subgraph External ["External AI Services"]
        OpenAI["OpenAI (GPT-4o & Whisper)"]
        CartesiaAPI["Cartesia Sonic TTS"]
        LangSmith["LangSmith Tracing"]
    end

    UI --> TQuery
    TQuery -->|REST / JWT| FastAPI
    UI --> LGClient
    LGClient -->|Native LangGraph SSE| LGServer
    UI --> CartesiaJS
    CartesiaJS <-->|Real-time Audio Stream| CartesiaAPI

    LGServer --> GraphState
    GraphState <--> PGCheckpointer
    GraphState -->|Validate & Sync| FastAPI
    GraphState --> OpenAI
    GraphState -.-> LangSmith

    FastAPI --> MainDB
    FastAPI --> S3Storage
    FastAPI --> OpenAI
    AudioService -->|Issue Short-lived Token| CartesiaAPI
```

### Architectural Highlights
- **`apps/backend` (FastAPI)**: System of record owning database models, domain persistence, business rules, spaced repetition calculations, and authentication.
- **`apps/chat-graph` (LangGraph)**: Dedicated AI orchestration service running independently on port 8123. Communicates with FastAPI exclusively over HTTP API contracts.
- **`apps/frontend` (Next.js)**: Modern responsive interface communicating with FastAPI for domain data and with `chat-graph` using the native LangGraph protocol.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [TanStack Query v5](https://tanstack.com/query), [Recharts](https://recharts.org/), [@dnd-kit](https://dndkit.com/), [Bun](https://bun.sh/) |
| **Backend API** | [Python 3.13+](https://www.python.org/), [FastAPI](https://fastapi.tiangolo.com/), [SQLAlchemy 2](https://www.sqlalchemy.org/) (Asyncio), [Alembic](https://alembic.sqlalchemy.org/), [Pydantic v2](https://docs.pydantic.dev/), [asyncpg](https://github.com/MagicStack/asyncpg), [aioboto3](https://github.com/terrycain/aioboto3), [uv](https://github.com/astral-sh/uv) |
| **AI & Orchestration** | [LangGraph](https://www.langchain.com/langgraph), [LangChain](https://www.langchain.com/), [OpenAI API](https://openai.com/) (GPT-4o, Whisper), [Cartesia Sonic TTS](https://cartesia.ai/), [LangSmith](https://smith.langchain.com/) |
| **Database & Storage** | [PostgreSQL 16+](https://www.postgresql.org/), [Neon Object Storage / AWS S3](https://aws.amazon.com/s3/) |
| **Testing & Tooling** | [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/), [Testing Library](https://testing-library.com/), [MSW](https://mswjs.io/), [pytest](https://docs.pytest.org/), `pytest-asyncio`, [Makefile](Makefile) |

---

## 📂 Repository Structure

```text
.
├── Makefile                     # Unified development and testing commands
├── apps/
│   ├── backend/                 # FastAPI application (domain logic & persistence)
│   │   ├── alembic/             # Database migrations
│   │   └── app/
│   │       ├── config.py        # Pydantic settings & environment configuration
│   │       ├── database.py      # SQLAlchemy async engine & sessionmaker
│   │       ├── infrastructure/  # AI providers, storage (S3), and external clients
│   │       └── modules/         # Vertical slices: flashcards, study_chat, users, etc.
│   ├── chat-graph/              # Standalone LangGraph orchestration service
│   │   ├── chat_graph/          # Graph definition, nodes, state, prompts & checkpointer
│   │   ├── langgraph.json       # LangGraph deployment & server configuration
│   │   └── tests/               # Unit and integration tests for graph workflows
│   └── frontend/                # Next.js 16 client application
│       ├── app/                 # Next.js App Router (dashboard, auth, chat pages)
│       ├── components/          # Reusable UI components (shadcn/ui, base controls)
│       └── modules/             # Frontend feature modules (study-chat, flashcards, landing)
└── docs/                        # Architecture guides, ADRs, engineering rules
    ├── architecture/            # Architecture overview & module specs
    ├── decisions/               # Architecture Decision Records (ADRs)
    └── engineering/             # Best practices, testing guidelines, and conventions
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Python**: `>= 3.13`
- **uv**: Fast Python package installer and resolver (`curl -LsSf https://astral.sh/uv/install.sh | sh`)
- **Bun**: Fast JavaScript package manager (`curl -fsSL https://bun.sh/install | bash`)
- **PostgreSQL**: Running locally or a remote connection string

---

### 1. Environment Setup

Copy `.env.example` to `.env` in the root directory:

```bash
cp .env.example .env
```

Configure your environment variables:

```ini
# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/english_ai_tutor

# Authentication
JWT_SECRET_KEY=replace-with-a-random-secret

# AI Providers
OPENAI_API_KEY=your-openai-api-key
CARTESIA_API_KEY=your-cartesia-api-key

# Storage (S3 / Neon Object Storage)
AWS_ENDPOINT_URL_S3=https://your-s3-endpoint.com
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-2
AWS_S3_BUCKET_NAME=fluentify-bucket

# Observability (Optional)
LANGSMITH_API_KEY=your-langsmith-api-key
LANGSMITH_TRACING=true
LANGSMITH_PROJECT=english-ai-tutor

# Service Endpoints
BACKEND_API_URL=http://localhost:8000
LANGGRAPH_API_URL=http://127.0.0.1:8123
```

---

### 2. Dependency Installation

Install dependencies across all three applications using a single command:

```bash
make install
```

*(This runs `bun install` for frontend, and `uv sync` for backend and chat-graph).*

---

### 3. Database Migration

Run Alembic migrations to set up database tables:

```bash
make migrate
```

To create a new migration after updating SQLAlchemy models:
```bash
make revision message="add_new_feature_fields"
```

---

### 4. Running the Development Servers

Start all three services concurrently in development mode:

```bash
make dev
```

Alternatively, you can run services individually in separate terminal sessions:

| Command | Service | URL |
|---|---|---|
| `make frontend` | Next.js Client | [http://localhost:3000](http://localhost:3000) |
| `make backend` | FastAPI Core API | [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI) |
| `make graph` | LangGraph Server | [http://127.0.0.1:8123](http://127.0.0.1:8123) |

---

## 🧪 Testing

The repository maintains strict test coverage across unit, integration, and E2E suites:

```bash
# Run all test suites across the monorepo
make test

# Run individual suites
make frontend-test    # Vitest unit & component tests
make backend-test     # pytest async backend test suite
make graph-test       # pytest chat-graph test suite
```

For frontend E2E browser tests:
```bash
cd apps/frontend && bun run test:e2e
```

---

## 📚 Architectural Guidelines & ADRs

Before making major code changes, consult the documentation:
- [Architecture Overview](docs/architecture/overview.md)
- [ADR-001: Layered Backend Boundaries](docs/decisions/ADR-001-layered-backend.md)
- [ADR-002: Isolate AI Provider Integrations](docs/decisions/ADR-002-ai-infrastructure-boundary.md)
- [ADR-003: Separate Chat Graph Orchestration Service](docs/decisions/ADR-003-chat-graph-service-boundary.md)
- [Backend Best Practices](docs/engineering/backend-best-practices.md)
- [Frontend Best Practices](docs/engineering/frontend-best-practices.md)

---

## 📄 License

This project is private and intended for educational and tutoring purposes.
