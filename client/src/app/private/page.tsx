import { getUser, getSessionCookie } from "@/common/lib/auth";
import CreateChatButton from "@/components/chat/create-chat-button";
import Chat from "@/components/chat/index";
import AiChat from "@/components/chat/index";
import { redirect } from "next/dist/server/api-utils";

export default async function PrivatePage() {
  const currentUser = await getUser();
  const sessionCookie = await getSessionCookie();

  if (!currentUser) return;

  const response = await fetch("http://localhost:5000/api/v1/create-chat", {
    method: "POST",
    body: JSON.stringify({
      title: "Private Chat with English Teacher",
      acab: "adasd",
    }),
    headers: {
      Cookie: sessionCookie,
    },
  });

  const chatId = await response.json();

  return (
    <>
      <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
        Private Page
      </h1>

      <CreateChatButton sessionCookie={chatId} />

      <div className="mt-20">
        <Chat />
      </div>
    </>
  );
}
