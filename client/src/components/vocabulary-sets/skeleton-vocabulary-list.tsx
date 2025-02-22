"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonVocabularyList({ length }: { length: number }) {
  return (
    <div className="flex flex-col items-stretch space-y-4 w-full h-full">
      {Array.from({ length }).map((_, index) => (
        <div  key={index}>
          <Skeleton className="p-12 max-h-full max-w-full h-full w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}
