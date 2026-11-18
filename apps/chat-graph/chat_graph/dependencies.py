from dataclasses import dataclass

from langchain_core.language_models import BaseChatModel

from chat_graph.backend_api import BackendApiClient
from chat_graph.prompts import INLINE_INSPECTOR_PROMPT_VERSION


@dataclass(frozen=True)
class StudyChatWorkflowContext:
    backend_api: BackendApiClient
    chat_ai_client: BaseChatModel
    inline_inspector_ai_client: BaseChatModel
    access_token: str
    model_name: str
    prompt_version: str


def create_workflow_context(
    access_token: str,
) -> StudyChatWorkflowContext:
    from chat_graph.ai import create_ai_client
    from chat_graph.config import settings
    from chat_graph.profiles import ENGLISH_CHAT_PROFILE, INLINE_INSPECTOR_PROFILE

    return StudyChatWorkflowContext(
        backend_api=BackendApiClient(settings.backend_api_url),
        chat_ai_client=create_ai_client(ENGLISH_CHAT_PROFILE),
        inline_inspector_ai_client=create_ai_client(INLINE_INSPECTOR_PROFILE),
        access_token=access_token,
        model_name=ENGLISH_CHAT_PROFILE.model,
        prompt_version=INLINE_INSPECTOR_PROMPT_VERSION,
    )
