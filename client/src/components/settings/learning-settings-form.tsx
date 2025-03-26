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

const learningLanguagues = [
  { value: "english", label: "English" },
  { value: "german", label: "German" },
];

const nativeLanguages = [
  { value: "english", label: "English" },
  { value: "german", label: "German" },
  { value: "french", label: "French" },
  { value: "spanish", label: "Spanish" },
  { value: "italian", label: "Italian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "dutch", label: "Dutch" },
  { value: "swedish", label: "Swedish" },
  { value: "danish", label: "Danish" },
  { value: "norwegian", label: "Norwegian" },
  { value: "finnish", label: "Finnish" },
  { value: "polish", label: "Polish" },
  { value: "czech", label: "Czech" },
  { value: "slovak", label: "Slovak" },
  { value: "hungarian", label: "Hungarian" },
  { value: "greek", label: "Greek" },
  { value: "bulgarian", label: "Bulgarian" },
  { value: "romanian", label: "Romanian" },
  { value: "croatian", label: "Croatian" },
  { value: "serbian", label: "Serbian" },
  { value: "bosnian", label: "Bosnian" },
  { value: "slovenian", label: "Slovenian" },
  { value: "albanian", label: "Albanian" },
  { value: "estonian", label: "Estonian" },
  { value: "latvian", label: "Latvian" },
  { value: "lithuanian", label: "Lithuanian" },
  { value: "icelandic", label: "Icelandic" },
  { value: "maltese", label: "Maltese" },
];

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

const FormSchema = z.object({
  learningLanguage: z.enum(["english", "german"], {
    message: "Please select a language.",
  }),
  nativeLanguage: z.enum(
    nativeLanguages.map((language) => language.value) as [string, ...string[]],
    {
      message: "Please select a language.",
    }
  ),
  learningLanguageLevel: z.string(),
});

type LearningSettingsFormType = z.infer<typeof FormSchema>;

interface LearningSettingsFormProps {
  learningLanguage: "english" | "german";
  nativeLanguage: string;
  learningLanguageLevel: string;
  buttonContent?: string;
}

export default function LearningSettingsForm(props: LearningSettingsFormProps) {
  const form = useForm<LearningSettingsFormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...props,
    },
  });

  const onSubmit = (data: LearningSettingsFormType) => {
    console.log("data", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-6">
        <FormField
          control={form.control}
          name="learningLanguage"
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
                  <Command>
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
