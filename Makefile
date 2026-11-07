.DEFAULT_GOAL := help

.PHONY: help install frontend-install backend-install migrate revision frontend backend graph dev test frontend-test backend-test

help:
	@printf '%s\n' \
		'Usage: make <target>' \
		'' \
		'Setup:' \
		'  install          Install frontend and backend dependencies' \
		'  frontend-install Install frontend dependencies' \
		'  backend-install  Install backend dependencies' \
		'' \
		'Development:' \
		'  dev              Start frontend, API, and LangGraph together' \
		'  frontend         Start the Next.js development server' \
		'  backend          Start the FastAPI development server' \
		'  graph            Start the LangGraph development server' \
		'' \
		'Database:' \
		'  migrate          Apply pending database migrations' \
		'  revision         Create a migration (message="...")' \
		'' \
		'Tests:' \
		'  test             Run frontend and backend tests' \
		'  frontend-test    Run frontend tests' \
		'  backend-test     Run backend tests'

install: frontend-install backend-install

frontend-install:
	cd frontend && bun install

backend-install:
	$(MAKE) -C backend install

migrate:
	$(MAKE) -C backend migrate

revision:
	$(MAKE) -C backend revision message="$(message)"

frontend:
	cd frontend && bun run dev

backend:
	$(MAKE) -C backend dev

graph:
	$(MAKE) -C backend graph

dev:
	$(MAKE) -j3 frontend backend graph

test: frontend-test backend-test

frontend-test:
	cd frontend && bun run test

backend-test:
	$(MAKE) -C backend tes