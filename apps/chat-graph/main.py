"""ASGI entrypoint for LangGraph server on Vercel or other ASGI runners."""
import json
import os
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

# Ensure default environment variables for LangGraph in-memory server
os.environ.setdefault("LANGGRAPH_RUNTIME_EDITION", "inmem")
os.environ.setdefault("REDIS_URI", "fake")
os.environ.setdefault("DATABASE_URI", ":memory:")
os.environ.setdefault("MIGRATIONS_PATH", "__inmem")
os.environ.setdefault(
    "LANGSERVE_GRAPHS",
    json.dumps({"study_chat": "./chat_graph/graph.py:make_study_chat_graph"}),
)
os.environ.setdefault(
    "LANGGRAPH_AUTH",
    json.dumps(
        {
            "path": "./chat_graph/auth.py:auth",
            "disable_studio_auth": False,
        }
    ),
)

from langgraph_api.server import app

__all__ = ["app"]
