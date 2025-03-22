"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const DEFAULT_PAGE = 1;

interface VocabularySetsPaginationProps {
  hasMore: boolean;
}

export function VocabularySetsPagination({
  hasMore,
}: VocabularySetsPaginationProps) {
  console.log(hasMore);

  const [page, setPage] = useState(DEFAULT_PAGE);
  const param = useSearchParams();
  const currentPage = Number(param.get("page"));
  const isActive = currentPage === page || !currentPage;

  const previousPage = page - 1;
  const nextPage = page + 1;

  useEffect(() => {
    if (currentPage) return setPage(currentPage);

    return setPage(DEFAULT_PAGE);
  }, [currentPage, param]);

  return (
    <Pagination>
      <PaginationContent className="mx-auto pt-8 sm:ml-auto">
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
          <PaginationLink href={`?page=${page}`} isActive={isActive}>
            {page}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href={`?page=${nextPage}`}
            className={!hasMore ? "pointer-events-none opacity-55" : ""}
            aria-disabled={!hasMore}
          >
            {nextPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href={`?page=${nextPage}`}
            className={!hasMore ? "pointer-events-none opacity-55" : ""}
            aria-disabled={!hasMore}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
