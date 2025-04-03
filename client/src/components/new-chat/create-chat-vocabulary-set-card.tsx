"use client";

import { useCreateChat } from "@/common/hooks/chat/use-create-chat";
import { VocabularySetCard } from "../vocabulary-sets/vocabulary-set-card";
import type { VocabularySet } from "@/common/api/services/vocabulary-set.service";

interface CreateChatVocabularySetCardProps {
  vocabularySet: VocabularySet;
  category: string;
  topic: string;
}

export default function CreateChatVocabularySetCard({
  vocabularySet,
  category,
  topic,
}: CreateChatVocabularySetCardProps) {
  const { id: vocabularySetId } = vocabularySet;
  const { mutate } = useCreateChat();

  return (
    <VocabularySetCard
      onClick={() => mutate({ category, topic, vocabularySetId })}
      vocabularySet={vocabularySet}
      className="relative cursor-pointer"
    />
  );
}
