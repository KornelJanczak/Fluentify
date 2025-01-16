"use client";

import type { Message } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";
import { Markdown } from "../../markdown";
import { MessageActions } from "./message-actions";
import equal from "fast-deep-equal";
import { cn } from "@/lib/utils";
import { SparklesIcon } from "lucide-react";

interface PreviewMessageProps {
  message: Message;
  isLoading: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const PurePreviewMessage = ({
  message,
  isLoading,
  audioRef,
}: PreviewMessageProps) => {
  return (
    <AnimatePresence>
      <motion.div
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            "group-data-[role=user]/message:w-fit"
          )}
        >
          {message.role === "assistant" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 w-full">
            {message.content && (
              <div className="flex flex-row gap-2 items-start">
                <div
                  className={cn("flex flex-col gap-4", {
                    "bg-primary text-primary-foreground px-3 py-2 rounded-xl":
                      message.role === "user",
                  })}
                >
                  <Markdown>{message.content as string}</Markdown>
                </div>
              </div>
            )}

            <MessageActions
              key={`action-${message.id}`}
              message={message}
              isLoading={isLoading}
            />
          </div>
        </div>
        <audio ref={audioRef} hidden controls={true} />
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.content !== nextProps.message.content) return false;
    if (
      !equal(
        prevProps.message.toolInvocations,
        nextProps.message.toolInvocations
      )
    )
      return false;

    return true;
  }
);
