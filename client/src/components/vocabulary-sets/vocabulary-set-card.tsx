import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type VocabularySet } from "@/common/services/vocabulary-set/vocabulary-set.service";
import Link from "next/link";

interface VocabularySetCardProps {
  vocabularySet: VocabularySet;
}

export default function VocabularySetCard({
  vocabularySet,
}: VocabularySetCardProps) {
  const { id, title, description, createdAt, flashCardsCount } = vocabularySet;

  const termOrTerms = flashCardsCount === 1 ? "term" : "terms";

  return (
    <Link href={`/dashboard/vocabulary/${id}`}>
      <Card className="relative transition-all duration-300 hover:shadow-lg hover:shadow-primary/50">
        <CardHeader className="relative">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <div className="absolute top-0 right-0 p-4">
            {flashCardsCount} {termOrTerms}
          </div>
        </CardHeader>
        <div className="absolute inset-0 border-b-4 border-transparent transition-all duration-300 hover:border-primary/95 hover:rounded" />
      </Card>
    </Link>
  );
}
