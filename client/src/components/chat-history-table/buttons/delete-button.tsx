"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import { chatSchema } from "../utils/schema";
import { Trash2Icon } from "lucide-react";
import { HistoryTableAlertDialog } from "../history-table-alert-dialog";

interface DeleteButtonProps<TData> extends ButtonProps {
  row: Row<TData>;
}

export default function DeleteButton({ row }: DeleteButtonProps<any>) {
  const chat = chatSchema.parse(row.original);

  return <HistoryTableAlertDialog chatId={chat.id} />;
}
