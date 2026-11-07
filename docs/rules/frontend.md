# Frontend Rules

- Use Next.js, React, and TypeScript conventions already present in `frontend/`.
- Prefer server components by default. Add `"use client"` only for browser APIs, local interaction state, or event handlers that require it.
- Use existing shadcn/ui primitives under `frontend/components/ui/` and the project's `cn()` utility before creating new UI infrastructure.
- Keep business rules, API clients, data transformation, and mutations outside generic presentational components.
- Compose focused components instead of creating large components with many boolean modes.
- Use accessible semantic HTML, labels, keyboard navigation, visible focus states, and tooltips for unfamiliar icon-only controls.
- Define loading, empty, error, disabled, and success states for asynchronous workflows.
- Keep layouts responsive and use the existing design tokens and component conventions.
- Prefer TanStack Query or the established local data-fetching pattern for server state; keep request error handling consistent.