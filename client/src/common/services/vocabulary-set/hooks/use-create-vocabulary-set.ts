"use client";

import { useMutation } from "@tanstack/react-query";
import { clientApi } from "../../api/client-api";
import { FlashCard } from "../../flash-card/flash-card.interfaces";
import { toast } from "sonner";

export const useCreateVocabularySet = () => {
  const mutation = useMutation({
    // mutationFn: async (vocabularySet: CreateVocabularySetRequest) =>
    //   (
    //     await clientApi.post<CreateVocabularySetResponse>(
    //       `/vocabulary-set`,
    //       formatCreateVocabularySetData(vocabularySet)
    //     )
    //   ).data,
    mutationFn: async (vocabularySet: CreateVocabularySetRequest) => {
      await fetch("http://localhost:5000/api/v1/vocabulary-set", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: formatCreateVocabularySetData(vocabularySet),
      });
    },
    onSuccess: () => {
      toast.success("Vocabulary set has been created successfully!");
    },
    onError: (error) => {
      console.log("error", error);

      toast.error("Failed to create vocabulary set!");
    },
  });

  return mutation;
};

const formatCreateVocabularySetData = ({
  title,
  description,
  flashCards,
}: CreateVocabularySetRequest) => {
  const obj = {
    title,
    description,
    flashCards: flashCards
      .map(({ translation, definition }) =>
        translation !== "" && definition !== ""
          ? { translation, definition }
          : null
      )
      .filter(Boolean),
  };
  console.log("obj", obj);

  return JSON.stringify(obj);
};

export type CreateVocabularySetResponse = {
  vocabularySetId: string;
};

export type CreateVocabularySetRequest = {
  title?: string;
  description?: string;
  flashCards: Omit<FlashCard, "id" | "vocabularySetId">[];
};
