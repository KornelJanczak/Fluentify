"use client";

import type { Message } from "ai";
import { useChat } from "ai/react";
import { MultimodalInput } from "./multimodal-input";
import { Messages } from "./messages";
import { useAudioPlayer } from "@/common/hooks/use-audio";
import { useRef } from "react";

interface ChatProps {
  id: string;
  initialMessages: Array<Message>;
}

export function Chat({ id, initialMessages }: ChatProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const { messages, handleSubmit, input, setInput, isLoading, stop } = useChat({
    id,
    initialMessages,
    api: `${process.env.NEXT_PUBLIC_API_URL}/chat`,
    credentials: "include",
    body: {
      chatCategory: "Vocabulary practice",
      chatTopic: "Practice vocabulary word by word",
      vocabularySetId: "da1229c4-4881-4b21-b224-b94369e2d134",
      chatId: id,
    },
    onFinish(message) {
      useAudioPlayer({ message, audioRef });
    },
  });

  return (
    <section className="flex flex-col min-w-0 h-dvh bg-background">
      <Messages isLoading={isLoading} messages={messages} audioRef={audioRef} />
      <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <MultimodalInput
          chatId={id}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
        />
      </form>
    </section>
  );
}
