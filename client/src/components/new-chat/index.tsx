"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import Markdown from "react-markdown";
import SectionWrapper from "../section-wrapper";
import { type ChatTopic, chatTopics } from "./chat-topics";
import ChooseVocabularySetDialog from "./choose-vocabulary-set-dialog";
import type { VocabularySet } from "@/common/api/services/vocabulary-set.service";

interface NewChatProps {
  vocabularySets: VocabularySet[];
}

export default function NewChat({ vocabularySets }: NewChatProps) {
  const [selectedTopic, setSelectedTopic] = useState<null | ChatTopic>(null);

  const handleSelectTopic = (topic: ChatTopic) => {
    setSelectedTopic(topic);
  };

  return (
    <SectionWrapper className="h-screen">
      <Markdown>## Choose an option</Markdown>
      {selectedTopic === null &&
        chatTopics.map((topic) => (
          <Button key={topic.title} onClick={() => handleSelectTopic(topic)}>
            {topic.title}
          </Button>
        ))}
      {selectedTopic != null &&
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
            <Button key={topic.title}>{topic.title}</Button>
          )
        )}
    </SectionWrapper>
  );
}
