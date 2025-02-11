"use client";

import { useMutation } from "@tanstack/react-query";
import { clientApi } from "../../api/client-api";
import {
  type CreateVocabularySetRequest,
  type CreateVocabularySetResponse,
} from "../vocabulary-set.service";
import { toast } from "sonner";

export const useCreateVocabularySet = (
  vocabularySet: CreateVocabularySetRequest
) => {
  const mutation = useMutation({
    mutationFn: async () =>
      (
        await clientApi.post<CreateVocabularySetResponse>(
          `/vocabulary-set`,
          vocabularySet
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
