import LearningSettingsForm from "@/components/settings/learning-settings-form";
import { Card } from "@/components/ui/card";
import Markdown from "react-markdown";

export default function OnboardingPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <Card className="max-w-xl p-8">
        <Markdown className="text-center">
          ## 👋 Welcome! Please answer a few quick questions to get started.
          (It's necessary to contine)
        </Markdown>
        <LearningSettingsForm
          learningLanguage="en-US"
          nativeLanguage="pl-PL"
          learningLanguageLevel="B2"
          buttonContent="Continue"
        />
      </Card>
    </section>
  );
}
