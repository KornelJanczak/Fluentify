import { messagesService } from "@/common/services/api/services/messages.service";
import { Chat } from "@/components/chat";

interface ChatPageProps {
  params: { chatId: string };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const chatId = params.chatId;
  const messages = await messagesService.getMessagesByChatId(chatId);
  return <Chat id={chatId} initialMessages={messages} />;
}
