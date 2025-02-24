import { vocabularySetService } from "@/common/api/services/vocabulary-set.service";
import VocabularySetEdit from "@/components/vocabulary-set/vocabulary-set-edit";

export default async function VocabularySet({
  params,
}: {
  params: { setId: string };
}) {
  const { setId } = await params;
  const vocabularySet = await vocabularySetService.getVocabularySetDetails(
    setId
  );
  return <VocabularySetEdit vocabularySet={vocabularySet} />;
}
