import { serverApi } from "@/common/api/server-api";
import { Chat } from "@/components/chat/chat";
import { Message } from "ai";

interface ChatPageProps {
  params: { chatId: string };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const chatId = params.chatId;

  const { data: messages } = await serverApi.get<Array<Message>>(
    `/chat/${chatId}/messages`
  );

  const sessionCookie = await serverApi.getSessionCookies();

  return (
    <Chat
      id={chatId}
      initialMessages={messages}
      sessionCookie={sessionCookie}
    />
  );
}
