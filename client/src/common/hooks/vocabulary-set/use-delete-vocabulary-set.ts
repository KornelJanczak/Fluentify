"use client";

import { useMutation } from "@tanstack/react-query";
import { clientApi } from "../../api/client-api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useDeleteVocabularySet = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (id: string) =>
      (await clientApi.delete(`/vocabulary-set/${id}`)).data,

    onSuccess: () => {
      toast.success("Vocabulary set has been deleted successfully!");
      router.push("/dashboard/vocabulary/sets");
    },
    onError: () => {
      toast.error("Failed to delete vocabulary set!");
    },
  });

  return mutation;
};
