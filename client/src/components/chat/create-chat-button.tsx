"use client";
import { redirect } from "next/navigation";

export default function CreateChatButton({
  sessionCookie,
}: {
  sessionCookie: string;
}) {
  const createChatHandler = async () => {
    console.log("createChatHandler", sessionCookie);

    const response = await fetch("http://localhost:5000/api/v1/create-chat", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
      body: JSON.stringify({
        title: "Chat with AI",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create chat");
    }
    const chatId = await response.json();
    console.log(chatId);

    redirect(`/chat/${chatId}`);
  };

  return (
    <button
      className="mt-10 block rounded bg-pink-800/50 px-2 py-1 text-white hover:opacity-70"
      onClick={createChatHandler}
    >
      Talk with AI
    </button>
  );
}
