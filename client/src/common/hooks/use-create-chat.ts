"use client";

import { useMutation } from "@tanstack/react-query";
import { clientApi } from "../api/client-api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useCreateChat = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (chat: CreateChatRequest) =>
      (await clientApi.post<CreateChatResponse>(`/create-chat`, chat)).data,
    onSuccess: (chatId) => {
      toast.success("Chat has been created successfully!");
      router.push(`/dashboard/chat/${chatId}`);
    },
    onError: () => {
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
