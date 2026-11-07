"use client";

import ChatView from "@/app/pages/chat-view";
import { useParams } from "next/navigation";
import { Suspense } from "react";

function ChatRouteContent() {
  const params = useParams<{ flashcardSetId: string }>();
  const flashcardSetId = params?.flashcardSetId ?? "demo";

  return <ChatView flashcardSetId={decodeURIComponent(flashcardSetId)} />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={<main className="chat-shell" aria-busy="true" />}>
      <ChatRouteContent />
    </Suspense>
  );
}
