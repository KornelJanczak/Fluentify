# Backend Testing Practices

## Principles

- Test observable behavior rather than implementation details.
- Start with the narrowest relevant test.
- Cover important success, validation, and failure paths.
- Keep tests deterministic, isolated, and readable.

## Stack

- `pytest==9.1.1` is the test runner, matching the commercial
  `gna-refract` project.
- `httpx==0.28.1` is used with FastAPI's `TestClient` for HTTP tests.
- LangGraph nodes and graph transitions are tested with deterministic fake
  dependencies.
- Real LLM calls do not belong in ordinary unit tests.
- LangSmith datasets and evaluators are used for LLM quality, correctness,
  naturalness, and prompt/model regression checks.

## Test scope

- Unit-test pure service logic without unnecessary I/O.
- Use integration tests for repository and database behavior.
- Add regression tests for fixed bugs.

## Commands

Run commands from `backend/`:

```bash
uv run pytest
uv run pytest path/to/test_file.py -q
```

The backend currently has no test files, so `uv run pytest` reports that no
tests were collected until the first test is added.
