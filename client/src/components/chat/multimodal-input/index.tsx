"use client";

import type { ChatRequestOptions } from "ai";
import cx from "classnames";
import type React from "react";
import { memo } from "react";
import { SendButton } from "./send-button";
import { StopButton } from "./stop-button";
import { Textarea } from "../../ui/textarea";
import { useMultiModalInput } from "@/common/hooks/chat/use-multimodal-input";
import dynamic from "next/dynamic";

const VoiceRecognationButton = dynamic(
  () => import("./voice-recognition-button"),
  {
    ssr: false,
  }
);

interface PureMultiModalInputProps
  extends React.HTMLAttributes<HTMLDivElement> {
  chatId: string;
  input: string;
  isLoading: boolean;
  setInput: (value: string) => void;
  stop: () => void;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
}

function PureMultimodalInput(props: PureMultiModalInputProps) {
  const { className, stop, isLoading, input, ...multiModalInputProps } = props;

  const {
    textareaRef,
    handleInput,
    onKeyDown,
    submitForm,
    browserSupportsSpeechRecognition,
    listening,
  } = useMultiModalInput({ isLoading, input, ...multiModalInputProps });

  return (
    <div className="relative w-full flex flex-col gap-4">
      <Textarea
        ref={textareaRef}
        placeholder="Send a message..."
        value={input}
        onChange={handleInput}
        className={cx(
          "min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10 dark:border-zinc-700",
          className
        )}
        rows={2}
        autoFocus
        onKeyDown={onKeyDown}
      />

      <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row gap-2 justify-between">
        <VoiceRecognationButton
          listening={listening}
          browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
        />
        {isLoading && <StopButton stop={stop} />}
        {!isLoading && <SendButton input={input} submitForm={submitForm} />}
      </div>
    </div>
  );
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false;
    if (prevProps.isLoading !== nextProps.isLoading) return false;

    return true;
  }
);
