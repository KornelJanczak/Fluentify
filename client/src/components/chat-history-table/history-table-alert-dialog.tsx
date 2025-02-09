"use client";

import { useDeleteChat } from "@/common/services/chat/hooks/use-delete-chat";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

interface HistoryTableAlertDialogProps {
  chatId: string;
}

export function HistoryTableAlertDialog({
  chatId,
}: HistoryTableAlertDialogProps) {
  const { mutate, isPending } = useDeleteChat(chatId);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-none bg-inherit hover:bg-inherit">
          <Trash2Icon size={21} color="#7F1D1D" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete chat and
            its history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutate()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
