---
applyTo: "**/*test*,**/tests/**/*,**/test_*.py,**/*.spec.ts,**/*.spec.tsx"
---

# Testing Instructions

- Follow the relevant testing guide:
  - backend: `docs/engineering/backend-testing.md`
  - frontend: `docs/engineering/frontend-testing.md`
- Test observable behavior and important failure paths.
- Start with the narrowest relevant test command.
- Do not weaken or delete tests to make an implementation pass.
- Keep tests deterministic and independent.
