import { StudyChatView } from "@/modules/study-chat/views/study-chat-view";

export const instant = false;

export default async function DashboardChatPage({
  params,
}: PageProps<"/dashboard/chats/[flashcardSetId]">) {
  const { flashcardSetId } = await params;
  return <StudyChatView flashcardSetId={decodeURIComponent(flashcardSetId)} />;
}
