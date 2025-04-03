"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import Markdown from "react-markdown";
import SectionWrapper from "../section-wrapper";
import { type ChatTopic, chatTopics } from "./chat-topics";
import ChooseVocabularySetDialog from "./choose-vocabulary-set-dialog";
import type { VocabularySet } from "@/common/api/services/vocabulary-set.service";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { CreateChatButton } from "./create-chat-button";

interface NewChatProps {
  vocabularySets: VocabularySet[];
}

export default function NewChat({ vocabularySets }: NewChatProps) {
  const [selectedTopic, setSelectedTopic] = useState<null | ChatTopic>(null);
  const router = useRouter();

  return (
    <SectionWrapper className="h-screen ">
      <div className="flex flex-col items-center gap-2 w-full max-w-3xl">
        <Markdown className="text-lg">## Choose an option</Markdown>
        <div className="flex w-full flex-col space-y-4 pb-2 md:w-auto md:flex-row md:space-y-0 md:space-x-6">
          {selectedTopic === null &&
            chatTopics.map((topic) => (
              <Button
                key={topic.title}
                size="lg"
                onClick={() => setSelectedTopic(topic)}
              >
                {topic.title}
              </Button>
            ))}
          {selectedTopic &&
            selectedTopic.categories.map((topic) =>
              topic.category === "vocabulary" ? (
                <ChooseVocabularySetDialog
                  key={topic.title}
                  title={topic.title}
                  topic={topic.topic}
                  category={topic.category}
                  vocabularySets={vocabularySets}
                />
              ) : (
                <CreateChatButton
                  key={topic.title}
                  title={topic.title}
                  topic={topic.topic}
                  category={topic.category}
                />
              )
            )}
        </div>
        <Markdown className="text-sm py-2">
          You'll be chatting with John
        </Markdown>
        <Separator />
        <div className="flex w-full justify-between">
          {selectedTopic && (
            <Button variant="link" onClick={() => setSelectedTopic(null)}>
              Back
            </Button>
          )}
          <Button
            variant="link"
            onClick={() => router.push("/dashboard/vocabulary/sets")}
          >
            View past chats
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
