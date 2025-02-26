"use client";

import { Input } from "../ui/input";
import { Markdown } from "../markdown";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRef } from "react";

export default function VocabularySetsHeader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-col items-center justify-center space-y-6">
      <Markdown>## Your vocabulary sets</Markdown>
      <form
        className={cn(
          "flex items-center justify-center bg-card gap-3 pl-4 border-border border-[0.5px] rounded-md",
          "focus-within:border-primary focus-within:transition-all focus-within:duration-300 "
        )}
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/dashboard/vocabulary/sets?search=${inputRef.current?.value}`);
        }}
      >
        <Input
          variant="secondary"
          className="flex-auto border-b-0"
          placeholder="Serach for a vocabulary set"
          ref={inputRef}
        />
        <Button className="rounded-none rounded-r-md" type="submit">
          <Search width={49} height={40} />
        </Button>
      </form>
    </div>
  );
}
