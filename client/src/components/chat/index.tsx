"use client";

import type { Message } from "ai";
import { useChat } from "ai/react";
import { MultimodalInput } from "./multimodal-input";
import { Messages } from "./messages";
import { useAudioPlayer } from "@/common/hooks/use-audio";
import { useEffect, useRef } from "react";
import { useAudioStore } from "@/common/hooks/use-audio-store";

interface ChatProps {
  id: string;
  initialMessages: Array<Message>;
}

export function Chat({ initialMessages, id }: ChatProps) {
  const hasExecuted = useRef(false);
  const state = useAudioStore((state) => state);
  const audioRef = useRef<HTMLAudioElement>(null);

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
        // useAudioPlayer({
        //   message,
        //   audioRef,
        // });
        state.playAudio(
          message.id,
          //@ts-ignore
          message.annotations
        );
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
      <audio ref={audioRef} controls={true} hidden />
    </section>
  );
}
