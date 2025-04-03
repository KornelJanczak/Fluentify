"use client";

import { Button } from "@/components/ui/button";
import { Mic, Pause } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import SpeechRecognition from "react-speech-recognition";

interface VoiceRecognationButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  listening: boolean;
  browserSupportsSpeechRecognition: boolean;
}

const VoiceRecognationButton = ({
  browserSupportsSpeechRecognition,
  listening,
  ...props
}: VoiceRecognationButtonProps) => {
  if (!browserSupportsSpeechRecognition)
    return toast.error(
      "Browser does not support speech recognition. You won't be able send voice message! Please use a Google Chrome browser."
    );

  return (
    <>
      {listening && (
        <Button
          className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
          {...props}
          onClick={(e) => {
            e.preventDefault();
            SpeechRecognition.stopListening();
          }}
        >
          <Pause />
        </Button>
      )}
      {!listening && (
        <Button
          className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
          {...props}
          onClick={(e) => {
            e.preventDefault();
            SpeechRecognition.startListening({
              continuous: true,
              language: "en",
            });
          }}
        >
          <Mic />
        </Button>
      )}
    </>
  );
};
export default VoiceRecognationButton;
