import SectionWrapper from "../section-wrapper";
import { type VocabularySet } from "@/common/api/services/vocabulary-set.service";
import VocabularySetsList from "./vocabulary-sets-list";
import { Separator } from "../ui/separator";
import { Suspense } from "react";
import { SkeletonVocabularyList } from "./skeleton-vocabulary-list";
import { VocabularySetsPagination } from "./vocabulary-sets-pagination";
import VocabularySetsHeader from "./vocabulary-sets-header";
import VocabularySetsNotFound from "./vocabulary-sets-not-found";

export interface VocabularySetsProps {
  vocabularySets: VocabularySet[];
  hasMore: boolean;
}

export default async function VocabularySets({
  vocabularySets,
  hasMore,
}: VocabularySetsProps) {
  const vocabularySetsExist = vocabularySets.length > 0;

  return (
    <SectionWrapper>
      <div className="w-full max-w-5xl">
        <VocabularySetsHeader />
        <Separator className="w-full mb-5 mt-10" />
        {vocabularySetsExist && (
          <Suspense
            fallback={<SkeletonVocabularyList length={vocabularySets.length} />}
          >
            <VocabularySetsList vocabularySets={vocabularySets} />
          </Suspense>
        )}
        {!vocabularySetsExist && <VocabularySetsNotFound />}
        {vocabularySetsExist && <VocabularySetsPagination hasMore={hasMore} />}
      </div>
    </SectionWrapper>
  );
}
