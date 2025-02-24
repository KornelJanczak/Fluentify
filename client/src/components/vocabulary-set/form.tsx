"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  FlashCardsSetFormValues,
  useFlashCardsSetForm,
} from "@/common/hooks/use-flash-cards-set-form";

interface FlashCardsSetFormProps {
  defaultValues?: FlashCardsSetFormValues;
  onSubmit: (data: FlashCardsSetFormValues) => void;
}

export function VocabularySetForm({
  onSubmit,
  defaultValues,
}: FlashCardsSetFormProps) {
  const { form } = useFlashCardsSetForm({ defaultValues });

  return (
    <Form {...form}>
      <form
        id="flash-cards-set-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 pt-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input variant="outline" placeholder="Set title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  variant="outline"
                  placeholder="Add description..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
