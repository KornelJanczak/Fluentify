import { vocabularySetService } from "@/common/services/vocabulary-set/vocabulary-set.service";
import VocabularySets from "@/components/vocabulary-sets";

export default async function SetsPage() {
  const vocabularySets = await vocabularySetService.getVocabularySets();
  return <VocabularySets vocabularySets={vocabularySets} />;
}
