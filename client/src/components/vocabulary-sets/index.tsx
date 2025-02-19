import { Suspense } from "react";
import VocabularySetsList from "./vocabulary-sets-list";
import { type VocabularySet } from "@/common/services/vocabulary-set/vocabulary-set.service";
import VocabularySetsContent from "./vocabulary-sets-content";

export interface VocabularySetsProps {
  vocabularySets: VocabularySet[];
}

export default function VocabularySets({
  vocabularySets,
}: VocabularySetsProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VocabularySetsContent vocabularySets={vocabularySets} />
    </Suspense>
  );
}
