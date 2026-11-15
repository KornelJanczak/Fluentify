"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  MessageCircle,
  Mic,
  Send,
  Sparkles,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getAccessToken } from "@/modules/auth/api";
import { transcribeStudyChatAudio } from "../api";
import { useAudioRecorder } from "../hooks/use-audio-recorder";
import { useStudyChat } from "../hooks/use-study-chat";
import { useTTSPlayback } from "../hooks/use-tts-playback";

type StudyChatViewProps = { flashcardSetId: string };

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function StudyChatView({ flashcardSetId }: StudyChatViewProps) {
  const [languageLevel, setLanguageLevel] = useState("B2");
  const [message, setMessage] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(
    null,
  );
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastPushedIndexRef = useRef(0);

  const {
    messages,
    isLoading,
    isHistoryLoading,
    isReady,
    error,
    sendMessage: sendChatMessage,
    streamedReplyText,
    isStreaming,
  } = useStudyChat(flashcardSetId);

  const {
    pushText: pushTTSText,
    finish: finishTTS,
    cancel: cancelTTS,
    state: ttsState,
    error: ttsError,
  } = useTTSPlayback({
    enabled: ttsEnabled,
  });

  const {
    isRecording,
    recordingDuration,
    error: recordingError,
    startRecording,
    stopRecording,
    cancelRecording,
    clearError: clearRecordingError,
  } = useAudioRecorder();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Feed incremental streamed tokens to TTS
  useEffect(() => {
    if (!isStreaming || !ttsEnabled) {
      return;
    }
    const currentText = streamedReplyText ?? "";
    const newChunk = currentText.slice(lastPushedIndexRef.current);
    if (newChunk) {
      pushTTSText(newChunk);
      lastPushedIndexRef.current = currentText.length;
    }
  }, [isStreaming, streamedReplyText, ttsEnabled, pushTTSText]);

  // Flush TTS audio when streaming turn ends
  useEffect(() => {
    if (!isStreaming) {
      if (lastPushedIndexRef.current > 0) {
        finishTTS();
      }
      lastPushedIndexRef.current = 0;
    }
  }, [isStreaming, finishTTS]);

  const handleVoiceToggle = async () => {
    setTranscriptionError(null);
    clearRecordingError();

    if (isRecording) {
      setIsTranscribing(true);
      try {
        const audioBlob = await stopRecording();
        if (!audioBlob || audioBlob.size === 0) {
          return;
        }

        const token = getAccessToken();
        if (!token) {
          setTranscriptionError("You must be logged in to transcribe audio.");
          return;
        }

        const result = await transcribeStudyChatAudio(
          audioBlob,
          languageLevel,
          token,
        );

        if (result.text?.trim()) {
          setMessage((prev) => {
            const trimmedPrev = prev.trim();
            return trimmedPrev
              ? `${trimmedPrev} ${result.text.trim()}`
              : result.text.trim();
          });
        }
      } catch (err) {
        setTranscriptionError(
          err instanceof Error
            ? err.message
            : "Failed to transcribe audio. Please try again.",
        );
      } finally {
        setIsTranscribing(false);
      }
    } else {
      await startRecording();
    }
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isRecording) {
      cancelRecording();
    }
    cancelTTS();
    const trimmed = message.trim();
    if (!trimmed || isLoading || isHistoryLoading || !isReady || isTranscribing)
      return;

    setMessage("");
    await sendChatMessage(trimmed, languageLevel);
  };

  const activeError = error || recordingError || transcriptionError || ttsError;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--fluent-line)] px-4 py-3 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/dashboard/chats"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[var(--fluent-muted)] transition-colors hover:bg-[var(--fluent-paper)] hover:text-[var(--fluent-ink)]"
            aria-label="Choose another set"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--fluent-coral)] text-white">
            <MessageCircle className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--fluent-ink)]">
              English practice room
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <label
            className="hidden text-xs font-medium text-[var(--fluent-muted)] sm:block"
            htmlFor="language-level"
          >
            Level
          </label>
          <Select
            value={languageLevel}
            onValueChange={(value) => value && setLanguageLevel(value)}
          >
            <SelectTrigger id="language-level" className="h-8 w-20 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
                <SelectItem value={level} key={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => {
              if (ttsEnabled) {
                cancelTTS();
                setTtsEnabled(false);
              } else {
                setTtsEnabled(true);
              }
            }}
            className={cn(
              "size-8 text-[var(--fluent-muted)] transition-colors hover:bg-[var(--fluent-paper)] hover:text-[var(--fluent-ink)]",
              ttsEnabled &&
                ttsState === "playing" &&
                "text-[var(--fluent-coral)] animate-pulse",
            )}
            aria-label={ttsEnabled ? "Mute tutor voice" : "Enable tutor voice"}
          >
            {ttsEnabled ? (
              <Volume2 className="size-4" />
            ) : (
              <VolumeX className="size-4 text-[var(--fluent-muted)]" />
            )}
          </Button>
          <span className="hidden items-center gap-2 text-xs text-[var(--fluent-muted)] md:flex">
            <span
              className={`size-1.5 rounded-full ${isReady ? "bg-[var(--fluent-green)]" : "bg-[var(--fluent-coral)]"}`}
            />{" "}
            {isReady ? "Ready" : "Connecting"}
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-8"
          aria-live="polite"
        >
          <div
            className={`mx-auto flex min-h-full w-full max-w-3xl flex-col ${
              messages.length === 0 ? "justify-center" : "justify-start"
            } py-8 sm:py-12`}
          >
            {isHistoryLoading ? (
              <div className="mx-auto max-w-2xl text-center text-sm text-[var(--fluent-muted)]">
                Loading your conversation...
              </div>
            ) : messages.length === 0 ? (
              <div className="mx-auto max-w-2xl text-center">
                <Sparkles className="mx-auto size-6 text-[var(--fluent-coral)]" />
                <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[var(--fluent-ink)] sm:text-4xl lg:text-5xl">
                  What would you like to practise?
                </h1>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[var(--fluent-muted)] sm:text-base">
                  Write about your day, ask a question, or use one of the
                  phrases from this set.
                </p>
              </div>
            ) : (
              <div className="space-y-6 py-4">
                {messages.map((item) => (
                  <div
                    className={`flex gap-3 ${item.type === "human" ? "justify-end" : "justify-start"}`}
                    key={item.id}
                  >
                    {item.type === "ai" && (
                      <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--fluent-mint)] text-[var(--fluent-ink)]">
                        <Sparkles className="size-4" />
                      </span>
                    )}
                    <div
                      className={`max-w-[min(82%,680px)] break-words rounded-2xl px-4 py-3 text-sm leading-6 ${item.type === "human" ? "rounded-br-sm bg-[var(--fluent-ink)] text-white" : "rounded-bl-sm bg-[var(--fluent-paper)] text-[var(--fluent-ink)]"}`}
                    >
                      <p className="mb-1 text-xs font-semibold opacity-60">
                        {item.type === "human" ? "You" : "Tutor"}
                      </p>
                      {item.type === "ai" && !item.content ? (
                        <div className="flex items-center gap-2 py-1 text-xs text-[var(--fluent-muted)]">
                          <span className="inline-block size-1.5 animate-pulse rounded-full bg-current" />
                          <span className="inline-block size-1.5 animate-pulse rounded-full bg-current [animation-delay:200ms]" />
                          <span className="inline-block size-1.5 animate-pulse rounded-full bg-current [animation-delay:400ms]" />
                          <span className="ml-1">Tutor is composing...</span>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{item.content}</p>
                      )}
                      {item.type === "human" && item.inlineInspector && (
                        <div className="mt-3 border-t border-current/15 pt-3 text-xs opacity-80">
                          {item.inlineInspector.corrected_message && (
                            <p>{item.inlineInspector.corrected_message}</p>
                          )}
                          {item.inlineInspector.errors.length > 0 && (
                            <p className="mt-1">
                              {item.inlineInspector.errors.length} language note
                              {item.inlineInspector.errors.length === 1
                                ? ""
                                : "s"}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-[var(--fluent-line)] bg-white px-4 py-4 sm:px-8 sm:py-5">
          <form className="mx-auto max-w-3xl" onSubmit={sendMessage}>
            <div className="flex items-end gap-2 rounded-2xl border border-[var(--fluent-line)] bg-[var(--fluent-paper)] p-2 transition-colors focus-within:border-[var(--fluent-coral)] focus-within:ring-2 focus-within:ring-[var(--fluent-coral)]/15">
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Write your next sentence..."
                aria-label="Message"
                maxLength={4000}
                disabled={isLoading || isHistoryLoading || !isReady}
                className="min-h-16 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <Button
                type="button"
                size="icon"
                variant={isRecording ? "destructive" : "ghost"}
                onClick={handleVoiceToggle}
                disabled={
                  isLoading || isHistoryLoading || !isReady || isTranscribing
                }
                className={cn(
                  "shrink-0 transition-colors",
                  isRecording && "bg-red-600 text-white hover:bg-red-700",
                )}
                aria-label={
                  isRecording
                    ? "Stop recording"
                    : isTranscribing
                      ? "Transcribing audio"
                      : "Record voice message"
                }
              >
                {isTranscribing ? (
                  <Loader2 className="size-4 animate-spin text-[var(--fluent-coral)]" />
                ) : isRecording ? (
                  <Square className="size-4 fill-current" />
                ) : (
                  <Mic className="size-4" />
                )}
              </Button>
              <Button
                type="submit"
                size="icon"
                className="shrink-0 bg-[var(--fluent-coral)] text-white hover:bg-[var(--fluent-coral)]/90"
                disabled={
                  !message.trim() ||
                  isLoading ||
                  isHistoryLoading ||
                  !isReady ||
                  isTranscribing
                }
                aria-label="Send message"
              >
                <Send className="size-4" />
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 px-1 text-xs text-[var(--fluent-muted)]">
              <div className="flex items-center gap-2">
                {isRecording ? (
                  <span className="flex items-center gap-1.5 font-medium text-red-600 animate-pulse">
                    <span className="size-2 rounded-full bg-red-600" />
                    Recording {formatDuration(recordingDuration)} (click stop to
                    finish)
                  </span>
                ) : isTranscribing ? (
                  <span className="flex items-center gap-1.5 font-medium text-[var(--fluent-coral)]">
                    <Loader2 className="size-3 animate-spin" />
                    Transcribing speech with Whisper...
                  </span>
                ) : (
                  <span>Press Enter to send</span>
                )}
              </div>
              <span>{message.length}/4000</span>
            </div>
            {activeError && (
              <p
                className="mt-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                {activeError}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
