"use client";

import { useMutation } from "@tanstack/react-query";
import { clientApi } from "../../api/client-api";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { LearningSettingsFormType } from "@/components/settings/learning-settings-form";
import { ChatSettingsFormType } from "@/components/settings/chat-settings-form";

export const useCreateSettings = () => {
  const router = useRouter();
  const pathName = usePathname();
  const toastId = "settings";

  const mutation = useMutation({
    mutationFn: async (settings: LearningSettingsFormType) =>
      (await clientApi.post<CreateSettingsResponse>(`settings`, settings)).data,
    onSuccess: () => {
      toast.success("We save your settings successfully!", {
        id: toastId,
      });
      if (pathName === "/onboarding") router.push(`/dashboard/chat/settings`);
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
