import { vocabularySetService } from "@/common/api/services/vocabulary-set.service";
import SectionWrapper from "@/components/section-wrapper";
import { VocabularySetsList } from "@/components/vocabulary-sets/vocabulary-sets-list";
import { Separator } from "@/components/ui/separator";
import { SkeletonVocabularyList } from "@/components/vocabulary-sets/skeleton-vocabulary-list";
import { VocabularySetsPagination } from "@/components/vocabulary-sets/vocabulary-sets-pagination";
import { VocabularySetsHeader } from "@/components/vocabulary-sets/vocabulary-sets-header";
import { VocabularySetsNotFound } from "@/components/vocabulary-sets/vocabulary-sets-not-found";

import { Suspense } from "react";

interface SetsPageProps {
  searchParams: {
    page: string;
    search: string;
  };
}

export default function SetsPage({ searchParams }: SetsPageProps) {
  const { page, search } = searchParams;
  const vocabularySetsPromise = vocabularySetService.getVocabularySets(
    page,
    search
  );

  return (
    <SectionWrapper>
      <div className="w-full max-w-5xl">
        <VocabularySetsHeader />
        <Separator className="w-full mb-5 mt-10" />
        <Suspense fallback={<SkeletonVocabularyList length={5} />}>
          <VocabularySetsList data={vocabularySetsPromise} />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <VocabularySetsPagination hasMorePromise={vocabularySetsPromise} />
        </Suspense>
      </div>
    </SectionWrapper>
  );
}
