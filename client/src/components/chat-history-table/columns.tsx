"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { HistoryTableColumnHeader } from "./history-table-column-header";
import { HistoryTableRowActions } from "./history-table-row-actions";
import { Chat } from "@/common/services/chat/chat.service";
import { format } from "date-fns";
import ContinueButton from "./buttons/continue-button";

export const columns: ColumnDef<Chat>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          table.getIsSomePageRowsSelected() ||
          "indeterminate"
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <HistoryTableColumnHeader column={column} title="Topic" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.title);

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <HistoryTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const createDate = format(
        new Date(row.original.startedAt),
        "MMMM dd, yyyy"
      );

      return (
        <div className="flex w-[100px] items-center">
          <span>{createDate}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "continue",
    cell: ({ row }) => <ContinueButton row={row} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <HistoryTableRowActions row={row} />,
  },
];
