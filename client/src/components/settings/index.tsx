import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LearningSettingsForm from "./learning-settings-form";
import SectionWrapper from "../section-wrapper";
import { ChatSettingsForm } from "./chat-settings-form";

export default function Settings() {
  return (
    <SectionWrapper>
      <Tabs defaultValue="learning" className="w-full max-w-6xl">
        <TabsList>
          <TabsTrigger value="learning">Learning Settings</TabsTrigger>
          <TabsTrigger value="chat">Chat Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="learning">
          <LearningSettingsForm
            learningLanguage="english"
            nativeLanguage="polish"
            learningLanguageLevel="B2"
          />
        </TabsContent>
        <TabsContent value="chat">
          <ChatSettingsForm
            tutorId="en-US-Casual-K"
            learningLanguage="english"
            autoCorrect={true}
          />
        </TabsContent>
      </Tabs>
    </SectionWrapper>
  );
}
