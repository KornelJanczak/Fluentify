"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

interface UseFlashCardsSetFormProps {
  defaultValues?: FlashCardsSetFormValues;
}

export const useFlashCardsSetForm = ({
  defaultValues,
}: UseFlashCardsSetFormProps) => {
  const form = useForm<FlashCardsSetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
      ? defaultValues
      : {
          title: "",
          description: "",
        },
  });

  return { form };
};

export type FlashCardsSetFormValues = z.infer<typeof formSchema>;

export type FlashCardsSetFormSubmitHandler =
  SubmitHandler<FlashCardsSetFormValues>;
