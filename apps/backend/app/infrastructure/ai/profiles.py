from dataclasses import dataclass


@dataclass(frozen=True)
class AiProfile:
    model: str
    temperature: float
    timeout: int
    max_retries: int = 2


FLASHCARD_EXAMPLES_PROFILE = AiProfile(
    model="gpt-4o-mini",
    temperature=0.2,
    timeout=30,
)
