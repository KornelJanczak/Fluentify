"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useStream } from "@langchain/react";

import { getAccessToken } from "@/modules/auth/api";
import { getStudyChatHistory, type Inspector } from "../api";

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
  streamedReplyText: string;
  isStreaming: boolean;
};

function createMessageId(): string {
  return crypto.randomUUID();
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

function isInspectorPayload(content: string): boolean {
  const trimmed = content.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return false;
  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    return Boolean(
      parsed &&
        typeof parsed === "object" &&
        "original_message" in parsed &&
        "errors" in parsed,
    );
  } catch {
    return false;
  }
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

  const defaultHeaders = useMemo(
    () =>
      accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    [accessToken],
  );

  const langGraphApiUrl =
    process.env.NEXT_PUBLIC_LANGGRAPH_API_URL ?? "http://127.0.0.1:8123";

  const stream = useStream<StudyChatState>({
    assistantId: "study_chat",
    apiUrl: langGraphApiUrl,
    threadId: accessToken ? flashcardSetId : null,
    defaultHeaders,
    optimistic: false,
    streamIdleReconnect: "auto",
  });

  const [messages, setMessages] = useState<StudyChatMessage[]>([]);
  const [streamedReplyText, setStreamedReplyText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [historyState, setHistoryState] = useState<{
    flashcardSetId: string;
    messages: StudyChatMessage[];
    error: string;
  } | null>(null);
  const [submitError, setSubmitError] = useState("");
  const activeHumanIdRef = useRef<string | null>(null);
  const activeAssistantIdRef = useRef<string | null>(null);
  const activeInspectionRequestIdRef = useRef<string | null>(null);
  const baselineAiIdsRef = useRef<Set<string> | null>(null);
  const baselineAiCountRef = useRef<number>(0);
  const baselineReplyRef = useRef<string | null>(null);
  const stopStreamRef = useRef(stream.stop);

  useEffect(() => {
    stopStreamRef.current = stream.stop;
  }, [stream.stop]);

  useEffect(() => {
    let cancelled = false;
    activeHumanIdRef.current = null;
    activeAssistantIdRef.current = null;
    activeInspectionRequestIdRef.current = null;
    baselineAiIdsRef.current = null;
    baselineAiCountRef.current = 0;
    baselineReplyRef.current = null;

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

    const baselineAiIds = baselineAiIdsRef.current;
    const baselineCount = baselineAiCountRef.current;
    const aiMessages = stream.messages.filter(
      (message) => message.type === "ai",
    );

    const isNewTurn =
      aiMessages.length > baselineCount ||
      aiMessages.some(
        (message) => Boolean(message.id && !baselineAiIds?.has(message.id)),
      );

    const candidateAiMessages = aiMessages.filter(
      (message) =>
        (aiMessages.length > baselineCount ||
          Boolean(message.id && !baselineAiIds?.has(message.id))) &&
        !isInspectorPayload(getContent(message)),
    );
    const currentAiMessage = isNewTurn ? (candidateAiMessages.at(-1) ?? null) : null;

    const streamedContent = currentAiMessage
      ? getContent(currentAiMessage)
      : "";
    const isNewReply =
      Boolean(stream.values.reply) &&
      stream.values.reply !== baselineReplyRef.current;

    if (isNewReply) {
      setStreamedReplyText(stream.values.reply ?? "");
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? { ...message, content: stream.values.reply ?? "" }
            : message,
        ),
      );
    } else if (streamedContent) {
      setStreamedReplyText(streamedContent);
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? { ...message, content: streamedContent }
            : message,
        ),
      );
    }
  }, [stream.messages, stream.values.reply]);

  useEffect(() => {
    if (stream.isLoading) return;

    setIsStreaming(false);

    if (stream.error) {
      const assistantId = activeAssistantIdRef.current;
      if (assistantId) {
        setMessages((current) =>
          current.filter(
            (message) => message.id !== assistantId || message.content !== "",
          ),
        );
      }
      activeHumanIdRef.current = null;
      activeAssistantIdRef.current = null;
      activeInspectionRequestIdRef.current = null;
      baselineAiIdsRef.current = null;
      baselineReplyRef.current = null;
      return;
    }

    const humanId = activeHumanIdRef.current;
    const inspection = stream.values.inline_inspector;
    const inspectionRequestId = activeInspectionRequestIdRef.current;
    if (
      humanId &&
      inspectionRequestId &&
      inspection &&
      stream.values.inspection_request_id === inspectionRequestId
    ) {
      setMessages((current) =>
        current.map((message) =>
          message.id === humanId
            ? { ...message, inlineInspector: inspection }
            : message,
        ),
      );
    }

    activeHumanIdRef.current = null;
    activeAssistantIdRef.current = null;
    activeInspectionRequestIdRef.current = null;
    baselineAiIdsRef.current = null;
    baselineReplyRef.current = null;
  }, [
    stream.isLoading,
    stream.error,
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
    baselineAiIdsRef.current = new Set(
      stream.messages
        .filter((item) => item.type === "ai" && item.id)
        .map((item) => item.id as string),
    );
    baselineAiCountRef.current = stream.messages.filter(
      (item) => item.type === "ai",
    ).length;
    baselineReplyRef.current = stream.values.reply ?? null;
    setSubmitError("");
    setStreamedReplyText("");
    setIsStreaming(true);
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
          thread_id: flashcardSetId,
          language_level: languageLevel,
          inspection_request_id: inspectionRequestId,
        },
        { multitaskStrategy: "reject" },
      );
    } catch (submitError) {
      setSubmitError(getStreamError(submitError));
      setIsStreaming(false);
      setMessages((current) =>
        current.filter(
          (item) => item.id !== assistantId || item.content !== "",
        ),
      );
      activeHumanIdRef.current = null;
      activeAssistantIdRef.current = null;
      activeInspectionRequestIdRef.current = null;
      baselineAiIdsRef.current = null;
      baselineReplyRef.current = null;
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
    streamedReplyText,
    isStreaming,
  };
}
