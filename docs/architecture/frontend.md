# Frontend Architecture

This document describes the frontend structure for the English learning
application. The project uses the Next.js App Router. Routes are responsible
for composition and metadata; product modules own domain behavior.

## Stack

The frontend uses Next.js, React, TypeScript, and the existing components under `frontend/components/`.

## Responsibilities

- Pages and views compose the user experience.
- Components render UI and handle local interaction state.
- API calls and data transformation should live outside presentational components when they are reused or non-trivial.
- Backend services remain the source of truth for business rules.

## UI Component Standard

Use shadcn/ui as the default foundation for every new frontend feature. Build interfaces by composing the existing shadcn components under `frontend/components/ui/` and the project's domain components. Do not hand-roll a replacement when an appropriate shadcn primitive already exists.

The project follows shadcn/ui's official principles:

- **Open code:** shadcn components are application-owned source code. Inspect and customize the local component directly when its behavior or styling needs to change.
- **Composition:** Prefer small, composable primitives with predictable APIs over large components with many unrelated modes.
- **Consistency:** Reuse the existing component variants, `cn()` utility, aliases, spacing, radius, and interaction patterns.
- **Accessibility:** Preserve semantic HTML, labels, keyboard navigation, focus states, screen-reader text, and the accessibility behavior provided by the underlying primitives.
- **Responsive behavior:** Components must remain usable on narrow screens and across loading, empty, error, disabled, and success states.
- **Theming:** Use semantic shadcn tokens such as `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`, and `ring-ring`. Do not introduce arbitrary raw colors when an existing token or a new documented semantic token is appropriate.

## Component Design Rules

- Build domain components by composing generic shadcn primitives. For example, a flashcard editor may compose `Card`, `Field`, `Input`, `Textarea`, `Button`, and `Alert` rather than duplicating their behavior.
- Create a generic component only when it represents reusable, domain-neutral behavior or a repeated project pattern. Keep its API small, name it after its responsibility, and expose intentional variants instead of many boolean props.
- Keep business rules, API calls, data transformation, and mutation behavior outside generic presentational components.
- Prefer composition through children, slots, and existing shadcn subcomponents over deeply nested configuration objects or conditional markup branches.
- Use the correct primitive for the interaction: `Dialog` or `AlertDialog` for modal flows, `Sheet` or `Drawer` for responsive panels, `Command` for command search, `Tabs` for views, `Select` or `Combobox` for selection, and `Field`/`FieldGroup` for forms.
- Use `Skeleton`, `Empty`, `Alert`, `Spinner`, and disabled states deliberately so every asynchronous workflow has a complete user-facing state.
- Use icon-only controls only when the icon is familiar and provide a tooltip and accessible label. Use icon plus text for unfamiliar or high-consequence actions.
- Keep server/client boundaries explicit in Next.js. Add `"use client"` only to interactive components that need browser APIs or client state.
- Use semantic HTML directly when it is the most accessible choice, but keep its styling and interaction consistent with the shadcn design tokens.

## CLI, Skills, and MCP Workflow

- Read [shadcn/ui Skills](https://ui.shadcn.com/docs/skills) before generating or substantially changing shadcn components.
- Check `components.json` before using the CLI. It controls the project style, React Server Component setting, Tailwind setup, CSS variables, aliases, and component paths.
- Prefer the shadcn CLI or configured MCP server to discover and install official components. Review the generated files, dependencies, and diff before accepting them.
- Do not rerun an installation command over a customized local component without checking how the change will merge with local modifications.
- Use the [official component documentation](https://ui.shadcn.com/docs/components) and [theming documentation](https://ui.shadcn.com/docs/theming) when selecting an API or adding a token.
- Use the [shadcn MCP server](https://ui.shadcn.com/docs/mcp) when it is configured for VS Code. It can browse registries, search components, and install registry items using the project's configuration.
- For custom reusable components or internal UI patterns, follow the [registry schema](https://ui.shadcn.com/docs/registry/registry-item-json) instead of inventing an incompatible distribution format.

## Current Areas

- `frontend/app/` — Next.js routes and application layout.
- `frontend/components/` — reusable UI components.
- `frontend/lib/` — shared frontend utilities.

## Recommended Structure: Modular Frontend

Use a **module-first** structure. A module is a vertical slice of one product
capability. Most code needed to understand or change a capability should live
inside one folder.

```text
frontend/
├── app/                              # Thin Next.js route adapters
│   ├── layout.tsx
│   ├── providers.tsx
│   ├── page.tsx
│   ├── flashcards/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   └── chat/
│       └── [flashcardSetId]/
│           └── page.tsx
├── modules/                          # Product capabilities
│   ├── flashcard-sets/
│   │   ├── api.ts                    # HTTP functions
│   │   ├── components/               # Module-specific UI
│   │   ├── hooks/                    # Module-specific React hooks
│   │   ├── mutations.ts              # TanStack mutations
│   │   ├── queries.ts                # TanStack queries and keys
│   │   ├── schemas.ts                # Boundary validation
│   │   ├── types.ts                  # Module types
│   │   ├── utils.ts                  # Module-only pure helpers
│   │   ├── views/                    # Complete page compositions
│   │   └── __tests__/                # Module tests
│   └── study-chat/
│       ├── api.ts
│       ├── stream.ts                 # LangGraph/SSE transport
│       ├── components/
│       ├── hooks/
│       ├── types.ts
│       ├── utils.ts
│       ├── views/
│       └── __tests__/
├── shared/                           # Reusable, domain-neutral code
│   ├── components/
│   │   ├── async-state.tsx
│   │   ├── empty-state.tsx
│   │   └── page-header.tsx
│   ├── hooks/
│   ├── types/
│   └── utils/
├── components/
│   └── ui/                           # shadcn primitives only
├── infrastructure/                   # Technical frontend adapters
│   ├── http/
│   │   ├── client.ts
│   │   └── errors.ts
│   ├── query/
│   │   └── query-client.ts
│   └── env.ts
└── test/
    ├── mocks/
    └── setup.ts
```

This is intentionally not a strict global layer hierarchy. The module owns its
API, hooks, UI, views, validation, and tests. Only genuinely shared
or technical code is extracted to `shared/`, `components/ui/`, or
`infrastructure/`.

The dependency direction should remain:

```text
app route -> module view -> module component/hook -> module API
                                      \-> infrastructure/shared
```

Modules should not import another module's internals. If two modules need the
same behavior, first decide whether it belongs in `shared/`; otherwise expose a
small public module API through `index.ts`. Avoid extracting code only because
it is used twice.

## What Belongs Where

### `app/`: routes and Next.js boundaries

Keep route files thin. A route should select a view, pass route parameters,
define route-level metadata, and expose loading/error/not-found states.

```tsx
import { FlashcardSetView } from "@/modules/flashcard-sets/views/flashcard-set-view";

export default async function FlashcardSetPage({
  params,
}: PageProps<"/flashcards/[flashcardSetId]">) {
  const { flashcardSetId } = await params;

  return <FlashcardSetView flashcardSetId={flashcardSetId} />;
}
```

Do not put API calls, query keys, business rules, or large JSX trees in
`app/**/page.tsx`. Server Components are the default. Add `"use client"` only
at the smallest interactive boundary.

### `modules/<module>/api.ts`: HTTP-related functions

Keep request functions small, typed, and independent of React. They should:

- build URLs and request options;
- call the shared HTTP transport;
- parse the response into the module's type;
- throw the project's consistent error type for non-2xx responses.

```ts
import { http } from "@/infrastructure/http/client";
import type { FlashcardSet } from "./types";

export function getFlashcardSet(id: string): Promise<FlashcardSet> {
  return http.get<FlashcardSet>(`/flashcard-sets/${id}`);
}
```

Do not call `fetch` directly from presentational components. Keep
authentication headers, base URLs, JSON parsing, and error normalization in
`infrastructure/http/`, so Server Components and Client Components use the same
contract.

For Server Components, call module API functions directly. For browser-side
REST state, wrap them in TanStack Query options in `queries.ts` and
`mutations.ts`. Query keys belong next to the query that owns them, not in JSX.

### `modules/<module>/hooks/`: React behavior

Hooks compose module APIs with React state or TanStack Query. They should
expose domain language rather than transport details:

```ts
export function useFlashcardSet(id: string) {
  return useQuery(flashcardSetQueryOptions(id));
}
```

Do not create a hook for every component or use hooks as a second service layer.
Use a hook when it coordinates server state, browser state, subscriptions, or
repeated interaction logic.

### `modules/<module>/components/`: module UI

These components render one module concern, such as a flashcard editor,
example-sentence list, or chat message. They may use module hooks when the
component owns the interaction, but keep complex data transformation in
module helpers or query functions.

Components must explicitly handle loading, empty, error, disabled, and success
states for asynchronous workflows. Compose shadcn primitives from
`components/ui/`; do not duplicate their accessibility or styling behavior.

### `modules/<module>/views/`: page-level composition

A view is the module's page composition layer. It arranges sections, decides
which module components appear together, and coordinates route inputs. It is
not a generic component and should not become a second routing system.

Use a view when a route contains enough composition to benefit from a named
page-level unit. For a small route, rendering a module component directly is
acceptable.

### `shared/`, `components/ui/`, and `infrastructure/`

- `components/ui/` contains only shadcn primitives such as `Button`, `Dialog`,
  `Field`, `Skeleton`, and `Alert`.
- `shared/` contains domain-neutral application patterns such as `PageHeader`,
  `AsyncState`, or `EmptyState`.
- `infrastructure/` contains technical adapters, such as the HTTP client,
  query client, environment access, and error normalization.
- Module-specific components stay inside their module directory.

Do not place module components in `shared/` merely because they are used on two
pages. Move them there only when the API and meaning are
genuinely domain-neutral.

## Data and Rendering Rules

### Server Components

Use native `fetch` through the shared HTTP layer for data needed during server
rendering. Server Components are preferred for initial page data, SEO-visible
content, and data that does not need browser interaction.

### Client Components and TanStack Query

Use TanStack Query for REST data that needs client-side loading, caching,
retries, refetching, or mutation invalidation. Keep the `QueryClientProvider`
in the existing application providers boundary and keep query configuration
close to the module that owns it.

After a successful mutation, invalidate or update related queries. Do not copy
server entities into unrelated local state.

### Study-chat streaming

The LangGraph study chat is a separate transport from ordinary REST. Keep SSE
connection management in `modules/study-chat/stream.ts` and expose it through
a chat-specific hook. Do not put the stream in TanStack Query and do not mix
stream lifecycle state with generic HTTP request state.

## Naming and Import Conventions

- Use kebab-case file names: `flashcard-set-view.tsx`,
  `use-flashcard-set.ts`, and `query-keys.ts`.
- Use PascalCase for React components and camelCase for functions and hooks.
- Import through the `@/` alias.
- Prefer importing a module's public API from a small `index.ts` only when it
  improves readability; avoid barrel files that create circular dependencies.
- Keep types near the module that owns them. Put a type in `shared` only when
  it is truly shared across unrelated modules.

## Frontend Conventions

- API clients and request error conventions belong outside presentational components.
- Server components are the default; client components are limited to interactive UI and browser-dependent behavior.
- Forms use shadcn form primitives and project-approved validation at the module boundary.
- Every asynchronous view defines loading, empty, error, disabled, and success behavior.
- Backend services remain the source of truth for validation and business rules.

## Data Fetching

- Use the native `fetch` API for data requested by Server Components and Server Actions.
- Use TanStack Query (`useQuery` and `useMutation`) for REST server state requested by Client Components.
- Keep request functions, response parsing, query keys, and mutation invalidation outside presentational components.
- Invalidate or update related queries after successful mutations instead of duplicating server state in local component state.
- Handle loading, empty, error, disabled, and success states at the component boundary that renders the request result.
- Do not use TanStack Query for the LangGraph study-chat stream. The existing `useStream` integration owns that interactive SSE workflow.
- Before adding browser-side REST requests, configure the FastAPI frontend origin with CORS or route requests through a same-origin Next.js proxy. Do not expose server-only credentials in `NEXT_PUBLIC_*` variables.

## Testing

- Vitest is the unit and component test runner.
- React Testing Library and `user-event` verify accessible, user-visible
  component behavior.
- MSW provides deterministic API mocks for frontend tests.
- Playwright covers meaningful browser workflows and cross-boundary behavior.
