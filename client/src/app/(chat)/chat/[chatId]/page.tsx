import { getSessionCookie } from "@/common/lib/auth";
import Chat from "@/components/chat";

interface ChatPageProps {
  params: { chatId: string };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const chatId = params.chatId;
  const sessionCookie = await getSessionCookie();

  return <Chat chatId={chatId} sessionCookie={sessionCookie} />;
}
