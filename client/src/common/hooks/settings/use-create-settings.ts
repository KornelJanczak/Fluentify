"use client";

import { useMutation } from "@tanstack/react-query";
import { clientApi } from "../../api/client-api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LearningSettingsFormType } from "@/components/settings/learning-settings-form";

export const useCreateSettings = () => {
  const router = useRouter();
  const toastId = toast("create-settings");

  const mutation = useMutation({
    mutationFn: async (settings: LearningSettingsFormType) =>
      (await clientApi.post<CreateSettingsResponse>(`settings`, settings)).data,
    onSuccess: () => {
      toast.success("Chat has been created successfully!", {
        id: toastId,
      });
      router.push(`/dashboard/chat/settings`);
    },
    onError: () => {
      toast.error("Failed to create chat!", {
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
