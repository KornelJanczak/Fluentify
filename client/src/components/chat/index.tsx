"use client";
import { useChat } from "ai/react";
import AudioStreamPlayer from "./audio-stream-player";

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
  const { messages, input, handleInputChange, handleSubmit, data } = useChat({
    id: chatId,
    initialMessages,
    api: `${process.env.NEXT_PUBLIC_API_URL}/chat`,
    credentials: "include",
    body: {
      chatId,
    },
    headers: {
      Cookie: sessionCookie,
    },
    onResponse: (res) => {
      console.log(res);

      console.log("data: ", data);
    },
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {/* <div>
        <audio src="http://localhost:5000/audio" controls={true} />
      </div> */}
      <AudioStreamPlayer />
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap ">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
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
