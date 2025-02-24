"use client";

import { useMutation } from "@tanstack/react-query";
import { clientApi } from "../../api/client-api";
import { type ChatsResponse } from "../../api/chat.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useDeleteChat = (chatId: string) => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () =>
      (await clientApi.delete<ChatsResponse>(`/chat/${chatId}`)).data,
    onSuccess: () => {
      toast.success("Chat has been deleted successfully!");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to delete chat!");
    },
  });

  return mutation;
};
