import { chatService } from "@/common/api/services/chat.service";
import { Chat } from "@/components/chat";

interface ChatPageProps {
  params: { chatId: string };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const chatId = params.chatId;
  const { category, topic, vocabularySetId, messages } =
    await chatService.getChatWithMessagesByChatId(chatId);

  return (
    <Chat
      id={chatId}
      vocabularySetId={vocabularySetId}
      category={category}
      topic={topic}
      initialMessages={messages}
    />
  );
}
