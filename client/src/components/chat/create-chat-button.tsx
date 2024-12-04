"use client";
import { getSessionCookie } from "@/common/lib/auth";
import { redirect } from "next/navigation";

export default function CreateChatButton({
  sessionCookie,
}: {
  sessionCookie: string;
}) {
  console.log(sessionCookie);

  const createChatHandler = async () => {
    // const chuj = await getSessionCookie();

    // const response = await fetch("http://localhost:5000/api/v1/auth/session", {
    //   headers: {
    //     Cookie: sessionCookie
    //   },
    // });

    // if (!response.ok) {
    //   throw new Error("Failed to create chat");
    // }

    // const chatId = await response.json();
    // console.log(chatId);

    redirect(`/chat/${sessionCookie}`);
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
