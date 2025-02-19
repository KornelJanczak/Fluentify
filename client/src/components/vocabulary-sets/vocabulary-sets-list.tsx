import { VocabularySetsProps } from ".";
import VocabularySetCard from "./vocabulary-set-card";

interface IVocabularySetsListProps extends VocabularySetsProps {}

export default function VocabularySetsList({
  vocabularySets,
}: IVocabularySetsListProps) {
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
