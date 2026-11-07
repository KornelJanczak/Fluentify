from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.error_analysis.error_analysis_model import (
    StudyChatErrorAnalysis,
)


class StudyChatErrorAnalysisRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        analysis: StudyChatErrorAnalysis,
    ) -> StudyChatErrorAnalysis:
        self.session.add(analysis)
        await self.session.flush()
        return analysis

    async def get_by_flashcard_set_id(
        self,
        flashcard_set_id: str,
    ) -> list[StudyChatErrorAnalysis]:
        result = await self.session.scalars(
            select(StudyChatErrorAnalysis)
            .filter_by(flashcard_set_id=flashcard_set_id)
            .order_by(StudyChatErrorAnalysis.created_at)
        )
        return list(result.all())

    async def get_by_thread_id(
        self,
        thread_id: str,
    ) -> list[StudyChatErrorAnalysis]:
        result = await self.session.scalars(
            select(StudyChatErrorAnalysis)
            .filter_by(thread_id=thread_id)
            .order_by(StudyChatErrorAnalysis.created_at)
        )
        return list(result.all())

    async def get_by_inspection_request_id(
        self,
        inspection_request_id: str,
    ) -> StudyChatErrorAnalysis | None:
        return await self.session.scalar(
            select(StudyChatErrorAnalysis).filter_by(
                inspection_request_id=inspection_request_id,
            )
        )
