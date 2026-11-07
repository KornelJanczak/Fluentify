# Infrastructure Rules

- Use explicit, maintained base-image versions in Dockerfiles; avoid `latest`.
- Run containers as non-root where possible and copy only required files.
- Keep configuration in environment variables or the project's settings layer, never hardcoded secrets.
- Add health checks and expose only required ports for critical services.
- Keep infrastructure changes declarative, reviewable, and separate from application business logic.
- Do not add deployment tooling that the repository does not currently use without a concrete task requiring it.