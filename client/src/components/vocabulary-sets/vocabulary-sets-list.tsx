import { VocabularySetsProps } from ".";
import VocabularySetCard from "./vocabulary-set-card";

interface VocabularySetsListProps extends VocabularySetsProps {}

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
