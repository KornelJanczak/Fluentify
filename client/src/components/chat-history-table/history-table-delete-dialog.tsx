"use client";

import { useDeleteChat } from "@/common/hooks/chat/use-delete-chat";
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
import DeleteButton from "../delete-button";
import { Row } from "@tanstack/react-table";
import { chatSchema } from "./utils/schema";

interface HistoryTableDeleteDialogProps<TData> {
  row: Row<TData>;
}

export function HistoryTableDeleteDialog({
  row,
}: HistoryTableDeleteDialogProps<any>) {
  const chat = chatSchema.parse(row.original);
  const { mutate } = useDeleteChat(chat.id);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DeleteButton />
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
