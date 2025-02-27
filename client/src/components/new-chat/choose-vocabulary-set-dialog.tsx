import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import type { VocabularySet } from "@/common/api/services/vocabulary-set.service";
import CreateChatVocabularySetCard from "./create-chat-vocabulary-set-card";

interface ChooseVocabularySetDialogProps {
  title: string
  topic: string;
  category: string;
  vocabularySets: VocabularySet[];
}

export default function ChooseVocabularySetDialog({
  title,
  topic,
  vocabularySets,
  category,
}: ChooseVocabularySetDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex m-2">{title}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="pb-2">
          Choose vocabulary set that you'd like to practise
        </DialogTitle>
        <div className="flex flex-col items-stretch space-y-4 w-full">
          {vocabularySets.map((vocabularySet) => (
            <CreateChatVocabularySetCard
              key={vocabularySet.id}
              vocabularySet={vocabularySet}
              topic={topic}
              category={category}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
