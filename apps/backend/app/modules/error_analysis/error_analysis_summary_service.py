from collections import Counter

from app.modules.error_analysis.error_analysis_model import (
    StudyChatErrorAnalysis,
)
from app.modules.error_analysis.error_analysis_repository import (
    StudyChatErrorAnalysisRepository,
)


class StudyChatAnalysisSummaryService:
    def __init__(self, repository: StudyChatErrorAnalysisRepository):
        self.repository = repository

    async def get_summary(self, flashcard_set_id: str) -> str:
        analyses = await self.repository.get_by_flashcard_set_id(flashcard_set_id)
        return self._format_summary(analyses)

    def _format_summary(
        self,
        analyses: list[StudyChatErrorAnalysis],
    ) -> str:
        if not analyses:
            return "No previous language analysis is available for this learner."

        error_counts = Counter(
            error["error_type"]
            for analysis in analyses
            for error in analysis.language_errors
            if isinstance(error.get("error_type"), str)
        )
        summary_lines = [
            f"Messages analyzed: {len(analyses)}",
            "Recurring error types: "
            + (", ".join(
                f"{error_type} ({count})"
                for error_type, count in error_counts.most_common()
            ) or "none"),
        ]

        corrections = [
            f"'{analysis.original_message}' -> '{analysis.corrected_message}'"
            for analysis in analyses
            if analysis.corrected_message
        ]
        if corrections:
            summary_lines.append(
                "Representative corrections:\n- "
                + "\n- ".join(corrections[-5:])
            )

        return "\n".join(summary_lines)
