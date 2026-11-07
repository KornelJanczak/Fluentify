from langchain.chat_models import init_chat_model
from langchain_core.language_models import BaseChatModel

from chat_graph.config import settings
from chat_graph.profiles import AiProfile


def create_ai_client(profile: AiProfile) -> BaseChatModel:
    return init_chat_model(
        model=profile.model,
        temperature=profile.temperature,
        timeout=profile.timeout,
        max_retries=profile.max_retries,
        api_key=settings.openai_api_key,
    )
