import { vocabularySetService } from "@/common/services/vocabulary-set/vocabulary-set.service";
import VocabularySetEdit from "@/components/vocabulary-set/vocabulary-set-edit";

export default async function VocabularySet({
  params,
}: {
  params: { setId: string };
}) {
  const vocabularySet = await vocabularySetService.getVocabularySetDetails(
    params.setId
  );
  return <VocabularySetEdit vocabularySet={vocabularySet} />;
}
