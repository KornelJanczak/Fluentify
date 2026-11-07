from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from sqlalchemy.engine import make_url


@asynccontextmanager
async def init_checkpointer(
    database_url: str,
) -> AsyncGenerator[AsyncPostgresSaver, None]:
    database_url_object = make_url(database_url)
    query = dict(database_url_object.query)
    if "ssl" in query and "sslmode" not in query:
        query["sslmode"] = query.pop("ssl")

    postgres_url = database_url_object.set(
        drivername="postgresql",
        query=query,
    ).render_as_string(hide_password=False)

    async with AsyncPostgresSaver.from_conn_string(postgres_url) as checkpointer:
        await checkpointer.setup()

        yield checkpointer
