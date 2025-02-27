import { type VocabularySet } from "@/common/api/services/vocabulary-set.service";
import VocabularySetCard from "./vocabulary-set-card";
import Link from "next/link";

interface VocabularySetsListProps {
  vocabularySets: VocabularySet[];
}

export default async function VocabularySetsList({
  vocabularySets,
}: VocabularySetsListProps) {
  return (
    <div className="flex flex-col items-stretch space-y-4 w-full">
      {vocabularySets.map((vocabularySet) => (
        <Link
          key={vocabularySet.id}
          href={`/dashboard/vocabulary/${vocabularySet.id}`}
        >
          <VocabularySetCard vocabularySet={vocabularySet} />
        </Link>
      ))}
    </div>
  );
}
