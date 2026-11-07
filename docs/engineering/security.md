# Security Practices

> Initial checklist. Replace placeholders with project-specific controls as the system grows.

- Never commit secrets, tokens, or production data.
- Validate and constrain external input.
- Do not expose provider keys or internal errors through API responses.
- Treat prompts, retrieved documents, and model output as untrusted input.
- Define authentication and authorization before exposing user-owned data.
- Review logging to avoid storing sensitive user conversations.
- Keep dependencies and migrations reviewable.
