# ADR-001: Layered Backend Boundaries

- Status: Proposed
- Date: 2026-10-22

## Context

The backend contains API routers, services, repositories, schemas, models, and infrastructure integrations.

## Proposed Decision

Keep HTTP concerns in routers, use-case orchestration in services, persistence in repositories, and technical provider code in infrastructure.

## Consequences

This creates clearer boundaries and makes isolated testing easier. It also adds indirection, so new layers should only be introduced when they protect a real boundary.

## Open Questions

- Should domain modules become a separate package as the application grows?
- Which services require explicit transaction boundaries?
