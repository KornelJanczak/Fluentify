"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import Markdown from "react-markdown";
import SectionWrapper from "../section-wrapper";

const chatTopics = [
  {
    title: "Practice vocabulary",
    categories: [
      {
        title: "Vocab",
        category: "Practice vocabulary word by word",
      },
    ],
  },
  {
    title: "Chat about anything",
    categories: [
      {
        title: "General conversation",
        category: "Free chat",
      },
    ],
  },
];

export default function NewChat() {
  const [selectedTopic, setSelectedTopic] = useState("");

  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic);
  };

  return (
    <SectionWrapper className="h-screen">
      <Markdown>## Choose an option</Markdown>
      {chatTopics.map((topic) => (
        <div key={topic.title} className="flex m-2">
          <Button onClick={() => handleSelectTopic(topic.title)}>
            {topic.title}
          </Button>
        </div>
      ))}
    </SectionWrapper>
  );
}
