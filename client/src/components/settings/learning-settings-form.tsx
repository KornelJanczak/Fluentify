"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreateSettings } from "@/common/hooks/settings/use-create-settings";

const languages = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "en-AU", label: "English (AU)" },
  { value: "de-DE", label: "German" },
  { value: "fr-FR", label: "French" },
  { value: "es-ES", label: "Spanish" },
  { value: "it-IT", label: "Italian" },
  { value: "pt-PT", label: "Portuguese" },
  { value: "nl-NL", label: "Dutch" },
  { value: "sv-SE", label: "Swedish" },
  { value: "da-DK", label: "Danish" },
  { value: "no-NO", label: "Norwegian" },
  { value: "fi-FI", label: "Finnish" },
  { value: "pl-PL", label: "Polish" },
  { value: "cs-CZ", label: "Czech" },
  { value: "sk-SK", label: "Slovak" },
  { value: "hu-HU", label: "Hungarian" },
  { value: "el-GR", label: "Greek" },
  { value: "bg-BG", label: "Bulgarian" },
  { value: "ro-RO", label: "Romanian" },
  { value: "hr-HR", label: "Croatian" },
  { value: "sr-RS", label: "Serbian" },
  { value: "bs-BA", label: "Bosnian" },
  { value: "sl-SI", label: "Slovenian" },
  { value: "sq-AL", label: "Albanian" },
  { value: "et-EE", label: "Estonian" },
  { value: "lv-LV", label: "Latvian" },
  { value: "lt-LT", label: "Lithuanian" },
  { value: "is-IS", label: "Icelandic" },
  { value: "mt-MT", label: "Maltese" },
];

const learningLanguagues = [...languages];
const nativeLanguages = [...languages];

export const learningLanguageLevels = {
  A1: {
    label: "Beginner",
    description: "You can understand and use familiar everyday expressions.",
  },
  A2: {
    label: "Elementary",
    description: "You can communicate in simple and routine tasks.",
  },
  B1: {
    label: "Intermediate",
    description:
      "You can deal with most situations likely to arise whilst travelling.",
  },
  B2: {
    label: "Upper Intermediate",
    description: "You can interact with a degree of fluency and spontaneity.",
  },
  C1: {
    label: "Advanced",
    description:
      "You can express ideas fluently and spontaneously without much obvious searching for expressions.",
  },
};

const languageSchema = z
  .string({ message: "Language should be a string" })
  .nonempty({
    message: "Please select a language.",
  })
  .min(2, {
    message: "Please select a language.",
  })
  .max(5, {
    message: "Please select a language.",
  });

const FormSchema = z.object({
  learningLanguage: languageSchema,
  nativeLanguage: languageSchema,
  learningLanguageLevel: z.string().nonempty({
    message: "Please select a language level.",
  }),
});

export type LearningSettingsFormType = {
  learningLanguage: string;
  nativeLanguage: string;
  learningLanguageLevel: string;
};

interface LearningSettingsFormProps {
  learningLanguage: string;
  nativeLanguage: string;
  learningLanguageLevel: string;
  buttonContent?: string;
}

export function LearningSettingsForm(props: LearningSettingsFormProps) {
  const { mutate } = useCreateSettings();
  const form = useForm<LearningSettingsFormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...props,
    },
  });

  const onSubmit = (data: LearningSettingsFormType) => mutate(data);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-6">
        <FormField
          control={form.control}
          name="learningLanguage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Which language would you like to learn?</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={props.learningLanguage}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {learningLanguagues.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
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
          name="nativeLanguage"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                What language should we show translations in?
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? nativeLanguages.find(
                            (language) => language.value === field.value
                          )?.label
                        : "Select language"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align={"start"}>
                  <Command
                    defaultValue={field.value}
                    className="overflow-hidden"
                  >
                    <CommandInput
                      placeholder="Search language..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {nativeLanguages.map((language) => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              form.setValue("nativeLanguage", language.value);
                            }}
                          >
                            {language.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                language.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>Typically your native language</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="learningLanguageLevel"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>What's your current level?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {Object.entries(learningLanguageLevels).map(
                    ([value, { label, description }]) => (
                      <FormItem
                        key={value}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={value} />
                        </FormControl>
                        <FormLabel className="font-[350]">{`(${value}) ${label} - ${description}`}</FormLabel>
                      </FormItem>
                    )
                  )}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{`${
          props.buttonContent ? props.buttonContent : "Save Settings"
        }`}</Button>
      </form>
    </Form>
  );
}
