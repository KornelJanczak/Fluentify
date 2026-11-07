import logging

import jwt
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from langchain_core.messages import HumanMessage
from langgraph.graph.state import CompiledStateGraph

from app.workflows.study_chat.dependencies import StudyChatWorkflowContext
from app.modules.study_chat.study_chat_dependencies import (
    get_study_chat_graph,
    get_study_chat_history_service,
    get_study_chat_service,
    get_study_chat_websocket_graph,
    get_study_chat_websocket_service,
)
from app.modules.study_chat.chat_schema import (
    StudyChatMessageSchema,
    StudyChatResponseSchema,
    StudyChatHistoryMessageSchema,
)
from app.modules.study_chat.study_chat_service import StudyChatService
from app.modules.study_chat.study_chat_history_service import (
    StudyChatHistoryService,
)
from app.modules.users.user_model import User
from app.modules.users.user_security import get_user_id_from_token
from app.modules.users.users_dependencies import get_current_user

router = APIRouter(prefix="/study-chat", tags=["study-chat"])
logger = logging.getLogger(__name__)


@router.get(
    "/{flashcard_set_id}/history",
    response_model=list[StudyChatHistoryMessageSchema],
)
async def study_chat_history(
    flashcard_set_id: str,
    current_user: User = Depends(get_current_user),
    graph: CompiledStateGraph = Depends(get_study_chat_graph),
    history_service: StudyChatHistoryService = Depends(
        get_study_chat_history_service
    ),
) -> list[StudyChatHistoryMessageSchema]:
    logger.info(
        "Retrieving chat history: user_id=%s flashcard_set_id=%s",
        current_user.id,
        flashcard_set_id,
    )

    thread_id = f"study_chat:{current_user.id}:{flashcard_set_id}"
    config = {
        "configurable": {
            "thread_id": thread_id,
        }
    }

    snapshot = await graph.aget_state(config)
    messages = snapshot.values.get("messages", [])

    return await history_service.get_history(
        flashcard_set_id=flashcard_set_id,
        user_id=current_user.id,
        thread_id=thread_id,
        messages=messages,
    )


@router.post(
    "/{flashcard_set_id}/message",
    response_model=StudyChatResponseSchema,
)
async def study_chat_message(
    flashcard_set_id: str,
    data: StudyChatMessageSchema,
    service: StudyChatService = Depends(get_study_chat_service),
    graph: CompiledStateGraph = Depends(get_study_chat_graph),
    current_user: User = Depends(get_current_user),
) -> StudyChatResponseSchema:
    context = StudyChatWorkflowContext(service=service)

    config = {
        "configurable": {
            "thread_id": f"study_chat:{current_user.id}:{flashcard_set_id}",
        }
    }
    logger.info(
        "Study chat request started: user_id=%s flashcard_set_id=%s",
        current_user.id,
        flashcard_set_id,
    )

    try:
        result = await graph.ainvoke({
            "messages": [HumanMessage(content=data.message)],
            "flashcard_set_id": flashcard_set_id,
            "user_id": current_user.id,
            "thread_id": config["configurable"]["thread_id"],
            "language_level": data.language_level,
        }, config=config, context=context)
    except Exception:
        logger.exception(
            "Study chat request failed: user_id=%s flashcard_set_id=%s",
            current_user.id,
            flashcard_set_id,
        )
        raise

    logger.info(
        "Study chat request completed: user_id=%s flashcard_set_id=%s",
        current_user.id,
        flashcard_set_id,
    )

    return StudyChatResponseSchema(
        response=result["reply"],
        inline_inspector=result["inline_inspector"],
    )


@router.websocket("/{flashcard_set_id}")
async def study_chat(
    websocket: WebSocket,
    flashcard_set_id: str,
    service: StudyChatService = Depends(get_study_chat_websocket_service),
    graph: CompiledStateGraph = Depends(get_study_chat_websocket_graph),
) -> None:
    # Authorization realted code
    authorization = websocket.headers.get("authorization", "")
    if not authorization:
        token = websocket.query_params.get("token", "")
        authorization = f"Bearer {token}" if token else ""
    if not authorization.lower().startswith("bearer "):
        logger.warning(
            "Study chat WebSocket rejected: reason=missing_authorization "
            "flashcard_set_id=%s",
            flashcard_set_id,
        )
        await websocket.close(code=4401)
        return

    try:
        user_id = get_user_id_from_token(authorization[7:].strip())
    except (jwt.InvalidTokenError, ValueError):
        logger.warning(
            "Study chat WebSocket rejected: reason=invalid_authorization "
            "flashcard_set_id=%s",
            flashcard_set_id,
        )
        await websocket.close(code=4401)
        return

    await websocket.accept()
    logger.info(
        "Study chat WebSocket connected: user_id=%s flashcard_set_id=%s",
        user_id,
        flashcard_set_id,
    )

    # Langgraph related code
    context = StudyChatWorkflowContext(service=service)
    thread_id = f"study_chat:{user_id}:{flashcard_set_id}"

    try:
        while True:
            data = StudyChatMessageSchema.model_validate(await websocket.receive_json())

            config = {
                "configurable": {
                    "thread_id": thread_id,
                }
            }

            input_state = {
                "messages": [HumanMessage(content=data.message)],
                "flashcard_set_id": flashcard_set_id,
                "user_id": user_id,
                "thread_id": thread_id,
                "language_level": data.language_level,
            }

            async for chunk in graph.astream(
                input_state,
                config=config,
                context=context,
                stream_mode=["messages", "updates"],
                version="v2",
            ):
                if chunk["type"] == "messages":
                    message_chunk, metadata = chunk["data"]

                    if (
                        metadata.get("langgraph_node") == "generate_reply"
                        and message_chunk.content
                    ):
                        await websocket.send_json({
                            "type": "token",
                            "content": message_chunk.content,
                        })

                elif chunk["type"] == "updates":
                    updates = chunk["data"]

                    if "inspect_message" in updates:
                        inspection = updates["inspect_message"].get(
                            "inline_inspector"
                        )

                        await websocket.send_json({
                            "type": "done",
                            "inline_inspector": inspection.model_dump(),
                        })

    except LookupError as error:
        logger.warning(
            "Study chat WebSocket failed: user_id=%s flashcard_set_id=%s "
            "reason=%s",
            user_id,
            flashcard_set_id,
            type(error).__name__,
        )
        await websocket.send_json({"type": "error", "detail": str(error)})
        await websocket.close(code=4404)
    except WebSocketDisconnect:
        logger.info(
            "Study chat WebSocket disconnected: user_id=%s flashcard_set_id=%s",
            user_id,
            flashcard_set_id,
        )
        return
