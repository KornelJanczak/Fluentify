
from langchain_core.prompts import ChatPromptTemplate

from app.infrastructure.ai.prompts import FLASHCARD_EXAMPLES_SYSTEM_PROMPT
from app.modules.flashcards.flashcard_model import FlashCard
from app.modules.example_sentences.example_sentence_schema import GeneratedExamplesSchema
from app.modules.flashcard_sets.flashcard_set_service import (
    FlashcardSetService,
)
from app.modules.flashcards.flashcard_service import FlashcardService


class AiExampleSentenceGenerator:
    def __init__(
        self,
        ai_client,
        flashcard_set_service: FlashcardSetService,
        flashcard_service: FlashcardService,
    ):
        structured_model = ai_client.with_structured_output(
            GeneratedExamplesSchema
        )
        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", FLASHCARD_EXAMPLES_SYSTEM_PROMPT),
                (
                    "human",
                    "Target word: {word}\nLearner level: {language_level}",
                ),
            ]
        )
        self.flashcard_set_service = flashcard_set_service
        self.flashcard_service = flashcard_service
        self.chain = prompt | structured_model

    async def generate_example_sentences(
        self,
        flashcard_set_id: str,
        user_id: str,
        language_level: str = "B2/B2+",
    ) -> list[GeneratedExamplesSchema] | None:
        flashcard_set = await self.flashcard_set_service.get_flashcard_set(
            flashcard_set_id, user_id
        )
        if flashcard_set is None:
            return None

        generated_examples = []
        for flashcard in flashcard_set.flashcards:
            examples = await self.generate_example_sentences_for_flashcard(
                flashcard,
                language_level,
            )
            generated_examples.append(examples)

        updates = [
            {
                "id": flashcard.id,
                "ai_example_sentences": generated.examples,
            }
            for flashcard, generated in zip(
                flashcard_set.flashcards,
                generated_examples,
            )
        ]

        await self.flashcard_service.update_flashcards(updates, user_id)

        return generated_examples

    async def generate_example_sentences_for_flashcard(
        self,
        flashcard: FlashCard,
        language_level: str = "B2/B2+",
    ) -> GeneratedExamplesSchema:
        return await self.chain.ainvoke(
            {
                "word": flashcard.definition,
                "language_level": language_level,
            }
        )
