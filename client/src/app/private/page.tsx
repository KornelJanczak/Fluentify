import { getUser, getSessionCookie } from "@/common/lib/auth";
import CreateChatButton from "@/components/chat/create-chat-button";
import Chat from "@/components/chat/index";
import AiChat from "@/components/chat/index";
import { redirect } from "next/dist/server/api-utils";

export default async function PrivatePage() {
  const currentUser = await getUser();
  const sessionCookie = await getSessionCookie();

  if (!currentUser) return;

  return (
    <>
      <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
        Private Page
      </h1>

      <CreateChatButton sessionCookie={sessionCookie} />
    </>
  );
}
