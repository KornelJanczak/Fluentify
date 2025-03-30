import { vocabularySetService } from "@/common/api/services/vocabulary-set.service";
import VocabularySets from "@/components/vocabulary-sets";
import { Suspense } from "react";

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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VocabularySets vocabularySets={vocabularySets} hasMore={hasMore} />
    </Suspense>
  );
}
