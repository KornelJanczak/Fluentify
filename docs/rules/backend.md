# Backend Rules

- Keep FastAPI routers thin: validate input, resolve dependencies, call a service, and map the response.
- Use Pydantic schemas for request and response contracts. Do not expose ORM models as API contracts.
- Keep business logic in application services and persistence queries in repositories.
- Keep provider SDK calls behind infrastructure boundaries.
- Use FastAPI dependency injection for request-scoped resources and explicit constructor or factory dependencies for application services.
- Preserve the existing async behavior and SQLAlchemy session lifetime conventions.
- Add an Alembic migration for every database schema change and review both upgrade and downgrade paths.
- Use type hints for public functions and important structures. Prefer explicit, readable Python over clever abstractions.