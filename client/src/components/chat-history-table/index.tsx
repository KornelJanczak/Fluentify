"use client";
import type { Chat } from "@/common/api/services/chat.service";

import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import { columns } from "./columns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HistoryTablePagination } from "./history-table-pagination";
import { HistoryTableToolbar } from "./history-table-toolbar";
import { useHistoryTable } from "@/common/hooks/chat/use-history-table";
import SectionWrapper from "../section-wrapper";

interface HistoryTableProps {
  chats: Chat[];
}

export function HistoryTable({ chats }: HistoryTableProps) {
  const { table } = useHistoryTable({ chats, columns });

  return (
    <div className="space-y-4 py-10 px-4 pr-[2.625rem]">
      <HistoryTableToolbar table={table} />
      <div className="overflow-x-auto w-full rounded-md border">
        <div className="rounded-md border">
          <div className="min-w-full">
            <Table className="max-w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <HistoryTablePagination table={table} />
    </div>
  );
}
