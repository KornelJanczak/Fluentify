import { vocabularySetService } from "@/common/api/services/vocabulary-set.service";
import NewChat from "@/components/new-chat";

export default async function NewChatPage() {
  const { vocabularySets } = await vocabularySetService.getVocabularySets();
  return <NewChat vocabularySets={vocabularySets} />;
}
