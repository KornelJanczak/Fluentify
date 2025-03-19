import { chatService } from "@/common/api/services/chat.service";
import { Chat } from "@/components/chat";

interface ChatPageProps {
  params: { chatId: string };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const chatId = params.chatId;
  const { messages } = await chatService.getChatWithMessagesByChatId(chatId);

  return <Chat id={chatId} initialMessages={messages} />;
}
