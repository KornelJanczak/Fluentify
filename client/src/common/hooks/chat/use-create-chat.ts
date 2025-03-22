"use client";

import { useMutation } from "@tanstack/react-query";
import { clientApi } from "../../api/client-api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useCreateChat = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (chat: CreateChatRequest) =>
      (await clientApi.post<CreateChatResponse>(`/chat/create-chat`, chat))
        .data,
    onSuccess: (chatId) => {
      router.push(`/dashboard/chat/${chatId}`);
      toast.success("Chat has been created successfully!");
    },
    onError: (error) => {
      console.log("error", error);
      console.log("error");

      toast.error("Failed to create chat!");
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
