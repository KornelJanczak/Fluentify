import SectionWrapper from "../section-wrapper";
import { Markdown } from "../markdown";
import { type VocabularySet } from "@/common/api/services/vocabulary-set.service";
import VocabularySetsList from "./vocabulary-sets-list";
import { Separator } from "../ui/separator";
import { Suspense } from "react";
import { SkeletonVocabularyList } from "./skeleton-vocabulary-list";

export interface VocabularySetsProps {
  vocabularySets: VocabularySet[];
}

export default async function VocabularySets({
  vocabularySets,
}: VocabularySetsProps) {
  return (
    <SectionWrapper>
      <div className="w-full max-w-5xl">
        <Markdown>## Your vocabulary sets</Markdown>
        <Separator className="w-full my-10" />
        <Suspense
          fallback={<SkeletonVocabularyList length={vocabularySets.length} />}
        >
          <VocabularySetsList vocabularySets={vocabularySets} />
        </Suspense>
      </div>
    </SectionWrapper>
  );
}
