"use client";
import { useChat } from "ai/react";
import { useRef } from "react";

interface ChatProps {
  chatId: string;
  sessionCookie: string;
  initialMessages: any;
}

export default function Chat({
  chatId,
  sessionCookie,
  initialMessages,
}: ChatProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    id: chatId,
    initialMessages,
    api: `${process.env.NEXT_PUBLIC_API_URL}/chat`,
    credentials: "include",
    body: {
      chatCategory: "Vocabulary practice",
      chatTopic: "Practice vocabulary word by word",
      vocabularySetId: "5d095803-3551-4734-94ec-1f91a84d8cf4",
      chatId,
    },
    headers: {
      Cookie: sessionCookie,
    },
    onFinish(message, options) {
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


  

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id}>
          <div className="whitespace-pre-wrap ">
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          
          </div>
          <audio controls={true} ref={audioRef} />
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="text-black fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
