"use client";

import { useMutation } from "@tanstack/react-query";
import { clientApi } from "../api/client-api";
import { FlashCard } from "../api/services/vocabulary-set.service";
import { formatCreateVocabularySetData } from "@/lib/formaters";
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

export type CreateVocabularySetResponse = {
  vocabularySetId: string;
};

export type CreateVocabularySetRequest = {
  title?: string;
  description?: string;
  flashCards: Omit<FlashCard, "id" | "vocabularySetId">[];
};
