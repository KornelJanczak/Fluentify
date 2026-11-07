"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, BookOpen, MessageCircle, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getFlashcardSets } from "@/modules/flashcard-sets/api";

export function ChatsView() {
  const setsQuery = useQuery({
    queryKey: ["flashcard-sets"],
    queryFn: getFlashcardSets,
  });

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="max-w-2xl">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--fluent-coral)]">
          <Sparkles className="size-4" />
          Practice room
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[var(--fluent-ink)] sm:text-4xl">
          Choose what you want to practise
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--fluent-muted)] sm:text-base">
          Pick a flashcard set and start a conversation grounded in the words
          you are learning right now.
        </p>
      </header>

      {setsQuery.isLoading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Skeleton className="h-40 rounded-2xl" key={item} />
          ))}
        </div>
      )}
      {setsQuery.isError && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-6">
            <p className="font-semibold">Your sets could not be loaded.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {setsQuery.error.message}
            </p>
          </CardContent>
        </Card>
      )}
      {!setsQuery.isLoading &&
        !setsQuery.isError &&
        setsQuery.data?.length === 0 && (
          <Card className="border-dashed bg-transparent">
            <CardContent className="flex flex-col items-center gap-4 px-6 py-16 text-center">
              <BookOpen className="size-8 text-[var(--fluent-coral)]" />
              <div>
                <h2 className="text-xl font-semibold">
                  Create a set before you start chatting.
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  A few phrases are enough to give the tutor a direction.
                </p>
              </div>
              <Link
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--fluent-ink)] px-4 py-2 text-sm font-semibold text-white"
                href="/dashboard/flashcard-sets"
              >
                Create a set <ArrowUpRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        )}
      {!setsQuery.isLoading &&
        !setsQuery.isError &&
        Boolean(setsQuery.data?.length) && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {setsQuery.data?.map((set) => (
              <Link
                href={`/dashboard/chats/${set.id}`}
                key={set.id}
                className="group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fluent-coral)] focus-visible:ring-offset-4"
              >
                <Card className="h-full border-[var(--fluent-line)] bg-white shadow-sm transition-colors group-hover:border-[var(--fluent-coral)]">
                  <CardContent className="flex h-full min-h-48 flex-col justify-between gap-10 p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--fluent-mint)] text-[var(--fluent-ink)]">
                        <MessageCircle />
                      </span>
                      <ArrowUpRight className="size-5 text-[var(--fluent-muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold tracking-[-0.04em] text-[var(--fluent-ink)] sm:text-2xl">
                        {set.name}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-[var(--fluent-muted)]">
                        {set.flashcard_count ?? 0} cards ready for a guided
                        conversation
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
    </div>
  );
}
