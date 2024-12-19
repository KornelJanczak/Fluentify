import { getSessionCookie } from "@/common/lib/auth";
import Chat from "@/components/chat";
import ai from "ai";

interface ChatPageProps {
  params: { chatId: string };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const chatId = params.chatId;
  const sessionCookie = await getSessionCookie();


  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}/messages`,
    {
      headers: {
        Cookie: sessionCookie,
      },
    }
  );

  const initialMessages = await response.json();

  return (
    <Chat
      chatId={chatId}
      sessionCookie={sessionCookie}
      initialMessages={initialMessages}
    />
  );
}
