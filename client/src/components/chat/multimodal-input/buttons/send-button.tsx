import React, { memo } from "react";
import { Button } from "../../../ui/button";
import { ArrowUpIcon } from "lucide-react";

function PureSendButton({
  submitForm,
  input,
}: {
  submitForm: () => void;
  input: string;
}) {
  const isValueEmpty = input.length === 0;

  return (
    <Button
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault();
        submitForm();
      }}
      disabled={isValueEmpty}
    >
      <ArrowUpIcon size={14} />
    </Button>
  );
}

export const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;
  return true;
});
