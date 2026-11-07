# Functions and Methods

- Keep functions small, focused, and easy to test. Split a function when it has multiple unrelated responsibilities or more than three nested conditional levels.
- Prefer guard clauses and named helpers over deeply nested branches.
- Keep cyclomatic complexity low; replace repeated conditionals with a mapping or strategy only when that genuinely clarifies the code.
- Avoid long positional argument lists. Use a typed options object or Pydantic model when several values travel together.
- Return a meaningful result when the caller needs context. Use `None` for a simple optional lookup.
- Prefer direct iteration and comprehensions when they remain readable. Do not compress complex business logic into clever expressions.
- Do not add abstractions until a second real use case exists.