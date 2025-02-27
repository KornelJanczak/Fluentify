import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type VocabularySet } from "@/common/api/services/vocabulary-set.service";
import React from "react";

interface VocabularySetCardProps extends React.HTMLAttributes<HTMLDivElement> {
  vocabularySet: VocabularySet;
}

export default function VocabularySetCard({
  vocabularySet,
  ...props
}: VocabularySetCardProps) {
  const { title, description, flashCardsCount } = vocabularySet;

  const termOrTerms = flashCardsCount === 1 ? "term" : "terms";

  return (
    <Card
      className="relative transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
      {...props}
    >
      <CardHeader className="relative">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="absolute top-0 right-0 p-4">
          {flashCardsCount} {termOrTerms}
        </div>
      </CardHeader>
      <div className="absolute inset-0 border-b-4 border-transparent transition-all duration-300 hover:border-primary/95 hover:rounded" />
    </Card>
  );
}
