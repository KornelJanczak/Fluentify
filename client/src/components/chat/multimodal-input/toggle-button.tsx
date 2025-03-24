import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, Square } from "lucide-react";

function PureToggleButton({
  submitForm,
  stop,
  input,
  isLoading,
}: {
  submitForm: () => void;
  stop: () => void;
  input: string;
  isLoading: boolean;
}) {
  const isValueEmpty = input.length === 0;

  return (
    <Button
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault();
        isLoading ? stop() : submitForm();
      }}
      disabled={isLoading ? false : isValueEmpty}
    >
      {isLoading ? <Square size={14} /> : <ArrowUpIcon size={14} />}
    </Button>
  );
}

export const ToggleButton = memo(PureToggleButton, (prevProps, nextProps) => {
  if (
    prevProps.input !== nextProps.input ||
    prevProps.isLoading !== nextProps.isLoading
  )
    return false;
    
  return true;
});
