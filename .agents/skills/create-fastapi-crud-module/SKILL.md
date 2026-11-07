---
name: create-fastapi-crud-module
description: "Create a FastAPI CRUD feature as a vertical-slice module under backend/app/modules, following this repository's model, schema, repository, service, dependencies, router, migration, registration, and testing conventions. Use when adding a new backend CRUD resource or module."
---

# Create FastAPI CRUD Module

Follow the repository workflow in
[`docs/engineering/skills/fastapi-crud-module.md`](../../../docs/engineering/skills/fastapi-crud-module.md).

Before editing, inspect the closest existing module and identify the resource
fields, ownership rules, API contract, and migration needs. Implement the
smallest complete module, register its router and model, add focused tests,
and run the narrowest relevant validation followed by the required structural
checks.
