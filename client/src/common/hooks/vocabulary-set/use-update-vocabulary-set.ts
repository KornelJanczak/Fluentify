"use client";

import { useMutation } from "@tanstack/react-query";
import { clientApi } from "../../api/client-api";
import { FlashCard } from "../../api/services/vocabulary-set.service";
import { toast } from "sonner";

export const useUpdateVocabularySet = () => {
  const mutation = useMutation({
    mutationFn: async ({ id, vocabularySet }: UpdateVocabularySetRequest) =>
      (
        await clientApi.put<UpdateVocabularySetResponse>(
          `/vocabulary-set/${id}`,
          vocabularySet
        )
      ).data,

    onSuccess: () => {
      toast.success("Vocabulary set has been saved successfully!");
    },
    onError: () => {
      toast.error("Failed to save vocabulary set!");
    },
  });

  return mutation;
};

export type UpdateVocabularySetResponse = {
  vocabularySetId: string;
};

export type UpdateVocabularySetRequest = {
  id: string;
  vocabularySet: {
    title?: string;
    description?: string;
    flashCards?: Omit<FlashCard, "vocabularySetId">[];
  };
};
