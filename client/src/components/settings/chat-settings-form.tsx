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
import { useUpdateSettings } from "@/common/hooks/settings/use-update-settings";

const tutors = {
  "en-US": [
    { id: "en-US-Casual-K", name: "John", origin: "USA" },
    { id: "en-US-Journey-F", name: "Emily", origin: "USA" },
  ],
  "en-GB": [
    { id: "en-GB-Journey-D", name: "Oliver", origin: "UK" },
    { id: "en-GB-Journey-F", name: "Victoria", origin: "UK" },
  ],
  "en-AU": [
    { id: "en-AU-Journey-D", name: "Jack", origin: "Australia" },
    { id: "en-AU-Neural2-C", name: "Charlotte", origin: "Australia" },
  ],
  german: [],
} as const;

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
  tutorId: z.string({ message: "Tutor should be a string!" }).nonempty({
    message: "Please select a tutor.",
  }),
  chatSettings: z
    .array(z.enum(["autoCorrect", "autoRecord", "autoSend"]))
    .optional(),
});

export type ChatSettingsFormType = z.infer<typeof FormSchema>;

interface ChatSettingsFormProps {
  tutorId: string;
  learningLanguage: string;
  autoCorrect?: boolean;
  autoRecord?: boolean;
  autoSend?: boolean;
}

export function ChatSettingsForm({
  tutorId,
  learningLanguage,
  autoCorrect,
  autoRecord,
  autoSend,
}: ChatSettingsFormProps) {
  console.log("Props:", {
    tutorId,
    learningLanguage,
    autoCorrect,
    autoRecord,
    autoSend,
  });

  const { mutate } = useUpdateSettings();
  const currentTutor = tutors[learningLanguage].find(
    ({ id }) => id === tutorId
  ).id;

  const form = useForm<ChatSettingsFormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tutorId: currentTutor,
      chatSettings: [
        autoCorrect ? "autoCorrect" : null,
        autoRecord ? "autoRecord" : null,
        autoSend ? "autoSend" : null,
      ].filter(Boolean) as ("autoCorrect" | "autoRecord" | "autoSend")[],
    },
  });

  const onSubmit = ({ tutorId, chatSettings }: ChatSettingsFormType) => {
    mutate({
      tutorId,
      autoCorrect: chatSettings.some((item) => item === "autoCorrect") || null,
      autoRecord: chatSettings.some((item) => item === "autoRecord") || null,
      autoSend: chatSettings.some((item) => item === "autoSend") || null,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-8">
        <FormField
          control={form.control}
          name="tutorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose your tutor!</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={currentTutor}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tutors[learningLanguage].map((tutor) => (
                    <SelectItem key={tutor.id} value={tutor.id}>
                      {tutor.name} ({tutor.origin})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Each tutor is characterized by their age, gender, and
                personality.
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
                          <Checkbox
                            checked={field.value?.includes(
                              item.id as
                                | "autoCorrect"
                                | "autoRecord"
                                | "autoSend"
                            )}
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
