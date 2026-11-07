# ADR-002: Isolate AI Provider Integrations

- Status: Proposed
- Date: 2026-10-22

## Context

The application uses AI to generate example sentences and analyze study-chat errors. Provider SDKs, prompts, and model profiles can change independently from API contracts.

## Proposed Decision

Keep provider clients and provider-specific configuration under `backend/app/infrastructure/ai/`. Coordinate AI use cases from services or graph workflows rather than calling providers directly from routers.

## Consequences

Provider changes and testing become easier to control. The application must define explicit contracts for AI inputs, outputs, failures, and observability.

## Open Questions

- Which outputs require structured validation and retries?
- Which workflows should be traced in LangSmith?
- How should model and prompt versions be recorded?
