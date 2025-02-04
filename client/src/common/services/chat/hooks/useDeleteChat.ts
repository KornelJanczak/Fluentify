"use client";

import { useMutation } from "@tanstack/react-query";
import { ChatsResponse } from "../chat.service";
import { clientApi } from "../../api/client-api";
import { toast } from "sonner";

export const useDeleteChat = (chatId: string) => {
  const mutation = useMutation({
    mutationFn: async () =>
      (
        await clientApi.delete<ChatsResponse>(`/chat/${chatId}`, {
          credentials: "include",
        })
      ).data,
    onSuccess: () => toast.success("Chat has been deleted successfully!"),
    onError: () => toast.error("Failed to delete chat!"),
  });

  return mutation;
};
