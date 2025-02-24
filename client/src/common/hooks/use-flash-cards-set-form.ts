"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const flashCardSchema = z.object({
  definition: z.string().min(2, {
    message: "Definition must be at least 2 characters.",
  }),
  translation: z.string().min(2, {
    message: "Translation must be at least 2 characters.",
  }),
});

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  flashCards: z.array(flashCardSchema).min(2, {
    message: "There must be at least 2 flash cards.",
  }),
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
