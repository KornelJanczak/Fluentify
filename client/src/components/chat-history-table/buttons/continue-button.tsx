"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import { chatSchema } from "../utils/schema";

interface ContinueButtonProps<TData> extends ButtonProps {
  row: Row<TData>;
}

export default function ContinueButton({ row }: ContinueButtonProps<any>) {
  const chat = chatSchema.parse(row.original);
  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={() => router.push(`/dashboard/chat/${chat.id}`)}
    >
      Continue chat
    </Button>
  );
}
