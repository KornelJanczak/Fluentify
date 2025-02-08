"use client";

import { useMutation } from "@tanstack/react-query";
import { ChatsResponse } from "../chat.service";
import { clientApi } from "../../api/client-api";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";

export const useDeleteChat = (chatId: string) => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () =>
      (await clientApi.delete<ChatsResponse>(`/chat/${chatId}`)).data,
    onSuccess: (data) => {
      console.log("data", data);

      toast.success("Chat has been deleted successfully!");
      router.refresh();
    },
    onError: (error) => {
      console.log("error", error);

      toast.error("Failed to delete chat!");
    },
  });

  return mutation;
};
