"use client";

import { useMutation } from "@tanstack/react-query";
import { clientApi } from "../../api/client-api";
import { FlashCard } from "../../flash-card/flash-card.interfaces";
import { toast } from "sonner";

export const useCreateVocabularySet = () => {
  const mutation = useMutation({
    mutationFn: async (vocabularySet: CreateVocabularySetRequest) =>
      (
        await clientApi.post<CreateVocabularySetResponse>(
          `/vocabulary-set`,
          formatCreateVocabularySetData(vocabularySet)
        )
      ).data,
    onSuccess: () => {
      toast.success("Vocabulary set has been created successfully!");
    },
    onError: () => {
      toast.error("Failed to create vocabulary set!");
    },
  });

  return mutation;
};

const formatCreateVocabularySetData = ({
  title,
  description,
  flashCards,
}: CreateVocabularySetRequest) => ({
  title,
  description,
  flashCards: flashCards
    .map(({ translation, definition }) =>
      translation !== "" && definition !== ""
        ? { translation, definition }
        : null
    )
    .filter(Boolean),
});

export type CreateVocabularySetResponse = {
  vocabularySetId: string;
};

export type CreateVocabularySetRequest = {
  title?: string;
  description?: string;
  flashCards: Omit<FlashCard, "id" | "vocabularySetId">[];
};
