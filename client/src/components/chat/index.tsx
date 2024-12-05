"use client";
import { useChat } from "ai/react";

interface ChatProps {
  chatId: string;
  sessionCookie: string;
}

export default function Chat({ chatId, sessionCookie }: ChatProps) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    id: chatId,
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
    },
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
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
