"use client";

import { useMutation } from "@tanstack/react-query";
import { clientApi } from "../../api/client-api";
import { toast } from "sonner";

export const useUpdateSettings = () => {
  const toastId = "update-settings";

  const mutation = useMutation({
    mutationFn: async (settings: UpdateSettingsRequest) => {
      console.log("settings", settings);

      (await clientApi.put<UpdateSettingsResponse>(`settings/update`, settings))
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

type UpdateSettingsRequest = {
  tutorId: string;
  autoCorrect?: boolean;
  autoRecord?: boolean;
  autoSend?: boolean;
};

export type UpdateSettingsResponse = {
  settingsId: string;
};
