"use client";

import { redirect } from "next/navigation";
import { Button } from "../ui/button";

export default function CreateChatButton() {
  const createChatHandler = async () => {
    const response = await fetch("http://localhost:5000/api/v1/create-chat", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Chat with AI",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create chat");
    }

    const chatId = await response.json();

    redirect(`/dashboard/chat/${chatId}`);
  };

  return <Button onClick={createChatHandler}>Talk with AI</Button>;
}
