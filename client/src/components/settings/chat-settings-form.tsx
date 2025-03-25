"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tutors = {
  english: [
    { id: "en-US-Casual-K", name: "John", origin: "USA" },
    { id: "en-US-Journey-F", name: "Emily", origin: "USA" },
    { id: "en-GB-Journey-D", name: "Oliver", origin: "UK" },
    { id: "en-GB-Journey-F", name: "Victoria", origin: "UK" },
    { id: "en-AU-Journey-D", name: "Jack", origin: "Australia" },
    { id: "en-AU-Neural2-C", name: "Charlotte", origin: "Australia" },
  ],
  german: [],
};

const chatSettings = [
  {
    id: "autoCorrect",
    label: "Auto-correct",
    explanation: "See corrections without clicking the pencil icon",
  },
  {
    id: "autoRecord",
    label: "Auto-record",
    explanation: "Recording starts after AI reply",
  },
  {
    id: "autoSend",
    label: "Auto-send",
    explanation: "Sends after a few seconds of silence",
  },
];

const FormSchema = z.object({
  tutor: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  chatSettings: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

interface ChatSettingsFormProps {
  learningLanguage: string;
}

export function ChatSettingsForm({ learningLanguage }: ChatSettingsFormProps) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: FormSchemaType) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-8">
        <FormField
          control={form.control}
          name="tutor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Which language would you like to learn?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={"english"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent defaultValue={"english"}>
                  {tutors[learningLanguage].map((tutor) => (
                    <SelectItem key={tutor.id} value={tutor.id}>
                      {tutor.name} ({tutor.origin})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                If you are learning more than one, please select the primary
                one. You can change this option when you switch to another
                language.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="chatSettings"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Chat options</FormLabel>
                <FormDescription>
                  Select the behaviour that you'd like to apply during chat with
                  AI.
                </FormDescription>
              </div>
              {chatSettings.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="chatSettings"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <div>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </div>
                        </FormControl>
                        <div className="flex flex-row items-center space-x-2">
                          <FormLabel className="text-sm font-normal">
                            {item.label}
                          </FormLabel>
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button className="p-0 m-0 text-white bg-primary rounded-full w-4 h-4">
                                ?
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="text-sm">
                              {item.explanation}
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Settings</Button>
      </form>
    </Form>
  );
}
