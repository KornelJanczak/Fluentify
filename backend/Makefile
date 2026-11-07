.PHONY: install dev graph migrate revision test

ALEMBIC := uv run python -m alembic

install:
	uv sync

dev:
	uv run python -m fastapi dev app/main.py

graph:
	cd ../chat-graph && uv run langgraph dev --port 8123

migrate:
	$(ALEMBIC) upgrade head

revision:
	@test -n "$(message)" || (echo "Usage: make revision message=describe_change" && exit 1)
	$(ALEMBIC) revision --autogenerate -m "$(message)"

test:
	PYTHONPATH=. uv run pytest