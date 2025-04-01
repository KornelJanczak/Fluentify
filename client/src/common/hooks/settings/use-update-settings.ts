"use client";

import { useMutation } from "@tanstack/react-query";
import { clientApi } from "../../api/client-api";
import { toast } from "sonner";
import { ChatSettingsFormType } from "@/components/settings/chat-settings-form";

export const useUpdateSettings = () => {
  const toastId = "update-settings";

  const mutation = useMutation({
    mutationFn: async (settings: ChatSettingsFormType) => {
      console.log("settings", settings);

      (await clientApi.put<CreateSettingsResponse>(`settings/update`, settings))
        .data;
    },
    onSuccess: () => {
      toast.success("We save your settings successfully!", {
        id: toastId,
      });
    },
    onError: (error) => {
      console.log(error);

      toast.error("Failed to create settings!", {
        id: toastId,
      });
    },
    onMutate: () => {
      toast.loading("Saving settings...", {
        id: toastId,
      });
    },
  });

  return mutation;
};

export type CreateSettingsResponse = {
  settingsId: string;
};
