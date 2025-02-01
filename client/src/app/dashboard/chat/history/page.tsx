import { chatService } from "@/common/services/chat/chat.service";
import { HistoryTable } from "@/components/chat-history-table";

export default async function ChatsHistory() {
  const history = await chatService.getChatsHistory();
  return <HistoryTable chats={history} />;
}
