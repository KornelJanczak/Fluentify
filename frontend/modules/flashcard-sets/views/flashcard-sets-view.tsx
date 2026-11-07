"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FlashcardSetDialog } from "../components/flashcard-set-dialog";
import {
  createFlashcard,
  createFlashcardSet,
  deleteFlashcard,
  deleteFlashcardSet,
  getFlashcardSet,
  getFlashcardSets,
  updateFlashcard,
  updateFlashcardSet,
} from "../api";
import type { FlashcardDraft, FlashcardSetDetails } from "../types";

const setsQueryKey = ["flashcard-sets"];

export function FlashcardSetsView() {
  const queryClient = useQueryClient();
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState("");

  const setsQuery = useQuery({
    queryKey: setsQueryKey,
    queryFn: getFlashcardSets,
  });
  const selectedSetQuery = useQuery({
    queryKey: ["flashcard-set", selectedSetId],
    queryFn: () => getFlashcardSet(selectedSetId as string),
    enabled: Boolean(selectedSetId && dialogMode === "edit"),
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: setsQueryKey });
    if (selectedSetId)
      await queryClient.invalidateQueries({
        queryKey: ["flashcard-set", selectedSetId],
      });
  };

  const createMutation = useMutation({
    mutationFn: ({ name, cards }: { name: string; cards: FlashcardDraft[] }) =>
      createFlashcardSet(name, cards),
    onSuccess: async () => {
      await refresh();
      setDialogMode(null);
    },
    onError: (error) => setMutationError(error.message),
  });

  const editMutation = useMutation({
    mutationFn: async ({
      set,
      name,
      cards,
    }: {
      set: FlashcardSetDetails;
      name: string;
      cards: FlashcardDraft[];
    }) => {
      await updateFlashcardSet(set.id, name);
      const currentIds = new Set(cards.map((card) => card.id).filter(Boolean));
      await Promise.all(
        set.flashcards
          .filter((card) => !currentIds.has(card.id))
          .map((card) => deleteFlashcard(card.id)),
      );
      await Promise.all(
        cards.map((card) =>
          card.id
            ? updateFlashcard(card.id, card)
            : createFlashcard(set.id, card),
        ),
      );
    },
    onSuccess: async () => {
      await refresh();
      setDialogMode(null);
    },
    onError: (error) => setMutationError(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFlashcardSet,
    onSuccess: async () => {
      await refresh();
      setDeleteTarget(null);
    },
    onError: (error) => setMutationError(error.message),
  });

  const openCreate = () => {
    setMutationError("");
    setSelectedSetId(null);
    setDialogMode("create");
  };
  const openEdit = (id: string) => {
    setMutationError("");
    setSelectedSetId(id);
    setDialogMode("edit");
  };
  const closeDialog = (open: boolean) => {
    if (!open) {
      setDialogMode(null);
      setSelectedSetId(null);
      setMutationError("");
    }
  };

  const submitDialog = (name: string, cards: FlashcardDraft[]) => {
    if (dialogMode === "create") createMutation.mutate({ name, cards });
    else if (selectedSetQuery.data)
      editMutation.mutate({ set: selectedSetQuery.data, name, cards });
  };

  const isSaving = createMutation.isPending || editMutation.isPending;
  const dialogSet = selectedSetQuery.data;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8 lg:px-12">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[var(--fluent-coral)]">
            Your learning library
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[var(--fluent-ink)] sm:text-4xl">
            Flashcard sets
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--fluent-muted)]">
            Keep the phrases you want to reach for again close at hand.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="w-fit bg-[var(--fluent-coral)] text-white hover:bg-[var(--fluent-coral)]/90"
        >
          <Plus /> New set
        </Button>
      </header>

      {setsQuery.isLoading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Skeleton className="h-44 rounded-2xl" key={item} />
          ))}
        </div>
      )}
      {setsQuery.isError && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex flex-col gap-4 p-6">
            <p className="font-semibold">Your sets could not be loaded.</p>
            <p className="text-sm text-muted-foreground">
              {setsQuery.error.message}
            </p>
            <Button variant="outline" onClick={() => setsQuery.refetch()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      )}
      {!setsQuery.isLoading &&
        !setsQuery.isError &&
        setsQuery.data?.length === 0 && (
          <Card className="border-dashed bg-transparent">
            <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-[var(--fluent-mint)] text-[var(--fluent-ink)]">
                <BookOpen />
              </span>
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.03em]">
                  Your first set starts here.
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  Collect a few phrases from your real life and give them
                  somewhere to stay.
                </p>
              </div>
              <Button
                onClick={openCreate}
                className="bg-[var(--fluent-ink)] text-white hover:bg-[var(--fluent-ink)]/90"
              >
                <Plus /> Create a set
              </Button>
            </CardContent>
          </Card>
        )}
      {!setsQuery.isLoading &&
        !setsQuery.isError &&
        Boolean(setsQuery.data?.length) && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {setsQuery.data?.map((set) => (
              <Card
                className="group border-[var(--fluent-line)] bg-white transition-transform hover:-translate-y-0.5"
                key={set.id}
              >
                <CardContent className="flex min-h-44 flex-col justify-between gap-6 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge
                        variant="secondary"
                        className="mb-4 bg-[var(--fluent-mint)] text-[var(--fluent-ink)]"
                      >
                        Flashcard set
                      </Badge>
                      <h2 className="text-xl font-semibold tracking-[-0.04em] text-[var(--fluent-ink)]">
                        {set.name}
                      </h2>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`More actions for ${set.name}`}
                    >
                      <MoreHorizontal />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm text-[var(--fluent-muted)]">
                    <span>{set.flashcard_count ?? 0} cards</span>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(set.id)}
                        aria-label={`Edit ${set.name}`}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive"
                        onClick={() => setDeleteTarget(set.id)}
                        aria-label={`Delete ${set.name}`}
                      >
                        <Trash2 />
                      </Button>
                      <Button
                        render={<Link href={`/dashboard/chats/${set.id}`} />}
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Chat with ${set.name}`}
                      >
                        <MessageCircle />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      <FlashcardSetDialog
        key={`${dialogMode}-${selectedSetId ?? "new"}-${dialogSet ? "ready" : "loading"}`}
        open={
          dialogMode !== null && (dialogMode === "create" || Boolean(dialogSet))
        }
        mode={dialogMode ?? "create"}
        set={dialogSet}
        saving={isSaving}
        error={
          mutationError ||
          (selectedSetQuery.isError ? selectedSetQuery.error.message : "")
        }
        onOpenChange={closeDialog}
        onSubmit={submitDialog}
      />
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this flashcard set?</AlertDialogTitle>
            <AlertDialogDescription>
              The set and all of its cards will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep set</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() =>
                deleteTarget && deleteMutation.mutate(deleteTarget)
              }
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete set"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {mutationError && !dialogMode && (
        <p className="text-sm text-destructive" role="alert">
          {mutationError}
        </p>
      )}
    </div>
  );
}
