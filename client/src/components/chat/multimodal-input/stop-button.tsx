import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";

function PureStopButton({ stop }: { stop: () => void }) {
  return (
    <Button
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault();
        stop();
      }}
    >
      <Square size={14} />
    </Button>
  );
}

export const StopButton = memo(PureStopButton);
