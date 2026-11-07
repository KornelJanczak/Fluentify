"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FlashcardDraft, FlashcardSetDetails } from "../types";

type FlashcardSetDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  set?: FlashcardSetDetails;
  saving: boolean;
  error?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, cards: FlashcardDraft[]) => void;
};

const emptyCard = (): FlashcardDraft => ({
  definition: "",
  definition_translation: "",
  language: "English",
  example_sentences: [],
});

export function FlashcardSetDialog({
  open,
  mode,
  set,
  saving,
  error,
  onOpenChange,
  onSubmit,
}: FlashcardSetDialogProps) {
  const [name, setName] = useState(set?.name ?? "");
  const [cards, setCards] = useState<FlashcardDraft[]>(
    set?.flashcards.map((card) => ({
      id: card.id,
      definition: card.definition,
      definition_translation: card.definition_translation,
      language: card.language,
      example_sentences: card.example_sentences,
    })) ?? [emptyCard()],
  );

  const updateCard = (index: number, patch: Partial<FlashcardDraft>) => {
    setCards((current) =>
      current.map((card, cardIndex) =>
        cardIndex === index ? { ...card, ...patch } : card,
      ),
    );
  };

  const submit = () => {
    const validCards = cards.filter(
      (card) => card.definition.trim() && card.definition_translation.trim(),
    );
    if (!name.trim() || validCards.length === 0) return;
    onSubmit(name.trim(), validCards);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create a flashcard set"
              : "Edit flashcard set"}
          </DialogTitle>
          <DialogDescription>
            Give the set a clear name and keep each card useful on its own.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <Label htmlFor="set-name">Set name</Label>
            <Input
              id="set-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Travel essentials"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold">Cards</h3>
                <p className="text-xs text-muted-foreground">
                  Add the phrase and the meaning you want to remember.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCards((current) => [...current, emptyCard()])}
              >
                <Plus /> Add card
              </Button>
            </div>
            {cards.map((card, index) => (
              <div
                className="grid gap-3 rounded-xl border border-[var(--fluent-line)] bg-[var(--fluent-paper)] p-4 md:grid-cols-[1fr_1fr_140px_auto]"
                key={card.id ?? index}
              >
                <div className="space-y-2">
                  <Label htmlFor={`definition-${index}`}>English</Label>
                  <Input
                    id={`definition-${index}`}
                    value={card.definition}
                    onChange={(event) =>
                      updateCard(index, { definition: event.target.value })
                    }
                    placeholder="to make a decision"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`translation-${index}`}>Translation</Label>
                  <Input
                    id={`translation-${index}`}
                    value={card.definition_translation}
                    onChange={(event) =>
                      updateCard(index, {
                        definition_translation: event.target.value,
                      })
                    }
                    placeholder="podjąć decyzję"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`language-${index}`}>Language</Label>
                  <Input
                    id={`language-${index}`}
                    value={card.language}
                    onChange={(event) =>
                      updateCard(index, { language: event.target.value })
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="self-end text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    setCards((current) =>
                      current.length === 1
                        ? current
                        : current.filter((_, cardIndex) => cardIndex !== index),
                    )
                  }
                  aria-label={`Remove card ${index + 1}`}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={submit}
            disabled={
              saving ||
              !name.trim() ||
              !cards.some(
                (card) =>
                  card.definition.trim() && card.definition_translation.trim(),
              )
            }
          >
            {saving
              ? "Saving..."
              : mode === "create"
                ? "Create set"
                : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
