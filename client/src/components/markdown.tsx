import Link from "next/link";
import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const components: Partial<Components> = {
  pre: ({ children, className }) => <>{children}</>,
  ol: ({ node, children, className, ...props }) => {
    return (
      <ol
        className={cn(`list-decimal list-outside ml-4`, className)}
        {...props}
      >
        {children}
      </ol>
    );
  },
  li: ({ node, children, className, ...props }) => {
    return (
      <li className={cn(`py-1`, className)} {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, className, ...props }) => {
    return (
      <ul className={cn(`list-decimal list-outside ml-4`, className)} {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ node, children, className, ...props }) => {
    return (
      <span className={cn(`font-semibold`, className)} {...props}>
        {children}
      </span>
    );
  },
  a: ({ node, children, className, ...props }) => {
    return (
      // @ts-expect-error
      <Link
        className={cn(`text-blue-500 hover:underline`, className)}
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ node, children, className, ...props }) => {
    return (
      <h1
        className={cn(`text-3xl font-semibold mt-6 mb-2`, className)}
        {...props}
      >
        {children}
      </h1>
    );
  },
  h2: ({ node, children, className, ...props }) => {
    return (
      <h2
        className={cn(`text-2xl font-semibold mt-6 mb-2`, className)}
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ node, children, className, ...props }) => {
    return (
      <h3 className={cn(`text-xl font-semibold mt-6 mb-2`, className)} {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ node, children, className, ...props }) => {
    return (
      <h4 className={cn(`text-lg font-semibold mt-6 mb-2`, className)} {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ node, children, className, ...props }) => {
    return (
      <h5
        className={cn(`text-base font-semibold mt-6 mb-2`, className)}
        {...props}
      >
        {children}
      </h5>
    );
  },
  h6: ({ node, children, className, ...props }) => {
    return (
      <h6 className={cn(`text-sm font-semibold mt-6 mb-2`, className)} {...props}>
        {children}
      </h6>
    );
  },
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      components={components}
      className={className}
    >
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
