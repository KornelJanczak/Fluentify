"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const DEFAULT_PAGE = 1;
export function VocabularySetsPagination() {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const param = useSearchParams();
  const currentPage = Number(param.get("page"));
  const isActive = currentPage === page;

  const previousPage = page - 1;
  const nextPage = page + 1;

  useEffect(() => {
    if (currentPage) return setPage(currentPage);

    return setPage(DEFAULT_PAGE);
  }, [currentPage, param]);

  return (
    <Pagination>
      <PaginationContent className="ml-auto pt-8">
        <PaginationItem>
          <PaginationPrevious
            href={`?page=${page - 1}`}
            className={page <= 1 ? "pointer-events-none opacity-55" : ""}
            aria-disabled={page <= 1}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href={`?page=${previousPage}`}
            className={page <= 1 ? "pointer-events-none opacity-55" : ""}
            aria-disabled={page <= 1}
          >
            {previousPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href={`?page=${page}`}
            isActive={isActive}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href={`?page=${nextPage}`}>{nextPage}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href={`?page=${nextPage}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

// default = page 1,
