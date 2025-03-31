import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LearningSettingsForm } from "@/components/settings/learning-settings-form";
import SectionWrapper from "@/components/section-wrapper";
import { ChatSettingsForm } from "@/components/settings/chat-settings-form";
import { settingsService } from "@/common/api/services/settings.service";

export default async function SettingsPage() {
  const {
    learningLanguage,
    learningLanguageLevel,
    nativeLanguage,
    ...chatSettings
  } = await settingsService.getChatSettingsByUserId();

  return (
    <SectionWrapper>
      <Tabs defaultValue="learning" className="w-full max-w-6xl">
        <TabsList>
          <TabsTrigger value="learning">Learning Settings</TabsTrigger>
          <TabsTrigger value="chat">Chat Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="learning">
          <LearningSettingsForm
            learningLanguage={learningLanguage}
            learningLanguageLevel={learningLanguageLevel}
            nativeLanguage={nativeLanguage}
          />
        </TabsContent>
        <TabsContent value="chat">
          <ChatSettingsForm
            learningLanguage={learningLanguage}
            {...chatSettings}
          />
        </TabsContent>
      </Tabs>
    </SectionWrapper>
  );
}
