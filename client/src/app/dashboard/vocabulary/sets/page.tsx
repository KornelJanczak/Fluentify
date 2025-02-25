import { vocabularySetService } from "@/common/api/services/vocabulary-set.service";
import VocabularySets from "@/components/vocabulary-sets";

export default async function SetsPage({
  searchParams,
}: {
  searchParams: {
    page: string;
  };
}) {
  const page = await searchParams.page;
  const vocabularySets = await vocabularySetService.getVocabularySets(page);
  return <VocabularySets vocabularySets={vocabularySets} />;
}
