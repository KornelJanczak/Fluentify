import { type VocabularySet } from "@/common/api/services/vocabulary-set.service";
import VocabularySetCard from "./vocabulary-set-card";

interface VocabularySetsListProps {
  vocabularySets: VocabularySet[];
}

export default async function VocabularySetsList({
  vocabularySets,
}: VocabularySetsListProps) {
  return (
    <div className="flex flex-col items-stretch space-y-4 w-full">
      {vocabularySets.map((vocabularySet) => (
        <VocabularySetCard
          key={vocabularySet.id}
          vocabularySet={vocabularySet}
        />
      ))}
    </div>
  );
}
