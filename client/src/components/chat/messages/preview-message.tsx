"use client";

import type { Message } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useRef } from "react";
import { Markdown } from "../../markdown";
import { MessageActions } from "./message-actions";
import equal from "fast-deep-equal";
import { cn } from "@/lib/utils";
import AssistantImage from "./assistant-image";
import { useAudioStore } from "@/common/hooks/use-audio-store";

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
  const audioRef1 = useRef<HTMLAudioElement | null>(null);
  const state = useAudioStore((state) => state);

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
          {message.role === "assistant" && <AssistantImage />}

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
              audioRef={audioRef1}
            />
          </div>
        </div>
        <audio ref={audioRef1} hidden controls={true} />
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
