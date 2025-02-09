"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

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
});

type FlashCard = z.infer<typeof flashCardSchema>;

interface UseFlashCardsSetFormProps {
  defaultValues?: FlashCardsSetFormValues;
}

export const useFlashCardsSetForm = ({
  defaultValues,
}: UseFlashCardsSetFormProps) => {
  // 1. Define your form.
  const form = useForm<FlashCardsSetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
      ? defaultValues
      : {
          title: "",
          description: "",
        },
  });

  // 2. Define a submit handler.
  // const onSubmit: SubmitHandler<FlashCardsSetFormValues> = (
  //   values: FlashCardsSetFormValues
  // ) => {
  //   // Do something with the form values.
  //   // ✅ This will be type-safe and validated.
  //   console.log(values);
  // };

  return { form };
};

export type FlashCardsSetFormValues = z.infer<typeof formSchema>;

export type FlashCardsSetFormSubmitHandler =
  SubmitHandler<FlashCardsSetFormValues>;
