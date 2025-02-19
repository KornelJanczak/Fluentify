import SectionWrapper from "../section-wrapper";
import { Markdown } from "../markdown";
import { type VocabularySet } from "@/common/services/vocabulary-set/vocabulary-set.service";
import VocabularySetsList from "./vocabulary-sets-list";
import { Separator } from "../ui/separator";

interface VocabularySetsContentProps {
  vocabularySets: VocabularySet[];
}

export default function VocabularySetsContent({
  vocabularySets,
}: VocabularySetsContentProps) {
  return (
    <SectionWrapper>
      <div className="w-full max-w-5xl">
        <Markdown>## Your vocabulary sets</Markdown>
        <Separator className="w-full my-10" />
        <VocabularySetsList vocabularySets={vocabularySets} />
      </div>
    </SectionWrapper>
  );
}
