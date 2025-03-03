"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { HistoryTableViewOptions } from "./history-table-view-options";

interface HistoryTableToolbarProps<TData> {
  table: Table<TData>;
}

export function HistoryTableToolbar<TData>({
  table,
}: HistoryTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("topic")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("topic")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <HistoryTableViewOptions table={table} />
    </div>
  );
}
