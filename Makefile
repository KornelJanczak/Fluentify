.DEFAULT_GOAL := help

.PHONY: help install frontend-install backend-install graph-install \
        frontend-add frontend-add-dev backend-add backend-add-dev graph-add graph-add-dev \
        add-fe add-fe-dev add-be add-be-dev add-graph add-graph-dev \
        migrate revision frontend backend graph dev test frontend-test backend-test graph-test

help:
	@printf '%s\n' \
		'Usage: make <target>' \
		'' \
		'Setup & Dependencies:' \
		'  install                     Install all dependencies across monorepo' \
		'  frontend-install            Install frontend dependencies' \
		'  backend-install             Install backend dependencies' \
		'  graph-install               Install chat-graph dependencies' \
		'  frontend-add pkg="..."      Add dependency to frontend (alias: add-fe)' \
		'  frontend-add-dev pkg="..."  Add devDependency to frontend (alias: add-fe-dev)' \
		'  backend-add pkg="..."       Add dependency to backend (alias: add-be)' \
		'  backend-add-dev pkg="..."   Add dev dependency to backend (alias: add-be-dev)' \
		'  graph-add pkg="..."         Add dependency to chat-graph (alias: add-graph)' \
		'  graph-add-dev pkg="..."     Add dev dependency to chat-graph (alias: add-graph-dev)' \
		'' \
		'Development:' \
		'  dev                         Start frontend, API, and LangGraph together' \
		'  frontend                    Start the Next.js development server' \
		'  backend                     Start the FastAPI development server' \
		'  graph                       Start the LangGraph development server' \
		'' \
		'Database:' \
		'  migrate                     Apply pending database migrations' \
		'  revision message="..."      Create a migration' \
		'' \
		'Tests:' \
		'  test                        Run frontend, backend, and graph tests' \
		'  frontend-test               Run frontend tests' \
		'  backend-test                Run backend tests' \
		'  graph-test                  Run chat-graph tests'

# Dependencies
install: frontend-install backend-install graph-install

frontend-install:
	cd apps/frontend && bun install

backend-install:
	cd apps/backend && uv sync

graph-install:
	cd apps/chat-graph && uv sync

frontend-add add-fe:
	@test -n "$(pkg)" || (echo 'Usage: make frontend-add pkg="<package>"' && exit 1)
	cd apps/frontend && bun add $(pkg)

frontend-add-dev add-fe-dev:
	@test -n "$(pkg)" || (echo 'Usage: make frontend-add-dev pkg="<package>"' && exit 1)
	cd apps/frontend && bun add -D $(pkg)

backend-add add-be:
	@test -n "$(pkg)" || (echo 'Usage: make backend-add pkg="<package>"' && exit 1)
	cd apps/backend && uv add $(pkg)

backend-add-dev add-be-dev:
	@test -n "$(pkg)" || (echo 'Usage: make backend-add-dev pkg="<package>"' && exit 1)
	cd apps/backend && uv add --dev $(pkg)

graph-add add-graph:
	@test -n "$(pkg)" || (echo 'Usage: make graph-add pkg="<package>"' && exit 1)
	cd apps/chat-graph && uv add $(pkg)

graph-add-dev add-graph-dev:
	@test -n "$(pkg)" || (echo 'Usage: make graph-add-dev pkg="<package>"' && exit 1)
	cd apps/chat-graph && uv add --dev $(pkg)

# Database
migrate:
	cd apps/backend && uv run python -m alembic upgrade head

revision:
	@test -n "$(message)" || (echo 'Usage: make revision message="describe_change"' && exit 1)
	cd apps/backend && uv run python -m alembic revision --autogenerate -m "$(message)"

# Services
frontend:
	cd apps/frontend && bun run dev

backend:
	cd apps/backend && uv run python -m fastapi dev app/main.py

graph:
	cd apps/chat-graph && uv run langgraph dev --port 8123

dev:
	$(MAKE) -j3 frontend backend graph

# Tests
test: frontend-test backend-test graph-test

frontend-test:
	cd apps/frontend && bun run test

backend-test:
	cd apps/backend && PYTHONPATH=. uv run pytest

graph-test:
	cd apps/chat-graph && uv run pytest
