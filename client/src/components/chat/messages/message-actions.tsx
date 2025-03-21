"use client";

import type { Message } from "ai";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { useAudioStore } from "@/common/hooks/use-audio-store";
import { CopyIcon, PauseIcon, Play } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { memo, useEffect } from "react";

interface PureMessageActionsProps {
  message: Message;
  isLoading: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export function PureMessageActions({
  message,
  isLoading,
  audioRef,
}: PureMessageActionsProps) {
  const {
    pauseAudio,
    playAudio,
    playingAudioId,
    isPlaying: isAudioPlaying,
  } = useAudioStore((state) => state);
  const [_, copyToClipboard] = useCopyToClipboard();
  const isPlaying = playingAudioId === message.id && isAudioPlaying;

  if (isLoading) return null;

  if (message.role === "user") return null;

  useEffect(() => {
    
  });

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-row gap-2 items-center">
              <Button
                className="py-1 px-2 h-fit text-muted-foreground"
                variant="outline"
                onClick={async () => {
                  await copyToClipboard(message.content as string);
                  toast.success("Copied to clipboard!");
                }}
              >
                <CopyIcon />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-row gap-2 items-center">
              <Button
                className="py-1 px-2 h-fit text-muted-foreground"
                variant="outline"
                onClick={() =>
                  isPlaying ? pauseAudio() : playAudio(message.id)
                }
              >
                {isPlaying ? <PauseIcon /> : <Play />}
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>{isPlaying ? "Pause" : "Play"}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    return true;
  }
);
