"use client";

import type { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { useState, useRef } from "react";
import { MultimodalInput } from "./multimodal-input";
import { Messages } from "./messages/messages";

interface ChatProps {
  id: string;
  sessionCookie: string;
  initialMessages: Array<Message>;
}

export function Chat({ id, initialMessages, sessionCookie }: ChatProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const { messages, handleSubmit, input, setInput, isLoading, stop } = useChat({
    id,
    initialMessages,
    api: `${process.env.NEXT_PUBLIC_API_URL}/chat`,
    credentials: "include",
    body: {
      chatCategory: "Vocabulary practice",
      chatTopic: "Practice vocabulary word by word",
      vocabularySetId: "e884f64a-9b44-48a5-b15d-f0dd23d75877",
      chatId: id,
    },
    headers: {
      Cookie: sessionCookie,
    },
    onFinish(message) {
      //@ts-ignore
      const audio = JSON.parse(message.annotations.at(-1).data);

      console.log(audio);

      const audioArray = new Uint8Array(audio.data);

      const audioBlob = new Blob([audioArray], { type: "audio/wav" });

      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef !== null) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    },
  });

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <Messages
          isLoading={isLoading}
          messages={messages}
          audioRef={audioRef}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          <MultimodalInput
            chatId={id}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
          />
        </form>
      </div>
    </>
  );
}
