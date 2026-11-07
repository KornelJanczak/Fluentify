# Backend Best Practices

## API Layer

- Keep routers thin.
- Validate external input at the API boundary with schemas.
- Return explicit response schemas.
- Translate domain or infrastructure failures into stable API errors.

## Services

- Services coordinate use cases and business workflows.
- Keep services independent from HTTP details where practical.
- Prefer small functions with one clear responsibility.

## Persistence and Integrations

- Keep database queries in repositories.
- Keep provider-specific code in infrastructure.
- Do not spread AI SDK calls across routers and unrelated services.
- Add migrations for schema changes.

## Python

- Use type hints for public functions and important data structures.
- Prefer explicit code over clever abstractions.
- Preserve async boundaries used by the existing application.
