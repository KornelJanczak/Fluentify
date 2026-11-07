---
applyTo: "backend/alembic/**/*,backend/app/models/**/*.py,backend/app/repositories/**/*.py,backend/app/database.py"
---

# Database Instructions

- Follow `docs/engineering/backend-best-practices.md` and the migration conventions documented here as they emerge.
- Every schema change must have an Alembic migration.
- Review migration upgrade and downgrade behavior before finishing.
- Keep database access behind repositories or the existing database abstraction.
- Do not silently change existing data semantics.
