import { vocabularySetService } from "@/common/api/services/vocabulary-set.service";
import VocabularySets from "@/components/vocabulary-sets";

export default async function SetsPage({
  searchParams,
}: {
  searchParams: {
    page: string;
    search: string;
  };
}) {
  const { page, search } = await searchParams;

  const { vocabularySets, hasMore } =
    await vocabularySetService.getVocabularySets(page, search);

  return <VocabularySets vocabularySets={vocabularySets} hasMore={hasMore} />;
}
