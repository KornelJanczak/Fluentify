"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useStream } from "@langchain/react";

import { getAccessToken } from "@/modules/auth/api";
import { getStudyChatHistory, type Inspector } from "../api";
import { getStudyChatThreadId } from "../utils/thread";

export type StudyChatInspector = {
  original_message: string;
  corrected_message: string | null;
  errors: Array<{
    original_fragment: string;
    corrected_fragment: string;
    error_type: string;
    explanation: string;
  }>;
};

export type StudyChatMessage = {
  id: string;
  type: "human" | "ai";
  content: string;
  inlineInspector?: Inspector | null;
};

type StudyChatState = {
  messages: Array<{
    role?: string;
    type?: string;
    content: unknown;
  }>;
  inline_inspector?: StudyChatInspector;
  reply?: string;
  flashcard_set_id?: string;
  user_id?: string;
  thread_id?: string;
  language_level?: string;
  inspection_request_id?: string;
};

type UseStudyChatResult = {
  messages: StudyChatMessage[];
  isLoading: boolean;
  isHistoryLoading: boolean;
  isReady: boolean;
  error: string;
  sendMessage: (message: string, languageLevel: string) => Promise<void>;
};

function createMessageId(): string {
  return crypto.randomUUID();
}

function getUserIdFromAccessToken(accessToken: string): string {
  const payload = accessToken.split(".")[1];
  if (!payload) throw new Error("The access token is malformed.");

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = (4 - (normalized.length % 4)) % 4;
    const decoded = JSON.parse(
      atob(normalized.padEnd(normalized.length + padding, "=")),
    ) as { sub?: unknown };
    if (typeof decoded.sub !== "string" || !decoded.sub) {
      throw new Error("The access token does not contain a user id.");
    }
    return decoded.sub;
  } catch {
    throw new Error("The access token is malformed.");
  }
}

function resolveThreadId(
  flashcardSetId: string,
  accessToken: string,
): string {
  return getStudyChatThreadId(
    flashcardSetId,
    getUserIdFromAccessToken(accessToken),
  );
}

function getContent(message: { content?: unknown }): string {
  if (typeof message.content === "string") return message.content;
  if (!Array.isArray(message.content)) return "";

  return message.content
    .filter(
      (block): block is { text?: string } =>
        typeof block === "object" && block !== null,
    )
    .map((block) => block.text ?? "")
    .join("");
}

function getStreamError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "The live chat request failed.";
}

export function useStudyChat(flashcardSetId: string): UseStudyChatResult {
  const accessToken = useSyncExternalStore(
    () => () => undefined,
    getAccessToken,
    () => null,
  );
  const threadId = accessToken
    ? resolveThreadId(flashcardSetId, accessToken)
    : null;
  const stream = useStream<StudyChatState>({
    assistantId: "study_chat",
    apiUrl:
      process.env.NEXT_PUBLIC_LANGGRAPH_API_URL ?? "http://127.0.0.1:8123",
    threadId,
    defaultHeaders: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined,
    optimistic: false,
    streamIdleReconnect: "auto",
  });

  const [messages, setMessages] = useState<StudyChatMessage[]>([]);
  const [historyState, setHistoryState] = useState<{
    flashcardSetId: string;
    messages: StudyChatMessage[];
    error: string;
  } | null>(null);
  const [submitError, setSubmitError] = useState("");
  const activeHumanIdRef = useRef<string | null>(null);
  const activeAssistantIdRef = useRef<string | null>(null);
  const activeInspectionRequestIdRef = useRef<string | null>(null);
  const stopStreamRef = useRef(stream.stop);

  useEffect(() => {
    stopStreamRef.current = stream.stop;
  }, [stream.stop]);

  useEffect(() => {
    let cancelled = false;
    activeHumanIdRef.current = null;
    activeAssistantIdRef.current = null;
    activeInspectionRequestIdRef.current = null;

    if (!accessToken) {
      return;
    }

    getStudyChatHistory(flashcardSetId, accessToken)
      .then((history) => {
        if (cancelled) return;

        const historyMessages = history.map((item) => ({
          id: createMessageId(),
          type: item.role === "user" ? ("human" as const) : ("ai" as const),
          content: item.content,
          inlineInspector: item.inline_inspector,
        }));
        setMessages(historyMessages);
        setHistoryState({
          flashcardSetId,
          messages: historyMessages,
          error: "",
        });
      })
      .catch((requestError) => {
        if (!cancelled) {
          setHistoryState({
            flashcardSetId,
            messages: [],
            error: getStreamError(requestError),
          });
        }
      });

    return () => {
      cancelled = true;
      void stopStreamRef.current();
    };
  }, [flashcardSetId, accessToken]);

  useEffect(() => {
    const assistantId = activeAssistantIdRef.current;
    if (!assistantId) return;

    const latestAssistant = [...stream.messages]
      .reverse()
      .find((message) => message.type === "ai");
    if (!latestAssistant) return;

    setMessages((current) =>
      current.map((message) =>
        message.id === assistantId
          ? { ...message, content: getContent(latestAssistant) }
          : message,
      ),
    );
  }, [stream.messages]);

  useEffect(() => {
    const humanId = activeHumanIdRef.current;
    const inspection = stream.values.inline_inspector;
    const inspectionRequestId = activeInspectionRequestIdRef.current;
    if (
      !humanId ||
      !inspectionRequestId ||
      stream.isLoading ||
      !inspection ||
      stream.values.inspection_request_id !== inspectionRequestId
    ) {
      return;
    }

    setMessages((current) =>
      current.map((message) =>
        message.id === humanId
          ? { ...message, inlineInspector: inspection }
          : message,
      ),
    );
    activeHumanIdRef.current = null;
    activeAssistantIdRef.current = null;
    activeInspectionRequestIdRef.current = null;
  }, [
    stream.isLoading,
    stream.values.inline_inspector,
    stream.values.inspection_request_id,
  ]);

  const isHistoryLoading =
    Boolean(accessToken) && historyState?.flashcardSetId !== flashcardSetId;
  const historyMessages =
    historyState?.flashcardSetId === flashcardSetId
      ? historyState.messages
      : [];
  const error =
    submitError ||
    (stream.error ? getStreamError(stream.error) : "") ||
    (historyState?.flashcardSetId === flashcardSetId
      ? historyState.error
      : "") ||
    (!accessToken ? "Sign in before entering the practice room." : "");

  const sendMessage = async (
    rawMessage: string,
    languageLevel: string,
  ): Promise<void> => {
    const message = rawMessage.trim();
    if (!message || isHistoryLoading || stream.isLoading || !accessToken)
      return;

    const humanId = createMessageId();
    const assistantId = createMessageId();
    activeHumanIdRef.current = humanId;
    activeAssistantIdRef.current = assistantId;
    const inspectionRequestId = crypto.randomUUID();
    activeInspectionRequestIdRef.current = inspectionRequestId;
    setSubmitError("");
    setMessages((current) => [
      ...current,
      { id: humanId, type: "human", content: message },
      { id: assistantId, type: "ai", content: "" },
    ]);

    try {
      await stream.submit(
        {
          messages: [{ role: "user", content: message }],
          flashcard_set_id: flashcardSetId,
          user_id: getUserIdFromAccessToken(accessToken),
          thread_id: threadId ?? undefined,
          language_level: languageLevel,
          inspection_request_id: inspectionRequestId,
        },
        { multitaskStrategy: "reject" },
      );
    } catch (submitError) {
      setSubmitError(getStreamError(submitError));
      activeHumanIdRef.current = null;
      activeAssistantIdRef.current = null;
      activeInspectionRequestIdRef.current = null;
    }
  };

  return {
    messages: isHistoryLoading
      ? []
      : messages.length
        ? messages
        : historyMessages,
    isLoading: stream.isLoading,
    isHistoryLoading,
    isReady: Boolean(accessToken),
    error,
    sendMessage,
  };
}
