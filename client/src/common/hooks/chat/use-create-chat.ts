"use client";

import { useMutation } from "@tanstack/react-query";
import { clientApi } from "../../api/client-api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useCreateChat = () => {
  const router = useRouter();
  const toastId = "create-chat";

  const mutation = useMutation({
    mutationFn: async (chat: CreateChatRequest) =>
      (await clientApi.post<CreateChatResponse>(`/chat/create-chat`, chat))
        .data,
    onError: () => {
      toast.error("Failed to create chat!", {
        id: toastId,
      });
    },
    onSuccess: (chatId) => {
      toast.success("We created your chat successfuly!", { id: toastId });
      router.push(`/dashboard/chat/${chatId}`);
    },
    onMutate: () => {
      toast.loading("Creating chat...", {
        id: toastId,
      });
    },
  });

  return mutation;
};

export type CreateChatResponse = {
  chatId: string;
};

export type CreateChatRequest = {
  category: string;
  topic: string;
  vocabularySetId?: string;
};
