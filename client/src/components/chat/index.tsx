"use client";

import type { Message } from "ai";
import { useChat } from "ai/react";
import { MultimodalInput } from "./multimodal-input";
import { Messages } from "./messages";
import { useEffect, useRef } from "react";
import { useAudioStore } from "@/common/hooks/chat/use-audio-store";

interface ChatProps {
  id: string;
  initialMessages: Array<Message>;
}

export function Chat({ initialMessages, id }: ChatProps) {
  const hasExecuted = useRef(false);
  const playAudio = useAudioStore((state) => state.playAudio);

  const { messages, handleSubmit, input, setInput, isLoading, stop, append } =
    useChat({
      id,
      initialMessages,
      api: `${process.env.NEXT_PUBLIC_API_URL}/chat/start-chat`,
      credentials: "include",
      body: {
        chatId: id,
      },
      onFinish(message) {
        playAudio(message.id, message.annotations);
      },
    });

  useEffect(() => {
    if (!hasExecuted.current && initialMessages.length === 0) {
      append({
        id: "system-init-message",
        content: "Hi, you should start the conversation",
        role: "user",
      });

      hasExecuted.current = true;
    }
  }, []);

  return (
    <section className="flex flex-col min-w-0 h-dvh bg-background">
      <Messages isLoading={isLoading} messages={messages} />
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
