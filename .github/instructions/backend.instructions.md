---
applyTo: "backend/**/*.py"
---

# Backend Instructions

- Read `docs/architecture/backend.md` before changing backend structure.
- Follow `docs/engineering/backend-best-practices.md`.
- Keep routers thin: validate input, call a service, and map the response.
- Keep persistence logic in repositories and provider-specific code in infrastructure.
- Use Pydantic schemas at API boundaries.
- Keep async behavior consistent with the existing code.
- Run the narrowest relevant backend validation after changes.
