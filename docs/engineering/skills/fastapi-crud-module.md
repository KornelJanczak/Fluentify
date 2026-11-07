# FastAPI CRUD Module Workflow

Use this workflow when adding a new CRUD capability to the backend. The
result must be a vertical-slice module under `backend/app/modules/` that fits
the existing modular-monolith architecture.

## Required Inputs

Before writing code, identify:

- module name in plural snake_case, for example `learning_goals`,
- singular domain name, for example `learning_goal`,
- fields and their types,
- create, update, and response behavior,
- ownership and authorization rules,
- whether relationships or pagination are required.

Do not invent missing business rules. Ask for them or record the smallest
explicit assumption before implementation.

## Procedure

1. Read `docs/architecture/backend.md`, the applicable files in
   `docs/engineering/`, and the backend instruction file.
2. Inspect the closest existing module and its tests. Prefer the same resource
   shape over introducing a new abstraction.
3. Create the module directory at
   `backend/app/modules/<plural_name>/`.
4. Add only the files the use case needs:
   - `<singular_name>_model.py` for the SQLAlchemy model,
   - `<singular_name>_schema.py` for create, update, and response schemas,
   - `<singular_name>_repository.py` for all database queries,
   - `<singular_name>_service.py` for application use cases,
   - `<plural_name>_dependencies.py` for repository/service dependency
     factories,
   - `<plural_name>_router.py` for HTTP routes,
   - `__init__.py` when the package requires it.
5. Keep the dependency direction:

   ```text
   router -> service -> repository
   ```

   Routers validate input, resolve dependencies, call services, translate
   not-found/domain errors, and return explicit response schemas. They must
   not contain SQLAlchemy queries or business rules.

6. Implement the CRUD surface deliberately:
   - `POST` creates and returns `201 Created`,
   - `GET` by id returns `404` when absent,
   - `GET` collection returns a typed list,
   - `PATCH` uses a partial update schema with `exclude_unset=True`,
   - `DELETE` returns `204 No Content` and `404` when absent.

   Adjust this surface when the domain requires a different contract; do not
   add endpoints only because they are conventional.

7. Use async SQLAlchemy consistently with the existing code. Keep queries in
   the repository and transaction ownership explicit in the service or the
   established local pattern.
8. Register the router in `backend/app/main.py` and import the model wherever
   `alembic/env.py` builds the complete ORM metadata registry.
9. If the model changes the database schema, create an Alembic migration.
   Review foreign keys, indexes, nullability, uniqueness, and delete behavior.
10. Add focused tests:
    - service tests with a fake repository for success and failure paths,
    - repository/database tests for queries and constraints,
    - API tests for validation, status codes, response shapes, and `404`.
      Do not make real AI or external provider calls.
11. Run the narrowest useful checks, then the structural checks required after
    backend changes:

    ```bash
    cd backend
    uv run pytest path/to/relevant/test_file.py -q
    uv run alembic check
    uv run python -c "from app.main import app"
    ```

    Run the full test suite when the focused checks pass and the module is
    ready for integration.

## Completion Checklist

- [ ] Module follows the existing flat vertical-slice structure.
- [ ] Public functions have useful type hints and async boundaries match the
      surrounding code.
- [ ] Routers are thin and use explicit response models.
- [ ] Persistence is isolated in the repository.
- [ ] Not-found and domain failures map to stable API errors.
- [ ] Router is registered in the composition root.
- [ ] ORM model is visible to Alembic metadata.
- [ ] Migration exists when schema changes are required.
- [ ] Focused tests cover success, validation, and failure paths.
- [ ] Relevant validation commands pass.

## Existing References

- `docs/architecture/backend.md`
- `docs/engineering/backend-best-practices.md`
- `docs/engineering/backend-testing.md`
- `backend/app/modules/flashcard_sets/`
- `backend/app/modules/flashcards/`
