"use client";

import { type VocabularySet } from "@/common/api/services/vocabulary-set.service";
import { VocabularySetCard } from "./vocabulary-set-card";
import Link from "next/link";
import { use } from "react";

interface VocabularySetsListProps {
  data: Promise<{ vocabularySets: VocabularySet[] }>;
}

export function VocabularySetsList({ data }: VocabularySetsListProps) {
  const { vocabularySets } = use(data);

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
